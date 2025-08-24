// RegisterLayout.tsx
import { Outlet } from 'react-router-dom';
import { useRegisterLayout } from '../../hooks/register/useRegisterLayout';
import ProgressBar from '../../component/common/ProgressBar';
import ResultModal from '../../component/common/ResultModal';
import SpinnerIcon from '../../component/common/Icons/SpinnerIcon';

const RegisterLayout = () => {
  const registerLayoutProps = useRegisterLayout();

  const {
    steps,
    currentStep,
    resultModalContent,
    isLoading,
    selectedCategory,
    isStep2Valid,
    goToPrevStep,
    goToNextStep,
    handleRegister,
  } = registerLayoutProps;

  return (
    <div className="inset-0 flex items-center justify-center">
      {resultModalContent && <ResultModal {...resultModalContent} />}

      <div className="relative flex h-[90vh] w-full max-w-4xl flex-col rounded-2xl bg-white p-8 shadow-2xl">
        <h1 className="text-center text-3xl font-bold text-gray-800">분실물 등록</h1>
        <ProgressBar steps={steps} currentStep={currentStep} />

        {/* Outlet 영역 */}
        <div className="flex-grow overflow-y-auto pr-2">
          <Outlet context={registerLayoutProps} />{' '}
        </div>

        {/* 버튼 영역 */}
        <div className="mt-auto flex flex-shrink-0 items-center justify-between border-t pt-6">
          <button
            onClick={goToPrevStep}
            className="rounded-lg bg-gray-200 px-6 py-3 font-bold text-gray-700 hover:bg-gray-300"
          >
            {currentStep === 1 ? '취소' : '이전'}
          </button>

          <div>
            {currentStep < steps.length ? (
              <button
                onClick={goToNextStep}
                disabled={
                  (currentStep === 1 && !selectedCategory) || (currentStep === 2 && !isStep2Valid)
                }
                className="rounded-lg bg-teal-500 px-6 py-3 font-bold text-white hover:bg-teal-600 disabled:cursor-not-allowed disabled:bg-gray-300"
              >
                다음
              </button>
            ) : (
              <button
                onClick={handleRegister}
                disabled={isLoading}
                className="rounded-lg bg-teal-500 px-6 py-3 font-bold text-white hover:bg-teal-600 disabled:bg-gray-300"
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

export default RegisterLayout;
