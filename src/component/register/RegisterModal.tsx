import { useRegisterProcess } from '../../hooks/register/useRegisterProcess';
import { REGISTER_PROCESS_STEPS } from '../../constants/register';

import ProgressBar from '../common/ProgressBar';
import ResultModal from '../common/ResultModal';
import Step1_CategorySelect from './steps/Step1_CategorySelect';
import Step2_DetailForm from './steps/Step2_DetailForm';
import Step3_Confirm from './steps/Step3_Confirm';
import CloseIcon from '../common/Icons/CloseIcon';
import SpinnerIcon from '../common/Icons/SpinnerIcon';

type Props = {
  onClose: () => void;
};

const RegisterModal = ({ onClose }: Props) => {
  // 등록 프로세스의 모든 로직을 담고 있는 커스텀 훅
  const {
    currentStep,
    isLoading,
    selectedCategory,
    categoryFeatures,
    formData,
    isStep2Valid,
    resultModal,
    goToNextStep,
    goToPrevStep,
    setSelectedCategory,
    setFormData,
    handleRegister,
  } = useRegisterProcess(onClose);

  const steps = REGISTER_PROCESS_STEPS.STEPS;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      {resultModal.isOpen && <ResultModal {...resultModal} />}

      <div className="relative flex h-[90vh] w-full max-w-4xl flex-col rounded-2xl bg-white p-8 shadow-xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:cursor-pointer hover:text-gray-600"
        >
          <CloseIcon className="h-6 w-6" />
        </button>

        <h1 className="text-center text-2xl font-bold text-gray-800">분실물 등록</h1>
        <ProgressBar steps={steps} currentStep={currentStep} />

        <div className="flex-grow overflow-y-auto pr-2">
          {currentStep === 1 && (
            <Step1_CategorySelect
              selectedCategory={selectedCategory}
              onSelect={setSelectedCategory}
            />
          )}
          {currentStep === 2 && (
            <Step2_DetailForm
              isLoading={isLoading}
              formData={formData}
              setFormData={setFormData}
              categoryFeatures={categoryFeatures}
            />
          )}
          {currentStep === 3 && (
            <Step3_Confirm
              selectedCategory={selectedCategory}
              formData={formData}
              categoryFeatures={categoryFeatures}
            />
          )}
        </div>

        <div className="mt-auto flex items-center justify-between border-t pt-6">
          <div>
            {/* 1단계에서는 '이전' 버튼 숨김 */}
            {currentStep > 1 && (
              <button
                onClick={goToPrevStep}
                className="rounded-lg bg-gray-200 px-6 py-3 font-bold text-gray-700 hover:cursor-pointer hover:bg-gray-300"
              >
                이전
              </button>
            )}
          </div>
          <div>
            {/* 마지막 단계가 아닐 경우 '다음' 버튼 표시 */}
            {currentStep < steps.length ? (
              <button
                onClick={goToNextStep}
                disabled={
                  (currentStep === 1 && !selectedCategory) || (currentStep === 2 && !isStep2Valid)
                }
                className="rounded-lg bg-teal-500 px-6 py-3 font-bold text-white hover:cursor-pointer hover:bg-teal-600 disabled:cursor-not-allowed disabled:bg-gray-300"
              >
                다음
              </button>
            ) : (
              // 마지막 단계일 경우 '등록하기' 버튼 표시
              <button
                onClick={handleRegister}
                disabled={isLoading}
                className="rounded-lg bg-teal-500 px-6 py-3 font-bold text-white hover:cursor-pointer hover:bg-teal-600 disabled:bg-gray-300"
              >
                {isLoading ? <SpinnerIcon /> : '등록하기'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterModal;
