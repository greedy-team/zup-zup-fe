import { create } from 'zustand';

const STORAGE_KEY = 'sejong-zupzup-onboarding-done';
export const SESSION_KEY = 'sejong-zupzup-onboarding-session';

type SessionState = {
  overlayStep: number;
  tourSectionIdx: number | null;
  tourStepIdx: number;
};

const SESSION_DEFAULTS: SessionState = { overlayStep: 0, tourSectionIdx: null, tourStepIdx: 0 };

function loadSession(): SessionState {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return SESSION_DEFAULTS;
    return { ...SESSION_DEFAULTS, ...(JSON.parse(raw) as Partial<SessionState>) };
  } catch {
    return SESSION_DEFAULTS;
  }
}

function saveSession(state: SessionState) {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(state));
}

type OnboardingStore = {
  /** 첫 방문 오버레이 활성 여부 */
  isActive: boolean;
  /** 첫 방문 오버레이 현재 스텝 */
  overlayStep: number;
  /** /onboarding 허브에서 시작하는 섹션 투어 (null = 비활성) */
  tourSectionIdx: number | null;
  tourStepIdx: number;
  actions: {
    /** 첫 방문 오버레이 완료 */
    complete: () => void;
    /** 첫 방문 오버레이 스텝 이동 */
    setOverlayStep: (step: number) => void;
    /** 섹션 투어 시작 */
    startTour: (sectionIdx: number) => void;
    /** 섹션 투어 종료 */
    endTour: () => void;
    setTourStepIdx: (idx: number) => void;
  };
};

export const useOnboardingStore = create<OnboardingStore>((set, get) => {
  const session = loadSession();
  return {
    isActive: !localStorage.getItem(STORAGE_KEY),
    overlayStep: session.overlayStep,
    tourSectionIdx: session.tourSectionIdx,
    tourStepIdx: session.tourStepIdx,
    actions: {
      complete: () => {
        localStorage.setItem(STORAGE_KEY, 'true');
        sessionStorage.removeItem(SESSION_KEY);
        set({ isActive: false, overlayStep: 0 });
      },
      setOverlayStep: (step) => {
        const { tourSectionIdx, tourStepIdx } = get();
        saveSession({ overlayStep: step, tourSectionIdx, tourStepIdx });
        set({ overlayStep: step });
      },
      startTour: (sectionIdx) => {
        const { overlayStep } = get();
        saveSession({ overlayStep, tourSectionIdx: sectionIdx, tourStepIdx: 0 });
        set({ tourSectionIdx: sectionIdx, tourStepIdx: 0 });
      },
      endTour: () => {
        const { overlayStep } = get();
        saveSession({ overlayStep, tourSectionIdx: null, tourStepIdx: 0 });
        set({ tourSectionIdx: null, tourStepIdx: 0 });
      },
      setTourStepIdx: (idx) => {
        const { overlayStep, tourSectionIdx } = get();
        saveSession({ overlayStep, tourSectionIdx, tourStepIdx: idx });
        set({ tourStepIdx: idx });
      },
    },
  };
});
