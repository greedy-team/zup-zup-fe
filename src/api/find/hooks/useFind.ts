import { useQuery, useMutation } from '@tanstack/react-query';
import {
  getLostItemBrief,
  getQuizzes,
  submitQuizzes,
  getDetail,
  postPledge,
  getDepositArea,
} from '..';
import type {
  LostItemBrief,
  GetQuizzesResponse,
  QuizSubmitBody,
  DetailResponse,
  PledgeResponse,
  DepositAreaResponse,
} from '../../../types/find';
import type { ApiError } from '../../../types/common';
import { defaultQueryRetry } from '../../common/querySetting';
import toast from 'react-hot-toast';
import { showApiErrorToast } from '../../common/apiErrorToast';

export const useLostItemBriefQuery = (lostItemId: number) =>
  useQuery<LostItemBrief, ApiError>({
    queryKey: ['lost-items', lostItemId, 'brief'],
    queryFn: () => getLostItemBrief(lostItemId),
    staleTime: Infinity,
    retry: defaultQueryRetry,
  });

export const useQuizzesQuery = (lostItemId: number) =>
  useQuery<GetQuizzesResponse, ApiError>({
    queryKey: ['lost-items', lostItemId, 'quizzes'],
    queryFn: () => getQuizzes(lostItemId),
    retry: defaultQueryRetry,
  });

export const useDetailQuery = (lostItemId: number) =>
  useQuery<DetailResponse, ApiError>({
    queryKey: ['lost-items', lostItemId, 'detail'],
    queryFn: () => getDetail(lostItemId),
    retry: defaultQueryRetry,
  });

export const useDepositAreaQuery = (lostItemId: number) =>
  useQuery<DepositAreaResponse, ApiError>({
    queryKey: ['lost-items', lostItemId, 'deposit-area'],
    queryFn: () => getDepositArea(lostItemId),
    retry: defaultQueryRetry,
  });

export const useSubmitQuizzesMutation = (lostItemId: number) =>
  useMutation<void, ApiError, QuizSubmitBody>({
    mutationFn: (body) => submitQuizzes(lostItemId, body),
    onSuccess: () => {
      toast.success('퀴즈 인증에 성공했습니다.');
    },
    onError: showApiErrorToast,
  });

export const usePledgeMutation = (lostItemId: number) =>
  useMutation<PledgeResponse, ApiError, void>({
    mutationFn: () => postPledge(lostItemId),
    onSuccess: () => {
      toast.success('서약이 완료되었습니다.');
    },
    onError: showApiErrorToast,
  });
