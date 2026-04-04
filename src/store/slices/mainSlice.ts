import type { StateCreator } from 'zustand';
import { SESSION_KEY } from '../onboardingStore';

export type Mode = 'register' | 'find' | 'mypage' | 'more';

function deriveInitialMode(): Mode {
  const path = window.location.pathname;
  if (path.startsWith('/mypage')) return 'mypage';
  if (path.startsWith('/more') || path.startsWith('/onboarding')) return 'more';
  if (path.startsWith('/register')) return 'register';
  if (path === '/') {
    try {
      const raw = sessionStorage.getItem(SESSION_KEY);
      if (raw) {
        const { tourSectionIdx } = JSON.parse(raw) as { tourSectionIdx: number | null };
        if (tourSectionIdx !== null) {
          const sectionModes: Partial<Record<number, Mode>> = { 2: 'register' };
          return sectionModes[tourSectionIdx] ?? 'find';
        }
      }
    } catch {}
  }
  return 'find';
}

export type MainSlice = {
  selectedMode: Mode;
  isRegisterConfirmModalOpen: boolean;
  actions: {
    setSelectedMode: (mode: Mode) => void;
    setRegisterConfirmModalOpen: (open: boolean) => void;
  };
};

export const createMainSlice: StateCreator<MainSlice> = (set) => ({
  selectedMode: deriveInitialMode(),
  isRegisterConfirmModalOpen: false,
  actions: {
    setSelectedMode: (mode) => set({ selectedMode: mode }),
    setRegisterConfirmModalOpen: (open) => set({ isRegisterConfirmModalOpen: open }),
  },
});
