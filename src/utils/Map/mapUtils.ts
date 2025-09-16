import lostCountCircle from '../../../assets/LostCountCircle.png';

type LatLngLike = { lat: number; lng: number };

export function createNumberedMarker(
  map: kakao.maps.Map,
  pos: LatLngLike,
  count: number,
): kakao.maps.CustomOverlay | null {
  if (count <= 0) return null; // 개수 0이면 원 생성 안 함

  const display = count < 100 ? count : '99+';
  const size = 40;

  const content = document.createElement('div');
  content.style.width = `${size}px`;
  content.style.height = `${size}px`;
  content.style.background = `url(${lostCountCircle}) center/contain no-repeat`;
  content.style.display = 'flex';
  content.style.alignItems = 'center';
  content.style.justifyContent = 'center';
  content.style.color = '#0f172a';
  content.style.fontWeight = '700';
  content.style.fontSize = '13px';
  content.style.textShadow = '0 1px 1px rgba(255,255,255,0.6)';
  content.style.textAlign = 'center';
  content.style.pointerEvents = 'none';
  content.textContent = display.toString();

  const overlay = new kakao.maps.CustomOverlay({
    map,
    position: new window.kakao.maps.LatLng(pos.lat, pos.lng),
    content,
    xAnchor: 0.5,
    yAnchor: 1,
    clickable: false,
    zIndex: 1000,
  });
  return overlay;
}
