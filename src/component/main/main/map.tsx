import { useEffect, useRef } from 'react';
import { useKakaoLoader } from '../../../hooks/main/useKakaoLoader';
import type { SchoolArea } from '../../../types/map/map';

type Props = {
  setSelectedLat: (lat: number | null) => void;
  setSelectedLng: (lng: number | null) => void;
  setSelectedAreaId: (areaId: number) => void;
  selectedAreaId: number;
  schoolAreas: SchoolArea[];
};

const KakaoMap = ({
  setSelectedLat,
  setSelectedLng,
  setSelectedAreaId,
  selectedAreaId,
  schoolAreas,
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
