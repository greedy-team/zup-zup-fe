import { useState, useEffect, useRef } from 'react';
import type { LostItem } from '../../component/main/main/lostListItem';
import type { QuizData, ResultModalStatus } from '../../types/find';
import { fetchQuiz } from '../../api/find/quizAPI';
import { PLEDGE_TEXT } from '../../constants/find';

export const useFindProcess = (item: LostItem, onClose: () => void) => {
  const [currentStep, setCurrentStep] = useState(1);

  const [isLoading, setIsLoading] = useState(false);

  const [quiz, setQuiz] = useState<QuizData | null>(null);

  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null);

  const agreementRef = useRef<HTMLInputElement>(null);

  const [resultModal, setResultModal] = useState({
    isOpen: false,
    status: 'success' as ResultModalStatus,
    title: '',
    message: '',
    buttonText: '',
    onConfirm: () => {},
  });

  const isValuable = item.categoryName !== '기타';

  useEffect(() => {
    setCurrentStep((prev) => Math.min(prev, isValuable ? 4 : 3));
  }, [isValuable]);

  useEffect(() => {
    if (currentStep === 2 && isValuable) {
      setIsLoading(true);
      fetchQuiz(item.lostItemId)
        .then(setQuiz)
        .finally(() => setIsLoading(false));
    }
  }, [currentStep, isValuable, item.lostItemId]);

  const handleStep1 = () => {
    setCurrentStep(2);
  };

  const handleStep2 = () => {
    if (!selectedChoiceId) alert('정답을 선택해주세요.');

    const isCorrect = selectedChoiceId === quiz?.correctChoiceId;
    setResultModal({
      isOpen: true,
      status: isCorrect ? 'success' : 'error',
      title: isCorrect ? '정답 일치!' : '오답!',
      message: isCorrect
        ? '인증 퀴즈를 성공적으로 맞히셨습니다.'
        : '인증 퀴즈를 풀지 못하셨습니다. 위 분실물을 더 이상 찾을 수 없습니다.',
      buttonText: isCorrect ? '상세 정보 확인하기' : '홈으로',
      onConfirm: () => {
        setResultModal((prev) => ({ ...prev, isOpen: false }));
        if (isCorrect) setCurrentStep(3);
        else onClose();
      },
    });
  };

  const handleStep3 = () => {
    setCurrentStep(isValuable ? 4 : 3);
  };

  const handleStep4 = () => {
    const userInput = agreementRef.current?.value.trim() || '';
    if (userInput !== PLEDGE_TEXT) {
      alert('서약 문구를 정확히 입력해주세요.');
      return;
    }

    setResultModal({
      isOpen: true,
      status: 'info',
      title: '보관 장소 안내',
      message: '해당 분실물은 [학생회관 401호]에 보관 중입니다.',
      buttonText: '확인',
      onConfirm: () => {
        setResultModal((prev) => ({ ...prev, isOpen: false }));
        onClose();
      },
    });
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      handleStep1();
    } else if (currentStep === 2) {
      if (isValuable) {
        handleStep2();
      } else {
        handleStep3();
      }
    } else if (currentStep === 3) {
      if (isValuable) {
        handleStep3();
      } else {
        handleStep4();
      }
    } else if (currentStep === 4) {
      handleStep4();
    } else {
      handleStep1();
    }
  };

  return {
    currentStep,
    isLoading,
    quiz,
    selectedChoiceId,
    resultModal,
    agreementRef,
    isValuable,

    handleNextStep,
    setSelectedChoiceId,
  };
};
