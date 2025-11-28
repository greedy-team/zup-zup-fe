import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { PledgedLostItemsResponse, CancelPledgeResponse } from '../../../types/mypage';
import type { ApiError } from '../../../types/common';
import { getPledgedLostItems, cancelPledge } from '..';
import { defaultQueryRetry } from '../../common/querySetting';
import toast from 'react-hot-toast';
import { showApiErrorToast } from '../../common/apiErrorToast';

export const usePledgedLostItems = () =>
  useQuery<PledgedLostItemsResponse, ApiError>({
    queryKey: ['lost-items', 'pledged'],
    queryFn: getPledgedLostItems,
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
