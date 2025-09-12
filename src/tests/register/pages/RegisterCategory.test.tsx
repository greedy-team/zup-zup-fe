import { fireEvent, render, screen } from '@testing-library/react';
import { vi, describe, it, expect, type Mock } from 'vitest';
import { useOutletContext } from 'react-router-dom';
import RegisterCategory from '../../../pages/register/RegisterCategory';
import type { Category } from '../../../types/register';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useOutletContext: vi.fn(),
  };
});

const mockCategories: Category[] = [
  {
    id: 1,
    name: '휴대폰',
    iconUrl: 'https://img.icons8.com/?size=100&id=79&format=png&color=000000',
  },
  {
    id: 2,
    name: '지갑',
    iconUrl: 'https://img.icons8.com/?size=100&id=20cEXbT1F6ek&format=png&color=000000',
  },
  {
    id: 3,
    name: '결제 카드',
    iconUrl: 'https://img.icons8.com/?size=100&id=kuzF9jfzqSmJ&format=png&color=000000',
  },
];

describe('RegisterCategory', () => {
  it('카테고리 목록을 렌더링해야 합니다.', () => {
    (useOutletContext as Mock).mockReturnValue({
      categories: mockCategories,
      selectedCategory: null,
      setSelectedCategory: vi.fn(),
    });

    render(<RegisterCategory />);

    expect(screen.getByText('카테고리를 선택해주세요')).toBeInTheDocument();
    mockCategories.forEach((category) => {
      expect(screen.getByText(category.name)).toBeInTheDocument();
      expect(screen.getByAltText(category.name)).toHaveAttribute('src', category.iconUrl);
    });
  });

  it('카테고리를 클릭하면 setSelectedCategory를 호출해야 합니다.', () => {
    const setSelectedCategory = vi.fn();
    (useOutletContext as Mock).mockReturnValue({
      categories: mockCategories,
      selectedCategory: null,
      setSelectedCategory,
    });

    render(<RegisterCategory />);

    const walletCategory = screen.getByText('지갑');
    fireEvent.click(walletCategory);

    expect(setSelectedCategory).toHaveBeenCalledWith(mockCategories[1]);
  });

  it('선택된 카테고리를 올바르게 표시해야 합니다.', () => {
    const selectedCategory = mockCategories[0];
    (useOutletContext as Mock).mockReturnValue({
      categories: mockCategories,
      selectedCategory,
      setSelectedCategory: vi.fn(),
    });

    render(<RegisterCategory />);

    const electronicsRadio = screen.getByLabelText('휴대폰');
    const walletRadio = screen.getByLabelText('지갑');

    expect(electronicsRadio).toBeChecked();
    expect(walletRadio).not.toBeChecked();
  });
});
