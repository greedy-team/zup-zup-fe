import { StateCreator } from 'zustand';

export type AdminPageState = {
  selectedLostItemIds: number[];

  actions: {
    addSelectedLostItemId: (id: number) => void;
    removeSelectedLostItemId: (id: number) => void;
    setSelectedLostItemIds: (id: number[]) => void;
    clearSelectedLostItemIds: () => void;
  };
};

export const createAdminSlice: StateCreator<AdminPageState> = (set) => ({
  selectedLostItemIds: [],

  actions: {
    addSelectedLostItemId: (id) =>
      set((state) => {
        if (state.selectedLostItemIds.includes(id)) return state;
        return {
          selectedLostItemIds: [...state.selectedLostItemIds, id],
        };
      }),
    removeSelectedLostItemId: (id) =>
      set((state) => ({
        selectedLostItemIds: state.selectedLostItemIds.filter((selectedId) => selectedId !== id),
      })),
    setSelectedLostItemIds: (ids) => set({ selectedLostItemIds: ids }),
    clearSelectedLostItemIds: () => set({ selectedLostItemIds: [] }),
  },
});
