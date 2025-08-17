import { useEffect, useRef, useState } from 'react';
import type { LostItemListItem } from '../../types/lost/lostApi';
import type { QuizItem, QuizSubmitBody, QuizResult, ResultModalStatus } from '../../types/find';
import { getQuiz, submitQuiz, postPledge, getPublicDetail } from '../../apis/find/findApi';
import { PLEDGE_TEXT } from '../../constants/find';

export const useFindProcess = (item: LostItemListItem, onClose: () => void) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const [quiz, setQuiz] = useState<QuizItem[] | null>(null);

  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});

  const [detail, setDetail] = useState<{ imageUrl: string; description?: string | null } | null>(
    null,
  );

  const agreementRef = useRef<HTMLInputElement>(null);

  const [resultModal, setResultModal] = useState({
    isOpen: false,
    status: 'success' as ResultModalStatus,
    title: '',
    message: '',
    buttonText: '',
    onConfirm: () => {},
  });

  const isValuable = item.categoryId !== 99;

  useEffect(() => {
    setCurrentStep((prev) => Math.min(prev, isValuable ? 4 : 3));
  }, [isValuable]);

  useEffect(() => {
    if (currentStep === 2 && isValuable) {
      setIsLoading(true);
      getQuiz(item.lostItemId)
        .then((items) => {
          setQuiz(items);
          setSelectedAnswers({});
        })
        .finally(() => setIsLoading(false));
    }
  }, [currentStep, isValuable, item.lostItemId]);

  useEffect(() => {
    if (!isValuable && currentStep === 2) {
      setIsLoading(true);
      getPublicDetail(item.lostItemId)
        .then((res) => {
          if ('error' in res) {
            if (res.error === 'Forbidden') {
              setResultModal({
                isOpen: true,
                status: 'error',
                title: '접근 불가',
                message: '이 분실물은 퀴즈 검증이 필요합니다.',
                buttonText: '확인',
                onConfirm: () => setResultModal((p) => ({ ...p, isOpen: false })),
              });
              return;
            }
            if (res.error === 'Not Found') {
              setResultModal({
                isOpen: true,
                status: 'error',
                title: '분실물을 찾을 수 없습니다',
                message: '이미 처리되었거나 존재하지 않습니다.',
                buttonText: '닫기',
                onConfirm: () => {
                  setResultModal((p) => ({ ...p, isOpen: false }));
                  onClose();
                },
              });
              return;
            }
          } else {
            setDetail(res);
          }
        })
        .finally(() => setIsLoading(false));
    }
  }, [isValuable, currentStep, item.lostItemId, onClose]);

  const handleStep1 = () => setCurrentStep(2);

  const handleStep2 = async () => {
    if (!quiz || quiz.length === 0) {
      alert('퀴즈를 불러오지 못했습니다.');
      return;
    }
    const unanswered = quiz.filter((q) => selectedAnswers[q.featureId] == null);
    if (unanswered.length > 0) {
      alert('모든 문항에 답변을 선택해주세요.');
      return;
    }

    setIsLoading(true);
    const body: QuizSubmitBody = {
      answers: quiz.map((q) => ({
        featureId: q.featureId,
        selectedOptionId: selectedAnswers[q.featureId],
      })),
    };

    try {
      const result: QuizResult = await submitQuiz(item.lostItemId, body);
      if (result.correct) {
        setDetail(result.detail);
        setResultModal({
          isOpen: true,
          status: 'success',
          title: '정답 일치!',
          message: '인증 퀴즈를 성공적으로 맞히셨습니다.',
          buttonText: '상세 정보 확인하기',
          onConfirm: () => {
            setResultModal((p) => ({ ...p, isOpen: false }));
            setCurrentStep(3);
          },
        });
      } else {
        setResultModal({
          isOpen: true,
          status: 'error',
          title: '오답!',
          message: '인증 퀴즈를 풀지 못하셨습니다. 위 분실물을 더 이상 찾을 수 없습니다.',
          buttonText: '홈으로',
          onConfirm: () => {
            setResultModal((p) => ({ ...p, isOpen: false }));
            onClose();
          },
        });
      }
    } catch {
      setResultModal({
        isOpen: true,
        status: 'error',
        title: '오류',
        message: '퀴즈 검증 중 문제가 발생했습니다.',
        buttonText: '닫기',
        onConfirm: () => setResultModal((p) => ({ ...p, isOpen: false })),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStep3 = () => setCurrentStep(isValuable ? 4 : 3);

  const handleStep4 = async () => {
    const userInput = agreementRef.current?.value.trim() || '';
    if (userInput !== PLEDGE_TEXT) {
      alert('서약 문구를 정확히 입력해주세요.');
      return;
    }

    setIsLoading(true);
    try {
      const { storageName } = await postPledge(item.lostItemId);
      setResultModal({
        isOpen: true,
        status: 'info',
        title: '보관 장소 안내',
        message: `해당 분실물은 [${storageName}]에 보관 중입니다.`,
        buttonText: '확인',
        onConfirm: () => {
          setResultModal((prev) => ({ ...prev, isOpen: false }));
          onClose();
        },
      });
    } catch (e: any) {
      if (e?.code === 409) {
        setResultModal({
          isOpen: true,
          status: 'error',
          title: '상태 전이 불가',
          message: '이미 처리된 분실물입니다.',
          buttonText: '닫기',
          onConfirm: () => setResultModal((p) => ({ ...p, isOpen: false })),
        });
      } else if (e?.code === 404) {
        setResultModal({
          isOpen: true,
          status: 'error',
          title: '분실물을 찾을 수 없습니다',
          message: '이미 처리되었거나 존재하지 않습니다.',
          buttonText: '닫기',
          onConfirm: () => {
            setResultModal((p) => ({ ...p, isOpen: false }));
            onClose();
          },
        });
      } else {
        setResultModal({
          isOpen: true,
          status: 'error',
          title: '오류',
          message: '서약 처리 중 문제가 발생했습니다.',
          buttonText: '닫기',
          onConfirm: () => setResultModal((p) => ({ ...p, isOpen: false })),
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextStep = () => {
    if (currentStep === 1) handleStep1();
    else if (currentStep === 2) {
      if (isValuable) handleStep2();
      else handleStep3();
    } else if (currentStep === 3) {
      if (isValuable) handleStep3();
      else handleStep4();
    } else if (currentStep === 4) handleStep4();
    else handleStep1();
  };

  return {
    currentStep,
    isLoading,
    quiz,
    selectedAnswers,
    resultModal,
    agreementRef,
    isValuable,
    detail,

    handleNextStep,
    setSelectedAnswers,
  };
};
