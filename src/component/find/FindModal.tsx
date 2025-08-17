import { useMemo } from 'react';
import type { LostItemListItem } from '../../types/lost/lostApi';
import { useFindProcess } from '../../hooks/find/useFindProcess';
import { FIND_PROCESS_STEPS } from '../../constants/find';
import ResultModal from '../common/ResultModal';
import ProgressBar from '../common/ProgressBar';
import Step1_ItemInfo from './steps/Step1_ItemInfo';
import Step2_Quiz from './steps/Step2_Quiz';
import Step4_Agreement from './steps/Step4_Agreement';
import CloseIcon from '../common/Icons/CloseIcon';
import SpinnerIcon from '../common/Icons/SpinnerIcon';
import Step3_DetailInfo from './steps/Step3_DetailInfo';

type Props = {
  item: LostItemListItem;
  onClose: () => void;
};

type StepKey = 'ITEM' | 'QUIZ' | 'DETAIL' | 'AGREE';

const FindModal = ({ item, onClose }: Props) => {
  const {
    currentStep,
    isLoading,
    quiz,
    selectedChoiceId,
    resultModal,
    agreementRef,
    isValuable,
    handleNextStep,
    setSelectedChoiceId,
  } = useFindProcess(item, onClose);

  const steps = isValuable ? FIND_PROCESS_STEPS.VALUABLE : FIND_PROCESS_STEPS.NON_VALUABLE;

  const flow: StepKey[] = useMemo(
    () => (isValuable ? ['ITEM', 'QUIZ', 'DETAIL', 'AGREE'] : ['ITEM', 'DETAIL', 'AGREE']),
    [isValuable],
  );

  const safeIndex = Math.max(0, Math.min(currentStep - 1, flow.length - 1));
  const stepKey = flow[safeIndex];

  const renderStep = () => {
    switch (stepKey) {
      case 'ITEM':
        return <Step1_ItemInfo item={item} />;
      case 'QUIZ':
        return (
          <Step2_Quiz
            quiz={quiz}
            selectedChoiceId={selectedChoiceId}
            onSelect={setSelectedChoiceId}
          />
        );
      case 'DETAIL':
        return <Step3_DetailInfo item={item} />;
      case 'AGREE':
        return <Step4_Agreement agreementRef={agreementRef} onEnter={handleNextStep} />;
      default:
        return null;
    }
  };

  const getButtonText = () => {
    switch (stepKey) {
      case 'ITEM':
        return '다음';
      case 'QUIZ':
        return '정답 확인';
      case 'DETAIL':
        return '서약 작성하기';
      case 'AGREE':
        return '보관 장소 조회하기';
      default:
        return '';
    }
  };

  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as Element).id === 'modal-overlay') onClose();
  };

  return (
    <div
      id="modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={handleOutsideClick}
    >
      {resultModal.isOpen && <ResultModal {...resultModal} />}

      <div className="relative w-full max-w-2xl rounded-2xl bg-white p-8 shadow-xl">
        <button
          onClick={onClose}
          aria-label="close"
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <CloseIcon className="h-6 w-6" />
        </button>

        <h1 className="text-center text-2xl font-bold text-gray-800">분실물 찾기</h1>
        <ProgressBar steps={steps} currentStep={currentStep} />

        <div className="mt-8 min-h-[300px]">
          {isLoading ? (
            <div className="flex h-full items-center justify-center">
              <SpinnerIcon />
            </div>
          ) : (
            renderStep()
          )}
        </div>

        <div className="mt-8">
          <button
            onClick={handleNextStep}
            className="w-full rounded-lg bg-teal-500 py-3 text-base font-bold text-white transition hover:bg-teal-600"
          >
            {getButtonText()}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FindModal;
