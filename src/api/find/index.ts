import type {
  LostItemBrief,
  GetQuizzesResponse,
  QuizSubmitBody,
  DetailResponse,
  PledgeResponse,
  DepositAreaResponse,
} from '../../types/find';
import type { ApiError } from '../../types/common';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function getLostItemBrief(lostItemId: number): Promise<LostItemBrief> {
  const res = await fetch(`${BASE_URL}/lost-items/${lostItemId}`, {
    method: 'GET',
  });

  const data = await res.json();

  if (!res.ok) {
    const error: ApiError = {
      status: res.status,
      title: data?.title ?? '분실물 단건 조회 오류',
      detail: data?.detail ?? '분실물 정보를 조회하는 중 오류가 발생했습니다.',
      instance: data?.instance ?? `/api/lost-items/${lostItemId}`,
    };
    throw error;
  }

  return data as LostItemBrief;
}

export async function getQuizzes(lostItemId: number): Promise<GetQuizzesResponse> {
  const res = await fetch(`${BASE_URL}/lost-items/${lostItemId}/quizzes`, {
    method: 'GET',
    credentials: 'include',
  });

  const data = await res.json();

  if (!res.ok) {
    const error: ApiError = {
      status: res.status,
      title: data?.title ?? '퀴즈 조회 오류',
      detail: data?.detail ?? '분실물 인증 퀴즈를 조회하는 중 오류가 발생했습니다.',
      instance: data?.instance ?? `/api/lost-items/${lostItemId}/quizzes`,
    };
    throw error;
  }

  return data as GetQuizzesResponse;
}

export async function submitQuizzes(lostItemId: number, body: QuizSubmitBody): Promise<void> {
  const res = await fetch(`${BASE_URL}/lost-items/${lostItemId}/quizzes`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => undefined);

  if (!res.ok) {
    const error: ApiError = {
      status: res.status,
      title: data?.title ?? '퀴즈 제출 오류',
      detail: data?.detail ?? '분실물 인증 퀴즈를 제출하는 중 오류가 발생했습니다.',
      instance: data?.instance ?? `/api/lost-items/${lostItemId}/quizzes`,
    };
    throw error;
  }
}

export async function getDetail(lostItemId: number): Promise<DetailResponse> {
  const res = await fetch(`${BASE_URL}/lost-items/${lostItemId}/image`, {
    method: 'GET',
    credentials: 'include',
  });

  const data = await res.json();

  if (!res.ok) {
    const error: ApiError = {
      status: res.status,
      title: data?.title ?? '상세 정보 조회 오류',
      detail: data?.detail ?? '분실물 상세 정보를 조회하는 중 오류가 발생했습니다.',
      instance: data?.instance ?? `/api/lost-items/${lostItemId}/image`,
    };
    throw error;
  }

  return data as DetailResponse;
}

export async function postPledge(lostItemId: number): Promise<PledgeResponse> {
  const res = await fetch(`${BASE_URL}/lost-items/${lostItemId}/pledge`, {
    method: 'POST',
    credentials: 'include',
  });

  const data = await res.json();

  if (!res.ok) {
    const error: ApiError = {
      status: res.status,
      title: data?.title ?? '서약 처리 오류',
      detail: data?.detail ?? '분실물 서약 처리 중 오류가 발생했습니다.',
      instance: data?.instance ?? `/api/lost-items/${lostItemId}/pledge`,
    };
    throw error;
  }

  return data as PledgeResponse;
}

export async function getDepositArea(lostItemId: number): Promise<DepositAreaResponse> {
  const res = await fetch(`${BASE_URL}/lost-items/${lostItemId}/deposit-area`, {
    method: 'GET',
    credentials: 'include',
  });

  const data = await res.json();

  if (!res.ok) {
    const error: ApiError = {
      status: res.status,
      title: data?.title ?? '보관 장소 조회 오류',
      detail: data?.detail ?? '분실물 보관 장소를 조회하는 중 오류가 발생했습니다.',
      instance: data?.instance ?? `/api/lost-items/${lostItemId}/deposit-area`,
    };
    throw error;
  }

  return data as DepositAreaResponse;
}
