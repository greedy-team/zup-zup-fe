import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, test, expect } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import MainPage from '../../pages/main/MainPage';
import { AppProvider } from '../../contexts/AppContexts';

{
  /* 리스트 렌더링 */
}

const renderMain = (initialPath: string) => {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <AppProvider>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/find/:lostItemId" element={<div data-testid="find-page" />} />
        </Routes>
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

  test('찾기 버튼 클릭 시 찾기 페이지로 이동', async () => {
    const user = userEvent.setup();
    renderMain('/?page=1');

    const buttons = await screen.findAllByRole('button', { name: '분실물 찾기' });
    expect(buttons.length).toBeGreaterThan(0);
    await user.click(buttons[0]);

    expect(await screen.findByTestId('find-page')).toBeInTheDocument();
  });
});
