import {
  useApproveLostItemsMutation,
  useRejectLostItemsMutation,
} from '../../api/admin/hooks/useAdminLostItems';
import { useAdminActions, useSelectedLostItemIds } from '../../store/hooks/useAdmin';

type PendingLostItemsActionBarProps = {
  currentPageLostItemIds: number[];
};

const PendingLostItemsActionBar = ({ currentPageLostItemIds }: PendingLostItemsActionBarProps) => {
  const selectedLostItemIds = useSelectedLostItemIds();
  const { setSelectedLostItemIds, clearSelectedLostItemIds } = useAdminActions();

  const approveMutation = useApproveLostItemsMutation();
  const rejectMutation = useRejectLostItemsMutation();

  const isAllSelected =
    currentPageLostItemIds.length > 0 &&
    currentPageLostItemIds.every((id) => selectedLostItemIds.includes(id));

  const selectedLostItemCount = selectedLostItemIds.length;
  const hasSelection = selectedLostItemCount > 0;

  const isMutating = approveMutation.isPending || rejectMutation.isPending;

  const handleToggleSelectAllItems = () => {
    if (isAllSelected) {
      clearSelectedLostItemIds();
    } else {
      setSelectedLostItemIds(currentPageLostItemIds);
    }
  };

  const handleApproveSelectedItems = () => {
    if (!hasSelection || isMutating) return;
    approveMutation.mutate(selectedLostItemIds, {
      onSuccess: () => {
        clearSelectedLostItemIds();
      },
    });
  };

  const handleRejectSelectedItems = () => {
    if (!hasSelection || isMutating) return;
    rejectMutation.mutate(selectedLostItemIds, {
      onSuccess: () => {
        clearSelectedLostItemIds();
      },
    });
  };

  return (
    <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center">
      <label className="flex items-center gap-1.5 text-sm">
        <input
          type="checkbox"
          checked={isAllSelected}
          onChange={handleToggleSelectAllItems}
          className="h-4 w-4"
        />
        <span>전체 선택</span>
      </label>

      <div className="flex flex-col gap-2 sm:ml-auto sm:flex-row sm:items-center">
        <span className="text-sm text-gray-600">선택된 항목: {selectedLostItemCount}개</span>

        <button
          type="button"
          disabled={!hasSelection || isMutating}
          onClick={handleApproveSelectedItems}
          className={`w-full rounded border px-3 py-1 text-sm transition-colors sm:w-auto ${
            hasSelection && !isMutating
              ? 'border-emerald-500 bg-emerald-500 text-white hover:bg-emerald-600'
              : 'cursor-not-allowed border-gray-300 bg-gray-200 text-gray-400'
          }`}
        >
          {approveMutation.isPending ? '승인 중...' : '승인'}
        </button>

        <button
          type="button"
          disabled={!hasSelection || isMutating}
          onClick={handleRejectSelectedItems}
          className={`w-full rounded border px-3 py-1 text-sm transition-colors sm:w-auto ${
            hasSelection && !isMutating
              ? 'border-red-400 bg-red-500 text-white hover:bg-red-600'
              : 'cursor-not-allowed border-red-200 bg-red-100 text-red-300'
          }`}
        >
          {rejectMutation.isPending ? '삭제 중...' : '삭제'}
        </button>
      </div>
    </div>
  );
};

export default PendingLostItemsActionBar;
