import { useEffect, useState } from 'react';

import type { UseLoaderHookReturnValue } from '../../types/hooks/map';

export function useLoader(): UseLoaderHookReturnValue {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const key = import.meta.env.VITE_KAKAO_MAP_API_KEY;
    if (!key) {
      console.error('Kakao Map API가 설정되지 않았습니다');
      setLoaded(false);
      return;
    }

    if (window.kakao?.maps) {
      setLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${key}&autoload=false&libraries=services`;
    script.async = true;

    const timeoutId = window.setTimeout(() => {
      console.error('Kakao Maps SDK 로드 시간 초과');
      setLoaded(false);
    }, 10000);

    script.onload = () => {
      window.kakao.maps.load(() => {
        clearTimeout(timeoutId);
        setLoaded(true);
      });
    };

    script.onerror = () => {
      window.clearTimeout(timeoutId);
      console.error('Kakao Maps SDK 로드 실패');
      setLoaded(false);
    };

    document.head.appendChild(script);

    return () => {
      window.clearTimeout(timeoutId);
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  return loaded;
}
