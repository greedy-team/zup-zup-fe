import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Step1_CategorySelect from '../../../component/register/steps/Step1_CategorySelect';
import type { Category } from '../../../types/register';

describe('Step1_CategorySelect 컴포넌트', () => {
  const mockCategories: Category[] = [
    { categoryId: 1, categoryName: '휴대폰' },
    { categoryId: 2, categoryName: '가방' },
  ];

  it('카테고리를 렌더링하고, 클릭 시 onSelect가 호출되어야 합니다', () => {
    const handleSelect = vi.fn();
    render(
      <Step1_CategorySelect
        categories={mockCategories}
        selectedCategory={null}
        onSelect={handleSelect}
      />,
    );

    const firstCategoryButton = screen.getByRole('button', { name: '휴대폰' });
    expect(firstCategoryButton).toBeInTheDocument();

    fireEvent.click(firstCategoryButton);

    expect(handleSelect).toHaveBeenCalledWith(mockCategories[0]);
  });

  it('선택된 카테고리에 하이라이트 스타일이 적용되어야 합니다', () => {
    render(
      <Step1_CategorySelect
        categories={mockCategories}
        selectedCategory={mockCategories[1]}
        onSelect={() => {}}
      />,
    );

    const selectedButton = screen.getByRole('button', { name: '가방' });
    expect(selectedButton).toHaveClass('border-teal-500');
  });
});
