import type { PledgedLostItemsResponse } from '../../types/mypage';
import type { ApiError } from '../../types/common';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function getPledgedLostItems(): Promise<PledgedLostItemsResponse> {
  const res = await fetch(`${BASE_URL}/lost-items/pledged`, {
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
