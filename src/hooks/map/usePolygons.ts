import { useCallback, useEffect, useRef, useState } from 'react';
import { BASE_STYLE, HOVER_STYLE, SELECTED_STYLE } from '../../constants/map/polygonStyle';
import type { UsePolygonsHookOptions } from '../../types/hooks/map';

export function usePolygons({
  map,
  schoolAreas,
  selectedAreaId,
  selectedMode,
  onOpenRegisterConfirm,
  onSelectArea,
}: UsePolygonsHookOptions) {
  const polysRef = useRef<kakao.maps.Polygon[]>([]);
  const polyByIdRef = useRef<Map<number, kakao.maps.Polygon>>(new Map());
  const selectedPolygonRef = useRef<kakao.maps.Polygon | null>(null);
  const modeRef = useRef(selectedMode);
  const openRef = useRef(onOpenRegisterConfirm);
  const selectRef = useRef(onSelectArea);
  const [selectedPolygonAreaId, setSelectedPolygonAreaId] = useState(selectedAreaId);

  // 등록 모드용 핀 관리
  const registerPinRef = useRef<kakao.maps.Marker | null>(null);

  useEffect(() => {
    modeRef.current = selectedMode;
  }, [selectedMode]);
  useEffect(() => {
    openRef.current = onOpenRegisterConfirm;
  }, [onOpenRegisterConfirm]);
  useEffect(() => {
    selectRef.current = onSelectArea;
  }, [onSelectArea]);

  const getPolygonCenter = (poly: kakao.maps.Polygon) => {
    // getPath는 보통 LatLng[]를, 도넛/멀티패스면 LatLng[][]를 반환할 수 있어 대비
    const raw: any = poly.getPath();
    const rings: kakao.maps.LatLng[][] = Array.isArray(raw[0]) ? raw : [raw];

    const bounds = new kakao.maps.LatLngBounds();
    // 첫 번째 외곽 링만으로 중앙을 구해도 보통 충분
    rings[0].forEach((ll: kakao.maps.LatLng) => bounds.extend(ll));

    const sw = bounds.getSouthWest();
    const ne = bounds.getNorthEast();
    return new kakao.maps.LatLng((sw.getLat() + ne.getLat()) / 2, (sw.getLng() + ne.getLng()) / 2);
  };

  // 등록 모드일 때 핀 생성
  const createRegisterPin = useCallback(
    (latlng: kakao.maps.LatLng) => {
      if (!map) return;

      // 기존 핀 제거
      if (registerPinRef.current) {
        registerPinRef.current.setMap(null);
      }

      // 새 핀 생성
      const pin = new kakao.maps.Marker({
        position: latlng,
        map: map,
      });

      registerPinRef.current = pin;
    },
    [map],
  );

  // 등록 모드 해제 시 핀 제거
  const removeRegisterPin = useCallback(() => {
    if (registerPinRef.current) {
      registerPinRef.current.setMap(null);
      registerPinRef.current = null;
    }
  }, []);

  // 모드 변경 시 핀 제거
  useEffect(() => {
    if (selectedMode !== 'register') {
      removeRegisterPin();
    }
  }, [selectedMode, removeRegisterPin]);

  useEffect(() => {
    if (!map || !schoolAreas.length) return;

    const kakao = window.kakao;
    const polys: kakao.maps.Polygon[] = [];
    const byId = new Map<number, kakao.maps.Polygon>();
    const handlers: Array<{
      target: kakao.maps.Polygon;
      type: 'click' | 'mouseover' | 'mouseout';
      handler: (e: kakao.maps.event.MouseEvent) => void;
    }> = [];

    schoolAreas.forEach((area) => {
      const path = area.areaPolygon.coordinates.map((c) => new kakao.maps.LatLng(c.lat, c.lng));
      const polygon = new kakao.maps.Polygon({ path, ...BASE_STYLE });
      polygon.setMap(map);

      const onClick = (e: kakao.maps.event.MouseEvent) => {
        kakao.maps.event.preventMap?.();

        // 선택된 구역 클릭 시 선택 해제
        if (selectedPolygonAreaId === area.id) {
          setSelectedPolygonAreaId(0);
          selectRef.current?.(0);
          return;
        }

        // 선택된 구역 클릭 시 선택 구역 변경
        setSelectedPolygonAreaId(area.id);
        selectRef.current?.(area.id);

        if (modeRef.current === 'register') {
          // 등록 모드: 핀 생성 후 모달 열기
          createRegisterPin(e.latLng);
          polysRef.current.forEach((p) => p.setOptions(BASE_STYLE));
          polygon.setOptions(SELECTED_STYLE);
          selectedPolygonRef.current = polygon;
          openRef.current?.();

          const center = getPolygonCenter(polygon);
          map?.panTo(center);

          return;
        }

        polysRef.current.forEach((p) => p.setOptions(BASE_STYLE));
        polygon.setOptions(SELECTED_STYLE);
        selectedPolygonRef.current = polygon;

        const center = getPolygonCenter(polygon);
        map?.panTo(center);
      };
      const onOver = () => {
        if (selectedPolygonRef.current === polygon) return;
        polygon.setOptions(HOVER_STYLE);
      };
      const onOut = () => {
        if (selectedPolygonRef.current === polygon) return;
        polygon.setOptions(BASE_STYLE);
      };

      kakao.maps.event.addListener(polygon, 'click', onClick);
      kakao.maps.event.addListener(polygon, 'mouseover', onOver);
      kakao.maps.event.addListener(polygon, 'mouseout', onOut);
      handlers.push(
        { target: polygon, type: 'click', handler: onClick },
        { target: polygon, type: 'mouseover', handler: onOver },
        { target: polygon, type: 'mouseout', handler: onOut },
      );

      polys.push(polygon);
      byId.set(area.id, polygon);
    });

    polysRef.current = polys;
    polyByIdRef.current = byId;

    // 초기 로드/새로고침 시 현재 selectedAreaId에 맞춰 선택 상태 적용
    if (selectedAreaId) {
      const poly = byId.get(selectedAreaId) || null;
      if (poly) {
        polysRef.current.forEach((p) => p.setOptions(BASE_STYLE));
        poly.setOptions(SELECTED_STYLE);
        selectedPolygonRef.current = poly;
      }
    }

    return () => {
      handlers.forEach(({ target, type, handler }) =>
        kakao.maps.event.removeListener(target, type, handler),
      );
      polys.forEach((p) => p.setMap(null));
      polysRef.current = [];
      polyByIdRef.current.clear();
      selectedPolygonRef.current = null;
      removeRegisterPin();
    };
  }, [map, schoolAreas, selectedPolygonAreaId]);

  useEffect(() => {
    polysRef.current.forEach((p) => p.setOptions(BASE_STYLE));

    if (!selectedPolygonAreaId) {
      selectedPolygonRef.current = null;
      return;
    }
    const poly = polyByIdRef.current.get(selectedPolygonAreaId) || null;
    if (poly) poly.setOptions(SELECTED_STYLE);
    selectedPolygonRef.current = poly;
  }, [selectedPolygonAreaId]);

  useEffect(() => {
    polysRef.current.forEach((p) => p.setOptions(BASE_STYLE));
    selectedPolygonRef.current = null;
  }, [selectedMode]);

  const reset = useCallback(() => {
    polysRef.current.forEach((p) => p.setOptions(BASE_STYLE));
    selectedPolygonRef.current = null;
  }, []);

  return { polysRef, selectedPolygonRef, reset, createRegisterPin };
}
