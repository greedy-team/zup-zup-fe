import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Step2_DetailForm from '../../../component/register/steps/Step2_DetailForm';
import type { RegisterFormData, Feature, SchoolArea } from '../../../types/register';

describe('Step2_DetailForm 컴포넌트', () => {
  let mockSetFormData: ReturnType<typeof vi.fn>;
  let mockHandleFeatureChange: ReturnType<typeof vi.fn>;

  const mockFeatures: Feature[] = [
    { featureId: 1, featureText: '색상', options: [{ id: 1, text: '검정' }] },
  ];
  const mockSchoolAreas: SchoolArea[] = [{ id: 1, areaName: '학생회관' } as SchoolArea];
  const mockFormData: RegisterFormData = {
    schoolAreaId: 1,
    features: [],
    detailLocation: '',
    description: '',
    storageName: '',
    images: [],
  };

  beforeEach(() => {
    mockSetFormData = vi.fn();
    mockHandleFeatureChange = vi.fn();
  });

  const setup = (overrides = {}) =>
    render(
      <Step2_DetailForm
        isLoading={false}
        formData={mockFormData}
        setFormData={mockSetFormData}
        categoryFeatures={mockFeatures}
        schoolAreas={mockSchoolAreas}
        handleFeatureChange={mockHandleFeatureChange}
        {...overrides}
      />,
    );

  it('선택된 건물 이름이 올바르게 표시되어야 합니다', () => {
    setup();
    expect(screen.getByText('학생회관')).toBeInTheDocument();
  });

  it('입력 필드 변경 시 setFormData가 호출되어야 합니다', () => {
    setup();
    const locationInput = screen.getByLabelText(/상세 위치/);
    fireEvent.change(locationInput, { target: { value: '701호 앞' } });
    expect(mockSetFormData).toHaveBeenCalled();
  });

  it('카테고리 특징 선택 시 handleFeatureChange가 호출되어야 합니다', () => {
    setup();
    const select = screen.getByLabelText('색상');
    fireEvent.change(select, { target: { value: '1' } });
    expect(mockHandleFeatureChange).toHaveBeenCalledWith(1, 1);
  });

  it('로딩 상태일 때 스피너가 표시되어야 합니다', () => {
    setup({ isLoading: true });
    expect(screen.getByText(/카테고리 정보를 불러오는 중/)).toBeInTheDocument();
  });
});
