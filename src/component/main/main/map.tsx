import { useEffect, useRef } from 'react';
import { useKakaoLoader } from '../../../hooks/main/useKakaoLoader';
import type { SchoolArea } from '../../../types/map/map';
import type { LostItemSummaryRow } from '../../../types/main/lostItemSummeryRow';

type Props = {
  setSelectedLat: (lat: number | null) => void;
  setSelectedLng: (lng: number | null) => void;
  setSelectedAreaId: (areaId: number) => void;
  selectedAreaId: number;
  schoolAreas: SchoolArea[];
  lostItemSummary: LostItemSummaryRow[];
};

const KakaoMap = ({
  setSelectedLat,
  setSelectedLng,
  setSelectedAreaId,
  selectedAreaId,
  schoolAreas,
  lostItemSummary,
}: Props) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<any>(null);
  const clickedOverlayRef = useRef(false);
  const loaded = useKakaoLoader();

  useEffect(() => {
    if (!loaded || !mapRef.current) return;
    if (!Array.isArray(schoolAreas) || schoolAreas.length === 0) return;

    const kakao = window.kakao;
    const map = new kakao.maps.Map(mapRef.current, {
      center: new kakao.maps.LatLng(37.550701948532236, 127.07428227734258),
      level: 2,
    });

    const place = (latlng: kakao.maps.LatLng) => {
      const lat = latlng.getLat();
      const lng = latlng.getLng();

      if (!markerRef.current) {
        markerRef.current = new kakao.maps.Marker({ position: latlng });
        markerRef.current.setMap(map);
      } else {
        markerRef.current.setPosition(latlng);
      }
      setSelectedLat(lat);
      setSelectedLng(lng);
    };

    const addNumberedMarker = (map: kakao.maps.Map, lat: number, lng: number, number: number) => {
      const pos = new kakao.maps.LatLng(lat, lng);

      const imageSrc =
        'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_number_blue.png';
      const imageSize = new kakao.maps.Size(36, 37);
      const imgOptions = {
        spriteSize: new kakao.maps.Size(36, 691),
        // number는 1부터 시작한다고 가정, 스프라이트는 0부터 계산
        spriteOrigin: new kakao.maps.Point(0, (number - 1) * 46 + 10),
        offset: new kakao.maps.Point(13, 37),
      };
      const markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imgOptions);

      return new kakao.maps.Marker({
        map,
        position: pos,
        image: markerImage,
      });
    };

    console.log('lostItemSummary', lostItemSummary);
    const markers = schoolAreas.map((item, index) => {
      const number = Array.isArray(lostItemSummary)
        ? (lostItemSummary.find((row) => row.schoolAreaId === item.id)?.count ?? 0)
        : 0;
      return addNumberedMarker(map, item.marker.lat, item.marker.lng, number);
    });

    const BASE_STYLE = {
      strokeWeight: 0,
      strokeColor: '#ffffff',
      strokeOpacity: 0.001,
      strokeStyle: 'solid' as const,
      fillColor: '#ffffff',
      fillOpacity: 0.001,
    };
    const HOVER_STYLE = {
      strokeWeight: 1,
      strokeColor: '#39DE2A',
      strokeOpacity: 0.8,
      strokeStyle: 'solid' as const,
      fillColor: '#A2FF99',
      fillOpacity: 0.001,
    };

    const listeners: { target: any; type: string; handler: (...args: any[]) => void }[] = [];

    const polygons = schoolAreas.map((area) => {
      const path = area.areaPolygon.coordinates.map(
        (coord) => new kakao.maps.LatLng(coord.lat, coord.lng),
      );

      const polygon = new kakao.maps.Polygon({
        path,
        ...BASE_STYLE,
      });

      polygon.setMap(map);

      const onOver = () => polygon.setOptions(HOVER_STYLE);
      const onOut = () => polygon.setOptions(BASE_STYLE);
      const onClick = (e: any) => {
        clickedOverlayRef.current = true;
        setSelectedAreaId(area.id);
        place(e.latLng);
      };

      kakao.maps.event.addListener(polygon, 'mouseover', onOver);
      kakao.maps.event.addListener(polygon, 'mouseout', onOut);
      kakao.maps.event.addListener(polygon, 'click', onClick);

      listeners.push(
        { target: polygon, type: 'mouseover', handler: onOver },
        { target: polygon, type: 'mouseout', handler: onOut },
        { target: polygon, type: 'click', handler: onClick },
      );

      return { area, polygon };
    });

    const onMapClick = (e: any) => {
      if (clickedOverlayRef.current) {
        clickedOverlayRef.current = false;
        return;
      }
      place(e.latLng);
      setSelectedAreaId(0);
    };
    kakao.maps.event.addListener(map, 'click', onMapClick);
    listeners.push({ target: map, type: 'click', handler: onMapClick });

    return () => {
      listeners.forEach(({ target, type, handler }) =>
        kakao.maps.event.removeListener(target, type, handler),
      );
      polygons.forEach(({ polygon }) => polygon.setMap(null));
    };
  }, [loaded, schoolAreas, setSelectedLat, setSelectedLng, setSelectedAreaId]);

  console.log('area', schoolAreas);

  return (
    <div>
      <div ref={mapRef} className="absolute inset-0" />
      <div className="absolute bottom-3 left-3 z-10 rounded-md bg-white/90 px-3 py-2 text-sm shadow">
        선택: {selectedAreaId || '전체'}
      </div>
    </div>
  );
};

export default KakaoMap;
