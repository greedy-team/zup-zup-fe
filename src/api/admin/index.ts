import type { PendingLostItemsResponse, AdminLostItemActionResponse } from '../../types/admin';
import type { ApiError } from '../../types/common';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const PENDING_LOST_ITEMS_LIMIT = 20;

export async function fetchPendingLostItems(params: {
  page?: number;
}): Promise<PendingLostItemsResponse> {
  const page = params.page ?? 1;

  const queryParams = new URLSearchParams();
  queryParams.set('page', String(page));
  queryParams.set('limit', String(PENDING_LOST_ITEMS_LIMIT));

  const res = await fetch(`${BASE_URL}/admin/lost-items/pending?${queryParams}`, {
    method: 'GET',
    credentials: 'include',
  });

  const data = await res.json();

  if (!res.ok) {
    const error: ApiError = {
      status: res.status,
      title: data?.title ?? '서버 오류',
      detail: data?.detail ?? '보류중인 분실물 목록 조회 중 오류가 발생했습니다.',
      instance: data?.instance ?? '/api/admin/lost-items/pending',
    };
    throw error;
  }

  return data as PendingLostItemsResponse;
}

export async function approveLostItems(
  pendingLostItemIds: number[],
): Promise<AdminLostItemActionResponse> {
  const res = await fetch(`${BASE_URL}/admin/lost-items/approve`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ lostItemIds: pendingLostItemIds }),
  });

  const data = await res.json();

  if (!res.ok) {
    const error: ApiError = {
      status: res.status,
      title: data?.title ?? '서버 오류',
      detail: data?.detail ?? '분실물 승인 처리 과정 중 오류가 발생했습니다.',
      instance: data?.instance ?? '/api/admin/lost-items/approve',
    };
    throw error;
  }

  return data as AdminLostItemActionResponse;
}

export async function rejectLostItems(
  pendingLostItemIds: number[],
): Promise<AdminLostItemActionResponse> {
  const res = await fetch(`${BASE_URL}/admin/lost-items/reject`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ lostItemIds: pendingLostItemIds }),
  });

  const data = await res.json();

  if (!res.ok) {
    const error: ApiError = {
      status: res.status,
      title: data?.title ?? '서버 오류',
      detail: data?.detail ?? '분실물 삭제 처리 중 오류가 발생했습니다.',
      instance: data?.instance ?? '/api/admin/lost-items/reject',
    };
    throw error;
  }

  return data as AdminLostItemActionResponse;
}
