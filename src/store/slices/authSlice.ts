import type { StateCreator } from 'zustand';

export type AuthSlice = {
  isAuthenticated: boolean;
  actions: {
    setAuthenticated: () => void;
    setUnauthenticated: () => void;
  };
};

export const createAuthSlice: StateCreator<AuthSlice> = (set) => ({
  isAuthenticated: false,
  actions: {
    setAuthenticated: () => set({ isAuthenticated: true }),
    setUnauthenticated: () => set({ isAuthenticated: false }),
  },
});
