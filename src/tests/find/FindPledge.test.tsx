import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderFind } from '../utils/renderFind';
import { server } from '../setup';
import { http, HttpResponse } from 'msw';
import { PLEDGE_TEXT } from '../../constants/find';

vi.mock('../../utils/auth/loginRedirect', () => ({
  redirectToLoginKeepPath: vi.fn(),
}));
import { redirectToLoginKeepPath } from '../../utils/auth/loginRedirect';

const AUTH_FLAG_CONTEXT_PATH = '../../src/contexts/AuthFlag';

describe('FindPledge', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('문구 불일치 시 alert 후 진행 막음', async () => {
    renderFind('/find/10/pledge');

    await screen.findByRole('heading', { name: '약관 동의' });

    const input = await screen.findByPlaceholderText('상단 문구를 똑같이 입력해주세요.');
    const nextBtn = screen.getByRole('button', { name: '서약 제출' });

    await userEvent.type(input, '틀린 문구');
    await userEvent.click(nextBtn);

    await waitFor(() =>
      expect(window.alert).toHaveBeenCalledWith('서약 문구를 정확히 입력해주세요.'),
    );
    expect(screen.getByRole('heading', { name: '약관 동의' })).toBeInTheDocument();
  });

  it('문구 일치 시 deposit으로 이동', async () => {
    renderFind('/find/10/pledge');

    await screen.findByRole('heading', { name: '약관 동의' });

    const input = await screen.findByPlaceholderText('상단 문구를 똑같이 입력해주세요.');
    const nextBtn = screen.getByRole('button', { name: '서약 제출' });

    await userEvent.type(input, PLEDGE_TEXT);
    await userEvent.click(nextBtn);

    await screen.findByRole('heading', { name: '보관 장소' });
  });

  it('POST /pledge 400 → alert + 홈 이동', async () => {
    server.use(http.post('*/lost-items/:id/pledge', () => new HttpResponse(null, { status: 400 })));

    renderFind('/find/10/pledge');
    await screen.findByRole('heading', { name: '약관 동의' });

    await userEvent.type(
      await screen.findByPlaceholderText('상단 문구를 똑같이 입력해주세요.'),
      PLEDGE_TEXT,
    );
    await userEvent.click(screen.getByRole('button', { name: '서약 제출' }));

    await waitFor(() => expect(window.alert).toHaveBeenCalled());
    expect(await screen.findByText('Home')).toBeInTheDocument();
  });

  it('POST /pledge 401(만료, isAuthenticated=true) → alert + 로그인 리다이렉트', async () => {
    vi.resetModules();
    vi.doMock(AUTH_FLAG_CONTEXT_PATH, () => ({
      useAuthFlag: () => ({
        isAuthenticated: true,
        setAuthenticated: vi.fn(),
        setUnauthenticated: vi.fn(),
      }),
      AuthFlagProvider: ({ children }: any) => children,
    }));
    const { renderFind: renderFindFresh } = await import('../utils/renderFind');

    server.use(http.post('*/lost-items/:id/pledge', () => new HttpResponse(null, { status: 401 })));

    renderFindFresh('/find/10/pledge');
    await screen.findByRole('heading', { name: '약관 동의' });

    await userEvent.type(
      await screen.findByPlaceholderText('상단 문구를 똑같이 입력해주세요.'),
      PLEDGE_TEXT,
    );
    await userEvent.click(screen.getByRole('button', { name: '서약 제출' }));

    await waitFor(() => expect(window.alert).toHaveBeenCalled());
    await waitFor(() => expect(redirectToLoginKeepPath).toHaveBeenCalled());
  });

  it('POST /pledge 401(미로그인) → alert + 로그인 리다이렉트', async () => {
    vi.resetModules();
    vi.doMock(AUTH_FLAG_CONTEXT_PATH, () => ({
      useAuthFlag: () => ({
        isAuthenticated: false,
        setAuthenticated: vi.fn(),
        setUnauthenticated: vi.fn(),
      }),
      AuthFlagProvider: ({ children }: any) => children,
    }));
    const { renderFind: renderFindFresh } = await import('../utils/renderFind');

    server.use(http.post('*/lost-items/:id/pledge', () => new HttpResponse(null, { status: 401 })));

    renderFindFresh('/find/10/pledge');
    await screen.findByRole('heading', { name: '약관 동의' });

    await userEvent.type(
      await screen.findByPlaceholderText('상단 문구를 똑같이 입력해주세요.'),
      PLEDGE_TEXT,
    );
    await userEvent.click(screen.getByRole('button', { name: '서약 제출' }));

    await waitFor(() => expect(window.alert).toHaveBeenCalled());
    await waitFor(() => expect(redirectToLoginKeepPath).toHaveBeenCalled());
  });

  it.each([404, 409])('POST /pledge %s → alert + 홈 이동', async (code) => {
    server.use(
      http.post('*/lost-items/:id/pledge', () => new HttpResponse(null, { status: code })),
    );

    renderFind('/find/10/pledge');
    await screen.findByRole('heading', { name: '약관 동의' });

    await userEvent.type(
      await screen.findByPlaceholderText('상단 문구를 똑같이 입력해주세요.'),
      PLEDGE_TEXT,
    );
    await userEvent.click(screen.getByRole('button', { name: '서약 제출' }));

    await waitFor(() => expect(window.alert).toHaveBeenCalled());
    expect(await screen.findByText('Home')).toBeInTheDocument();
  });

  it('POST /pledge 기타 에러 → alert + 홈 이동', async () => {
    server.use(http.post('*/lost-items/:id/pledge', () => new HttpResponse(null, { status: 500 })));

    renderFind('/find/10/pledge');
    await screen.findByRole('heading', { name: '약관 동의' });

    await userEvent.type(
      await screen.findByPlaceholderText('상단 문구를 똑같이 입력해주세요.'),
      PLEDGE_TEXT,
    );
    await userEvent.click(screen.getByRole('button', { name: '서약 제출' }));

    await waitFor(() => expect(window.alert).toHaveBeenCalled());
    expect(await screen.findByText('Home')).toBeInTheDocument();
  });
});
