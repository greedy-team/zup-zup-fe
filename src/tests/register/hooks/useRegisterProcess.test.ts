import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useRegisterProcess } from '../../../hooks/register/useRegisterProcess';
import * as api from '../../../api/register';
import type { Category, Feature } from '../../../types/register';

vi.mock('../../../api/register');

describe('useRegisterProcess 훅 테스트', () => {
  const mockOnClose = vi.fn();
  const mockCategories: Category[] = [{ categoryId: 1, categoryName: 'Phone' }];
  const mockFeatures: Feature[] = [
    { featureId: 1, featureText: 'Color?', options: [{ id: 1, text: 'Red' }] },
  ];

  beforeEach(() => {
    vi.spyOn(api, 'fetchCategories').mockResolvedValue(mockCategories);
    vi.spyOn(api, 'fetchCategoryFeatures').mockResolvedValue(mockFeatures);
    vi.spyOn(api, 'postLostItem').mockResolvedValue({ success: true });
    mockOnClose.mockClear();
  });

  it('초기 상태 및 카테고리 fetch 확인', async () => {
    const { result } = renderHook(() => useRegisterProcess(mockOnClose, 1));
    expect(result.current.currentStep).toBe(1);
    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.categories).toEqual(mockCategories);
      expect(result.current.isLoading).toBe(false);
    });
  });

  it('다음 및 이전 단계로 이동', () => {
    const { result } = renderHook(() => useRegisterProcess(mockOnClose, 1));
    act(() => result.current.goToNextStep());
    expect(result.current.currentStep).toBe(2);
    act(() => result.current.goToPrevStep());
    expect(result.current.currentStep).toBe(1);
  });

  it('카테고리 선택 시 feature fetch', async () => {
    const { result } = renderHook(() => useRegisterProcess(mockOnClose, 1));
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    act(() => {
      result.current.setSelectedCategory(mockCategories[0]);
    });

    await waitFor(() => {
      expect(api.fetchCategoryFeatures).toHaveBeenCalledWith(mockCategories[0].categoryId);
      expect(result.current.categoryFeatures).toEqual(mockFeatures);
    });
  });

  it('handleFeatureChange가 form state를 업데이트해야 함', async () => {
    const { result } = renderHook(() => useRegisterProcess(mockOnClose, 1));
    act(() => {
      result.current.handleFeatureChange(1, 101);
    });
    expect(result.current.formData.features).toEqual([{ featureId: 1, optionId: 101 }]);

    act(() => {
      result.current.handleFeatureChange(1, 102); // 같은 featureId로 다시 호출
    });
    expect(result.current.formData.features).toEqual([{ featureId: 1, optionId: 102 }]);
  });

  it('최종 등록 성공 처리', async () => {
    const { result } = renderHook(() => useRegisterProcess(mockOnClose, 1));

    // 3단계로 이동
    act(() => {
      result.current.goToNextStep();
      result.current.goToNextStep();
    });

    // 카테고리 설정
    act(() => {
      result.current.setSelectedCategory(mockCategories[0]);
    });

    // setSelectedCategory가 유발하는 비동기 작업(feature fetch)이 끝나기를 기다림
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    // 이제 handleRegister 호출
    await act(async () => {
      await result.current.handleRegister();
    });

    // resultModalContent가 생성될 때까지 대기
    await waitFor(() => expect(result.current.resultModalContent).not.toBeNull());

    // 모달 내용 검증
    expect(result.current.resultModalContent?.status).toBe('success');

    // 모달의 확인 버튼 클릭 시뮬레이션
    act(() => {
      result.current.resultModalContent?.onConfirm();
    });

    // 모달이 닫히고 (content가 null로) onClose가 호출되었는지 확인
    expect(result.current.resultModalContent).toBeNull();
    expect(mockOnClose).toHaveBeenCalled();
  });
});
