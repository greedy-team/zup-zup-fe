import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { renderFind } from '../utils/renderFind';
import { server } from '../setup';
import { http, HttpResponse } from 'msw';

vi.mock('../../utils/auth/loginRedirect', () => ({
  redirectToLoginKeepPath: vi.fn(),
}));
import { redirectToLoginKeepPath } from '../../utils/auth/loginRedirect';

describe('FindDeposit', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('보관 장소 표시', async () => {
    renderFind('/find/10/deposit');

    await screen.findByRole('heading', { name: '보관 장소' });

    expect(await screen.findByText(/보관 중/)).toBeInTheDocument();
    expect(screen.getByText('학생회관 1층 분실물 센터')).toBeInTheDocument();
  });

  it('401 발생시 alert + 로그인 리다이렉트 호출', async () => {
    server.use(
      http.get('*/lost-items/:id/deposit-area', () => new HttpResponse(null, { status: 401 })),
    );

    renderFind('/find/10/deposit');

    await waitFor(() => expect(window.alert).toHaveBeenCalled());
    await waitFor(() => expect(redirectToLoginKeepPath).toHaveBeenCalled());
  });

  it.each([403, 404])('%s 발생시 alert + 홈 이동', async (code) => {
    server.use(
      http.get('*/lost-items/:id/deposit-area', () => new HttpResponse(null, { status: code })),
    );

    renderFind('/find/10/deposit');

    await waitFor(() => expect(window.alert).toHaveBeenCalled());
    expect(await screen.findByText('Home')).toBeInTheDocument();
  });
});
