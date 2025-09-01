import { apiFetch } from '../common/apiClient';
import type {
  LostItemBrief,
  GetQuizzesResponse,
  QuizSubmitBody,
  DetailResponse,
  DepositAreaResponse,
} from '../../types/find/index';

const BASE = '/lost-items';

export function getLostItemBrief(lostItemId: number) {
  return apiFetch<LostItemBrief>(`${BASE}/${lostItemId}`);
}

export function getQuizzes(lostItemId: number) {
  return apiFetch<GetQuizzesResponse>(`${BASE}/${lostItemId}/quizzes`);
}

export function submitQuizzes(lostItemId: number, body: QuizSubmitBody) {
  return apiFetch<void>(`${BASE}/${lostItemId}/quizzes`, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export function getDetail(lostItemId: number) {
  return apiFetch<DetailResponse>(`${BASE}/${lostItemId}/image`);
}

export function postPledge(lostItemId: number) {
  return apiFetch<void>(`${BASE}/${lostItemId}/pledge`, { method: 'POST' });
}

export function getDepositArea(lostItemId: number) {
  return apiFetch<DepositAreaResponse>(`${BASE}/${lostItemId}/deposit-area`);
}
