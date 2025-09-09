import { render, screen } from '@testing-library/react';
import Main from '../../component/main/main/Main';
import { describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { MemoryRouter } from 'react-router-dom';
import { AppProvider } from '../../contexts/AppContexts';

vi.mock('../../component/main/main/Map', () => ({
  default: () => <div data-testid="map" />,
}));

const renderMain = () =>
  render(
    <MemoryRouter>
      <AppProvider>
        <Main />
      </AppProvider>
    </MemoryRouter>,
  );

describe('메인 하단 버튼', () => {
  it('처음엔 "분실물 추가"가 보이고, 클릭 시 "분실물 조회"로 바뀐다', () => {
    renderMain();

    const button = screen.getByRole('button', { name: '분실물 추가' });
    expect(button).toBeInTheDocument();

    // register 모드로 변경 시 텍스트가 "분실물 조회"로 바뀌는지 확인
    button.click();
    expect(screen.getByRole('button', { name: '분실물 조회' })).toBeInTheDocument();
  });
});
