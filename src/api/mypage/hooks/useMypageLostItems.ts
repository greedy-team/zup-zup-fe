import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type {
  PledgedLostItemsResponse,
  CancelPledgeResponse,
  FoundCompleteResponse,
} from '../../../types/mypage';
import type { ApiError } from '../../../types/common';
import { getPledgedLostItems, cancelPledge, completeFoundItem } from '..';
import { defaultQueryRetry } from '../../common/querySetting';
import toast from 'react-hot-toast';
import { showApiErrorToast } from '../../common/apiErrorToast';

export const usePledgedLostItems = (page: number = 1) =>
  useQuery<PledgedLostItemsResponse, ApiError>({
    queryKey: ['lost-items', 'pledged'],
    queryFn: () => getPledgedLostItems(page),
    placeholderData: (prev) => prev,
    retry: defaultQueryRetry,
  });

export const useCancelPledgeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<CancelPledgeResponse, ApiError, number>({
    mutationFn: cancelPledge,
    onSuccess: () => {
      toast.success('해당 분실물이 서약 취소 처리되었습니다.');
      queryClient.invalidateQueries({
        queryKey: ['lost-items', 'pledged'],
      });
    },
    onError: showApiErrorToast,
  });
};

export const useCompleteFoundMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<FoundCompleteResponse, ApiError, number>({
    mutationFn: completeFoundItem,
    onSuccess: () => {
      toast.success('해당 분실물이 찾음 완료 처리되었습니다.');
      queryClient.invalidateQueries({
        queryKey: ['lost-items', 'pledged'],
      });
    },
    onError: showApiErrorToast,
  });
};
