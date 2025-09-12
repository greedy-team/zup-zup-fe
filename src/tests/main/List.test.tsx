import { render, screen } from '@testing-library/react';
import { describe, test, expect, beforeAll, afterAll, afterEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { MemoryRouter } from 'react-router-dom';
import MainPage from '../../pages/main/MainPage';
import { AppProvider } from '../../contexts/AppContexts';

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
  // 분실물 목록: 쿼리에 따라 분기
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

{
  /* msw 설정 */
}
beforeAll(() => server.listen());
afterAll(() => server.close());
afterEach(() => server.resetHandlers());

{
  /* 리스트 렌더링 */
}
const renderMain = (initialPath: string) => {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <AppProvider>
        <MainPage />
      </AppProvider>
    </MemoryRouter>,
  );
};

describe('메인 리스트', () => {
  test('목록이 없으면 빈 메시지 보임', async () => {
    renderMain('/?page=1&schoolAreaId=999');
    const empties = await screen.findAllByText('현재 확인된 분실물이 존재하지 않습니다.');
    expect(empties.length).toBeGreaterThanOrEqual(1);
  });

  test('데이터가 있으면 제목과 개수 보임', async () => {
    renderMain('/?page=1');
    expect(await screen.findByText('분실물 목록')).toBeInTheDocument();
    const totals = await screen.findAllByText('총 2개');
    expect(totals.length).toBeGreaterThanOrEqual(1);
  });
});
