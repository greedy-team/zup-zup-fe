import { useEffect, useRef, useState } from 'react';
import { useLoader } from '../../../hooks/map/useLoader';
import { usePolygons } from '../../../hooks/map/usePolygons';
import { useNumberedMarkers } from '../../../hooks/map/useNumberedMarkers';
import type { MapComponentProps } from '../../../types/main/components';

const Map = (props: MapComponentProps) => {
  const {
    setIsRegisterConfirmModalOpen,
    setSelectedAreaId,
    selectedAreaId,
    schoolAreas,
    lostItemSummary,
    selectedMode,
    selectedCategoryId,
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

  const { reset, createRegisterPin } = usePolygons({
    map,
    schoolAreas,
    selectedAreaId,
    selectedMode,
    onOpenRegisterConfirm: () => setIsRegisterConfirmModalOpen(true),
    onSelectArea: setSelectedAreaId,
  });

  useNumberedMarkers({
    map,
    schoolAreas,
    summary: lostItemSummary,
    enabled: selectedMode !== 'register',
    selectedCategoryId: selectedCategoryId,
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
        // 등록 모드: 지도 클릭 시 핀 생성 및 모달 열기
        setSelectedAreaId(0); // 구역 선택 해제
        createRegisterPin(e.latLng); // 핀 생성
        setIsRegisterConfirmModalOpen(true);
        return;
      }
      setSelectedAreaId(0);
    };
    kakao.maps.event.addListener(map, 'click', onMapClick);
    return () => kakao.maps.event.removeListener(map, 'click', onMapClick);
  }, [map, selectedMode, setSelectedAreaId, setIsRegisterConfirmModalOpen, createRegisterPin]);

  const selectedArea = schoolAreas.find((area) => area.id === selectedAreaId);

  return (
    <div>
      <div ref={mapRef} className="absolute inset-0" />
      {selectedMode === 'register' && (
        <div className="absolute top-20 left-1/2 z-20 -translate-x-1/2 -translate-y-1/2 transform rounded-lg border bg-teal-400/70 px-6 py-3 shadow-lg">
          <p className="text-center text-lg font-medium text-black">
            분실물을 발견한 위치를 선택해주세요
          </p>
        </div>
      )}

      <div className="absolute bottom-3 left-3 z-10 rounded-md bg-white/90 px-3 py-2 text-sm shadow">
        선택: {selectedArea?.areaName || '전체'}
      </div>
    </div>
  );
};

export default Map;
