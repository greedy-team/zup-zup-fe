import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderFind } from '../utils/renderFind';
import { server } from '../setup';
import { http, HttpResponse } from 'msw';

vi.mock('../../utils/auth/loginRedirect', () => ({
  redirectToLoginKeepPath: vi.fn(),
}));
import { redirectToLoginKeepPath } from '../../utils/auth/loginRedirect';

describe('FindQuiz', () => {
  it('선택 없이 제출 시 alert, 선택 후 제출 시 detail 이동', async () => {
    renderFind('/find/10/quiz');

    await screen.findByText('색상은?');
    const submitBtn = screen.getByRole('button', { name: '퀴즈 제출' });

    await userEvent.click(submitBtn);
    expect(window.alert).toHaveBeenCalledWith('모든 문항을 선택해주세요.');

    const red = await screen.findByRole('radio', { name: '빨강' });
    await userEvent.click(red);
    await userEvent.click(submitBtn);

    expect(await screen.findByRole('heading', { name: '상세 정보' })).toBeInTheDocument();
  });

  it('GET /quizzes 401(미로그인) 발생 시 alert + 로그인 리다이렉트 호출', async () => {
    server.use(http.get('*/lost-items/:id/quizzes', () => new HttpResponse(null, { status: 401 })));

    renderFind('/find/10/quiz');

    await screen.findByRole('button', { name: '퀴즈 제출' });
    expect(window.alert).toHaveBeenCalled();
    expect(redirectToLoginKeepPath).toHaveBeenCalled();
  });

  it('퀴즈 없음일시 빈 상태', async () => {
    server.use(http.get('*/lost-items/:id/quizzes', () => HttpResponse.json({ quizzes: [] })));
    renderFind('/find/10/quiz');

    expect(await screen.findByText('퀴즈가 없습니다.')).toBeInTheDocument();
  });

  it('POST /quizzes 401(미로그인) 발생 시 alert + 로그인 리다이렉트 호출, 이동 안 함', async () => {
    server.use(
      http.get('*/lost-items/:id/quizzes', () =>
        HttpResponse.json({
          quizzes: [{ featureId: 1, question: '색상은?', options: [{ id: 10, text: '빨강' }] }],
        }),
      ),
    );
    server.use(
      http.post('*/lost-items/:id/quizzes', () => new HttpResponse(null, { status: 401 })),
    );

    renderFind('/find/10/quiz');

    await screen.findByText('색상은?');

    const red = await screen.findByRole('radio', { name: '빨강' });
    await userEvent.click(red);
    await userEvent.click(screen.getByRole('button', { name: '퀴즈 제출' }));

    expect(window.alert).toHaveBeenCalled();
    expect(redirectToLoginKeepPath).toHaveBeenCalled();

    expect(screen.queryByRole('heading', { name: '상세 정보' })).not.toBeInTheDocument();
  });

  it.each([403, 404, 409])('POST /quizzes %s 발생 시 alert + 홈 이동', async (code) => {
    server.use(
      http.get('*/lost-items/:id/quizzes', () =>
        HttpResponse.json({
          quizzes: [{ featureId: 1, question: '색상은?', options: [{ id: 10, text: '빨강' }] }],
        }),
      ),
    );
    server.use(
      http.post('*/lost-items/:id/quizzes', () => new HttpResponse(null, { status: code })),
    );

    renderFind('/find/10/quiz');

    await screen.findByText('색상은?');

    const red = await screen.findByRole('radio', { name: '빨강' });
    await userEvent.click(red);
    await userEvent.click(screen.getByRole('button', { name: '퀴즈 제출' }));

    expect(window.alert).toHaveBeenCalled();
    expect(await screen.findByText('Home')).toBeInTheDocument();
  });

  it('POST /quizzes 기타 에러 발생 시 alert + 홈 이동', async () => {
    server.use(
      http.get('*/lost-items/:id/quizzes', () =>
        HttpResponse.json({
          quizzes: [{ featureId: 1, question: '색상은?', options: [{ id: 10, text: '빨강' }] }],
        }),
      ),
    );
    server.use(
      http.post('*/lost-items/:id/quizzes', () => new HttpResponse(null, { status: 500 })),
    );

    renderFind('/find/10/quiz');

    await screen.findByText('색상은?');

    const red = await screen.findByRole('radio', { name: '빨강' });
    await userEvent.click(red);
    await userEvent.click(screen.getByRole('button', { name: '퀴즈 제출' }));

    expect(window.alert).toHaveBeenCalled();
    expect(await screen.findByText('Home')).toBeInTheDocument();
  });
});
