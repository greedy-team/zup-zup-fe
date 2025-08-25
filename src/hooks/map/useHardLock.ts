import { useEffect } from 'react';
import { ALLOWED_BOUNDARY } from '../../constants/map/mapConfig';

export function useHardLock(map: kakao.maps.Map | null) {
  useEffect(() => {
    if (!map) return;
    const kakao = window.kakao;

    const ALLOWED = new kakao.maps.LatLngBounds(
      new kakao.maps.LatLng(ALLOWED_BOUNDARY.sw.lat, ALLOWED_BOUNDARY.sw.lng),
      new kakao.maps.LatLng(ALLOWED_BOUNDARY.ne.lat, ALLOWED_BOUNDARY.ne.lng),
    );

    let adjusting = false;

    const getInnerBounds = () => {
      const b = map.getBounds();
      const sw = b.getSouthWest();
      const ne = b.getNorthEast();

      const halfLatSpan = (ne.getLat() - sw.getLat()) / 2;
      const halfLngSpan = (ne.getLng() - sw.getLng()) / 2;

      const aSW = ALLOWED.getSouthWest();
      const aNE = ALLOWED.getNorthEast();

      const innerSW = new kakao.maps.LatLng(aSW.getLat() + halfLatSpan, aSW.getLng() + halfLngSpan);
      const innerNE = new kakao.maps.LatLng(aNE.getLat() - halfLatSpan, aNE.getLng() - halfLngSpan);

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
      map.setCenter(new kakao.maps.LatLng(lat, lng));
      adjusting = false;
    };

    const onCenterChanged = clampCenter;
    const onZoomChanged = clampCenter;
    const onDragStart = clampCenter;
    const onDrag = clampCenter;

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
}
