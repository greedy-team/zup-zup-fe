import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Step1_CategorySelect from '../../../component/register/steps/Step1_CategorySelect';

describe('Step1_CategorySelect 컴포넌트', () => {
  it('카테고리를 렌더링하고, 클릭 시 onSelect가 호출되어야 합니다', () => {
    const handleSelect = vi.fn();
    render(<Step1_CategorySelect selectedCategory={null} onSelect={handleSelect} />);

    const firstCategoryButton = screen.getByRole('button', { name: '휴대폰' });
    expect(firstCategoryButton).toBeInTheDocument();

    fireEvent.click(firstCategoryButton);

    expect(handleSelect).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'phone1', name: '휴대폰' }),
    );
  });

  it('선택된 카테고리에 하이라이트 스타일이 적용되어야 합니다', () => {
    const selected = { id: 'bag1', name: '백팩' };
    render(<Step1_CategorySelect selectedCategory={selected} onSelect={() => {}} />);

    const selectedButton = screen.getByRole('button', { name: '백팩' });
    expect(selectedButton).toHaveClass('border-teal-500');
  });
});
