import { describe, it, beforeEach, expect, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { server } from '../setup';
import { renderFind } from '../utils/renderFind';

vi.mock('../../api/common/apiErrorToast', () => ({
  showApiErrorToast: vi.fn(),
}));
import { showApiErrorToast } from '../../api/common/apiErrorToast';

describe('FindInfo', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('FindInfo > 성공 시 필드 렌더', async () => {
    renderFind('/find/10/info');

    expect(await screen.findByText('분실물 찾기')).toBeInTheDocument();
  });

  it('FindInfo > HTTP 403 발생시 로딩 상태 표시', async () => {
    server.use(http.get('*/lost-items/:id', () => new HttpResponse(null, { status: 403 })));

    renderFind('/find/10/info');

    expect(await screen.findByText('로딩 중…')).toBeInTheDocument();

    await waitFor(() => {
      expect(showApiErrorToast).not.toHaveBeenCalled();
    });
  });

  it('FindInfo > HTTP 404 발생시 로딩 상태 표시', async () => {
    server.use(http.get('*/lost-items/:id', () => new HttpResponse(null, { status: 404 })));

    renderFind('/find/404/info');

    expect(await screen.findByText('로딩 중…')).toBeInTheDocument();

    await waitFor(() => {
      expect(showApiErrorToast).not.toHaveBeenCalled();
    });
  });
});
