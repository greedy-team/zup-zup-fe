import { useMainStore } from '../mainStore';

export const useSelectedMode = () => useMainStore((s) => s.selectedMode);
export const useSetSelectedMode = () => useMainStore((s) => s.actions.setSelectedMode);
export const useRegisterConfirmModal = () => useMainStore((s) => s.isRegisterConfirmModalOpen);
export const useSetRegisterConfirmModal = () =>
  useMainStore((s) => s.actions.setRegisterConfirmModalOpen);
