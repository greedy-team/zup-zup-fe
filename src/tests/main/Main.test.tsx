import { render, screen } from '@testing-library/react';

import Main from '../../component/main/main/Main';
import { describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

vi.mock('../../component/main/main/Map', () => ({
  default: () => <div data-testid="map" />, // 맵 컴포넌트 모킹데이터
}));

const createTestQueryClient = () =>
  new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } });

const renderMain = () =>
  // 메인 컴포넌트 렌더링
  render(
    <QueryClientProvider client={createTestQueryClient()}>
      <MemoryRouter>
        <Main />
      </MemoryRouter>
    </QueryClientProvider>,
  );

describe('메인 컴포넌트', () => {
  it('지도가 렌더링된다', () => {
    renderMain();
    expect(screen.getByTestId('map')).toBeInTheDocument();
  });
});
