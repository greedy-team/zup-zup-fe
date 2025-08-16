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
  const museum = [
    { lat: 37.55128016726004, lng: 127.07534379212652 },
    { lat: 37.551464730726885, lng: 127.07556465417318 },
    { lat: 37.551769084589424, lng: 127.07514624069634 },
    { lat: 37.55158227144605, lng: 127.07491971815496 },
  ];

  const woojeongDang = [
    { lat: 37.55169052200443, lng: 127.07471329554578 },
    { lat: 37.551908861471226, lng: 127.0749539954644 },
    { lat: 37.552089213363445, lng: 127.07470236098006 },
    { lat: 37.551884397296064, lng: 127.07445886119999 },
  ];

  const yulgokGwan = [
    { lat: 37.55167296698273, lng: 127.07397485925725 },
    { lat: 37.551790204648526, lng: 127.07380239422955 },
    { lat: 37.55206706287642, lng: 127.07411953825563 },
    { lat: 37.55193856406506, lng: 127.0742891630448 },
  ];

  const chungmuGwan = [
    { lat: 37.552454815619825, lng: 127.07360217495305 },
    { lat: 37.55261912578581, lng: 127.07379755316325 },
    { lat: 37.552100624184334, lng: 127.07447888075991 },
    { lat: 37.55195433151994, lng: 127.07428917869515 },
  ];

  const gwanggaetoGwan = [
    { lat: 37.550652950939906, lng: 127.07339104579738 },
    { lat: 37.550197640122896, lng: 127.0738828688325 },
    { lat: 37.54983748643569, lng: 127.07348926547328 },
    { lat: 37.550299603816676, lng: 127.0729154040191 },
  ];

  const gunjaGwan = [
    { lat: 37.54986421428433, lng: 127.07397307163014 },
    { lat: 37.54938439573069, lng: 127.07403200863018 },
    { lat: 37.54934641621697, lng: 127.07353121988194 },
    { lat: 37.54981945415337, lng: 127.07350905161334 },
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
    {
      id: 4,
      areaName: '박물관',
      areaPolygon: { coordinates: museum },
      marker: centroid(museum),
    },
    {
      id: 5,
      areaName: '우정당',
      areaPolygon: { coordinates: woojeongDang },
      marker: centroid(woojeongDang),
    },
    {
      id: 6,
      areaName: '율곡관',
      areaPolygon: { coordinates: yulgokGwan },
      marker: centroid(yulgokGwan),
    },
    {
      id: 7,
      areaName: '충무관',
      areaPolygon: { coordinates: chungmuGwan },
      marker: centroid(chungmuGwan),
    },
    {
      id: 8,
      areaName: '광개토관',
      areaPolygon: { coordinates: gwanggaetoGwan },
      marker: centroid(gwanggaetoGwan),
    },
    {
      id: 9,
      areaName: '군자관',
      areaPolygon: { coordinates: gunjaGwan },
      marker: centroid(gunjaGwan),
    },
  ];

  schoolAreas.push(...rows);
}
