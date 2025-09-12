import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { renderFind } from '../utils/renderFind';
import { server } from '../setup';
import { http, HttpResponse } from 'msw';

describe('FindInfo', () => {
  it('성공 시 필드 렌더', async () => {
    renderFind('/find/10/info');

    // 헤딩으로 페이지 진입 확인
    await screen.findByRole('heading', { name: '물건 정보' });

    expect(await screen.findByText('분실물 카테고리')).toBeInTheDocument();
    expect(screen.getByText(/학술정보원\s+-\s+3층/)).toBeInTheDocument(); //공백과 줄바꿈을 허용하여 해당 텍스트를 찾는 방식
    expect(screen.getByText(/등록 날짜/)).toBeInTheDocument(); // 부분 일치 문자열을 찾을 수 있는 방식
  });

  it.each([403, 404])('HTTP %s 발생시 alert + 홈 이동', async (status) => {
    const path = status === 404 ? '/find/404/info' : '/find/10/info';

    server.use(http.get('*/lost-items/:id', () => new HttpResponse(null, { status })));
    renderFind(path);

    expect(await screen.findByText('Home')).toBeInTheDocument();
    expect(window.alert).toHaveBeenCalled();
  });
});
