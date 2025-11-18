import { describe, it, beforeEach, expect, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { server } from '../setup';
import { renderFind } from '../utils/renderFind';

vi.mock('../../api/common/apiErrorToast', () => ({
  showApiErrorToast: vi.fn(),
}));
import { showApiErrorToast } from '../../api/common/apiErrorToast';

describe('FindDetail', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('FindDetail > 이미지/설명 렌더링 및 썸네일 전환', async () => {
    renderFind('/find/10/detail');

    expect(await screen.findByRole('heading', { name: '상세 정보' })).toBeInTheDocument();

    expect(await screen.findByAltText('분실물 사진')).toBeInTheDocument();

    expect(await screen.findByText('갈색 지갑')).toBeInTheDocument();
  });

  it('FindDetail > HTTP 403 발생시 로딩 상태 유지', async () => {
    server.use(http.get('*/lost-items/:id/image', () => new HttpResponse(null, { status: 403 })));

    renderFind('/find/10/detail');

    expect(await screen.findByText('불러오는 중…')).toBeInTheDocument();

    await waitFor(() => {
      expect(showApiErrorToast).not.toHaveBeenCalled();
    });
  });

  it('FindDetail > HTTP 404 발생시 로딩 상태 유지', async () => {
    server.use(http.get('*/lost-items/:id/image', () => new HttpResponse(null, { status: 404 })));

    renderFind('/find/404/detail');

    expect(await screen.findByText('불러오는 중…')).toBeInTheDocument();

    await waitFor(() => {
      expect(showApiErrorToast).not.toHaveBeenCalled();
    });
  });

  it('FindDetail > 401 발생시 로딩 상태 유지', async () => {
    server.use(http.get('*/lost-items/:id/image', () => new HttpResponse(null, { status: 401 })));

    renderFind('/find/10/detail');

    expect(await screen.findByText('불러오는 중…')).toBeInTheDocument();

    await waitFor(() => {
      expect(showApiErrorToast).not.toHaveBeenCalled();
    });
  });
});
