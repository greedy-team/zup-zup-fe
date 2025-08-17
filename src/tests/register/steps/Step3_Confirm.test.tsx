import { render, screen } from '@testing-library/react';
import Step3_Confirm from '../../../component/register/steps/Step3_Confirm';
import { vi, describe, it, expect } from 'vitest';
import type { RegisterFormData, Category, Feature, SchoolArea } from '../../../types/register';

const mockCategory: Category = { categoryId: 1, categoryName: '휴대폰' };
const mockFeatures: Feature[] = [
  { featureId: 1, featureText: '색상', options: [{ id: 101, text: '검정' }] },
  { featureId: 2, featureText: '브랜드', options: [{ id: 201, text: '삼성' }] },
];
const mockSchoolAreas: SchoolArea[] = [{ id: 1, areaName: '학생회관' } as SchoolArea];
const mockFormData: RegisterFormData = {
  schoolAreaId: 1,
  features: [
    { featureId: 1, optionId: 101 },
    { featureId: 2, optionId: 201 },
  ],
  detailLocation: '콜라보랩 카운터',
  description: '분실물입니다. 잘 부탁드립니다.',
  storageName: '학생회관 401호',
  images: [new File([''], 'image1.png', { type: 'image/png' })],
};

window.URL.createObjectURL = vi.fn(() => 'mock-url');

describe('Step3_Confirm', () => {
  it('전달된 모든 확인 정보를 올바르게 렌더링해야 합니다.', () => {
    render(
      <Step3_Confirm
        selectedCategory={mockCategory}
        formData={mockFormData}
        categoryFeatures={mockFeatures}
        schoolAreas={mockSchoolAreas}
      />,
    );

    // 카테고리, 건물, 보관장소, 상세위치, 상세정보
    expect(screen.getByText(mockCategory.categoryName)).toBeInTheDocument();
    expect(screen.getByText('학생회관')).toBeInTheDocument();
    expect(screen.getByText(mockFormData.storageName)).toBeInTheDocument();
    expect(screen.getByText(mockFormData.detailLocation)).toBeInTheDocument();
    expect(screen.getByText(mockFormData.description)).toBeInTheDocument();

    // 이미지
    expect(screen.getByAltText('confirm 0')).toHaveAttribute('src', 'mock-url');

    // 분실물 특징
    expect(screen.getByText('색상:')).toBeInTheDocument();
    expect(screen.getByText('검정')).toBeInTheDocument();
    expect(screen.getByText('브랜드:')).toBeInTheDocument();
    expect(screen.getByText('삼성')).toBeInTheDocument();
  });
});
