import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { renderFind } from '../utils/renderFind';
import { server } from '../setup';
import { http, HttpResponse } from 'msw';
import { ETC_CATEGORY_ID } from '../../constants/find';

describe('FindLayout: 스텝/버튼/이동', () => {
  it('귀중품 플로우(info → quiz)', async () => {
    renderFind('/find/10/info');

    expect(await screen.findByRole('heading', { name: '물건 정보' })).toBeInTheDocument();

    const nextBtn = screen.getByRole('button', { name: '다음' });
    await nextBtn.click();

    expect(await screen.findByRole('heading', { name: '인증 퀴즈' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '퀴즈 제출' })).toBeInTheDocument();
  });

  it('비귀중품 플로우(info → detail)', async () => {
    server.use(
      http.get('*/lost-items/:id', ({ params }) => {
        const { id } = params as any;
        return HttpResponse.json({
          //비귀중품 응답 오버라이드
          id: Number(id),
          categoryId: ETC_CATEGORY_ID,
          categoryName: '기타',
          categoryIconUrl: '',
          schoolAreaId: 1,
          schoolAreaName: '학술정보원',
          foundAreaDetail: '3층',
          createdAt: '2025-08-08T09:00:00Z',
          representativeImageUrl: '',
        });
      }),
    );

    renderFind('/find/10/info');

    expect(await screen.findByRole('heading', { name: '물건 정보' })).toBeInTheDocument();

    const nextBtn = screen.getByRole('button', { name: '다음' });
    await nextBtn.click();

    expect(await screen.findByRole('heading', { name: '상세 정보' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '내 분실물이 맞습니다' })).toBeInTheDocument();
  });
});
