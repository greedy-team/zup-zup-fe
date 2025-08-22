import { useEffect, useRef, useState, useContext } from 'react';
import { useSearchParams } from 'react-router-dom';

import { useLoader } from '../../../hooks/map/useLoader';
import { usePolygons } from '../../../hooks/map/usePolygons';
import { useNumberedMarkers } from '../../../hooks/map/useNumberedMarkers';
import {
  RegisterConfirmModalContext,
  SchoolAreasContext,
  LostItemSummaryContext,
  SelectedModeContext,
} from '../../../contexts/AppContexts';

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

  const [map, setMap] = useState<kakao.maps.Map | null>(null);

  useEffect(() => {
    if (!loaded || !mapRef.current) return;

    const kakao = window.kakao;
    const map = new kakao.maps.Map(mapRef.current, {
      center: new kakao.maps.LatLng(37.550701948532236, 127.07428227734258),
      level: 2,
      minLevel: 1,
      maxLevel: 2,
    });

    map.setCursor('default');
    setMap(map);
    return () => setMap(null);
  }, [loaded]);

  // 세종대 경계 하드락(드래그 중 실시간 제한)
  useEffect(() => {
    if (!map) return;
    const kakao = window.kakao;

    // 세종대 근처 박스
    const ALLOWED = new kakao.maps.LatLngBounds(
      new kakao.maps.LatLng(37.547, 127.0655), // SW
      new kakao.maps.LatLng(37.5545, 127.084), // NE
    );

    // 재진입 방지 플래그
    let adjusting = false;

    // 현재 뷰포트 절반 크기만큼 여유를 둔 안쪽 경계
    const getInnerBounds = () => {
      const b = map.getBounds();
      const sw = b.getSouthWest();
      const ne = b.getNorthEast();

      const halfLatSpan = (ne.getLat() - sw.getLat()) / 2;
      const halfLngSpan = (ne.getLng() - sw.getLng()) / 2;

      const aSW = ALLOWED.getSouthWest();
      const aNE = ALLOWED.getNorthEast();

      // 안쪽 경계 = 허용 박스에서 현재 뷰 반경만큼 축소
      const innerSW = new kakao.maps.LatLng(aSW.getLat() + halfLatSpan, aSW.getLng() + halfLngSpan);
      const innerNE = new kakao.maps.LatLng(aNE.getLat() - halfLatSpan, aNE.getLng() - halfLngSpan);

      // 만약 뷰포트가 허용 영역보다 크면(inner가 뒤집히면) setBounds로 맞춤
      if (innerSW.getLat() >= innerNE.getLat() || innerSW.getLng() >= innerNE.getLng()) {
        map.setBounds(ALLOWED);
        return null;
      }
      return new kakao.maps.LatLngBounds(innerSW, innerNE);
    };

    const clampCenter = () => {
      if (adjusting) return;
      const inner = getInnerBounds();
      if (!inner) return;

      const c = map.getCenter();
      if (inner.contain(c)) return;

      adjusting = true;
      const sw = inner.getSouthWest();
      const ne = inner.getNorthEast();

      const lat = Math.min(Math.max(c.getLat(), sw.getLat()), ne.getLat());
      const lng = Math.min(Math.max(c.getLng(), sw.getLng()), ne.getLng());

      // 즉시 중심 보정(드래그 중에도 벽처럼 느껴짐)
      map.setCenter(new kakao.maps.LatLng(lat, lng));
      adjusting = false;
    };

    // 드래그 중/줌 중에도 지속 보정
    const onCenterChanged = clampCenter;
    const onZoomChanged = clampCenter;
    const onDragStart = clampCenter;
    const onDrag = clampCenter;

    // 초기 뷰 보정
    clampCenter();

    kakao.maps.event.addListener(map, 'center_changed', onCenterChanged);
    kakao.maps.event.addListener(map, 'zoom_changed', onZoomChanged);
    kakao.maps.event.addListener(map, 'dragstart', onDragStart);
    kakao.maps.event.addListener(map, 'drag', onDrag);

    return () => {
      kakao.maps.event.removeListener(map, 'center_changed', onCenterChanged);
      kakao.maps.event.removeListener(map, 'zoom_changed', onZoomChanged);
      kakao.maps.event.removeListener(map, 'dragstart', onDragStart);
      kakao.maps.event.removeListener(map, 'drag', onDrag);
    };
  }, [map]);

  // 세종대 밖은 반투명 그레이로 마스킹(도넛 폴리곤)
  useEffect(() => {
    if (!map) return;
    const kakao = window.kakao;

    // 바깥 큰 사각형(시계방향; 전 세계를 대충 덮는 박스)
    const outerWorldCW = [
      new kakao.maps.LatLng(85, -179.999),
      new kakao.maps.LatLng(85, 179.999),
      new kakao.maps.LatLng(-85, 179.999),
      new kakao.maps.LatLng(-85, -179.999),
    ];

    // 남길 영역(세종대 근처) - "구멍" 경로(반시계방향 권장)
    // SW → NW → NE → SE 순으로 넣어 CCW가 되게 작성
    const campusHoleCCW = [
      new kakao.maps.LatLng(37.545, 127.07), // SW
      new kakao.maps.LatLng(37.5575, 127.07), // NW
      new kakao.maps.LatLng(37.5575, 127.078), // NE
      new kakao.maps.LatLng(37.545, 127.078), // SE
    ];

    const mask = new kakao.maps.Polygon({
      map,
      path: [outerWorldCW, campusHoleCCW], // [외곽, 구멍]
      strokeWeight: 0,
      fillColor: '#000000',
      fillOpacity: 0.45, // 회색 투명도
      zIndex: 999,
    });

    return () => mask.setMap(null);
  }, [map]);
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

  // 번호 마커 가져오기
  useNumberedMarkers({
    map,
    schoolAreas,
    summary: lostItemSummary,
    enabled: selectedMode !== 'register',
    selectedCategoryId: selectedCategoryId,
  });

  // 모드 변경 시 마커 초기화
  useEffect(() => {
    reset();
  }, [selectedMode, reset]);

  // 지도 클릭 시 핀 생성 및 모달 열기
  useEffect(() => {
    if (!map) return;
    const kakao = window.kakao;
    const onMapClick = (e: kakao.maps.event.MouseEvent) => {
      if (selectedMode === 'register') {
        // 등록 모드: 지도 클릭 시 핀 생성 및 모달 열기
        updateAreaIdInUrl(0); // 구역 선택 해제
        createRegisterPin(e.latLng); // 핀 생성
        setIsRegisterConfirmModalOpen(true);
        return;
      }
      updateAreaIdInUrl(0);
    };
    kakao.maps.event.addListener(map, 'click', onMapClick);

    return () => kakao.maps.event.removeListener(map, 'click', onMapClick);
  }, [map, selectedMode, setIsRegisterConfirmModalOpen, createRegisterPin, selectedAreaId]);

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
