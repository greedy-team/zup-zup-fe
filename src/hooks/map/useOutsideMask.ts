import { useEffect } from 'react';
import { OUTER_WORLD, SEJONG_UNIVERSITY_CAMPUS } from '../../constants/map/mapConfig';
import { MAP_MASK_STYLE } from '../../constants/map/polygonStyle';

export function useOutsideMask(map: kakao.maps.Map | null) {
  useEffect(() => {
    if (!map) return;
    const kakao = window.kakao;

    const outerWorld = OUTER_WORLD.map((p) => new kakao.maps.LatLng(p.lat, p.lng));
    const sejongUniversityCampus = SEJONG_UNIVERSITY_CAMPUS.map(
      (p) => new kakao.maps.LatLng(p.lat, p.lng),
    );

    const mask = new kakao.maps.Polygon({
      map,
      path: [outerWorld, sejongUniversityCampus],
      ...MAP_MASK_STYLE,
    });

    return () => mask.setMap(null);
  }, [map]);
}
