import { useEffect, useState } from 'react';

import type { UseLoaderHookReturnValue } from '../../types/hooks/map';

export function useLoader(): UseLoaderHookReturnValue {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    // 이미 로드된 경우
    if (window.kakao?.maps) {
      setLoaded(true);
      return;
    }

    const onReady = () => setLoaded(true);
    const onTimeout = window.setTimeout(() => {
      console.error('Kakao Maps SDK 로드 시간 초과');
      setLoaded(false);
    }, 15000);

    window.addEventListener('kakao-maps-ready', onReady, { once: true });

    return () => {
      window.clearTimeout(onTimeout);
      window.removeEventListener('kakao-maps-ready', onReady);
    };
  }, []);

  return loaded;
}
