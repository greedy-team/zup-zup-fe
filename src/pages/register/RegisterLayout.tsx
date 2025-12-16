import { Outlet } from 'react-router-dom';
import { useRegisterLayout } from '../../hooks/register/useRegisterLayout';
import ProgressBar from '../../component/common/ProgressBar';
import ResultModal from '../../component/common/ResultModal';
import SpinnerIcon from '../../component/common/Icons/SpinnerIcon';
import { COMMON_BUTTON_CLASSNAME } from '../../constants/common';
import { LAYOUT_BUTTON_CLASSNAME } from '../../constants/register';

const RegisterLayout = () => {
  const registerLayoutProps = useRegisterLayout();

  const {
    steps,
    currentStep,
    resultModalContent,
    isLoading,
    isPending,
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

        <div className="mt-3">
          <ProgressBar steps={steps} currentStep={currentStep} />
        </div>

        <div className="mt-4 flex-grow overflow-y-auto pr-2 pb-3 sm:pr-3 md:pb-4">
          <Outlet context={registerLayoutProps} />{' '}
        </div>

        <div className="mt-3 flex flex-shrink-0 items-center justify-between md:mt-5">
          <button
            onClick={goToPrevStep}
            className={`${COMMON_BUTTON_CLASSNAME} ${LAYOUT_BUTTON_CLASSNAME} bg-gray-200 text-gray-700 hover:bg-gray-300 focus-visible:ring-gray-400`}
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
                className={`${COMMON_BUTTON_CLASSNAME} ${LAYOUT_BUTTON_CLASSNAME} bg-teal-500 text-white hover:bg-teal-600 focus-visible:ring-teal-300 disabled:cursor-not-allowed disabled:bg-gray-300`}
              >
                다음
              </button>
            ) : (
              <button
                onClick={handleRegister}
                disabled={isLoading || isPending}
                className={`${COMMON_BUTTON_CLASSNAME} ${LAYOUT_BUTTON_CLASSNAME} bg-teal-500 text-white hover:bg-teal-600 focus-visible:ring-teal-300 disabled:cursor-not-allowed disabled:bg-gray-300`}
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
