import { describe, it, beforeEach, expect, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { server } from '../setup';
import { renderFind } from '../utils/renderFind';

vi.mock('../../api/common/apiErrorToast', () => ({
  showApiErrorToast: vi.fn(),
}));
import { showApiErrorToast } from '../../api/common/apiErrorToast';

describe('FindDeposit', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('FindDeposit > 보관 장소 표시', async () => {
    renderFind('/find/10/deposit');

    expect(await screen.findByRole('heading', { name: '보관 장소' })).toBeInTheDocument();

    expect(await screen.findByText('학생회관 1층 분실물 센터')).toBeInTheDocument();
  });

  it('FindDeposit > 401 발생시 로딩 상태 유지', async () => {
    server.use(
      http.get('*/lost-items/:id/deposit-area', () => new HttpResponse(null, { status: 401 })),
    );

    renderFind('/find/10/deposit');

    expect(await screen.findByText('불러오는 중…')).toBeInTheDocument();

    await waitFor(() => {
      expect(showApiErrorToast).not.toHaveBeenCalled();
    });
  });

  it('FindDeposit > 403 발생시 로딩 상태 유지', async () => {
    server.use(
      http.get('*/lost-items/:id/deposit-area', () => new HttpResponse(null, { status: 403 })),
    );

    renderFind('/find/10/deposit');

    expect(await screen.findByText('불러오는 중…')).toBeInTheDocument();

    await waitFor(() => {
      expect(showApiErrorToast).not.toHaveBeenCalled();
    });
  });

  it('FindDeposit > 404 발생시 로딩 상태 유지', async () => {
    server.use(
      http.get('*/lost-items/:id/deposit-area', () => new HttpResponse(null, { status: 404 })),
    );

    renderFind('/find/404/deposit');

    expect(await screen.findByText('불러오는 중…')).toBeInTheDocument();

    await waitFor(() => {
      expect(showApiErrorToast).not.toHaveBeenCalled();
    });
  });
});
