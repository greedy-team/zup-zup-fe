import { useEffect, useRef, useState } from 'react';
import { useLoader } from '../../../hooks/map/useLoader';
import { usePolygons } from '../../../hooks/map/usePolygons';
import { useNumberedMarkers } from '../../../hooks/map/useNumberedMarkers';
import type { MapComponentProps } from '../../../types/main/components';
import { extractCoords } from '../../../utils/Map/mapUtils';

const Map = (props: MapComponentProps) => {
  const {
    setIsRegisterConfirmModalOpen,
    setSelectedCoordinates,
    setSelectedAreaId,
    selectedAreaId,
    schoolAreas,
    lostItemSummary,
    selectedMode,
  } = props;

  const mapRef = useRef<HTMLDivElement>(null);
  const loaded = useLoader();
  const [map, setMap] = useState<kakao.maps.Map | null>(null);

  useEffect(() => {
    if (!loaded || !mapRef.current) return;
    const kakao = window.kakao;
    const m = new kakao.maps.Map(mapRef.current, {
      center: new kakao.maps.LatLng(37.550701948532236, 127.07428227734258),
      level: 2,
    });
    m.setCursor('default');
    setMap(m);
    return () => setMap(null);
  }, [loaded]);

  const { reset } = usePolygons({
    map,
    schoolAreas,
    selectedAreaId,
    selectedMode,
    onOpenRegisterConfirm: () => setIsRegisterConfirmModalOpen(true),
    onSelectArea: setSelectedAreaId,
    onPickLatLng: (latlng) => setSelectedCoordinates(extractCoords(latlng)),
  });

  useNumberedMarkers({
    map,
    schoolAreas,
    summary: lostItemSummary,
    enabled: selectedMode !== 'register',
  });

  useEffect(() => {
    if (!map) return;
    reset();
  }, [selectedMode, map, reset]);

  useEffect(() => {
    if (!map) return;
    const kakao = window.kakao;
    const onMapClick = (e: kakao.maps.event.MouseEvent) => {
      if (selectedMode === 'register') {
        setIsRegisterConfirmModalOpen(true);
        return;
      }
      setSelectedAreaId(0);
      setSelectedCoordinates(extractCoords(e.latLng));
    };
    kakao.maps.event.addListener(map, 'click', onMapClick);
    return () => kakao.maps.event.removeListener(map, 'click', onMapClick);
  }, [map, selectedMode, setSelectedAreaId, setSelectedCoordinates, setIsRegisterConfirmModalOpen]);

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

export default Map;
