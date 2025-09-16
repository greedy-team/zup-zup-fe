import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach, type Mock } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';

vi.mock('../../../contexts/AppContexts', () => {
  return {
    SelectedModeContext: React.createContext({
      selectedMode: 'append',
      setSelectedMode: vi.fn(),
    }),
  };
});

// 라우터 mock
const mockNavigate = vi.fn();
const mockUseLocation = vi.fn();
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  useParams: () => ({ schoolAreaId: '1' }),
  useLocation: () => mockUseLocation(),
}));

import { useRegisterLayout } from '../../../hooks/register/useRegisterLayout'; // [변경] 모킹 뒤에 import
import * as api from '../../../api/register';
import { useRegisterProcess } from '../../../hooks/register/useRegisterProcess';

import type { SchoolArea } from '../../../types/register';

vi.mock('../../../api/register');
vi.mock('../../../hooks/register/useRegisterProcess');

describe('useRegisterLayout 훅 테스트', () => {
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
  const mockRegisterProcess = {
    isLoading: false,
    categories: [],
    selectedCategory: null,
  };

  beforeEach(() => {
    vi.spyOn(api, 'fetchSchoolAreas').mockResolvedValue(mockSchoolAreas);
    (useRegisterProcess as Mock).mockReturnValue(mockRegisterProcess);
    mockUseLocation.mockReturnValue({ pathname: '/register/1/category' });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('초기 렌더링 시 학교 구역을 fetch하고 useRegisterProcess를 호출해야 한다', async () => {
    const { result } = renderHook(() => useRegisterLayout());

    await waitFor(() => {
      expect(api.fetchSchoolAreas).toHaveBeenCalledTimes(1);
      expect(result.current.schoolAreas).toEqual(mockSchoolAreas);
    });

    expect(useRegisterProcess).toHaveBeenCalledWith(1);
    expect(result.current.isLoading).toBe(mockRegisterProcess.isLoading);
  });

  it.each([
    [{ pathname: '/register/1/category' }, 1],
    [{ pathname: '/register/1/details' }, 2],
    [{ pathname: '/register/1/review' }, 3],
    [{ pathname: '/register/1' }, 1],
  ])('경로(%s)에 따라 올바른 currentStep(%i)을 계산해야 한다', async (location, expectedStep) => {
    mockUseLocation.mockReturnValue(location);
    const { result } = renderHook(() => useRegisterLayout());
    await waitFor(() => expect(result.current.schoolAreas).not.toBeNull()); // Wait for initial fetch
    expect(result.current.currentStep).toBe(expectedStep);
  });

  it('goToPrevStep이 현재 단계에 따라 올바르게 navigate를 호출해야 한다', async () => {
    // Step 2 -> Step 1
    mockUseLocation.mockReturnValue({ pathname: '/register/1/details' });
    const { result: resultFromStep2 } = renderHook(() => useRegisterLayout());
    await waitFor(() => expect(resultFromStep2.current.schoolAreas).not.toBeNull());
    act(() => {
      resultFromStep2.current.goToPrevStep();
    });
    expect(mockNavigate).toHaveBeenCalledWith('category');

    // Step 3 -> Step 2
    mockUseLocation.mockReturnValue({ pathname: '/register/1/review' });
    const { result: resultFromStep3 } = renderHook(() => useRegisterLayout());
    await waitFor(() => expect(resultFromStep3.current.schoolAreas).not.toBeNull());
    act(() => {
      resultFromStep3.current.goToPrevStep();
    });
    expect(mockNavigate).toHaveBeenCalledWith('details');
  });

  it('첫 단계에서 goToPrevStep을 호출하면 홈으로 이동해야 한다', async () => {
    mockUseLocation.mockReturnValue({ pathname: '/register/1/category' });

    const { result } = renderHook(() => useRegisterLayout());

    // fetchSchoolAreas가 mockSchoolAreas로 resolve된 걸 확실히 기다림
    await waitFor(() => {
      expect(result.current.schoolAreas).toEqual(mockSchoolAreas);
    });

    act(() => {
      result.current.goToPrevStep();
    });

    // 두 번째 인자 { replace: true }까지 함께 검증
    expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true });
  });

  it('goToNextStep이 현재 단계에 따라 올바르게 navigate를 호출해야 한다', async () => {
    window.alert = vi.fn();

    // --- Step 1 -> Step 2 ---
    mockUseLocation.mockReturnValue({ pathname: '/register/1/category' });
    (useRegisterProcess as Mock).mockImplementation(() => ({
      isLoading: false,
      categories: [],
      selectedCategory: { id: 42, name: '휴대폰', iconUrl: 'icons.com' },
    }));

    const { result: r1, unmount: unmount1 } = renderHook(() => useRegisterLayout());

    await waitFor(() => {
      expect(r1.current.schoolAreas).toEqual(mockSchoolAreas);
    });

    act(() => {
      r1.current.goToNextStep();
    });

    // 두 번째 인자 포함해서 검증
    expect(mockNavigate).toHaveBeenCalledWith(
      { pathname: 'details', search: '?categoryId=42' },
      { replace: true },
    );

    mockNavigate.mockClear();
    unmount1();

    // --- Step 2 -> Step 3 ---
    mockUseLocation.mockReturnValue({ pathname: '/register/1/details' });
    (useRegisterProcess as Mock).mockImplementation(() => ({
      isLoading: false,
      categories: [],
      selectedCategory: { id: 99, name: '지갑', iconUrl: 'y' },
    }));

    const { result: r2 } = renderHook(() => useRegisterLayout());

    await waitFor(() => {
      expect(r2.current.schoolAreas).toEqual(mockSchoolAreas);
    });

    act(() => {
      r2.current.goToNextStep();
    });

    expect(mockNavigate).toHaveBeenCalledWith(
      { pathname: 'review', search: '?categoryId=99' },
      { replace: true },
    );
  });
});
