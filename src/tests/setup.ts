import '@testing-library/jest-dom';
import { vi, beforeAll, afterAll, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';

// Common browser API stubs for tests
vi.spyOn(window, 'alert').mockImplementation(() => {});
window.URL.createObjectURL = vi.fn();

// Shared MSW server and default handlers
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
    HttpResponse.json({ areas: [{ schoolAreaId: 1, schoolAreaName: '학술정보원', lostCount: 2 }] }),
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
);

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => {
  server.resetHandlers();
  cleanup();
});
afterAll(() => server.close());

export { server };
