import lostCountCircle from '../../../assets/LostCountCircle.png';

const WIDTH = 34;
const HEIGHT = 34;

const cache = new Map<number, kakao.maps.MarkerImage>();

export function getNumberPinImage(n: number): kakao.maps.MarkerImage {
  void n;
  const key = 0;
  const cached = cache.get(key);
  if (cached) return cached;

  const size = new window.kakao.maps.Size(WIDTH, HEIGHT);
  const offset = new window.kakao.maps.Point(Math.floor(WIDTH / 2), HEIGHT); // 바닥 중앙 기준점
  const img = new window.kakao.maps.MarkerImage(lostCountCircle, size, { offset });
  cache.set(key, img);
  return img;
}
