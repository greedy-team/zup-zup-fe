import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach, type Mock } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useRegisterProcess } from '../../../hooks/register/useRegisterProcess';
import * as api from '../../../api/register';

// 하위 훅들 모의 처리
vi.mock('../../../hooks/register/useRegisterRouter');
vi.mock('../../../hooks/register/useRegisterData');
vi.mock('../../../hooks/register/useRegisterState');
vi.mock('../../../api/register');

import { useRegisterRouter } from '../../../hooks/register/useRegisterRouter';
import { useRegisterData } from '../../../hooks/register/useRegisterData';
import { useRegisterState } from '../../../hooks/register/useRegisterState';
import type { Category, Feature, SchoolArea } from '../../../types/register';

// Context 모의 처리
vi.mock('../../../contexts/AppContexts', () => ({
  SelectedModeContext: React.createContext({
    selectedMode: 'append',
    setSelectedMode: vi.fn(),
  }),
}));

describe('useRegisterProcess 훅 조합 테스트', () => {
  // Mock 데이터
  const mockCategories: Category[] = [{ id: 1, name: '휴대폰', iconUrl: 'url' }];
  const mockFeatures: Feature[] = [{ id: 1, name: '색상', quizQuestion: '색?', options: [] }];
  const mockCategoryIdFromQuery = vi.fn<() => number | null>(() => null);
  const mockValidSchoolAreaId = vi.fn<() => number | null>(() => 1);
  const mockSchoolAreas: SchoolArea[] = [
    { id: 1, areaName: '집현관', marker: { lat: 0, lng: 0 }, areaPolygon: { coordinates: [] } },
  ];

  // Mock 함수
  const mockNavigate = vi.fn();
  const mockResetForm = vi.fn();

  // 기본 Mock 반환 값
  const defaultRouterMock = {
    navigate: mockNavigate,
    isDetailsRoute: false,
    categoryIdFromQuery: mockCategoryIdFromQuery,
    validSchoolAreaId: mockValidSchoolAreaId,
  };
  const defaultDataMock = {
    isLoading: false,
    categories: mockCategories,
    categoryFeatures: [],
  };
  const defaultStateMock = {
    formData: {
      foundAreaId: 1,
      foundAreaDetail: '',
      depositArea: '',
      featureOptions: [],
      images: [],
      imageOrder: [],
      description: '',
    },
    resetForm: mockResetForm,
  };

  beforeEach(() => {
    (useRegisterRouter as Mock).mockReturnValue(defaultRouterMock);
    (useRegisterData as Mock).mockReturnValue(defaultDataMock);
    (useRegisterState as Mock).mockReturnValue(defaultStateMock);
    vi.spyOn(api, 'fetchSchoolAreas').mockResolvedValue(mockSchoolAreas);
    vi.spyOn(api, 'postLostItem').mockResolvedValue({ success: true });

    mockCategoryIdFromQuery.mockClear();
    mockValidSchoolAreaId.mockClear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('초기 렌더링 시 schoolAreas를 fetch하고 유효성을 검증해야 한다', async () => {
    renderHook(() => useRegisterProcess());
    await waitFor(() => {
      expect(api.fetchSchoolAreas).toHaveBeenCalled();
    });
  });

  it('categoryIdFromQuery와 categories가 있으면 selectedCategory를 설정해야 한다', async () => {
    (useRegisterRouter as Mock).mockReturnValue({
      ...defaultRouterMock,
      categoryIdFromQuery: vi.fn().mockReturnValue(1),
    });

    const { result } = renderHook(() => useRegisterProcess());

    await waitFor(() => {
      expect(result.current.selectedCategory).toEqual(mockCategories[0]);
    });
  });

  it('isStep2Valid가 모든 조건 충족 시 true를 반환해야 한다', async () => {
    (useRegisterData as Mock).mockReturnValue({
      ...defaultDataMock,
      categoryFeatures: mockFeatures,
    });
    (useRegisterState as Mock).mockReturnValue({
      ...defaultStateMock,
      formData: {
        ...defaultStateMock.formData,
        foundAreaDetail: '1층',
        depositArea: '학생회관',
        images: [new File([''], 'test.png')],
        featureOptions: [{ featureId: 1, optionId: 1 }],
      },
    });

    const { result } = renderHook(() => useRegisterProcess());

    await waitFor(() => {
      expect(result.current.isStep2Valid).toBe(true);
    });
  });

  it('handleRegister가 성공하면 resetForm을 호출하고 성공 모달을 표시해야 한다', async () => {
    const { result } = renderHook(() => useRegisterProcess());

    // 등록에 필요한 상태 설정
    act(() => {
      result.current.setSelectedCategory(mockCategories[0]);
    });

    await act(async () => {
      await result.current.handleRegister();
    });

    expect(api.postLostItem).toHaveBeenCalled();
    expect(mockResetForm).toHaveBeenCalled();
    expect(result.current.resultModalContent?.status).toBe('success');
  });

  it('handleRegister가 실패하면 resetForm을 호출하고 에러 모달을 표시해야 한다', async () => {
    vi.spyOn(api, 'postLostItem').mockRejectedValue(new Error('실패'));
    const { result } = renderHook(() => useRegisterProcess());

    act(() => {
      result.current.setSelectedCategory(mockCategories[0]);
    });

    await act(async () => {
      await result.current.handleRegister();
    });

    expect(mockResetForm).toHaveBeenCalled();
    expect(result.current.resultModalContent?.status).toBe('error');
  });
});
