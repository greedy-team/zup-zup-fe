import { useEffect, useRef } from 'react';
import { useKakaoLoader } from '../../../hooks/main/useKakaoLoader';

type Props = {
  setSelectedLat: (lat: number | null) => void;
  setSelectedLng: (lng: number | null) => void;
  setSelectedArea: (area: string) => void;
  selectedArea: string;
};

const KakaoMap = ({ setSelectedLat, setSelectedLng, setSelectedArea, selectedArea }: Props) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<any>(null);
  const clickedOverlayRef = useRef(false);

  const loaded = useKakaoLoader();

  useEffect(() => {
    if (!loaded || !mapRef.current) return;

    const kakao = window.kakao;
    const map = new kakao.maps.Map(mapRef.current, {
      center: new kakao.maps.LatLng(37.550701948532236, 127.07428227734258),
      level: 2,
    });

    const place = (latlng: kakao.maps.LatLng) => {
      const lat = latlng.getLat();
      const lng = latlng.getLng();
      if (!markerRef.current) {
        markerRef.current = new kakao.maps.Marker({ position: latlng });
        markerRef.current.setMap(map);
      } else {
        markerRef.current.setPosition(latlng);
      }
      setSelectedLat(lat);
      setSelectedLng(lng);
    };

    const studentCenterPolygonPath = [
      new kakao.maps.LatLng(37.54931182018081, 127.07481842704466),
      new kakao.maps.LatLng(37.54921703581116, 127.07510124208609),
      new kakao.maps.LatLng(37.5499555833034, 127.07552635196333),
      new kakao.maps.LatLng(37.550009809360844, 127.0752661269229),
    ];

    const libraryPolygonPath = [
      new kakao.maps.LatLng(37.55164364732781, 127.07403424325965),
      new kakao.maps.LatLng(37.551391158238964, 127.07436783675207),
      new kakao.maps.LatLng(37.55169727232406, 127.0747246190505),
      new kakao.maps.LatLng(37.55194075599854, 127.07438535804738),
    ];

    const aiCenterPolygonPath = [
      new kakao.maps.LatLng(37.5508231145694, 127.07502363713),
      new kakao.maps.LatLng(37.55050299725438, 127.07543637164292),
      new kakao.maps.LatLng(37.55085861214749, 127.07587242067135),
      new kakao.maps.LatLng(37.55118322872235, 127.07547100729076),
    ];

    const aiCenterPolygon = new kakao.maps.Polygon({
      path: aiCenterPolygonPath,
      strokeWeight: 3,
      strokeColor: '#39DE2A',
      strokeOpacity: 0.8,
      strokeStyle: 'solid',
      fillColor: '#A2FF99',
      fillOpacity: 0.7,
    });

    const studentCenterPolygon = new kakao.maps.Polygon({
      path: studentCenterPolygonPath,
      strokeWeight: 3,
      strokeColor: '#39DE2A',
      strokeOpacity: 0.8,
      strokeStyle: 'solid',
      fillColor: '#A2FF99',
      fillOpacity: 0.7,
    });

    const libraryPolygon = new kakao.maps.Polygon({
      path: libraryPolygonPath,
      strokeWeight: 3,
      strokeColor: '#39DE2A',
      strokeOpacity: 0.8,
      strokeStyle: 'solid',
      fillColor: '#A2FF99',
      fillOpacity: 0.7,
    });

    studentCenterPolygon.setMap(map);
    libraryPolygon.setMap(map);
    aiCenterPolygon.setMap(map);

    const mouseoverOption = {
      fillColor: '#EFFFED',
      fillOpacity: 0.8,
    };

    const mouseoutOption = {
      fillColor: '#A2FF99',
      fillOpacity: 0.7,
    };

    const onStudentOver = () => studentCenterPolygon.setOptions(mouseoverOption);
    const onStudentOut = () => studentCenterPolygon.setOptions(mouseoutOption);
    const onLibraryOver = () => libraryPolygon.setOptions(mouseoverOption);
    const onLibraryOut = () => libraryPolygon.setOptions(mouseoutOption);
    const onAiOver = () => aiCenterPolygon.setOptions(mouseoverOption);
    const onAiOut = () => aiCenterPolygon.setOptions(mouseoutOption);

    kakao.maps.event.addListener(studentCenterPolygon, 'mouseover', onStudentOver);
    kakao.maps.event.addListener(studentCenterPolygon, 'mouseout', onStudentOut);
    kakao.maps.event.addListener(libraryPolygon, 'mouseover', onLibraryOver);
    kakao.maps.event.addListener(libraryPolygon, 'mouseout', onLibraryOut);
    kakao.maps.event.addListener(aiCenterPolygon, 'mouseover', onAiOver);
    kakao.maps.event.addListener(aiCenterPolygon, 'mouseout', onAiOut);

    const onMapClick = (e: any) => {
      if (clickedOverlayRef.current) {
        clickedOverlayRef.current = false;
        return;
      }
      place(e.latLng);
      setSelectedArea('전체');
    };
    const onStudentClick = (e: any) => {
      clickedOverlayRef.current = true;
      setSelectedArea('학생회관');
      place(e.latLng);
    };
    const onLibraryClick = (e: any) => {
      clickedOverlayRef.current = true;
      setSelectedArea('학술정보원');
      place(e.latLng);
    };
    const onAiClick = (e: any) => {
      clickedOverlayRef.current = true;
      setSelectedArea('대양ai센터');
      place(e.latLng);
    };

    kakao.maps.event.addListener(map, 'click', onMapClick);
    kakao.maps.event.addListener(studentCenterPolygon, 'click', onStudentClick);
    kakao.maps.event.addListener(libraryPolygon, 'click', onLibraryClick);
    kakao.maps.event.addListener(aiCenterPolygon, 'click', onAiClick);

    return () => {
      kakao.maps.event.removeListener(map, 'click', onMapClick);
      kakao.maps.event.removeListener(studentCenterPolygon, 'click', onStudentClick);
      kakao.maps.event.removeListener(libraryPolygon, 'click', onLibraryClick);
      kakao.maps.event.removeListener(aiCenterPolygon, 'click', onAiClick);

      kakao.maps.event.removeListener(studentCenterPolygon, 'mouseover', onStudentOver);
      kakao.maps.event.removeListener(studentCenterPolygon, 'mouseout', onStudentOut);
      kakao.maps.event.removeListener(libraryPolygon, 'mouseover', onLibraryOver);
      kakao.maps.event.removeListener(libraryPolygon, 'mouseout', onLibraryOut);
      kakao.maps.event.removeListener(aiCenterPolygon, 'mouseover', onAiOver);
      kakao.maps.event.removeListener(aiCenterPolygon, 'mouseout', onAiOut);
    };
  }, [loaded, setSelectedLat, setSelectedLng]);

  return (
    <div>
      <div ref={mapRef} className="absolute inset-0" />
      <div className="absolute left-3 bottom-3 z-10 rounded-md bg-white/90 px-3 py-2 text-sm shadow">
        선택: {selectedArea || '전체'}
      </div>
    </div>
  );
};

export default KakaoMap;
