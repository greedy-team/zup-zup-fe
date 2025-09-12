import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderFind } from '../utils/renderFind';
import { server } from '../setup';
import { http, HttpResponse } from 'msw';

vi.mock('../../utils/auth/loginRedirect', () => ({
  redirectToLoginKeepPath: vi.fn(),
}));
import { redirectToLoginKeepPath } from '../../utils/auth/loginRedirect';

describe('FindDetail', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('이미지/설명 렌더링 및 썸네일 전환', async () => {
    const user = userEvent.setup();
    renderFind('/find/10/detail');

    const main = (await screen.findByAltText('분실물 사진')) as HTMLImageElement;
    expect(main.src).toContain('a.png');

    const thumb1 = screen.getByLabelText('분실물 썸네일-1');
    await user.click(thumb1);

    const updated = (await screen.findByAltText('분실물 사진')) as HTMLImageElement;
    expect(updated.src).toContain('b.png');
  });

  it.each([403, 404])('HTTP %s 발생시 alert + 홈 이동', async (status) => {
    server.use(http.get('*/lost-items/:id/image', () => new HttpResponse(null, { status })));

    const path = status === 404 ? '/find/404/detail' : '/find/10/detail';
    renderFind(path);

    await waitFor(() => expect(window.alert).toHaveBeenCalled());
    expect(await screen.findByText('Home')).toBeInTheDocument();
  });

  it('401 발생시 alert + 로그인 리다이렉트 호출', async () => {
    server.use(http.get('*/lost-items/:id/image', () => new HttpResponse(null, { status: 401 })));

    renderFind('/find/10/detail');

    await waitFor(() => expect(window.alert).toHaveBeenCalled());
    await waitFor(() => expect(redirectToLoginKeepPath).toHaveBeenCalled());
  });
});
