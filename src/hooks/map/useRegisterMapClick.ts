import { useEffect } from 'react';

export function useRegisterMapClick(
  map: kakao.maps.Map | null,
  enabled: boolean,
  createRegisterPin: (latLng: kakao.maps.LatLng) => void,
  openConfirm: () => void,
) {
  useEffect(() => {
    if (!map) return;
    const kakao = window.kakao;
    if (!enabled) return;

    const onMapClick = (e: kakao.maps.event.MouseEvent) => {
      createRegisterPin(e.latLng);
      openConfirm();
    };
    kakao.maps.event.addListener(map, 'click', onMapClick);
    return () => kakao.maps.event.removeListener(map, 'click', onMapClick);
  }, [map, enabled, createRegisterPin, openConfirm]);
}
