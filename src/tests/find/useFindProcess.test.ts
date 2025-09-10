import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useFindProcess } from '../../hooks/find/useFindOutlet';
import * as quizAPI from '../../api/find/quizAPI';
import type { LostItem } from '../../component/main/main/lostListItem';

const mockValuableItem: LostItem = {
  lostItemId: 1,
  categoryName: '지갑',
  foundDate: '2024-08-12T15:00:00.000Z',
  foundLocation: '학생회관',
  status: 'registered',
  categoryId: 'WALLET',
};

const mockNonValuableItem: LostItem = {
  lostItemId: 2,
  categoryName: '기타',
  foundDate: '2024-08-12T15:00:00.000Z',
  foundLocation: '학술정보원',
  status: 'registered',
  categoryId: 'ETC',
};

const mockQuiz = {
  questionId: 'q1',
  question: '분실된 지갑의 색상은 무엇이었나요?',
  choices: [{ id: 'c2', text: '갈색' }],
  correctChoiceId: 'c2',
};

describe('useFindProcess 훅 테스트', () => {
  beforeEach(() => {
    // 각 테스트가 실행되기 전에 API를 모의 처리합니다.
    vi.spyOn(quizAPI, 'fetchQuiz').mockResolvedValue(mockQuiz);
  });

  afterEach(() => {
    // 각 테스트가 끝난 후 모든 모의 객체의 상태를 초기화합니다.
    vi.clearAllMocks();
  });

  it('초기 상태가 올바르게 설정되어야 한다', () => {
    const { result } = renderHook(() => useFindProcess(mockValuableItem, () => {}));
    expect(result.current.currentStep).toBe(1);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.quiz).toBe(null);
  });

  it('귀중품의 경우, 첫 "다음" 버튼 클릭 시 퀴즈를 불러오고 2단계로 이동해야 한다', async () => {
    const { result } = renderHook(() => useFindProcess(mockValuableItem, () => {}));

    await act(async () => {
      result.current.handleNextStep();
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.currentStep).toBe(2);
    expect(result.current.quiz).toEqual(mockQuiz);
    expect(quizAPI.fetchQuiz).toHaveBeenCalledWith(mockValuableItem.lostItemId);
  });

  it('기타 물품의 경우, 첫 "다음" 버튼 클릭 시 3단계(약관 동의)로 바로 이동해야 한다', async () => {
    const { result } = renderHook(() => useFindProcess(mockNonValuableItem, () => {}));

    await act(async () => {
      result.current.handleNextStep();
    });

    expect(result.current.currentStep).toBe(3);
    expect(result.current.quiz).toBe(null);
    expect(quizAPI.fetchQuiz).not.toHaveBeenCalled();
  });

  it('퀴즈 정답을 맞히면, 성공 모달을 띄우고 확인 시 3단계로 이동해야 한다', async () => {
    const { result } = renderHook(() => useFindProcess(mockValuableItem, () => {}));

    await act(async () => result.current.handleNextStep());
    act(() => result.current.setSelectedChoiceId(mockQuiz.correctChoiceId));
    await act(async () => result.current.handleNextStep());

    expect(result.current.resultModal.isOpen).toBe(true);
    expect(result.current.resultModal.status).toBe('success');

    await act(async () => result.current.resultModal.onConfirm());

    expect(result.current.currentStep).toBe(3);
    expect(result.current.resultModal.isOpen).toBe(false);
  });

  it('퀴즈 오답 시, 에러 모달을 띄우고 확인 시 전체 모달을 닫아야 한다', async () => {
    const handleClose = vi.fn();
    const { result } = renderHook(() => useFindProcess(mockValuableItem, handleClose));

    await act(async () => result.current.handleNextStep());
    act(() => result.current.setSelectedChoiceId('wrong-answer'));
    await act(async () => result.current.handleNextStep());

    expect(result.current.resultModal.isOpen).toBe(true);
    expect(result.current.resultModal.status).toBe('error');

    await act(async () => result.current.resultModal.onConfirm());

    expect(handleClose).toHaveBeenCalled();
  });
});
