import { useEffect, useRef } from 'react';
import { useKakaoLoader } from '../../../hooks/main/useKakaoLoader';
import type { SchoolArea } from '../../../types/map/map';
import type { LostItemSummaryRow } from '../../../types/main/lostItemSummeryRow';
import type { SelectedMode } from '../../../types/main/mode';
import { BASE_STYLE, HOVER_STYLE, SELECTED_STYLE } from '../../../constants/map/polygonStyle';
import {
  extractCoords,
  toKakaoPath,
  createNumberedMarker,
  resetPolygons,
} from '../../../utils/Map/mapUtils';

type Props = {
  setIsRegisterConfirmModalOpen: (isOpen: boolean) => void;
  setSelectedCoordinates: (coordinates: { lat: number; lng: number } | null) => void;
  selectedCoordinates: { lat: number; lng: number } | null;
  setSelectedAreaId: (areaId: number) => void;
  selectedAreaId: number;
  schoolAreas: SchoolArea[];
  lostItemSummary: LostItemSummaryRow[];
  selectedMode: SelectedMode;
  setSelectedMode: (mode: SelectedMode) => void;
};

const KakaoMap = ({
  setIsRegisterConfirmModalOpen,
  setSelectedCoordinates,
  setSelectedAreaId,
  selectedAreaId,
  schoolAreas,
  lostItemSummary,
  selectedMode,
  setSelectedMode,
}: Props) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const clickedOverlayRef = useRef(false);
  const loaded = useKakaoLoader();
  const polysRef = useRef<kakao.maps.Polygon[]>([]);
  const selectedPolygonRef = useRef<kakao.maps.Polygon | null>(null);

  useEffect(() => {
    if (!loaded || !mapRef.current) return;
    if (!Array.isArray(schoolAreas) || schoolAreas.length === 0) return;

    const kakao = window.kakao;
    const map = new kakao.maps.Map(mapRef.current, {
      center: new kakao.maps.LatLng(37.550701948532236, 127.07428227734258),
      level: 2,
    });

    const place = (latlng: kakao.maps.LatLng) => setSelectedCoordinates(extractCoords(latlng));
    map.setCursor('default');

    // 마커 스타일은 여기!!

    const addNumberedMarker = (map: kakao.maps.Map, lat: number, lng: number, raw: number) => {
      if (!raw) return null;
      const number = Math.max(1, Math.min(10, raw));
      const pos = new kakao.maps.LatLng(lat, lng);
      const imageSrc =
        'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_number_blue.png';
      const imageSize = new kakao.maps.Size(36, 37);
      const imgOptions = {
        spriteSize: new kakao.maps.Size(36, 691),
        spriteOrigin: new kakao.maps.Point(0, (number - 1) * 46 + 10),
        offset: new kakao.maps.Point(13, 37),
      };
      const markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imgOptions);
      return new kakao.maps.Marker({ map, position: pos, image: markerImage });
    };

    const markerObjs = schoolAreas.map((area) => {
      if (selectedMode === 'register') return null;
      const count = lostItemSummary.find((r) => r.schoolAreaId === area.id)?.count ?? 0;
      return createNumberedMarker(map, area.marker, count);
    });

    // 폴리곤 스타일은 여기!!

    const polys: kakao.maps.Polygon[] = [];
    const handlers: Array<{ target: any; type: string; handler: (...a: any[]) => void }> = [];
    let selectedPolygon: kakao.maps.Polygon | null = null;

    schoolAreas.forEach((area) => {
      const path = toKakaoPath(area);
      const polygon = new kakao.maps.Polygon({
        path,
        ...(area.id === selectedAreaId ? SELECTED_STYLE : BASE_STYLE),
      });
      polygon.setMap(map);
      polys.push(polygon);
      polysRef.current = polys;

      const onOver = () => {
        if (selectedPolygon === polygon) return;
        if (area.id !== selectedAreaId) polygon.setOptions(HOVER_STYLE);
      };
      const onOut = () => {
        if (selectedPolygon === polygon) return;
        if (area.id !== selectedAreaId) polygon.setOptions(BASE_STYLE);
      };
      const onClick = (e: any) => {
        kakao.maps.event.preventMap?.();
        if (selectedMode === 'register') {
          setIsRegisterConfirmModalOpen(true);
          return;
        }
        polys.forEach((p) => p.setOptions(BASE_STYLE));
        polygon.setOptions(SELECTED_STYLE);
        selectedPolygon = polygon;
        selectedPolygonRef.current = null;
        selectedPolygonRef.current = polygon;

        setSelectedAreaId(area.id);
        place(e.latLng);
      };

      kakao.maps.event.addListener(polygon, 'mouseover', onOver);
      kakao.maps.event.addListener(polygon, 'mouseout', onOut);
      kakao.maps.event.addListener(polygon, 'click', onClick);
      handlers.push(
        { target: polygon, type: 'mouseover', handler: onOver },
        { target: polygon, type: 'mouseout', handler: onOut },
        { target: polygon, type: 'click', handler: onClick },
      );
    });

    const onMapClick = (e: any) => {
      if (selectedMode === 'register') {
        setIsRegisterConfirmModalOpen(true);
        return;
      }
      resetPolygons(polysRef.current, BASE_STYLE);
      if (clickedOverlayRef.current) {
        clickedOverlayRef.current = false;
        return;
      }

      selectedPolygon = null;
      setSelectedAreaId(0);
      place(e.latLng);
    };
    kakao.maps.event.addListener(map, 'click', onMapClick);
    handlers.push({ target: map, type: 'click', handler: onMapClick });

    return () => {
      handlers.forEach(({ target, type, handler }) =>
        kakao.maps.event.removeListener(target, type, handler),
      );
      polys.forEach((p) => p.setMap(null));
      markerObjs.forEach((m) => m?.setMap?.(null));
    };
  }, [
    loaded,
    schoolAreas,
    setSelectedCoordinates,
    setSelectedAreaId,
    lostItemSummary,
    setSelectedMode,
    selectedMode,
  ]);
  useEffect(() => {
    resetPolygons(polysRef.current, BASE_STYLE);
    selectedPolygonRef.current = null;
  }, [selectedMode]);

  const selectedArea = schoolAreas.find((area) => area.id === selectedAreaId);

  return (
    <div>
      <div ref={mapRef} className="absolute inset-0" />
      <div className="absolute bottom-3 left-3 z-10 rounded-md bg-white/90 px-3 py-2 text-sm shadow">
        선택: {selectedArea?.areaName || '전체'}
      </div>
    </div>
  );
};

export default KakaoMap;
