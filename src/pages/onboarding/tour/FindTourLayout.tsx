import { Outlet, useLocation } from 'react-router-dom';
import WizardLayout from '../../../layouts/WizardLayout';
import { FIND_STEPS, VALUABLE_FLOW, PAGE_TITLES, NEXT_BUTTON_LABEL } from '../../../constants/find';
import { WIZARD_PRIMARY_BTN } from '../../../constants/common';
import type { StepKey } from '../../../constants/find';

export default function FindTourLayout() {
  const location = useLocation();
  const segment = (location.pathname.split('/').filter(Boolean).pop() as StepKey) ?? 'info';
  const stepIdx = Math.max(0, (VALUABLE_FLOW as readonly string[]).indexOf(segment));
  const stepKey = VALUABLE_FLOW[stepIdx];

  return (
    <WizardLayout
      title={PAGE_TITLES[stepKey]}
      steps={FIND_STEPS.VALUABLE as string[]}
      currentStep={stepIdx + 1}
      footer={
        <button disabled className={`w-full ${WIZARD_PRIMARY_BTN}`}>
          {NEXT_BUTTON_LABEL[stepKey]}
        </button>
      }
    >
      <Outlet />
    </WizardLayout>
  );
}
