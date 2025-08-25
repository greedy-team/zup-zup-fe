import { getNumberPinImage } from '../../constants/map/numberedPinImage';

type LatLngLike = { lat: number; lng: number };

export function createNumberedMarker(
  map: kakao.maps.Map,
  pos: LatLngLike,
  count: number,
): kakao.maps.Marker | null {
  if (count <= 0) return null; // 개수 0이면 마커 생성 안 함
  const image = getNumberPinImage(count);
  const marker = new kakao.maps.Marker({
    map,
    position: new window.kakao.maps.LatLng(pos.lat, pos.lng),
    image, // 숫자 핀 적용
    clickable: false,
    zIndex: 1000,
  });
  return marker;
}
