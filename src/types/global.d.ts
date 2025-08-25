declare global {
  namespace kakao.maps {
    interface MapOptions {
      minLevel?: number;
      maxLevel?: number;
    }

    namespace event {
      interface MouseEvent {
        latLng: kakao.maps.LatLng;
      }
    }
  }

  interface Window {
    kakao: typeof kakao;
  }
}

export {};
