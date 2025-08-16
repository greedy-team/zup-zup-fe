import { describe, it, expect, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useRegisterProcess } from '../../../hooks/register/useRegisterProcess';
import * as api from '../../../api/register';

vi.mock('../../../api/register');

describe('useRegisterProcess 훅 테스트', () => {
  const mockOnClose = vi.fn();

  it('첫 번째 단계(1단계)로 초기화되어야 합니다', () => {
    const { result } = renderHook(() => useRegisterProcess(mockOnClose));
    expect(result.current.currentStep).toBe(1);
    expect(result.current.selectedCategory).toBeNull();
  });

  it('다음 및 이전 단계로 이동할 수 있어야 합니다', () => {
    const { result } = renderHook(() => useRegisterProcess(mockOnClose));

    act(() => result.current.goToNextStep());
    expect(result.current.currentStep).toBe(2);

    act(() => result.current.goToPrevStep());
    expect(result.current.currentStep).toBe(1);
  });

  it('카테고리 선택 시, 관련 특징 데이터를 API로 가져와야 합니다', async () => {
    const mockFeatures = [{ id: 'q1', question: 'Color?', options: ['Red'] }];
    vi.spyOn(api, 'fetchCategoryFeatures').mockResolvedValue(mockFeatures);

    const { result } = renderHook(() => useRegisterProcess(mockOnClose));

    await act(async () => {
      result.current.setSelectedCategory({ id: 'cat1', name: 'Phone' });
    });

    await waitFor(() => {
      expect(result.current.categoryFeatures).toEqual(mockFeatures);
      expect(result.current.isLoading).toBe(false);
    });
  });

  it('최종 등록을 성공적으로 처리해야 합니다', async () => {
    vi.spyOn(api, 'postLostItem').mockResolvedValue({ success: true });

    const { result } = renderHook(() => useRegisterProcess(mockOnClose));

    act(() => {
      result.current.goToNextStep(); // 2단계로 이동
      result.current.goToNextStep(); // 3단계로 이동
    });

    await act(async () => {
      result.current.handleRegister();
    });

    // resultModal가 업데이트 될 때까지 기다림
    await waitFor(() => expect(result.current.resultModal.isOpen).toBe(true));

    // onConfirm 호출
    act(() => {
      result.current.resultModal.onConfirm?.();
    });

    expect(mockOnClose).toHaveBeenCalled();
  });
});
