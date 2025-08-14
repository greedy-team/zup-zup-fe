import { render, screen } from '@testing-library/react';
import Step3_Confirm from '../../../component/register/steps/Step3_Confirm';
import { vi, describe, it, expect } from 'vitest';
import type { RegisterFormData, CategoryFeature } from '../../../types/register';

const mockCategory = { id: 'phone1', name: '휴대폰' };
const mockFeatures: CategoryFeature[] = [
  { id: 'q1', question: '색상', options: [] },
  { id: 'q2', question: '브랜드', options: [] },
];

const mockFormData: RegisterFormData = {
  featureAnswers: { q1: '검정', q2: '삼성' },
  building: '대양AI센터',
  locationDetail: '콜라보랩 카운터에 있습니다.',
  description: '분실물 상세 정보 ----',
  storageLocation: '학생회관 401호',
  images: [new File([''], 'image1.png', { type: 'image/png' })],
};

// URL.createObjectURL 모의 처리
window.URL.createObjectURL = vi.fn(() => 'mock-url');

describe('Step3_Confirm', () => {
  it('전달된 모든 확인 정보를 올바르게 렌더링해야 합니다.', () => {
    render(
      <Step3_Confirm
        selectedCategory={mockCategory}
        formData={mockFormData}
        categoryFeatures={mockFeatures}
      />,
    );

    // 카테고리 이름
    expect(screen.getByText(mockCategory.name)).toBeInTheDocument();

    // 이미지
    expect(screen.getByAltText('confirm 0')).toBeInTheDocument();
    expect(screen.getByAltText('confirm 0')).toHaveAttribute('src', 'mock-url');

    // 분실물 특징
    expect(screen.getByText('색상:')).toBeInTheDocument();
    expect(screen.getByText('검정')).toBeInTheDocument();
    expect(screen.getByText('브랜드:')).toBeInTheDocument();
    expect(screen.getByText('삼성')).toBeInTheDocument();

    // 보관 장소
    expect(screen.getByText(mockFormData.storageLocation)).toBeInTheDocument();

    // 위치 정보
    expect(screen.getByText(/건물:/)).toHaveTextContent(`건물: ${mockFormData.building}`);
    expect(screen.getByText(/상세 위치:/)).toHaveTextContent(
      `상세 위치: ${mockFormData.locationDetail}`,
    );

    // 상세 정보
    expect(screen.getByText(mockFormData.description)).toBeInTheDocument();
  });

  it('내용이 없는 필드에 대해 플레이스홀더를 표시해야 합니다.', () => {
    const emptyFormData: RegisterFormData = {
      featureAnswers: {},
      building: '',
      locationDetail: '',
      description: '',
      storageLocation: '',
      images: [],
    };

    render(
      <Step3_Confirm
        selectedCategory={{ id: 'cat2', name: '지갑' }}
        formData={emptyFormData}
        categoryFeatures={mockFeatures}
      />,
    );

    // 카테고리 이름은 선택됨
    expect(screen.getByText('지갑')).toBeInTheDocument();

    // 이미지 없음 처리
    expect(screen.queryByAltText(/confirm/)).not.toBeInTheDocument();

    // 상세 정보 없음 처리
    expect(screen.getByText('입력된 내용이 없습니다.')).toBeInTheDocument();

    // 분실물 특징이 없으므로 질문 텍스트만 표시되지 않음
    Object.values(emptyFormData.featureAnswers).forEach((ans) => {
      expect(screen.queryByText(ans)).not.toBeInTheDocument();
    });
  });
});
