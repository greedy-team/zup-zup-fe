import number1 from '../../../assets/numberedPin/number-1.png';
import number2 from '../../../assets/numberedPin/number-2.png';
import number3 from '../../../assets/numberedPin/number-3.png';
import number4 from '../../../assets/numberedPin/number-4.png';
import number5 from '../../../assets/numberedPin/number-5.png';
import number6 from '../../../assets/numberedPin/number-6.png';
import number7 from '../../../assets/numberedPin/number-7.png';
import number8 from '../../../assets/numberedPin/number-8.png';
import number9 from '../../../assets/numberedPin/number-9.png';
import number10 from '../../../assets/numberedPin/number-10.png';

export const PIN: Record<number, string> = {
  1: number1,
  2: number2,
  3: number3,
  4: number4,
  5: number5,
  6: number6,
  7: number7,
  8: number8,
  9: number9,
  10: number10,
};

const WIDTH = 44;
const HEIGHT = 44;

const cache = new Map<number, kakao.maps.MarkerImage>();

export function getNumberPinImage(n: number): kakao.maps.MarkerImage {
  const key = Math.max(1, Math.min(n, 10));
  const cached = cache.get(key);
  if (cached) return cached;

  const size = new window.kakao.maps.Size(WIDTH, HEIGHT);
  const offset = new window.kakao.maps.Point(Math.floor(WIDTH / 2), HEIGHT); // 바닥 중앙 기준점
  const img = new window.kakao.maps.MarkerImage(PIN[key], size, { offset });
  cache.set(key, img);
  return img;
}
