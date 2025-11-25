import { render, screen } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, type Mock } from 'vitest';
import { useOutletContext } from 'react-router-dom';
import RegisterReview from '../../../pages/register/RegisterReview';
import type { RegisterContextType } from '../../../types/register';

// react-router-dom 모의 처리
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useOutletContext: vi.fn(),
  };
});

// 파일을 업로드하면 "mock-url-for-{파일 이름}" 형식의 URL을 반환하도록 모의 처리
(window.URL.createObjectURL as Mock).mockImplementation(
  (file: File) => `mock-url-for-${file.name}`,
);

const mockFile = new File(['(⌐□_□)'], 'test.png', { type: 'image/png' });

const defaultMockContext: RegisterContextType = {
  isLoading: false,
  categories: [],
  selectedCategory: { id: 1, name: '전자기기', iconUrl: '' },
  setSelectedCategory: vi.fn(),
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
  formData: {
    foundAreaId: 1,
    foundAreaDetail: '401호 앞',
    depositArea: '학생회관 1층',
    images: [mockFile],
    imageOrder: [0],
    featureOptions: [{ featureId: 1, optionId: 2 }],
    description: '검은색 케이스',
  },
  schoolAreas: [
    {
      id: 1,
      areaName: '학생회관',
      areaPolygon: { coordinates: [{ lat: 0, lng: 0 }] },
      marker: { lat: 0, lng: 0 },
    },
  ],
  setField: vi.fn() as RegisterContextType['setField'],
  setImages: vi.fn() as RegisterContextType['setImages'],
  setFeature: vi.fn() as RegisterContextType['setFeature'],
  resetForm: vi.fn() as RegisterContextType['resetForm'],
  handleRegister: vi.fn() as RegisterContextType['handleRegister'],
  isStep2Valid: true,
  resultModalContent: null,
};

const renderComponent = (context: Partial<RegisterContextType> = {}) => {
  (useOutletContext as Mock).mockReturnValue({
    ...defaultMockContext,
    ...context,
  });
  return render(<RegisterReview />);
};

describe('RegisterReview', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('모든 입력 정보를 올바르게 렌더링해야 합니다.', () => {
    renderComponent();
    expect(screen.getByText('입력 정보를 확인해주세요')).toBeInTheDocument();

    // 카테고리
    expect(screen.getByText('카테고리')).toBeInTheDocument();
    expect(screen.getByText('전자기기')).toBeInTheDocument();

    // 사진
    expect(screen.getByAltText('confirm 0')).toHaveAttribute(
      'src',
      `mock-url-for-${mockFile.name}`,
    );

    // 분실물 특징
    expect(screen.getByText('분실물 특징')).toBeInTheDocument();
    expect(
      screen.getByText('다음 중 분실물의 색상으로 가장 적절한 것은 무엇인가요?'),
    ).toBeInTheDocument();
    expect(screen.getByText('파랑')).toBeInTheDocument();

    // 보관 장소
    expect(screen.getByText('보관 장소')).toBeInTheDocument();
    expect(screen.getByText('학생회관 1층')).toBeInTheDocument();

    // 위치 정보
    expect(screen.getByText(/건물:/)).toHaveTextContent('건물: 학생회관');
    expect(screen.getByText(/상세 위치:/)).toHaveTextContent('상세 위치: 401호 앞');

    // 상세 정보
    expect(screen.getByText('상세 정보')).toBeInTheDocument();
    expect(screen.getByText('검은색 케이스')).toBeInTheDocument();
  });

  it('상세 정보가 없을 때 대체 텍스트를 표시해야 합니다.', () => {
    renderComponent({
      formData: { ...defaultMockContext.formData, description: '' },
    });
    expect(screen.getByText('입력된 내용이 없습니다.')).toBeInTheDocument();
  });
});
