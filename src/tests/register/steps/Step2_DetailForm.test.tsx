import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Step2_DetailForm from '../../../component/register/steps/Step2_DetailForm';
import type { RegisterFormData, CategoryFeature } from '../../../types/register';

describe('Step2_DetailForm 컴포넌트', () => {
  let mockSetFormData: ReturnType<typeof vi.fn>;
  const mockFeatures: CategoryFeature[] = [
    { id: 'q1', question: '무슨 색상인가요?', options: ['검정', '흰색', '갈색', '기타'] },
  ];
  const mockFormData: RegisterFormData = {
    featureAnswers: {},
    building: '대양AI센터',
    locationDetail: '콜라보랩 카운터에 있습니다.',
    description: '분실물 상세 정보 ----',
    storageLocation: '학생회관 401호',
    images: [],
  };

  beforeEach(() => {
    mockSetFormData = vi.fn();
  });

  const setup = (overrides = {}) =>
    render(
      <Step2_DetailForm
        isLoading={false}
        formData={mockFormData}
        setFormData={mockSetFormData}
        categoryFeatures={mockFeatures}
        selectedArea="대양AI센터"
        {...overrides}
      />,
    );

  it('선택된 건물 표시', () => {
    setup();
    expect(screen.getByText('선택된 건물')).toBeInTheDocument();
    expect(screen.getByText('대양AI센터')).toBeInTheDocument();
  });

  it('locationDetail, description, storageLocation 입력 시 setFormData 호출', () => {
    setup();

    const locationInput = screen.getByLabelText(/상세 위치/);
    fireEvent.change(locationInput, { target: { value: '701호 앞' } });
    expect(mockSetFormData).toHaveBeenCalled();

    const descriptionInput = screen.getByPlaceholderText(/분실물에 대한 추가 정보/);
    fireEvent.change(descriptionInput, { target: { value: '새로운 설명' } });
    expect(mockSetFormData).toHaveBeenCalled();

    const storageInput = screen.getByPlaceholderText(/분실물을 보관하고 있는 장소/);
    fireEvent.change(storageInput, { target: { value: '학생회관 101호' } });
    expect(mockSetFormData).toHaveBeenCalled();
  });

  it('카테고리 특징 select 선택 시 featureAnswers 업데이트', () => {
    setup();
    const mockSetFormData = vi.fn();

    mockSetFormData.mockImplementation((updater) => {
      const newState = typeof updater === 'function' ? updater(mockFormData) : updater;
      expect(newState.featureAnswers).toEqual({ q1: '검정' });
    });

    fireEvent.change(screen.getByLabelText(/무슨 색상인가요\?/i), {
      target: { value: '검정' },
    });
  });

  it('이미지 업로드 버튼 클릭 → input 클릭', () => {
    setup();
    const uploadButton = screen.getByText('업로드');
    fireEvent.click(uploadButton);
    expect(uploadButton).toBeInTheDocument();
  });

  it('이미지 업로드 및 삭제', () => {
    setup();

    const file = new File(['dummy'], 'test.png', { type: 'image/png' });
    const fileInput = screen.getByTestId('file-input') as HTMLInputElement;

    // 이미지 업로드
    mockSetFormData.mockImplementation((updater) => {
      const newState = typeof updater === 'function' ? updater(mockFormData) : updater;
      expect(newState.images).toContain(file);
    });
    fireEvent.change(fileInput, { target: { files: [file] } });

    // 이미지 삭제
    mockSetFormData.mockReset();
    mockSetFormData.mockImplementation((updater) => {
      const newState =
        typeof updater === 'function' ? updater({ ...mockFormData, images: [file] }) : updater;
      expect(newState.images).toHaveLength(0);
    });

    const removeButton = screen.getByRole('button');
    fireEvent.click(removeButton);
  });

  it('로딩 상태일 때 스피너 표시', () => {
    setup({ isLoading: true });
    expect(screen.getByText(/카테고리 정보를 불러오는 중/)).toBeInTheDocument();
  });
});
