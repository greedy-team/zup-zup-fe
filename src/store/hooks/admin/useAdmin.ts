import { useAdminStore } from '../../adminStore';

export const useSelectedLostItemIds = () => useAdminStore((store) => store.selectedLostItemIds);

export const useAdminActions = () => useAdminStore((store) => store.actions);
