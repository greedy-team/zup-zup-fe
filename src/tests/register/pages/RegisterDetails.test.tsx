import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, type Mock } from 'vitest';
import { useOutletContext } from 'react-router-dom';
import RegisterDetails from '../../../pages/register/RegisterDetails';
import type {
  RegisterContextType,
  RegisterFormData,
  FeatureSelection,
} from '../../../types/register';

// react-router-dom 모의 처리
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useOutletContext: vi.fn(), // useOutletContext를 모의 함수로 대체
  };
});

// 파일을 업로드하면 "mock-url-for-{파일 이름}" 형식의 URL을 반환하도록 모의 처리
(window.URL.createObjectURL as Mock).mockImplementation(
  (file: File) => `mock-url-for-${file.name}`,
);

// window.alert를 모의 함수로 대체
window.alert = vi.fn();

const mockSetFormData = vi.fn();
const mockHandleFeatureChange = vi.fn((featureId: number, optionId: number) => {
  mockSetFormData((prev: RegisterFormData) => {
    const otherFeatures = prev.featureOptions.filter((f) => f.featureId !== featureId);
    const newFeature: FeatureSelection = { featureId, optionId };
    return { ...prev, featureOptions: [...otherFeatures, newFeature] };
  });
});

// mock 컨텍스트 값
const defaultMockContext: RegisterContextType = {
  isLoading: false,
  categories: [],
  selectedCategory: null,
  setSelectedCategory: vi.fn(),
  formData: {
    foundAreaId: 1,
    foundAreaDetail: '401호 앞',
    depositArea: '학생회관 1층',
    images: [],
    imageOrder: [],
    featureOptions: [],
    description: '검은색 케이스',
  },
  setFormData: mockSetFormData,
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
    {
      id: 2,
      areaName: '학술정보원',
      areaPolygon: { coordinates: [{ lat: 0, lng: 0 }] },
      marker: { lat: 0, lng: 0 },
    },
  ],
  handleFeatureChange: mockHandleFeatureChange,
  isStep2Valid: true,
  resultModalContent: null,
  handleRegister: vi.fn(),
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
  });

  it('폼 필드를 올바르게 렌더링해야 합니다.', () => {
    renderComponent();

    // 카테고리 특징
    expect(screen.getByText('카테고리 특징')).toBeInTheDocument();
    expect(
      screen.getByText('다음 중 분실물의 색상으로 가장 적절한 것은 무엇인가요?'),
    ).toBeInTheDocument();

    // 위치 상세 정보
    expect(screen.getByText('선택된 건물').nextSibling).toHaveTextContent('학생회관');
    expect(screen.getByLabelText('상세 위치 (예: 401호, 정문 앞 소파)')).toHaveValue('401호 앞');

    // 보관 장소
    expect(screen.getByPlaceholderText('분실물을 보관하고 있는 장소를 입력해주세요')).toHaveValue(
      '학생회관 1층',
    );

    // 사진 업로드
    expect(screen.getByText('사진 업로드 (최소 1장, 최대 3장)')).toBeInTheDocument();

    // 분실물 상세 정보
    expect(screen.getByPlaceholderText(/분실물에 대한 추가 정보를 입력해주세요/)).toHaveValue(
      '검은색 케이스',
    );
  });

  it('입력 필드 변경 시 setFormData를 호출해야 합니다.', () => {
    renderComponent();
    const detailLocationInput = screen.getByLabelText('상세 위치 (예: 401호, 정문 앞 소파)');
    fireEvent.change(detailLocationInput, { target: { name: 'foundAreaDetail', value: '501호' } });

    expect(mockSetFormData).toHaveBeenCalled();
  });

  it('카테고리 특징 변경 시 handleFeatureChange를 호출해야 합니다.', () => {
    renderComponent();
    const featureSelect = screen.getByLabelText(
      '다음 중 분실물의 색상으로 가장 적절한 것은 무엇인가요?',
    );
    fireEvent.change(featureSelect, { target: { value: '1' } });

    expect(mockHandleFeatureChange).toHaveBeenCalledWith(1, 1);
  });

  it('이미지 업로드 시 setFormData를 호출해야 합니다.', () => {
    renderComponent();
    const file = new File(['(⌐□_□)'], 'test.png', { type: 'image/png' });
    const fileInput = screen.getByTestId('file-input');

    fireEvent.change(fileInput, { target: { files: [file] } });

    expect(mockSetFormData).toHaveBeenCalled();
  });

  it('이미지는 최대 3장까지 업로드할 수 있습니다.', () => {
    const initialImages = [
      new File(['1'], '1.png'),
      new File(['2'], '2.png'),
      new File(['3'], '3.png'),
    ];
    renderComponent({
      formData: { ...defaultMockContext.formData, images: initialImages },
    });

    const file = new File(['4'], '4.png');
    const fileInput = screen.getByTestId('file-input');
    fireEvent.change(fileInput, { target: { files: [file] } });

    expect(window.alert).toHaveBeenCalledWith('사진은 최대 3장까지 업로드할 수 있습니다.');
  });

  it('이미지 삭제 시 setFormData를 호출해야 합니다.', () => {
    const imageToRemove = new File(['(⌐□_□)'], 'test.png', { type: 'image/png' });
    renderComponent({
      formData: { ...defaultMockContext.formData, images: [imageToRemove] },
    });

    expect(screen.getByAltText('preview 0')).toBeInTheDocument();
    const removeButton = screen.getByText('X');
    fireEvent.click(removeButton);

    expect(mockSetFormData).toHaveBeenCalled();
  });
});
