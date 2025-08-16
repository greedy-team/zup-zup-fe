import { useCallback, useEffect, useRef } from 'react';
import { BASE_STYLE, HOVER_STYLE, SELECTED_STYLE } from '../../constants/map/polygonStyle';
import type { UsePolygonsHookOptions } from '../../types/hooks/map';

export function usePolygons({
  map,
  schoolAreas,
  selectedAreaId,
  selectedMode,
  onOpenRegisterConfirm,
  onSelectArea,
  onPickLatLng,
}: UsePolygonsHookOptions) {
  const polysRef = useRef<kakao.maps.Polygon[]>([]);
  const polyByIdRef = useRef<Map<number, kakao.maps.Polygon>>(new Map());
  const selectedPolygonRef = useRef<kakao.maps.Polygon | null>(null);
  const modeRef = useRef(selectedMode);
  const openRef = useRef(onOpenRegisterConfirm);
  const selectRef = useRef(onSelectArea);
  const pickRef = useRef(onPickLatLng);

  useEffect(() => {
    modeRef.current = selectedMode;
  }, [selectedMode]);
  useEffect(() => {
    openRef.current = onOpenRegisterConfirm;
  }, [onOpenRegisterConfirm]);
  useEffect(() => {
    selectRef.current = onSelectArea;
  }, [onSelectArea]);
  useEffect(() => {
    pickRef.current = onPickLatLng;
  }, [onPickLatLng]);

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
        if (modeRef.current === 'register') {
          openRef.current?.();
          return;
        }
        polysRef.current.forEach((p) => p.setOptions(BASE_STYLE));
        polygon.setOptions(SELECTED_STYLE);
        selectedPolygonRef.current = polygon;
        selectRef.current?.(area.id);
        pickRef.current?.(e.latLng);
      };
      const onOver = (e: kakao.maps.event.MouseEvent) => {
        if (selectedPolygonRef.current === polygon) return;
        polygon.setOptions(HOVER_STYLE);
      };
      const onOut = (e: kakao.maps.event.MouseEvent) => {
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

    return () => {
      handlers.forEach(({ target, type, handler }) =>
        kakao.maps.event.removeListener(target, type, handler),
      );
      polys.forEach((p) => p.setMap(null));
      polysRef.current = [];
      polyByIdRef.current.clear();
      selectedPolygonRef.current = null;
    };
  }, [map, schoolAreas]);

  useEffect(() => {
    polysRef.current.forEach((p) => p.setOptions(BASE_STYLE));

    if (!selectedAreaId) {
      selectedPolygonRef.current = null;
      return;
    }
    const poly = polyByIdRef.current.get(selectedAreaId) || null;
    if (poly) poly.setOptions(SELECTED_STYLE);
    selectedPolygonRef.current = poly;
  }, [selectedAreaId]);

  useEffect(() => {
    polysRef.current.forEach((p) => p.setOptions(BASE_STYLE));
    selectedPolygonRef.current = null;
  }, [selectedMode]);

  const reset = useCallback(() => {
    polysRef.current.forEach((p) => p.setOptions(BASE_STYLE));
    selectedPolygonRef.current = null;
  }, []);

  return { polysRef, selectedPolygonRef, reset };
}
