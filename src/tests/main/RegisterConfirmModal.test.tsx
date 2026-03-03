import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RegisterConfirmModal from '../../component/main/modal/RegisterConfirmModal';
import { describe, expect, it, beforeEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useMainStore } from '../../store/mainStore';

const LocationDisplay = () => {
  const location = useLocation();
  return <div data-testid="location-display">{location.pathname}</div>;
};

const createTestQueryClient = () =>
  new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } });

const renderWithStore = (isOpen: boolean) => {
  useMainStore.setState({ isRegisterConfirmModalOpen: isOpen });
  return render(
    <QueryClientProvider client={createTestQueryClient()}>
      <MemoryRouter initialEntries={['/?schoolAreaId=1']}>
        <RegisterConfirmModal />
        <LocationDisplay />
      </MemoryRouter>
    </QueryClientProvider>,
  );
};

describe('등록 확인 모달', () => {
  beforeEach(() => {
    useMainStore.setState({ isRegisterConfirmModalOpen: false });
  });

  it('닫혀 있으면 보이지 않는다', () => {
    renderWithStore(false);
    expect(screen.queryByRole('button', { name: '등록' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: '취소' })).not.toBeInTheDocument();
  });

  it('열려 있으면 제목과 버튼이 보인다', async () => {
    renderWithStore(true);
    expect(await screen.findByRole('button', { name: '등록' })).toBeInTheDocument();
    expect(await screen.findByRole('button', { name: '취소' })).toBeInTheDocument();
  });

  it('등록 버튼 클릭 시 등록 페이지로 이동한다', async () => {
    const user = userEvent.setup();
    renderWithStore(true);

    await user.click(await screen.findByRole('button', { name: '등록' }));
    // 등록 버튼 클릭 시 등록 페이지로 이동한다
    expect(screen.getByTestId('location-display')).toHaveTextContent('/register/1');

    // 모달이 사라진 상태인지 확인
    expect(screen.queryByRole('button', { name: '취소' })).not.toBeInTheDocument();
  });

  it('취소 버튼 클릭 시 모달이 닫힌다', async () => {
    const user = userEvent.setup();
    renderWithStore(true);

    await user.click(await screen.findByRole('button', { name: '취소' }));

    // 모달이 닫힌 상태인지 확인
    expect(screen.queryByRole('button', { name: '등록' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: '취소' })).not.toBeInTheDocument();
  });
});
