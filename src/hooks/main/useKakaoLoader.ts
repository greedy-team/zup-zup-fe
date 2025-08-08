import { useEffect, useState } from 'react';

export function useKakaoLoader(): boolean {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    if ((window as Window).kakao && (window as Window).kakao.maps) {
      setLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${import.meta.env.VITE_KAKAO_MAP_API_KEY}&autoload=false&libraries=services`;
    script.async = true;
    script.onload = () => {
      (window as Window).kakao.maps.load(() => {
        setLoaded(true);
      });
    };
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return loaded;
}
