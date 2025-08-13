import { useState, useEffect, useRef } from 'react';
import type { LostItem } from '../../component/main/main/lostListItem';
import type { QuizData, ResultModalStatus } from '../../types/find';
import { fetchQuiz } from '../../api/find/quizAPI';
import { PLEDGE_TEXT } from '../../constants/find';

export const useFindProcess = (item: LostItem, onClose: () => void) => {
  // 현재 단계 상태 관리
  const [currentStep, setCurrentStep] = useState(1);

  // 로딩 상태 관리
  const [isLoading, setIsLoading] = useState(false);

  // 퀴즈 데이터 상태 관리
  const [quiz, setQuiz] = useState<QuizData | null>(null);

  // 선택된 정답 ID 상태 관리
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null);

  // 서약 작성용 ref
  const agreementRef = useRef<HTMLInputElement>(null);

  // 결과 모달 상태 관리
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
    if (currentStep === 2 && isValuable) {
      setIsLoading(true);
      fetchQuiz(item.lostItemId)
        .then(setQuiz)
        .finally(() => setIsLoading(false));
    }
  }, [currentStep, isValuable, item.lostItemId]);

  // 1단계 처리
  const handleStep1 = () => {
    setCurrentStep(isValuable ? 2 : 3);
  };

  // 2단계: 퀴즈 제출 처리
  const handleQuizSubmit = () => {
    if (!selectedChoiceId) {
      alert('정답을 선택해주세요.');
      return;
    }

    const isCorrect = selectedChoiceId === quiz?.correctChoiceId;

    if (isCorrect) {
      setResultModal({
        isOpen: true,
        status: 'success',
        title: '정답 일치!',
        message: '인증 퀴즈를 성공적으로 맞히셨습니다.',
        buttonText: '서약 작성하기',
        onConfirm: () => {
          setResultModal((prev) => ({ ...prev, isOpen: false }));
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
          setResultModal((prev) => ({ ...prev, isOpen: false }));
          onClose();
        },
      });
    }
  };

  // 3단계: 서약 입력 처리
  const handleAgreementSubmit = () => {
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
      handleQuizSubmit();
    } else if (currentStep === 3) {
      handleAgreementSubmit();
    } else {
      handleStep1();
    }
  };

  return {
    // States
    currentStep,
    isLoading,
    quiz,
    selectedChoiceId,
    resultModal,
    agreementRef,
    isValuable,

    // Handlers
    handleNextStep,
    setSelectedChoiceId,
  };
};
