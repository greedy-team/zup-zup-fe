import '@testing-library/jest-dom';
import { vi, beforeAll, afterAll, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';

vi.spyOn(window, 'alert').mockImplementation(() => {});
window.URL.createObjectURL = vi.fn();

const server = setupServer(
  // 카테고리
  http.get('*/categories', () =>
    HttpResponse.json({
      categories: [
        { categoryId: 1, categoryName: '가방' },
        { categoryId: 2, categoryName: '지갑' },
      ],
    }),
  ),

  // 학교 구역
  http.get('*/school-areas', () =>
    HttpResponse.json({
      schoolAreas: [
        { id: 1, areaName: '학술정보원' },
        { id: 2, areaName: '광개토관' },
      ],
    }),
  ),

  // 분실물 요약
  http.get('*/lost-items/summary', () =>
    HttpResponse.json({
      areas: [{ schoolAreaId: 1, schoolAreaName: '학술정보원', lostCount: 2 }],
    }),
  ),

  // 분실물 목록 (쿼리에 따라 분기)
  http.get('*/lost-items', ({ request }) => {
    const url = new URL(request.url);
    const schoolAreaId = url.searchParams.get('schoolAreaId');
    const items =
      schoolAreaId === '999'
        ? []
        : [
            {
              id: 10,
              categoryId: 1,
              categoryName: '가방',
              schoolAreaId: 1,
              foundArea: '학술정보원 3층',
              createdAt: '2025-08-08T09:00:00Z',
              representativeImageUrl: '',
            },
            {
              id: 11,
              categoryId: 2,
              categoryName: '지갑',
              schoolAreaId: 2,
              foundArea: '광개토관 1층',
              createdAt: '2025-08-07T09:00:00Z',
              representativeImageUrl: '',
            },
          ];
    return HttpResponse.json({ items, pageInfo: { totalElements: items.length } });
  }),

  // 분실물 요약 정보(info)
  http.get('*/lost-items/:id', ({ params }) => {
    const { id } = params as any;
    return HttpResponse.json({
      id: Number(id),
      categoryId: 2, // 비귀중품인 경우는 오버라이드로 응답 조정 가능
      categoryName: '지갑',
      categoryIconUrl: '',
      schoolAreaId: 1,
      schoolAreaName: '학술정보원',
      foundAreaDetail: '3층',
      createdAt: '2025-08-08T09:00:00Z',
      representativeImageUrl: '',
    });
  }),

  // 퀴즈 조회(quiz)
  http.get('*/lost-items/:id/quizzes', () =>
    HttpResponse.json({
      quizzes: [
        {
          featureId: 1,
          question: '색상은?',
          options: [
            { id: 10, text: '빨강' },
            { id: 11, text: '파랑' },
          ],
        },
      ],
    }),
  ),

  // 퀴즈 제출(quiz)
  http.post('*/lost-items/:id/quizzes', async ({ request }) => {
    const body = (await request.json()) as { answers?: any[] };
    if (!body.answers?.length) return new HttpResponse(null, { status: 400 });
    return HttpResponse.json({});
  }),

  // 상세 이미지/설명(detail)
  http.get('*/lost-items/:id/image', () =>
    HttpResponse.json({
      id: 10,
      categoryId: 2,
      categoryName: '지갑',
      categoryIconUrl: '',
      schoolAreaId: 1,
      schoolAreaName: '학술정보원',
      foundAreaDetail: '3층',
      description: '갈색 지갑',
      createdAt: '2025-08-08T09:00:00Z',
      imageUrls: ['https://example.com/a.png', 'https://example.com/b.png'],
    }),
  ),

  // 서약 제출(pledge)
  http.post('*/lost-items/:id/pledge', () => HttpResponse.json({})),

  // 보관 장소(deposit)
  http.get('*/lost-items/:id/deposit-area', () =>
    HttpResponse.json({ depositArea: '학생회관 1층 분실물 센터' }),
  ),
);

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => {
  server.resetHandlers();
  cleanup();
});
afterAll(() => server.close());

export { server };