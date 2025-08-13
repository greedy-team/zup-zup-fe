import type { LostItem } from '../main/main/lostListItem';
import { useFindProcess } from '../../hooks/find/useFindProcess';
import { FIND_PROCESS_STEPS } from '../../constants/find';

import ResultModal from './ResultModal';
import ProgressBar from './ProgressBar';
import Step1_ItemInfo from './steps/Step1_ItemInfo';
import Step2_Quiz from './steps/Step2_Quiz';
import Step4_Agreement from './steps/Step4_Agreement';
import CloseIcon from './Icons/CloseIcon';
import SpinnerIcon from './Icons/SpinnerIcon';
import Step3_DetailInfo from './steps/Step3_DetailInfo';

type Props = {
  item: LostItem;
  onClose: () => void;
};

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

  const getButtonText = () => {
    switch (currentStep) {
      case 1:
        return '다음';
      case 2:
        return '정답 확인';
      case 3:
        return '서약 작성하기';
      case 4:
        return '보관 장소 조회하기';
      default:
        return '';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
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
            <>
              {currentStep === 1 && <Step1_ItemInfo item={item} />}
              {currentStep === 2 && (
                <Step2_Quiz
                  quiz={quiz}
                  selectedChoiceId={selectedChoiceId}
                  onSelect={setSelectedChoiceId}
                />
              )}
              {currentStep === 3 && <Step3_DetailInfo item={item} />}
              {currentStep === 4 && <Step4_Agreement agreementRef={agreementRef} />}
            </>
          )}
        </div>

        <div className="mt-8">
          <button
            onClick={handleNextStep}
            className="w-full rounded-lg bg-emerald-600 py-3 text-base font-bold text-white transition hover:bg-emerald-700"
          >
            {getButtonText()}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FindModal;
