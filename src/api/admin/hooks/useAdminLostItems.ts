import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { PendingLostItemsResponse, AdminLostItemActionResponse } from '../../../types/admin';
import type { ApiError } from '../../../types/common';
import { fetchPendingLostItems, approveLostItems, rejectLostItems } from '..';
import toast from 'react-hot-toast';
import { defaultQueryRetry } from '../../common/querySetting';
import { showApiErrorToast } from '../../common/apiErrorToast';

export function usePendingLostItems(page: number = 1) {
  return useQuery<PendingLostItemsResponse, ApiError>({
    queryKey: ['lost-items', 'pending', { page }],
    queryFn: () => fetchPendingLostItems({ page }),
    placeholderData: (prev) => prev,
    staleTime: Infinity,
    retry: defaultQueryRetry,
  });
}

export const useApproveLostItemsMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<AdminLostItemActionResponse, ApiError, number[]>({
    mutationFn: (pendingLostItemIds) => approveLostItems(pendingLostItemIds),
    onSuccess: () => {
      toast.success('해당 분실물이 승인되었습니다.');
      queryClient.invalidateQueries({
        queryKey: ['lost-items', 'pending'],
      });
    },
    onError: showApiErrorToast,
  });
};

export const useRejectLostItemsMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<AdminLostItemActionResponse, ApiError, number[]>({
    mutationFn: (pendingLostItemIds) => rejectLostItems(pendingLostItemIds),
    onSuccess: () => {
      toast.success('해당 분실물이 반려되었습니다.');
      queryClient.invalidateQueries({
        queryKey: ['lost-items', 'pending'],
      });
    },
    onError: showApiErrorToast,
  });
};
