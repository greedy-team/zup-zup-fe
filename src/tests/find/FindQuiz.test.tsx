import { describe, it, beforeEach, expect, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { server } from '../setup';
import { renderFind } from '../utils/renderFind';

const mockRedirectToLoginKeepPath = vi.fn();

vi.mock('../../utils/auth/loginRedirect', () => ({
  useRedirectToLoginKeepPath: () => mockRedirectToLoginKeepPath,
}));

vi.mock('../../api/common/apiErrorToast', () => ({
  showApiErrorToast: vi.fn(),
}));

import { showApiErrorToast } from '../../api/common/apiErrorToast';

describe('FindQuiz', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockRedirectToLoginKeepPath.mockClear();
  });

  it('FindQuiz > 선택 없이 제출 시 진행 안 되고, 선택 후 제출 시 detail 이동', async () => {
    renderFind('/find/10/quiz');

    const submitButton = await screen.findByRole('button', { name: '퀴즈 제출' });

    await userEvent.click(submitButton);

    const [option] = await screen.findAllByRole('radio');
    await userEvent.click(option);
    await userEvent.click(submitButton);

    expect(await screen.findByRole('heading', { name: '상세 정보' })).toBeInTheDocument();
  });

  it('FindQuiz > GET /quizzes 401(미로그인) 발생 시 로딩 영역 노출', async () => {
    server.use(http.get('*/lost-items/:id/quizzes', () => new HttpResponse(null, { status: 401 })));

    renderFind('/find/10/quiz');

    expect(await screen.findByText('퀴즈 불러오는 중…')).toBeInTheDocument();
  });

  it('FindQuiz > 퀴즈 없음일시 빈 상태', async () => {
    server.use(
      http.get('*/lost-items/:id/quizzes', () =>
        HttpResponse.json({ quizzes: [] }, { status: 200 }),
      ),
    );

    renderFind('/find/10/quiz');

    expect(await screen.findByText('퀴즈가 없습니다.')).toBeInTheDocument();
  });

  it('FindQuiz > POST /quizzes 401(미로그인) 발생 시 toast 호출 + 홈 이동 없음', async () => {
    server.use(
      http.post('*/lost-items/:id/quizzes', () => new HttpResponse(null, { status: 401 })),
    );

    renderFind('/find/10/quiz');

    const [option] = await screen.findAllByRole('radio');
    await userEvent.click(option);
    await userEvent.click(screen.getByRole('button', { name: '퀴즈 제출' }));

    await waitFor(() => {
      expect(showApiErrorToast).toHaveBeenCalled();
    });

    expect(screen.getByRole('heading', { name: '인증 퀴즈' })).toBeInTheDocument();
  });

  it('FindQuiz > POST /quizzes 403 발생 시 toast + 홈 이동', async () => {
    server.use(
      http.post('*/lost-items/:id/quizzes', () => new HttpResponse(null, { status: 403 })),
    );

    renderFind('/find/10/quiz');

    const [option] = await screen.findAllByRole('radio');
    await userEvent.click(option);
    await userEvent.click(screen.getByRole('button', { name: '퀴즈 제출' }));

    await waitFor(() => {
      expect(showApiErrorToast).toHaveBeenCalled();
    });

    expect(await screen.findByText('Home')).toBeInTheDocument();
  });

  it('FindQuiz > POST /quizzes 404 발생 시 toast + 홈 이동', async () => {
    server.use(
      http.post('*/lost-items/:id/quizzes', () => new HttpResponse(null, { status: 404 })),
    );

    renderFind('/find/404/quiz');

    const [option] = await screen.findAllByRole('radio');
    await userEvent.click(option);
    await userEvent.click(screen.getByRole('button', { name: '퀴즈 제출' }));

    await waitFor(() => {
      expect(showApiErrorToast).toHaveBeenCalled();
    });

    expect(await screen.findByText('Home')).toBeInTheDocument();
  });

  it('FindQuiz > POST /quizzes 409 발생 시 toast + 홈 이동', async () => {
    server.use(
      http.post('*/lost-items/:id/quizzes', () => new HttpResponse(null, { status: 409 })),
    );

    renderFind('/find/10/quiz');

    const [option] = await screen.findAllByRole('radio');
    await userEvent.click(option);
    await userEvent.click(screen.getByRole('button', { name: '퀴즈 제출' }));

    await waitFor(() => {
      expect(showApiErrorToast).toHaveBeenCalled();
    });

    expect(await screen.findByText('Home')).toBeInTheDocument();
  });

  it('FindQuiz > POST /quizzes 기타 에러 발생 시 toast + 홈 이동', async () => {
    server.use(
      http.post('*/lost-items/:id/quizzes', () => new HttpResponse(null, { status: 500 })),
    );

    renderFind('/find/10/quiz');

    const [option] = await screen.findAllByRole('radio');
    await userEvent.click(option);
    await userEvent.click(screen.getByRole('button', { name: '퀴즈 제출' }));

    await waitFor(() => {
      expect(showApiErrorToast).toHaveBeenCalled();
    });

    expect(await screen.findByText('Home')).toBeInTheDocument();
  });
});
