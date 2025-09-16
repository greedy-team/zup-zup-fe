import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import * as api from '../../../api/register';
import type { Category, Feature, SchoolArea } from '../../../types/register';
import { useRegisterProcess } from '../../../hooks/register/useRegisterProcess';

// 라우터 mock 핸들러들
const mockNavigate = vi.fn();
const mockUseLocation = vi.fn();
const mockUseSearchParams = vi.fn();

// 기본값: /register/category, 쿼리 없음
mockUseLocation.mockReturnValue({ pathname: '/register/category' });
mockUseSearchParams.mockReturnValue([new URLSearchParams(), vi.fn()]);

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  useParams: () => ({ schoolAreaId: '1' }),
  useLocation: () => mockUseLocation(),
  useSearchParams: () => mockUseSearchParams(),
}));

// API 모듈 모의 설정
vi.mock('../../../api/register');

vi.mock('../../../contexts/AppContexts', () => {
  return {
    SelectedModeContext: React.createContext({
      selectedMode: 'append',
      setSelectedMode: vi.fn(),
    }),
  };
});

describe('useRegisterProcess 훅 테스트', () => {
  const mockCategories: Category[] = [
    {
      id: 1,
      name: '휴대폰',
      iconUrl: 'https://img.icons8.com/?size=100&id=79&format=png&color=000000',
    },
  ];
  const mockFeatures: Feature[] = [
    {
      id: 1,
      name: '색상',
      quizQuestion: '다음 중 분실물의 색상으로 가장 적절한 것은 무엇인가요?',
      options: [
        { id: 1, optionValue: '빨강' },
        { id: 2, optionValue: '파랑' },
      ],
    },
  ];
  const mockSchoolAreas: SchoolArea[] = [
    {
      id: 1,
      areaName: '집현관',
      areaPolygon: {
        coordinates: [
          { lat: 37.549313, lng: 127.0741179 },
          { lat: 37.5493215, lng: 127.0733401 },
          { lat: 37.5484602, lng: 127.0732891 },
          { lat: 37.548439, lng: 127.0740777 },
          { lat: 37.549313, lng: 127.0741179 },
        ],
      },
      marker: { lat: 37.5490786, lng: 127.0735303 },
    },
  ];

  beforeEach(() => {
    // 기본 라우트 상황: category 화면, 쿼리 없음
    mockUseLocation.mockReturnValue({ pathname: '/register/1/category' });
    mockUseSearchParams.mockReturnValue([new URLSearchParams(), vi.fn()]);

    vi.spyOn(api, 'fetchCategories').mockResolvedValue(mockCategories);
    vi.spyOn(api, 'fetchCategoryFeatures').mockResolvedValue(mockFeatures);
    vi.spyOn(api, 'postLostItem').mockResolvedValue({ success: false });
    vi.spyOn(api, 'fetchSchoolAreas').mockResolvedValue(mockSchoolAreas);
  });

  afterEach(() => {
    vi.clearAllMocks(); // 각 테스트 후 모든 모의 초기화
  });

  it('초기 렌더링 시 카테고리와 학교 구역을 fetch해야 한다', async () => {
    const { result } = renderHook(() => useRegisterProcess());

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(api.fetchCategories).toHaveBeenCalledTimes(1);
      expect(api.fetchSchoolAreas).toHaveBeenCalledTimes(1);
      expect(result.current.categories).toEqual(mockCategories);
      expect(result.current.isLoading).toBe(false);
    });
  });

  it('유효하지 않은 schoolAreaId일 경우 홈으로 리다이렉트해야 한다', async () => {
    vi.spyOn(api, 'fetchSchoolAreas').mockResolvedValue([
      {
        id: 3,
        areaName: '모짜르트홀',
        areaPolygon: {
          coordinates: [
            { lat: 37.5484411, lng: 127.0739704 },
            { lat: 37.5481136, lng: 127.073949 },
            { lat: 37.5481072, lng: 127.0741796 },
            { lat: 37.5484351, lng: 127.074193 },
            { lat: 37.5484411, lng: 127.0739704 },
          ],
        },
        marker: { lat: 37.548313, lng: 127.0740775 },
      },
    ]);
    renderHook(() => useRegisterProcess());

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  it('details 진입 + categoryId 쿼리가 있으면 해당 카테고리의 특징을 fetch한다', async () => {
    // 경로를 details로, 쿼리에 categoryId=1 셋업
    mockUseLocation.mockReturnValue({ pathname: '/register/details' });
    mockUseSearchParams.mockReturnValue([new URLSearchParams('categoryId=1'), vi.fn()]);

    const { result } = renderHook(() => useRegisterProcess());

    // 초기 카테고리 fetch 끝날 때까지 대기
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    // details 진입 이펙트로 특징 fetch가 호출되는지 확인
    await waitFor(() => {
      expect(api.fetchCategoryFeatures).toHaveBeenCalledWith(1);
      expect(result.current.categoryFeatures).toEqual(mockFeatures);
    });
  });

  it('handleFeatureChange가 formData의 featureOptions를 올바르게 업데이트해야 한다', async () => {
    const { result } = renderHook(() => useRegisterProcess());
    await waitFor(() => expect(result.current.isLoading).toBe(false)); // 초기 로딩 완료 대기

    act(() => {
      result.current.handleFeatureChange(1, 1); // featureId: 1, optionId: 1
    });
    expect(result.current.formData.featureOptions).toEqual([{ featureId: 1, optionId: 1 }]);

    act(() => {
      result.current.handleFeatureChange(1, 2); // 같은 featureId, 다른 optionId
    });
    expect(result.current.formData.featureOptions).toEqual([{ featureId: 1, optionId: 2 }]);
  });

  it('isStep2Valid가 모든 조건 충족 시 true를 반환해야 한다', async () => {
    mockUseLocation.mockReturnValue({ pathname: '/register/1/details' });
    mockUseSearchParams.mockReturnValue([new URLSearchParams('categoryId=1'), vi.fn()]);

    const { result } = renderHook(() => useRegisterProcess());

    // 특징 로딩까지 대기
    await waitFor(() => expect(result.current.categoryFeatures).toHaveLength(mockFeatures.length));

    expect(result.current.isStep2Valid).toBe(false);

    // 폼 데이터 채우기
    act(() => {
      result.current.setFormData((prev) => ({
        ...prev,
        foundAreaId: 1,
        foundAreaDetail: '정문 앞',
        depositArea: '학생회관',
        images: [new File([''], 'test.jpg')],
        imageOrder: [0],
        featureOptions: [{ featureId: 1, optionId: 1 }],
      }));
    });

    expect(result.current.isStep2Valid).toBe(true);
  });

  it('handleRegister 호출 시 성공적으로 등록하고 성공 모달을 표시해야 한다', async () => {
    const { result } = renderHook(() => useRegisterProcess());
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    // 등록에 필요한 상태 설정
    act(() => {
      result.current.setSelectedCategory(mockCategories[0]);
      result.current.setFormData({
        foundAreaId: 1,
        foundAreaDetail: '정문 앞',
        depositArea: '학생회관',
        featureOptions: [{ featureId: 1, optionId: 1 }],
        description: '테스트 설명',
        images: [new File([''], 'test.jpg')],
        imageOrder: [0],
      });
    });

    await act(async () => {
      await result.current.handleRegister();
    });

    await waitFor(() => {
      expect(api.postLostItem).toHaveBeenCalled();
      expect(result.current.resultModalContent).not.toBeNull();
      expect(result.current.resultModalContent?.status).toBe('success');
    });

    // 성공 모달의 확인 버튼 클릭 시뮬레이션
    act(() => {
      result.current.resultModalContent?.onConfirm();
    });

    expect(result.current.resultModalContent).toBeNull();
    expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true });
  });

  it('handleRegister 호출 시 실패하면 에러 모달을 표시해야 한다', async () => {
    const errorMessage = '등록에 실패했습니다.';
    vi.spyOn(api, 'postLostItem').mockRejectedValue(new Error(errorMessage));
    const { result } = renderHook(() => useRegisterProcess());
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    act(() => {
      result.current.setSelectedCategory(mockCategories[0]);
      result.current.setFormData({
        foundAreaId: 1,
        foundAreaDetail: '정문 앞',
        depositArea: '학생회관',
        featureOptions: [{ featureId: 1, optionId: 1 }],
        description: '테스트 설명',
        images: [new File([''], 'test.jpg')],
        imageOrder: [0],
      });
    });

    await act(async () => {
      await result.current.handleRegister();
    });

    await waitFor(() => {
      expect(result.current.resultModalContent).not.toBeNull();
      expect(result.current.resultModalContent?.status).toBe('error');
      expect(result.current.resultModalContent?.message).toBe(errorMessage);
    });

    // 에러 모달의 확인 버튼 클릭 시뮬레이션
    act(() => {
      result.current.resultModalContent?.onConfirm();
    });

    expect(result.current.resultModalContent).toBeNull();
  });
});
