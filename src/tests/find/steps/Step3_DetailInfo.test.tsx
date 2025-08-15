import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Step3_DetailInfo from '../../../component/find/steps/Step3_DetailInfo';
import type { LostItem } from '../../../component/main/main/lostListItem';

const mockItem: LostItem = {
  lostItemId: 1,
  categoryName: '카드',
  foundLocation: '학술정보원',
  foundDate: '2024-08-10T12:00:00.000Z',
  status: 'registered',
  categoryId: 'CARD',
  detail: '국민카드고, 유효기간이 2031년 06월까지에요.',
  imageUrl: 'https://via.placeholder.com/150',
};

const mockItemWithoutImageAndDetail: LostItem = {
  lostItemId: 1,
  categoryName: '카드',
  foundLocation: '학술정보원',
  foundDate: '2024-08-10T12:00:00.000Z',
  status: 'registered',
  categoryId: 'CARD',
  detail: '',
  imageUrl: '',
};

describe('Step3_DetailInfo 컴포넌트 테스트', () => {
  it('이미지와 상세 정보가 있을 때 이를 표시하고, 플레이스홀더는 보이지 않는다', () => {
    render(<Step3_DetailInfo item={mockItem} />);

    const img = screen.getByRole('img', { name: /분실물|상세|이미지/i });
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', mockItem.imageUrl);
    expect(screen.getByText(mockItem.detail!)).toBeInTheDocument();
    expect(screen.queryByText('이미지 없음')).not.toBeInTheDocument();
    expect(screen.queryByText('상세 정보가 없습니다.')).not.toBeInTheDocument();
  });

  it('이미지와 상세 정보가 없을 때 플레이스홀더를 표시하고, 이미지는 보이지 않는다', () => {
    render(<Step3_DetailInfo item={mockItemWithoutImageAndDetail} />);

    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(screen.getByText('이미지 없음')).toBeInTheDocument();
    expect(screen.getByText('상세 정보가 없습니다.')).toBeInTheDocument();
  });
});
