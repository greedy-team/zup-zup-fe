declare global {
  namespace kakao.maps.event {
    interface MouseEvent {
      latLng: kakao.maps.LatLng;
    }
  }

  interface Window {
    kakao: typeof kakao;
  }
}

export {};
