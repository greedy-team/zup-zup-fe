import { render, screen } from '@testing-library/react';
import List from '../../component/main/main/lostList';
import type { LostItem } from '../../component/main/main/lostListItem';
import { describe, test, expect } from 'vitest';
import '@testing-library/jest-dom/vitest';

const itemsBase: LostItem[] = [
  {
    status: 'registered',
    lostItemId: 1,
    categoryId: 'wallet',
    categoryName: '지갑',
    foundLocation: '광개토관 3층',
    foundDate: '2025-08-08T09:00:00Z',
    imageUrl: '',
  },
  {
    status: 'found',
    lostItemId: 2,
    categoryId: 'bag',
    categoryName: '가방',
    foundLocation: '학술정보원 3층',
    foundDate: '2025-08-07T09:00:00Z',
    imageUrl: '',
  },
];

describe('List filtering & empty messages', () => {
  test('전체 데이터가 0개 → 전체 없음 메시지', () => {
    render(<List items={[]} category="전체" area={null} />);
    expect(screen.getByText('현재 확인된 분실물이 존재하지 않습니다.')).toBeInTheDocument();
  });

  test('데이터는 있음 + area 적용했는데 해당 지역 없음 → 지역 없음 메시지', () => {
    render(<List items={itemsBase} category="전체" area="AI센터" />);
    expect(screen.getByText('선택한 지역에 분실물이 존재하지 않습니다.')).toBeInTheDocument();
  });

  test('지역에는 존재 + 카테고리에는 없음 → 카테고리 없음 메시지', () => {
    render(<List items={itemsBase} category="휴대폰" area="광개토관" />);
    expect(screen.getByText('선택한 카테고리에 분실물이 존재하지 않습니다.')).toBeInTheDocument();
  });

  test('카테고리/지역 모두 매칭 → 리스트 렌더', () => {
    render(<List items={itemsBase} category="가방" area="학술정보원" />);
    expect(screen.getByText('분실물 목록')).toBeInTheDocument();
    expect(screen.getByText(/개 항목/)).toBeInTheDocument();
  });
});
