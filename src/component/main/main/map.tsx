import { useEffect, useRef, useState } from 'react';
import { useKakaoLoader } from '../../../hooks/main/useKakaoLoader';

const KakaoMap = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [selectedPolygon, setSelectedPolygon] = useState<string>('');
  const loaded = useKakaoLoader();

  useEffect(() => {
    if (!loaded || !mapRef.current) return;

    const kakao = (window as any).kakao;
    const map = new kakao.maps.Map(mapRef.current, {
      center: new kakao.maps.LatLng(37.550701948532236, 127.07428227734258),
      level: 3,
    });

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

    kakao.maps.event.addListener(studentCenterPolygon, 'mouseover', () => {
      studentCenterPolygon.setOptions(mouseoverOption);
    });

    kakao.maps.event.addListener(studentCenterPolygon, 'mouseout', () => {
      studentCenterPolygon.setOptions(mouseoutOption);
    });

    kakao.maps.event.addListener(studentCenterPolygon, 'mousedown', () => {
      setSelectedPolygon('studentCenter');
    });

    kakao.maps.event.addListener(libraryPolygon, 'mousedown', () => {
      setSelectedPolygon('library');
    });

    kakao.maps.event.addListener(libraryPolygon, 'mouseover', () => {
      libraryPolygon.setOptions(mouseoverOption);
    });

    kakao.maps.event.addListener(libraryPolygon, 'mouseout', () => {
      libraryPolygon.setOptions(mouseoutOption);
    });

    kakao.maps.event.addListener(aiCenterPolygon, 'mousedown', () => {
      setSelectedPolygon('aiCenter');
    });

    kakao.maps.event.addListener(aiCenterPolygon, 'mouseover', () => {
      aiCenterPolygon.setOptions(mouseoverOption);
    });

    kakao.maps.event.addListener(aiCenterPolygon, 'mouseout', () => {
      aiCenterPolygon.setOptions(mouseoutOption);
    });
  }, [loaded]);

  return (
    <div>
      <div ref={mapRef} style={{ width: '100%', height: '70vh', marginBottom: '12px' }} />
      <div>클릭 {selectedPolygon}</div>
    </div>
  );
};

export default KakaoMap;
