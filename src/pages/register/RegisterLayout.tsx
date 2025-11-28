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
    <div className="flex h-full w-full items-center justify-center pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
      {resultModalContent && <ResultModal {...resultModalContent} />}

      <div className="relative flex h-[95dvh] w-full max-w-4xl flex-col rounded-2xl bg-white p-6 lg:p-8">
        <h1 className="text-center text-2xl font-normal text-gray-800 md:text-3xl">분실물 등록</h1>
        <ProgressBar steps={steps} currentStep={currentStep} />

        {/* Outlet 영역 */}
        <div className="flex-grow overflow-y-auto pr-4">
          <Outlet context={registerLayoutProps} />{' '}
        </div>

        {/* 버튼 영역 */}
        <div className="mt-auto flex flex-shrink-0 items-center justify-between border-t pt-4 md:pt-6">
          <button
            onClick={goToPrevStep}
            className="rounded-lg bg-gray-200 px-8 py-4 text-base font-normal text-gray-700 hover:cursor-pointer hover:bg-gray-300 md:text-xl"
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
                className="rounded-lg bg-teal-500 px-8 py-4 text-base font-normal text-white hover:cursor-pointer hover:bg-teal-600 disabled:cursor-not-allowed disabled:bg-gray-300 md:text-xl"
              >
                다음
              </button>
            ) : (
              <button
                onClick={handleRegister}
                disabled={isLoading}
                className="rounded-lg bg-teal-500 px-8 py-4 text-base font-normal text-white hover:cursor-pointer hover:bg-teal-600 disabled:bg-gray-300 md:text-xl"
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
