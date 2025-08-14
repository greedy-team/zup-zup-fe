import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Step1_ItemInfo from '../../../component/find/steps/Step1_ItemInfo';
import type { LostItem } from '../../../component/main/main/lostListItem';

const mockItem: LostItem = {
  lostItemId: 1,
  categoryName: '카드',
  foundLocation: '학술정보원',
  foundDate: '2024-08-10T12:00:00.000Z',
  status: 'registered',
  categoryId: 'CARD',
};

describe('Step1_ItemInfo 컴포넌트 테스트', () => {
  it('item prop으로 받은 분실물 정보를 올바르게 렌더링해야 한다', () => {
    render(<Step1_ItemInfo item={mockItem} />);

    expect(screen.getByText('분실물 카테고리')).toBeInTheDocument();
    expect(screen.getByText('카드')).toBeInTheDocument();

    expect(screen.getByText('발견 장소')).toBeInTheDocument();
    expect(screen.getByText('학술정보원')).toBeInTheDocument();

    expect(screen.getByText('발견 날짜')).toBeInTheDocument();
    expect(screen.getByText(/2024\.\s*8\.\s*10/)).toBeInTheDocument();
  });
});
