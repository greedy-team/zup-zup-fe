import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, type Mock } from 'vitest';
import { useOutletContext } from 'react-router-dom';
import RegisterDetails from '../../../pages/register/RegisterDetails';
import type { RegisterContextType } from '../../../types/register';

// react-router-dom 모의 처리
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useOutletContext: vi.fn(),
  };
});

// window.alert를 모의 함수로 대체
window.alert = vi.fn();

const mockSetField = vi.fn();
const mockSetFeature = vi.fn();
const mockSetImages = vi.fn();

// mock 컨텍스트 값
const defaultMockContext: Partial<RegisterContextType> = {
  isLoading: false,
  formData: {
    foundAreaId: 1,
    foundAreaDetail: '401호 앞',
    depositArea: '학생회관 1층',
    images: [],
    imageOrder: [],
    featureOptions: [],
    description: '검은색 케이스',
  },
  setField: mockSetField,
  setFeature: mockSetFeature,
  setImages: mockSetImages,
  categoryFeatures: [
    {
      id: 1,
      name: '색상',
      quizQuestion: '다음 중 분실물의 색상으로 가장 적절한 것은 무엇인가요?',
      options: [
        { id: 1, optionValue: '빨강' },
        { id: 2, optionValue: '파랑' },
      ],
    },
  ],
  schoolAreas: [
    {
      id: 1,
      areaName: '학생회관',
      areaPolygon: { coordinates: [{ lat: 0, lng: 0 }] },
      marker: { lat: 0, lng: 0 },
    },
  ],
};

const renderComponent = (context: Partial<RegisterContextType> = {}) => {
  (useOutletContext as Mock).mockReturnValue({
    ...defaultMockContext,
    ...context,
  });
  return render(<RegisterDetails />);
};

describe('RegisterDetails', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (window.URL.createObjectURL as Mock) = vi.fn((file: File) => `mock-url-for-${file.name}`);
  });

  it('폼 필드를 올바르게 렌더링해야 합니다.', () => {
    renderComponent();

    expect(screen.getByText('카테고리 특징')).toBeInTheDocument();
    expect(screen.getByText(/다음 중 분실물의 색상으로/)).toBeInTheDocument();
    expect(screen.getByText('선택된 건물').nextSibling).toHaveTextContent('학생회관');
    expect(screen.getByLabelText(/상세 위치/)).toHaveValue('401호 앞');
    expect(screen.getByPlaceholderText(/보관하고 있는 장소/)).toHaveValue('학생회관 1층');
    expect(screen.getByPlaceholderText(/추가 정보/)).toHaveValue('검은색 케이스');
  });

  it('입력 필드 변경 시 setField를 호출해야 합니다.', () => {
    renderComponent();
    const detailLocationInput = screen.getByLabelText(/상세 위치/);
    fireEvent.change(detailLocationInput, { target: { name: 'foundAreaDetail', value: '501호' } });

    expect(mockSetField).toHaveBeenCalledWith('foundAreaDetail', '501호');
  });

  it('카테고리 특징 변경 시 setFeature를 호출해야 합니다.', () => {
    renderComponent();
    const featureSelect = screen.getByLabelText(/다음 중 분실물의 색상으로/);
    fireEvent.change(featureSelect, { target: { value: '1' } });

    expect(mockSetFeature).toHaveBeenCalledWith({ featureId: 1, optionId: 1 });
  });

  it('이미지 업로드 시 setImages를 호출해야 합니다.', () => {
    renderComponent();
    const file = new File(['(⌐□_□)'], 'test.png', { type: 'image/png' });
    const fileInput = screen.getByTestId('file-input');

    fireEvent.change(fileInput, { target: { files: [file] } });

    expect(mockSetImages).toHaveBeenCalledWith([file], [0]);
  });

  it('이미지 삭제 시 setImages를 호출해야 합니다.', () => {
    const imageToRemove = new File(['(⌐□_□)'], 'test.png', { type: 'image/png' });
    renderComponent({
      formData: { ...defaultMockContext.formData!, images: [imageToRemove] },
    });

    const removeButton = screen.getByText('X');
    fireEvent.click(removeButton);

    expect(mockSetImages).toHaveBeenCalledWith([], []);
  });
});
