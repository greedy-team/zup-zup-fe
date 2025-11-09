import { StateCreator } from 'zustand';

export type AdminPageState = {
  selectedLostItemIds: number[];

  actions: {
    toggleSelectedLostItemId: (id: number) => void;
    setSelectedLostItemIds: (id: number[]) => void;
    clearSelectedLostItemIds: () => void;
  };
};

export const createAdminSlice: StateCreator<AdminPageState> = (set) => ({
  selectedLostItemIds: [],

  actions: {
    toggleSelectedLostItemId: (id) =>
      set((state) => {
        const hasId = state.selectedLostItemIds.includes(id);

        return {
          selectedLostItemIds: hasId
            ? state.selectedLostItemIds.filter((selectedId) => selectedId !== id)
            : [...state.selectedLostItemIds, id],
        };
      }),
    setSelectedLostItemIds: (ids) => set({ selectedLostItemIds: ids }),
    clearSelectedLostItemIds: () => set({ selectedLostItemIds: [] }),
  },
});
