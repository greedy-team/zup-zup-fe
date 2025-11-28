import { useQuery } from '@tanstack/react-query';
import type { PledgedLostItemsResponse } from '../../../types/mypage';
import type { ApiError } from '../../../types/common';
import { getPledgedLostItems } from '..';
import { defaultQueryRetry } from '../../common/querySetting';

export const usePledgedLostItems = () =>
  useQuery<PledgedLostItemsResponse, ApiError>({
    queryKey: ['lost-items', 'pledged'],
    queryFn: getPledgedLostItems,
    retry: defaultQueryRetry,
  });
