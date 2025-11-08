import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { PendingLostItemsResponse, AdminLostItemActionResponse } from '../../../types/admin';
import type { ApiError } from '../../../types/common';
import { fetchPendingLostItems, approveLostItems, rejectLostItems } from '..';

export function usePendingLostItems(page: number = 1) {
  return useQuery<PendingLostItemsResponse, ApiError>({
    queryKey: ['lost-items', 'pending', { page }],
    queryFn: () => fetchPendingLostItems({ page }),
    placeholderData: (prev) => prev,
    staleTime: Infinity,
  });
}

export const useApproveLostItemsMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<AdminLostItemActionResponse, ApiError, number[]>({
    mutationFn: (pendingLostItemIds) => approveLostItems(pendingLostItemIds),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['lost-items', 'pending'],
      });
    },
    onError: (err) => {
      alert(`${err.status} : ${err.detail}`);
    },
  });
};

export const useRejectLostItemsMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<AdminLostItemActionResponse, ApiError, number[]>({
    mutationFn: (pendingLostItemIds) => rejectLostItems(pendingLostItemIds),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['lost-items', 'pending'],
      });
    },
    onError: (err) => {
      alert(`${err.status} : ${err.detail}`);
    },
  });
};
