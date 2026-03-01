import { Outlet } from 'react-router-dom';
import { useRegisterLayout } from '../../hooks/register/useRegisterLayout';
import { WIZARD_PRIMARY_BTN, WIZARD_SECONDARY_BTN } from '../../constants/common';
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

  const footer = (
    <div className="flex items-center justify-between">
      <button onClick={goToPrevStep} className={WIZARD_SECONDARY_BTN}>
        {currentStep === 1 ? '취소' : '이전'}
      </button>

      {currentStep < steps.length ? (
        <button
          onClick={goToNextStep}
          disabled={(currentStep === 1 && !selectedCategory) || (currentStep === 2 && !isStep2Valid)}
          className={WIZARD_PRIMARY_BTN}
        >
          다음
        </button>
      ) : (
        <button
          onClick={handleRegister}
          disabled={isLoading || isPending}
          className={WIZARD_PRIMARY_BTN}
        >
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
