import { useEffect, useRef, useContext } from 'react';
import { useSearchParams } from 'react-router-dom';

import { useLoader } from '../../../hooks/map/useLoader';
import { usePolygons } from '../../../hooks/map/usePolygons';
import { useNumberedMarkers } from '../../../hooks/map/useNumberedMarkers';
import { getKakaoMap } from '../../../hooks/map/getKakaoMap';
import { useHardLock } from '../../../hooks/map/useHardLock';
import { useOutsideMask } from '../../../hooks/map/useOutsideMask';
import { useRegisterMapClick } from '../../../hooks/map/useRegisterMapClick';
import {
  RegisterConfirmModalContext,
  SchoolAreasContext,
  LostItemSummaryContext,
  SelectedModeContext,
} from '../../../contexts/AppContexts';
// keep constants import minimal here; hooks encapsulate most logic

const Map = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const { setIsRegisterConfirmModalOpen } = useContext(RegisterConfirmModalContext)!;
  const { schoolAreas } = useContext(SchoolAreasContext)!;
  const { lostItemSummary } = useContext(LostItemSummaryContext)!;
  const { selectedMode } = useContext(SelectedModeContext)!;

  const selectedAreaId = Number(searchParams.get('schoolAreaId')) || 0;
  const selectedCategoryId = Number(searchParams.get('categoryId')) || 0;

  const mapRef = useRef<HTMLDivElement>(null);
  const loaded = useLoader();

  const map = getKakaoMap(mapRef, loaded);

  // 세종대 경계 하드락(드래그 중 실시간 제한)
  useHardLock(map);

  // 세종대 밖은 반투명 그레이로 마스킹(도넛 폴리곤)
  useOutsideMask(map);
  // 구역 선택 시 페이지 1로 이동시키는 핸들러
  const updateAreaIdInUrl = (areaId: number) => {
    const next = new URLSearchParams(searchParams);
    next.set('schoolAreaId', String(areaId));
    next.set('page', '1');
    setSearchParams(next, { replace: true });
  };

  // 구역 가져오기
  const { reset, createRegisterPin } = usePolygons({
    map,
    schoolAreas,
    selectedAreaId,
    selectedMode,
    onOpenRegisterConfirm: () => setIsRegisterConfirmModalOpen(true),
    onSelectArea: updateAreaIdInUrl,
  });

  useNumberedMarkers({
    map,
    schoolAreas,
    summary: lostItemSummary,
    enabled: selectedMode !== 'register',
    selectedCategoryId,
  });

  // 모드 변경 시 마커 초기화
  useEffect(() => {
    reset();
  }, [selectedMode, reset]);

  // 지도 클릭 시 핀 생성 및 모달 열기
  useRegisterMapClick(map, selectedMode === 'register', createRegisterPin, () =>
    setIsRegisterConfirmModalOpen(true),
  );

  // 선택된 구역 정보 가져오기
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
