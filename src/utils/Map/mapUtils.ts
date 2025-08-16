import type { SchoolArea } from '../../types/map/map';

export function toKakaoPath(area: SchoolArea) {
  return area.areaPolygon.coordinates.map((c) => new kakao.maps.LatLng(c.lat, c.lng));
}

export function createNumberedMarker(
  map: kakao.maps.Map,
  pos: { lat: number; lng: number },
  raw: number,
) {
  if (!raw) return null;
  const number = Math.max(1, Math.min(10, raw));
  const imageSrc =
    'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_number_blue.png';
  const imageSize = new kakao.maps.Size(36, 37);
  const imgOptions = {
    spriteSize: new kakao.maps.Size(36, 691),
    spriteOrigin: new kakao.maps.Point(0, (number - 1) * 46 + 10),
    offset: new kakao.maps.Point(13, 37),
  };
  const markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imgOptions);
  return new kakao.maps.Marker({
    map,
    position: new kakao.maps.LatLng(pos.lat, pos.lng),
    image: markerImage,
  });
}

export function resetPolygons(polys: kakao.maps.Polygon[], baseStyle: kakao.maps.PolygonOptions) {
  polys.forEach((p) => p.setOptions(baseStyle));
}
