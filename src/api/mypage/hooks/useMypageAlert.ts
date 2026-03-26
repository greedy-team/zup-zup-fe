import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import type {
  SubscriptionsResponse,
  EmailAlertResponse,
  EmailAlertRequest,
  SubscriptionsRequest,
} from '../../../types/mypage';
import type { ApiError } from '../../../types/common';
import { getEmailAlert, getSubscriptions, updateEmailAlert, updateSubscriptions } from '..';
import { defaultQueryRetry } from '../../common/querySetting';
import { showApiErrorToast } from '../../common/apiErrorToast';

type AlertSettingsPayload = EmailAlertRequest & SubscriptionsRequest;

export const useEmailAlertQuery = (enabled: boolean) =>
  useQuery<EmailAlertResponse, ApiError>({
    queryKey: ['members', 'me', 'email'],
    queryFn: getEmailAlert,
    retry: defaultQueryRetry,
    enabled,
  });

export const useSubscriptionsQuery = (enabled: boolean) =>
  useQuery<SubscriptionsResponse, ApiError>({
    queryKey: ['alerts', 'subscriptions'],
    queryFn: getSubscriptions,
    retry: defaultQueryRetry,
    enabled,
  });

export const useUpdateAlertSettingsMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<void, ApiError, AlertSettingsPayload>({
    mutationFn: ({ email, emailAlertEnabled, categoryIds }) =>
      Promise.all([
        updateEmailAlert({ email, emailAlertEnabled }),
        updateSubscriptions({ categoryIds }),
      ]).then(() => undefined),
    onSuccess: () => {
      toast.success('알림 설정이 저장되었습니다.');
      queryClient.invalidateQueries({ queryKey: ['members', 'me', 'email'] });
      queryClient.invalidateQueries({ queryKey: ['alerts', 'subscriptions'] });
    },
    onError: showApiErrorToast,
  });
};
