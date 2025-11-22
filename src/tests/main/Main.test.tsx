import { render, screen } from '@testing-library/react';

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

describe('메인 컴포넌트', () => {
  it('지도가 렌더링된다', () => {
    renderMain();
    expect(screen.getByTestId('map')).toBeInTheDocument();
  });
});
