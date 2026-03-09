import { Outlet, useLocation } from 'react-router-dom';
import WizardLayout from '../../../layouts/WizardLayout';
import { WIZARD_PRIMARY_BTN, WIZARD_SECONDARY_BTN } from '../../../constants/common';
import { REGISTER_PROCESS_STEPS } from '../../../constants/register';

const ROUTE_TO_STEP: Record<string, number> = { category: 1, details: 2, review: 3 };

export default function RegisterTourLayout() {
  const location = useLocation();
  const seg = location.pathname.split('/').filter(Boolean).pop() ?? 'category';
  const currentStep = ROUTE_TO_STEP[seg] ?? 1;
  const isLast = currentStep === REGISTER_PROCESS_STEPS.INDEXS.length;

  return (
    <WizardLayout
      title="분실물 등록"
      steps={REGISTER_PROCESS_STEPS.INDEXS}
      currentStep={currentStep}
      footer={
        <div className="flex items-center justify-between">
          <button disabled className={WIZARD_SECONDARY_BTN}>
            {currentStep === 1 ? '취소' : '이전'}
          </button>
          <button disabled className={WIZARD_PRIMARY_BTN}>
            {isLast ? '등록하기' : '다음'}
          </button>
        </div>
      }
    >
      <Outlet />
    </WizardLayout>
  );
}
