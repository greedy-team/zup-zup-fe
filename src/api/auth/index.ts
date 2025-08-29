import { apiFetch } from '../common/apiClient';

export type LoginRequest = {
  portalId: string;
  portalPassword: string;
};

const LOGIN_URL = '/auth/login/portal';
const LOGOUT_URL = '/auth/logout';

export function loginPortal(payload: LoginRequest) {
  return apiFetch<void>(LOGIN_URL, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function logout() {
  return apiFetch<void>(LOGOUT_URL, { method: 'POST' });
}
