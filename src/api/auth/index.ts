import type { LoginFormValues, LoginResponse } from '../../types/auth';
import type { ApiError } from '../../types/common';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function loginPortal(payload: LoginFormValues): Promise<LoginResponse> {
  const res = await fetch(`${BASE_URL}/auth/login/portal`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    const error: ApiError = {
      status: res.status,
      title: data?.title ?? '포털 로그인 오류',
      detail: data?.detail ?? '포털 로그인 중 오류가 발생했습니다.',
      instance: data?.instance ?? '/api/auth/login/portal',
    };
    throw error;
  }

  return data as LoginResponse;
}

export async function logout(): Promise<void> {
  const res = await fetch(`${BASE_URL}/auth/logout`, {
    method: 'POST',
    credentials: 'include',
  });

  const data = await res.json().catch(() => undefined);

  if (!res.ok) {
    const error: ApiError = {
      status: res.status,
      title: data?.title ?? '로그아웃 오류',
      detail: data?.detail ?? '로그아웃 중 오류가 발생했습니다.',
      instance: data?.instance ?? '/api/auth/logout',
    };
    throw error;
  }

  return;
}
