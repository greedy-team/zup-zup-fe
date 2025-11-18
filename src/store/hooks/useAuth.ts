import { useAuthStore } from '../authStore';

export const useAuthFlag = () => useAuthStore((store) => store.isAuthenticated);

export const useAuthActions = () => useAuthStore((store) => store.actions);
