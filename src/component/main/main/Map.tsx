import { useEffect, useRef, useContext, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { useLoader } from '../../../hooks/map/useLoader';
import { usePolygons } from '../../../hooks/map/usePolygons';
import { useNumberedMarkers } from '../../../hooks/map/useNumberedMarkers';
import { getKakaoMap } from '../../../hooks/map/getKakaoMap';
import { useHardLock } from '../../../hooks/map/useHardLock';
import { useOutsideMask } from '../../../hooks/map/useOutsideMask';
import { useRegisterMapClick } from '../../../hooks/map/useRegisterMapClick';
import { isValidId } from '../../../utils/isValidId';
import {
  RegisterConfirmModalContext,
  SchoolAreasContext,
  LostItemSummaryContext,
  SelectedModeContext,
  SelectedAreaIdContext,
} from '../../../contexts/AppContexts';
import CategoryRadio from './CategoryRadio';

interface MapProps {
  isDesktopListOpen?: boolean;
}

const Map = ({ isDesktopListOpen = false }: MapProps) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const { setIsRegisterConfirmModalOpen } = useContext(RegisterConfirmModalContext)!;
  const { schoolAreas } = useContext(SchoolAreasContext)!;
  const { lostItemSummary } = useContext(LostItemSummaryContext)!;
  const { selectedMode } = useContext(SelectedModeContext)!;
  const { setSelectedAreaId } = useContext(SelectedAreaIdContext)!;
  const [hoverAreaId, setHoverAreaId] = useState(0); // 마우스 올리면 구역 아이디 업데이트
  const rawAreaId = searchParams.get('schoolAreaId');
  const selectedAreaId = isValidId(rawAreaId) ? Number(rawAreaId) : 0;
  const rawCategoryId = searchParams.get('categoryId');
  const selectedCategoryId = isValidId(rawCategoryId) ? Number(rawCategoryId) : 0;

  const mapRef = useRef<HTMLDivElement>(null);
  const categoryBarRef = useRef<HTMLDivElement>(null);
  const [categoryBarHeight, setCategoryBarHeight] = useState(0);
  const loaded = useLoader();

  const map = getKakaoMap(mapRef, loaded);

  // 세종대 경계 하드락(드래그 중 실시간 제한)
  useHardLock(map);

  // 세종대 밖은 반투명 그레이로 마스킹(도넛 폴리곤)
  useOutsideMask(map);

  // 구역 선택 시 페이지 1로 이동시키는 핸들러
  const updateAreaIdInUrl = (areaId: number) => {
    const next = new URLSearchParams();
    if (areaId === 0) {
      next.delete('schoolAreaId');
      setSelectedAreaId(0);
    } else {
      next.set('schoolAreaId', String(areaId));
      setSelectedAreaId(areaId);
    }
    next.set('categoryId', String(selectedCategoryId) || '0');
    next.set('page', '1');
    setSearchParams(next, { replace: true });
  };

  // 구역 가져오기
  const { reset, createRegisterPin } = usePolygons({
    map,
    schoolAreas,
    selectedAreaId,
    selectedMode,
    isDesktopListOpen,
    onOpenRegisterConfirm: () => setIsRegisterConfirmModalOpen(true),
    onSelectArea: updateAreaIdInUrl,
    setHoverAreaId,
  });

  useNumberedMarkers({
    map,
    schoolAreas,
    summary: lostItemSummary,
    enabled: selectedMode === 'find',
    selectedCategoryId,
  });

  // 모드 변경 시 마커 초기화
  useEffect(() => {
    reset();
  }, [selectedMode, reset]);

  // 지도 클릭 시 핀 생성 및 모달 열기
  const isRegisterClickEnabled = selectedMode === 'register' && selectedAreaId !== 0;
  useRegisterMapClick(map, isRegisterClickEnabled, createRegisterPin, () =>
    setIsRegisterConfirmModalOpen(true),
  );

  // 선택된 구역 정보 가져오기
  const selectedArea = schoolAreas.find((area) => area.id === selectedAreaId);
  const hoverArea = schoolAreas.find((area) => area.id === hoverAreaId);

  useEffect(() => {
    if (!categoryBarRef.current) return;
    const el = categoryBarRef.current;
    const update = () => setCategoryBarHeight(el.getBoundingClientRect().height || 0);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    window.addEventListener('resize', update);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', update);
    };
  }, []);

  return (
    <div
      className="relative h-full min-w-0 overflow-hidden"
      style={{ ['--cat-h' as any]: `${categoryBarHeight}px` }}
    >
      <div
        ref={categoryBarRef}
        className={`absolute top-0 z-30 flex justify-center pt-4 transition-all duration-300 ease-out ${
          isDesktopListOpen ? 'md:right-0 md:left-[380px]' : 'md:right-0 md:left-0'
        } right-0 left-0`}
      >
        <CategoryRadio />
      </div>

      {selectedMode === 'find' && selectedArea && (
        <div
          className={`absolute z-20 flex justify-center transition-all duration-300 ease-out ${
            isDesktopListOpen ? 'md:right-0 md:left-[380px]' : 'md:right-0 md:left-0'
          } right-0 left-0`}
          style={{ top: 'calc(var(--cat-h) + 3rem)' }}
        >
          <div className="-translate-y-1/2 transform rounded-lg border bg-teal-200/70 px-6 py-3 shadow-lg">
            {selectedArea?.areaName}
          </div>
        </div>
      )}
      {selectedMode === 'register' && hoverArea && (
        <div
          className={`absolute z-20 flex justify-center transition-all duration-300 ease-out ${
            isDesktopListOpen ? 'md:right-0 md:left-[380px]' : 'md:right-0 md:left-0'
          } right-0 left-0`}
          style={{ top: 'calc(var(--cat-h) + 10rem)' }}
        >
          <div className="-translate-y-1/2 transform rounded-lg border bg-teal-200/70 px-6 py-3 shadow-lg">
            {hoverArea?.areaName}
          </div>
        </div>
      )}
      <div ref={mapRef} className="absolute inset-0" />
      {selectedMode === 'register' && (
        <div
          className={`absolute z-20 flex justify-center transition-all duration-300 ease-out ${
            isDesktopListOpen ? 'md:right-0 md:left-[380px]' : 'md:right-0 md:left-0'
          } right-0 left-0`}
          style={{ top: 'calc(var(--cat-h) + 5rem)' }}
        >
          <p className="-translate-y-1/2 transform rounded-lg border bg-teal-400/70 px-6 py-3 text-center text-lg font-medium text-black shadow-lg">
            분실물을 발견한 위치를 선택해주세요
          </p>
        </div>
      )}

      {hoverArea && (
        <div
          className={`absolute bottom-[calc(3rem+env(safe-area-inset-bottom))] z-10 hidden rounded-md bg-white/90 px-6 py-2 text-base shadow md:block ${
            isDesktopListOpen ? 'md:left-[390px]' : 'md:left-10'
          }`}
        >
          {hoverArea?.areaName}
        </div>
      )}
    </div>
  );
};

export default Map;
