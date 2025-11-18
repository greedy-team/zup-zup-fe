import { describe, it, beforeEach, expect, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { server } from '../setup';
import { renderFind } from '../utils/renderFind';
import { PLEDGE_TEXT } from '../../constants/find';

const mockRedirectToLoginKeepPath = vi.fn();

vi.mock('../../utils/auth/loginRedirect', () => ({
  useRedirectToLoginKeepPath: () => mockRedirectToLoginKeepPath,
}));

vi.mock('../../api/common/apiErrorToast', () => ({
  showApiErrorToast: vi.fn(),
}));

import { showApiErrorToast } from '../../api/common/apiErrorToast';

describe('FindPledge', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockRedirectToLoginKeepPath.mockClear();
  });

  it('FindPledge > 문구 불일치 시 진행 막음 (페이지 그대로)', async () => {
    renderFind('/find/10/pledge');

    await screen.findByRole('heading', { name: /약관 동의|서약 동의/ });

    const input = await screen.findByPlaceholderText('상단 문구를 똑같이 입력해주세요.');
    await userEvent.type(input, '틀린 문구');
    await userEvent.click(screen.getByRole('button', { name: '서약 제출' }));

    expect(screen.getByRole('heading', { name: /약관 동의|서약 동의/ })).toBeInTheDocument();
  });

  it('FindPledge > 문구 일치 시 deposit으로 이동', async () => {
    renderFind('/find/10/pledge');

    await screen.findByRole('heading', { name: /약관 동의|서약 동의/ });

    const input = await screen.findByPlaceholderText('상단 문구를 똑같이 입력해주세요.');
    await userEvent.type(input, PLEDGE_TEXT);
    await userEvent.click(screen.getByRole('button', { name: '서약 제출' }));

    expect(await screen.findByRole('heading', { name: '보관 장소' })).toBeInTheDocument();
  });

  it('FindPledge > POST /pledge 400 → toast + 홈 이동', async () => {
    server.use(http.post('*/lost-items/:id/pledge', () => new HttpResponse(null, { status: 400 })));

    renderFind('/find/10/pledge');
    await screen.findByRole('heading', { name: /약관 동의|서약 동의/ });

    const input = await screen.findByPlaceholderText('상단 문구를 똑같이 입력해주세요.');
    await userEvent.type(input, PLEDGE_TEXT);
    await userEvent.click(screen.getByRole('button', { name: '서약 제출' }));

    await waitFor(() => {
      expect(showApiErrorToast).toHaveBeenCalled();
    });

    expect(await screen.findByText('Home')).toBeInTheDocument();
  });

  it('FindPledge > POST /pledge 401 → toast + 홈 이동 (로그인 리다이렉트 호출 안 함)', async () => {
    server.use(http.post('*/lost-items/:id/pledge', () => new HttpResponse(null, { status: 401 })));

    renderFind('/find/10/pledge');
    await screen.findByRole('heading', { name: /약관 동의|서약 동의/ });

    const input = await screen.findByPlaceholderText('상단 문구를 똑같이 입력해주세요.');
    await userEvent.type(input, PLEDGE_TEXT);
    await userEvent.click(screen.getByRole('button', { name: '서약 제출' }));

    await waitFor(() => {
      expect(showApiErrorToast).toHaveBeenCalled();
    });

    expect(await screen.findByText('Home')).toBeInTheDocument();
    expect(mockRedirectToLoginKeepPath).not.toHaveBeenCalled();
  });

  it('FindPledge > POST /pledge 404 → toast + 홈 이동', async () => {
    server.use(http.post('*/lost-items/:id/pledge', () => new HttpResponse(null, { status: 404 })));

    renderFind('/find/404/pledge');
    await screen.findByRole('heading', { name: /약관 동의|서약 동의/ });

    const input = await screen.findByPlaceholderText('상단 문구를 똑같이 입력해주세요.');
    await userEvent.type(input, PLEDGE_TEXT);
    await userEvent.click(screen.getByRole('button', { name: '서약 제출' }));

    await waitFor(() => {
      expect(showApiErrorToast).toHaveBeenCalled();
    });

    expect(await screen.findByText('Home')).toBeInTheDocument();
  });

  it('FindPledge > POST /pledge 409 → toast + 홈 이동', async () => {
    server.use(http.post('*/lost-items/:id/pledge', () => new HttpResponse(null, { status: 409 })));

    renderFind('/find/10/pledge');
    await screen.findByRole('heading', { name: /약관 동의|서약 동의/ });

    const input = await screen.findByPlaceholderText('상단 문구를 똑같이 입력해주세요.');
    await userEvent.type(input, PLEDGE_TEXT);
    await userEvent.click(screen.getByRole('button', { name: '서약 제출' }));

    await waitFor(() => {
      expect(showApiErrorToast).toHaveBeenCalled();
    });

    expect(await screen.findByText('Home')).toBeInTheDocument();
  });

  it('FindPledge > POST /pledge 기타 에러 → toast + 홈 이동', async () => {
    server.use(http.post('*/lost-items/:id/pledge', () => new HttpResponse(null, { status: 500 })));

    renderFind('/find/10/pledge');
    await screen.findByRole('heading', { name: /약관 동의|서약 동의/ });

    const input = await screen.findByPlaceholderText('상단 문구를 똑같이 입력해주세요.');
    await userEvent.type(input, PLEDGE_TEXT);
    await userEvent.click(screen.getByRole('button', { name: '서약 제출' }));

    await waitFor(() => {
      expect(showApiErrorToast).toHaveBeenCalled();
    });

    expect(await screen.findByText('Home')).toBeInTheDocument();
  });
});
