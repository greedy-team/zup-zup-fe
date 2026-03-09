import { create } from 'zustand';

const STORAGE_KEY = 'sejong-zupzup-onboarding-done';

type OnboardingStore = {
  /** 첫 방문 오버레이 활성 여부 */
  isActive: boolean;
  /** /onboarding 허브에서 시작하는 섹션 투어 (null = 비활성) */
  tourSectionIdx: number | null;
  tourStepIdx: number;
  actions: {
    /** 첫 방문 오버레이 완료 */
    complete: () => void;
    /** 섹션 투어 시작 */
    startTour: (sectionIdx: number) => void;
    /** 섹션 투어 종료 */
    endTour: () => void;
    setTourStepIdx: (idx: number) => void;
  };
};

export const useOnboardingStore = create<OnboardingStore>((set) => ({
  isActive: !localStorage.getItem(STORAGE_KEY),
  tourSectionIdx: null,
  tourStepIdx: 0,
  actions: {
    complete: () => {
      localStorage.setItem(STORAGE_KEY, 'true');
      set({ isActive: false });
    },
    startTour: (sectionIdx) => set({ tourSectionIdx: sectionIdx, tourStepIdx: 0 }),
    endTour: () => set({ tourSectionIdx: null, tourStepIdx: 0 }),
    setTourStepIdx: (idx) => set({ tourStepIdx: idx }),
  },
}));
