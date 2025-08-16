import { useEffect, useRef, useState } from 'react';
import { useKakaoLoader } from '../../../hooks/main/useKakaoLoader';
import { fetchSchoolAreas } from '../../../api/register';
import type { SchoolArea } from '../../../types/register';

type Props = {
  setSelectedLat: (lat: number | null) => void;
  setSelectedLng: (lng: number | null) => void;
  setSelectedAreaId: (id: number | null) => void;
  selectedAreaId: number | null;
};

const KakaoMap = ({ setSelectedLat, setSelectedLng, setSelectedAreaId, selectedAreaId }: Props) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<any>(null);
  const clickedOverlayRef = useRef(false);
  const [schoolAreas, setSchoolAreas] = useState<SchoolArea[]>([]);

  const loaded = useKakaoLoader();

  useEffect(() => {
    fetchSchoolAreas().then(setSchoolAreas).catch(console.error);
  }, []);

  useEffect(() => {
    if (!loaded || !mapRef.current || schoolAreas.length === 0) return;

    const kakao = window.kakao;
    const map = new kakao.maps.Map(mapRef.current, {
      center: new kakao.maps.LatLng(37.550701948532236, 127.07428227734258),
      level: 3,
    });

    const place = (latlng: any) => {
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

    const polygons: any[] = [];

    schoolAreas.forEach((area) => {
      const path = area.areaPolygon.coordinates.map(
        (coord) => new kakao.maps.LatLng(coord.lat, coord.lng),
      );

      const polygon = new kakao.maps.Polygon({
        path,
        strokeWeight: 3,
        strokeColor: '#39DE2A',
        strokeOpacity: 0.8,
        strokeStyle: 'solid',
        fillColor: '#A2FF99',
        fillOpacity: 0.7,
      });
      polygons.push(polygon);
      polygon.setMap(map);

      const mouseoverOption = { fillColor: '#EFFFED', fillOpacity: 0.8 };
      const mouseoutOption = { fillColor: '#A2FF99', fillOpacity: 0.7 };

      kakao.maps.event.addListener(polygon, 'mouseover', () => polygon.setOptions(mouseoverOption));
      kakao.maps.event.addListener(polygon, 'mouseout', () => polygon.setOptions(mouseoutOption));
      kakao.maps.event.addListener(polygon, 'click', (e: any) => {
        clickedOverlayRef.current = true;
        setSelectedAreaId(area.id);
        place(e.latLng);
      });
    });

    const onMapClick = (e: any) => {
      if (clickedOverlayRef.current) {
        clickedOverlayRef.current = false;
        return;
      }
      place(e.latLng);
      setSelectedAreaId(null);
    };

    kakao.maps.event.addListener(map, 'click', onMapClick);

    return () => {
      // unmount 시 이벤트 리스너 제거
      kakao.maps.event.removeListener(map, 'click', onMapClick);
      polygons.forEach((p) => p.setMap(null));
    };
  }, [loaded, schoolAreas, setSelectedLat, setSelectedLng, setSelectedAreaId]);

  const selectedAreaName = schoolAreas.find((area) => area.id === selectedAreaId)?.areaName;

  return (
    <div>
      <div ref={mapRef} className="absolute inset-0" />
      <div className="absolute bottom-3 left-3 z-10 rounded-md bg-white/90 px-3 py-2 text-sm shadow">
        선택: {selectedAreaName || '전체'}
      </div>
    </div>
  );
};

export default KakaoMap;
