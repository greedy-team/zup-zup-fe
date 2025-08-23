import { useEffect, useState } from 'react';
import type { RefObject } from 'react';
import {
  MAP_DEFAULT_CENTER,
  MAP_LEVEL,
  MAP_MIN_LEVEL,
  MAP_MAX_LEVEL,
} from '../../constants/map/mapConfig';

export function getKakaoMap(containerRef: RefObject<HTMLDivElement | null>, loaded: boolean) {
  const [map, setMap] = useState<kakao.maps.Map | null>(null);

  useEffect(() => {
    if (!loaded || !containerRef.current) return;
    const kakao = window.kakao;

    const nextMap = new kakao.maps.Map(containerRef.current, {
      center: new kakao.maps.LatLng(MAP_DEFAULT_CENTER.lat, MAP_DEFAULT_CENTER.lng),
      level: MAP_LEVEL,
      minLevel: MAP_MIN_LEVEL,
      maxLevel: MAP_MAX_LEVEL,
    });
    nextMap.setCursor('default');
    setMap(nextMap);
    return () => setMap(null);
  }, [loaded, containerRef]);

  return map;
}
