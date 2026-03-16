import type {
  PledgedLostItemsResponse,
  CancelPledgeResponse,
  FoundCompleteResponse,
  EmailAlertResponse,
  EmailAlertRequest,
  SubscriptionsResponse,
  SubscriptionsRequest,
} from '../../types/mypage';
import type { ApiError } from '../../types/common';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const PLEDGED_LOST_ITEMS_LIMIT = 5;

export async function getPledgedLostItems(page: number): Promise<PledgedLostItemsResponse> {
  const queryParams = new URLSearchParams({
    page: String(page),
    limit: String(PLEDGED_LOST_ITEMS_LIMIT),
  });

  const res = await fetch(`${BASE_URL}/lost-items/pledged?${queryParams}`, {
    method: 'GET',
    credentials: 'include',
  });

  const data = await res.json();

  if (!res.ok) {
    const error: ApiError = {
      status: res.status,
      title: data?.title ?? '서약 분실물 조회 오류',
      detail: data?.detail ?? '내가 서약한 분실물을 조회하는 중 오류가 발생했습니다.',
      instance: data?.instance ?? '/api/lost-items/pledged',
    };
    throw error;
  }

  return data as PledgedLostItemsResponse;
}

export async function completeFoundItem(lostItemId: number): Promise<FoundCompleteResponse> {
  const res = await fetch(`${BASE_URL}/lost-items/${lostItemId}/found`, {
    method: 'POST',
    credentials: 'include',
  });

  const data = await res.json();

  if (!res.ok) {
    const error: ApiError = {
      status: res.status,
      title: data?.title ?? '찾음 완료 오류',
      detail: data?.detail ?? '찾음 완료 처리 중 오류가 발생했습니다.',
      instance: data?.instance ?? `/api/lost-items/${lostItemId}/found`,
    };
    throw error;
  }

  return data as FoundCompleteResponse;
}

export async function cancelPledge(lostItemId: number): Promise<CancelPledgeResponse> {
  const res = await fetch(`${BASE_URL}/lost-items/${lostItemId}/pledge/cancel`, {
    method: 'POST',
    credentials: 'include',
  });

  const data = await res.json();

  if (!res.ok) {
    const error: ApiError = {
      status: res.status,
      title: data?.title ?? '서약 취소 오류',
      detail: data?.detail ?? '서약 취소 중 오류가 발생했습니다.',
      instance: data?.instance ?? `/api/lost-items/${lostItemId}/pledge/cancel`,
    };
    throw error;
  }

  return data as CancelPledgeResponse;
}

export async function getEmailAlert(): Promise<EmailAlertResponse> {
  const res = await fetch(`${BASE_URL}/members/me/email`, {
    method: 'GET',
    credentials: 'include',
  });

  const data = await res.json();

  if (!res.ok) {
    const error: ApiError = {
      status: res.status,
      title: data?.title ?? '이메일 설정 조회 오류',
      detail: data?.detail ?? '이메일 알림 설정을 조회하는 중 오류가 발생했습니다.',
      instance: data?.instance ?? '/api/members/me/email',
    };
    throw error;
  }

  return data as EmailAlertResponse;
}

export async function getSubscriptions(): Promise<SubscriptionsResponse> {
  const res = await fetch(`${BASE_URL}/alerts/subscriptions`, {
    method: 'GET',
    credentials: 'include',
  });

  const data = await res.json();

  if (!res.ok) {
    const error: ApiError = {
      status: res.status,
      title: data?.title ?? '구독 조회 오류',
      detail: data?.detail ?? '구독 카테고리를 조회하는 중 오류가 발생했습니다.',
      instance: data?.instance ?? '/api/alerts/subscriptions',
    };
    throw error;
  }

  return data as SubscriptionsResponse;
}

export async function updateSubscriptions(payload: SubscriptionsRequest): Promise<void> {
  const res = await fetch(`${BASE_URL}/alerts/subscriptions`, {
    method: 'PUT',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const data = await res.json();
    const error: ApiError = {
      status: res.status,
      title: data?.title ?? '구독 수정 오류',
      detail: data?.detail ?? '구독 카테고리를 수정하는 중 오류가 발생했습니다.',
      instance: data?.instance ?? '/api/alerts/subscriptions',
    };
    throw error;
  }
}

export async function updateEmailAlert(payload: EmailAlertRequest): Promise<void> {
  const res = await fetch(`${BASE_URL}/members/me/email`, {
    method: 'PUT',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const data = await res.json();
    const error: ApiError = {
      status: res.status,
      title: data?.title ?? '이메일 설정 오류',
      detail: data?.detail ?? '이메일 알림 설정을 수정하는 중 오류가 발생했습니다.',
      instance: data?.instance ?? '/api/members/me/email',
    };
    throw error;
  }
}
