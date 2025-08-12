import { schoolAreas, resetSchoolAreas, type SchoolArea } from '../db/schoolAreas.db';

function centroid(coords: { lat: number; lng: number }[]) {
  const n = coords.length;
  const lat = coords.reduce((s, c) => s + c.lat, 0) / n;
  const lng = coords.reduce((s, c) => s + c.lng, 0) / n;
  return { lat, lng };
}

export function seedSchoolAreas() {
  resetSchoolAreas();

  const studentHall = [
    { lat: 37.54931182018081, lng: 127.07481842704466 },
    { lat: 37.54921703581116, lng: 127.07510124208609 },
    { lat: 37.5499555833034, lng: 127.07552635196333 },
    { lat: 37.550009809360844, lng: 127.0752661269229 },
  ];
  const library = [
    { lat: 37.55164364732781, lng: 127.07403424325965 },
    { lat: 37.551391158238964, lng: 127.07436783675207 },
    { lat: 37.55169727232406, lng: 127.0747246190505 },
    { lat: 37.55194075599854, lng: 127.07438535804738 },
  ];
  const aiCenter = [
    { lat: 37.5508231145694, lng: 127.07502363713 },
    { lat: 37.55050299725438, lng: 127.07543637164292 },
    { lat: 37.55085861214749, lng: 127.07587242067135 },
    { lat: 37.55118322872235, lng: 127.07547100729076 },
  ];

  const rows: SchoolArea[] = [
    {
      id: 1,
      areaName: '학생회관',
      areaPolygon: { coordinates: studentHall },
      marker: centroid(studentHall),
    },
    {
      id: 2,
      areaName: '학술정보원',
      areaPolygon: { coordinates: library },
      marker: centroid(library),
    },
    {
      id: 3,
      areaName: '대양 AI 센터',
      areaPolygon: { coordinates: aiCenter },
      marker: centroid(aiCenter),
    },
  ];

  schoolAreas.push(...rows);
}
