import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { createAuthSlice } from './slices/authSlice';
import type { AuthSlice } from './slices/authSlice';

export const useAuthStore = create<AuthSlice>()(
  persist(createAuthSlice, {
    name: 'auth-flag-storage',
    storage: createJSONStorage(() => sessionStorage),
    partialize: (state) => ({
      isAuthenticated: state.isAuthenticated,
    }),
  }),
);
