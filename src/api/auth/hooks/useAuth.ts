import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { loginPortal, logout } from '..';
import { useAuthActions } from '../../../store/hooks/useAuth';
import type { LoginFormValues, LoginResponse } from '../../../types/auth';
import type { ApiError } from '../../../types/common';
import { showApiErrorToast } from '../../common/apiErrorToast';

export const useLoginMutation = () => {
  const { setAuthenticated } = useAuthActions();

  return useMutation<LoginResponse, ApiError, LoginFormValues>({
    mutationFn: (loginFormValues) => loginPortal(loginFormValues),
    onSuccess: (data) => {
      setAuthenticated();
      toast.success(data?.message ?? '로그인에 성공했습니다.');
    },
    onError: showApiErrorToast,
  });
};

export const useLogoutMutation = () => {
  const { setUnauthenticated } = useAuthActions();

  return useMutation<void, ApiError, void>({
    mutationFn: () => logout(),
    onSuccess: () => {
      setUnauthenticated();
      toast.success('로그아웃에 성공했습니다.');
    },
    onError: showApiErrorToast,
  });
};
