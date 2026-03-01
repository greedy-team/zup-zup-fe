import { useRegisterStore } from '../registerStore';

export const useSelectedCategory = () => useRegisterStore((s) => s.selectedCategory);
export const useRegisterFormData = () => useRegisterStore((s) => s.formData);
export const useRegisterIsPending = () => useRegisterStore((s) => s.isPending);
export const useResultModalContent = () => useRegisterStore((s) => s.resultModalContent);
export const useRegisterActions = () => useRegisterStore((s) => s.actions);
