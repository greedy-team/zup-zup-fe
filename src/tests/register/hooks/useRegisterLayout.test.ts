import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach, type Mock } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useRegisterLayout } from '../../../hooks/register/useRegisterLayout';
import { useRegisterProcess } from '../../../hooks/register/useRegisterProcess';

// --- Mocks ---
vi.mock('../../../contexts/AppContexts', () => ({
  SelectedModeContext: React.createContext({
    selectedMode: 'append',
    setSelectedMode: vi.fn(),
  }),
}));

const mockNavigate = vi.fn();
const mockUseLocation = vi.fn();
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  useParams: () => ({ schoolAreaId: '1' }),
  useLocation: () => mockUseLocation(),
}));

vi.mock('../../../hooks/register/useRegisterProcess');

// --- Tests ---
describe('useRegisterLayout 훅 테스트', () => {
  const mockResetForm = vi.fn();
  let mockRegisterProcess: {
    selectedCategory: any;
    isStep2Valid: boolean;
    resetForm: () => void;
  };

  beforeEach(() => {
    // 각 테스트 전에 모의 상태 초기화
    mockRegisterProcess = {
      selectedCategory: null,
      isStep2Valid: false,
      resetForm: mockResetForm,
    };
    (useRegisterProcess as Mock).mockReturnValue(mockRegisterProcess);
    window.alert = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('useRegisterProcess를 올바른 schoolAreaId와 함께 호출해야 한다', () => {
    mockUseLocation.mockReturnValue({ pathname: '/register/1/category' });

    renderHook(() => useRegisterLayout());
    expect(useRegisterProcess).toHaveBeenCalledWith(1);
  });

  it.each([
    ['/register/1/category', 1],
    ['/register/1/details', 2],
    ['/register/1/review', 3],
    ['/register/1', 1], // 기본 경로
  ])('경로가 %s일 때 currentStep은 %i이어야 한다', (pathname, expectedStep) => {
    mockUseLocation.mockReturnValue({ pathname });
    const { result } = renderHook(() => useRegisterLayout());
    expect(result.current.currentStep).toBe(expectedStep);
  });

  describe('goToNextStep 함수 테스트', () => {
    it('1단계: 카테고리가 선택되었으면 details로 이동해야 한다', () => {
      mockUseLocation.mockReturnValue({ pathname: '/register/1/category' });
      mockRegisterProcess.selectedCategory = { id: 1, name: '전자기기' };
      const { result } = renderHook(() => useRegisterLayout());

      act(() => result.current.goToNextStep());

      expect(mockNavigate).toHaveBeenCalledWith(
        { pathname: 'details', search: '?categoryId=1' },
        { replace: true },
      );
    });

    it('1단계: 카테고리가 선택되지 않았으면 alert를 띄우고 이동하지 않아야 한다', () => {
      mockUseLocation.mockReturnValue({ pathname: '/register/1/category' });
      const { result } = renderHook(() => useRegisterLayout());

      act(() => result.current.goToNextStep());

      expect(window.alert).toHaveBeenCalledWith('카테고리를 선택해주세요.');
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('2단계: 폼이 유효하면 review로 이동해야 한다', () => {
      mockUseLocation.mockReturnValue({ pathname: '/register/1/details' });
      mockRegisterProcess.isStep2Valid = true;
      mockRegisterProcess.selectedCategory = { id: 1, name: '전자기기' };
      const { result } = renderHook(() => useRegisterLayout());

      act(() => result.current.goToNextStep());

      expect(mockNavigate).toHaveBeenCalledWith(
        { pathname: 'review', search: '?categoryId=1' },
        { replace: true },
      );
    });

    it('2단계: 폼이 유효하지 않으면 alert를 띄우고 이동하지 않아야 한다', () => {
      mockUseLocation.mockReturnValue({ pathname: '/register/1/details' });
      const { result } = renderHook(() => useRegisterLayout());

      act(() => result.current.goToNextStep());

      expect(window.alert).toHaveBeenCalledWith('모든 필수 정보를 입력해주세요.');
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  describe('goToPrevStep 함수 테스트', () => {
    it('1단계: resetForm을 호출하고 홈으로 이동해야 한다', () => {
      mockUseLocation.mockReturnValue({ pathname: '/register/1/category' });
      const { result } = renderHook(() => useRegisterLayout());

      act(() => result.current.goToPrevStep());

      expect(mockResetForm).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true });
    });

    it('2단계: resetForm을 호출하고 category로 이동해야 한다', () => {
      mockUseLocation.mockReturnValue({ pathname: '/register/1/details' });
      const { result } = renderHook(() => useRegisterLayout());

      act(() => result.current.goToPrevStep());

      expect(mockResetForm).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('category');
    });

    it('3단계: details로 이동해야 한다', () => {
      mockUseLocation.mockReturnValue({ pathname: '/register/1/review' });
      mockRegisterProcess.selectedCategory = { id: 1, name: '전자기기' };
      const { result } = renderHook(() => useRegisterLayout());

      act(() => result.current.goToPrevStep());

      expect(mockNavigate).toHaveBeenCalledWith({
        pathname: 'details',
        search: '?categoryId=1',
      });
    });
  });
});
