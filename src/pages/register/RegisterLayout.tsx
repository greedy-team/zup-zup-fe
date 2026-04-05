import { Outlet } from 'react-router-dom';
import { useRegisterLayout } from '../../hooks/register/useRegisterLayout';
import WizardLayout from '../../layouts/WizardLayout';
import ResultModal from '../../component/common/ResultModal';
import SpinnerIcon from '../../component/common/Icons/SpinnerIcon';

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

  const secondaryBtn =
    'cursor-pointer rounded-lg bg-gray-200 px-5 py-2 text-sm font-bold text-gray-700 transition hover:bg-gray-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 active:translate-y-[1px]';
  const primaryBtn =
    'cursor-pointer rounded-lg bg-teal-500 px-5 py-2 text-sm font-bold text-white shadow-md transition hover:bg-teal-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-300 active:translate-y-[1px] disabled:pointer-events-none disabled:opacity-60';

  const footer = (
    <div className="flex items-center justify-between">
      <button onClick={goToPrevStep} className={secondaryBtn}>
        {currentStep === 1 ? '취소' : '이전'}
      </button>

      {currentStep < steps.length ? (
        <button
          onClick={goToNextStep}
          disabled={
            (currentStep === 1 && !selectedCategory) || (currentStep === 2 && !isStep2Valid)
          }
          className={primaryBtn}
        >
          다음
        </button>
      ) : (
        <button onClick={handleRegister} disabled={isLoading || isPending} className={primaryBtn}>
          {isLoading || isPending ? <SpinnerIcon /> : '등록하기'}
        </button>
      )}
    </div>
  );

  return (
    <WizardLayout
      title="분실물 등록"
      steps={steps}
      currentStep={currentStep}
      footer={footer}
      overlay={resultModalContent ? <ResultModal {...resultModalContent} /> : undefined}
    >
      <Outlet context={registerLayoutProps} />
    </WizardLayout>
  );
};

export default RegisterLayout;
