import type { StateCreator } from 'zustand';

export type Mode = 'register' | 'find' | 'mypage' | 'more';

export type MainSlice = {
  selectedMode: Mode;
  isRegisterConfirmModalOpen: boolean;
  actions: {
    setSelectedMode: (mode: Mode) => void;
    setRegisterConfirmModalOpen: (open: boolean) => void;
  };
};

export const createMainSlice: StateCreator<MainSlice> = (set) => ({
  selectedMode: 'find',
  isRegisterConfirmModalOpen: false,
  actions: {
    setSelectedMode: (mode) => set({ selectedMode: mode }),
    setRegisterConfirmModalOpen: (open) => set({ isRegisterConfirmModalOpen: open }),
  },
});
