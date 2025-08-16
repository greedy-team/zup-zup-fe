import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RegisterModal from '../../component/register/RegisterModal';
import * as api from '../../api/register';
import type { Category, Feature, SchoolArea } from '../../types/register';

vi.mock('../../api/register');

describe('RegisterModal 컴포넌트 통합 테스트', () => {
  const mockOnClose = vi.fn();
  const mockCategories: Category[] = [{ categoryId: 1, categoryName: '휴대폰' }];
  const mockFeatures: Feature[] = [
    { featureId: 1, featureText: '색상은 무엇인가요?', options: [{ id: 1, text: '빨강' }] },
  ];
  const mockSchoolAreas: SchoolArea[] = [{ id: 1, areaName: '학생회관' } as SchoolArea];

  beforeEach(() => {
    vi.spyOn(api, 'fetchCategories').mockResolvedValue(mockCategories);
    vi.spyOn(api, 'fetchCategoryFeatures').mockResolvedValue(mockFeatures);
    vi.spyOn(api, 'fetchSchoolAreas').mockResolvedValue(mockSchoolAreas);
    vi.spyOn(api, 'postLostItem').mockResolvedValue({ success: true });
    mockOnClose.mockClear();
  });

  it('1단계에서 카테고리 선택 후 2단계로 이동', async () => {
    render(<RegisterModal onClose={mockOnClose} schoolAreaId={1} />);
    const categoryButton = await screen.findByRole('button', { name: '휴대폰' });
    fireEvent.click(categoryButton);

    const nextButton = screen.getByRole('button', { name: '다음' });
    fireEvent.click(nextButton);

    await screen.findByText('카테고리 특징');
    expect(screen.getByText('카테고리 특징')).toBeInTheDocument();
  });

  it('2단계에서 모든 필드를 채우면 다음 버튼 활성화', async () => {
    render(<RegisterModal onClose={mockOnClose} schoolAreaId={1} />);

    // 1단계: 카테고리 선택 및 다음
    const categoryButton = await screen.findByRole('button', { name: '휴대폰' });
    fireEvent.click(categoryButton);
    fireEvent.click(screen.getByRole('button', { name: '다음' }));

    // 2단계: 폼 채우기
    await screen.findByText('카테고리 특징');
    fireEvent.change(screen.getByLabelText('색상은 무엇인가요?'), { target: { value: '1' } });
    fireEvent.change(screen.getByLabelText(/상세 위치/), { target: { value: '401호' } });
    fireEvent.change(screen.getByPlaceholderText(/보관하고 있는 장소/), {
      target: { value: '사물함' },
    });
    const file = new File(['dummy'], 'test.png', { type: 'image/png' });
    fireEvent.change(screen.getByTestId('file-input'), { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByRole('button', { name: '다음' })).not.toBeDisabled();
    });
  });

  it('마지막 단계에서 등록하기 버튼 클릭 시 API 호출', async () => {
    render(<RegisterModal onClose={mockOnClose} schoolAreaId={1} />);

    // 1단계
    const categoryButton = await screen.findByRole('button', { name: '휴대폰' });
    fireEvent.click(categoryButton);
    fireEvent.click(screen.getByRole('button', { name: '다음' }));

    // 2단계
    await screen.findByText('카테고리 특징');
    fireEvent.change(screen.getByLabelText('색상은 무엇인가요?'), { target: { value: '1' } });
    fireEvent.change(screen.getByLabelText(/상세 위치/), { target: { value: '401호' } });
    fireEvent.change(screen.getByPlaceholderText(/보관하고 있는 장소/), {
      target: { value: '사물함' },
    });
    const file = new File(['dummy'], 'test.png', { type: 'image/png' });
    fireEvent.change(screen.getByTestId('file-input'), { target: { files: [file] } });
    fireEvent.click(screen.getByRole('button', { name: '다음' }));

    // 3단계
    const registerButton = await screen.findByRole('button', { name: '등록하기' });
    fireEvent.click(registerButton);

    await screen.findByText('등록 완료!');
    fireEvent.click(screen.getByRole('button', { name: '홈으로' }));

    await waitFor(() => {
      expect(api.postLostItem).toHaveBeenCalled();
      expect(mockOnClose).toHaveBeenCalled();
    });
  });
});
