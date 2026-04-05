import type { StateCreator } from 'zustand';
import { SESSION_KEY } from '../onboardingStore';
import { SECTION_MODE_MAP } from '../../component/onboarding/onboardingSteps';

export type Mode = 'register' | 'find' | 'mypage' | 'more';

function deriveInitialMode(): Mode {
  const path = window.location.pathname;
  if (path.startsWith('/mypage')) return 'mypage';
  if (path.startsWith('/more')) return 'more';
  if (path.startsWith('/register')) return 'register';
  const isOnboarding = path.startsWith('/onboarding');
  if (path === '/' || isOnboarding) {
    try {
      const raw = sessionStorage.getItem(SESSION_KEY);
      if (raw) {
        const { tourSectionId } = JSON.parse(raw) as { tourSectionId: string | null };
        if (tourSectionId !== null) {
          return SECTION_MODE_MAP[tourSectionId] ?? 'find';
        }
      }
    } catch {}
    if (isOnboarding) return 'more';
  }
  return 'find';
}

export type MainSlice = {
  selectedMode: Mode;
  isRegisterConfirmModalOpen: boolean;
  isBottomSheetOpen: boolean;
  actions: {
    setSelectedMode: (mode: Mode) => void;
    setRegisterConfirmModalOpen: (open: boolean) => void;
    setBottomSheetOpen: (open: boolean) => void;
  };
};

export const createMainSlice: StateCreator<MainSlice> = (set) => ({
  selectedMode: deriveInitialMode(),
  isRegisterConfirmModalOpen: false,
  isBottomSheetOpen: false,
  actions: {
    setSelectedMode: (mode) => set({ selectedMode: mode }),
    setRegisterConfirmModalOpen: (open) => set({ isRegisterConfirmModalOpen: open }),
    setBottomSheetOpen: (open) => set({ isBottomSheetOpen: open }),
  },
});
