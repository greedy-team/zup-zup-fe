import { render, screen } from '@testing-library/react';

import userEvent from '@testing-library/user-event';
import Main from '../../component/main/main/Main';
import { describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { MemoryRouter } from 'react-router-dom';
import { AppProvider } from '../../contexts/AppContexts';

vi.mock('../../component/main/main/Map', () => ({
  default: () => <div data-testid="map" />, // 맵 컴포넌트 모킹데이터
}));

const renderMain = () =>
  // 메인 컴포넌트 렌더링
  render(
    <MemoryRouter>
      <AppProvider>
        <Main />
      </AppProvider>
    </MemoryRouter>,
  );

describe('메인 하단 버튼', () => {
  it('처음엔 "분실물 추가"가 보이고, 클릭 시 "분실물 조회"로 바뀐다', async () => {
    renderMain();

    const user = userEvent.setup();
    const button = screen.getByRole('button', { name: '분실물 추가' });
    expect(button).toBeInTheDocument();

    await user.click(button);
    expect(await screen.findByRole('button', { name: '분실물 조회' })).toBeInTheDocument();
  });
});
