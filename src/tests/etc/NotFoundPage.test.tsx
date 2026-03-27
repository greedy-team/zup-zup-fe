import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { MemoryRouter } from 'react-router-dom';
import NotFoundPage from '../../pages/etc/NotFoundPage';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return { ...actual, useNavigate: () => mockNavigate };
});

const renderNotFoundPage = () =>
  render(
    <MemoryRouter>
      <NotFoundPage />
    </MemoryRouter>,
  );

describe('NotFoundPage', () => {
  it('404 텍스트와 안내 메시지가 렌더된다', () => {
    renderNotFoundPage();

    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText('페이지를 찾을 수 없어요')).toBeInTheDocument();
    expect(screen.getByText(/주소를 다시 확인하거나/)).toBeInTheDocument();
  });

  it('홈으로 가기 버튼과 이전 페이지 버튼이 렌더된다', () => {
    renderNotFoundPage();

    expect(screen.getByRole('button', { name: '홈으로 가기' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '이전 페이지' })).toBeInTheDocument();
  });

  it('홈으로 가기 버튼 클릭 시 "/" 로 이동한다', async () => {
    const user = userEvent.setup();
    renderNotFoundPage();

    await user.click(screen.getByRole('button', { name: '홈으로 가기' }));

    expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true });
  });

  it('이전 페이지 버튼 클릭 시 뒤로 이동한다', async () => {
    const user = userEvent.setup();
    renderNotFoundPage();

    await user.click(screen.getByRole('button', { name: '이전 페이지' }));

    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });
});
