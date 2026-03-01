import { useEffect, useRef, useState, useCallback } from 'react';
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useLostItemBriefQuery } from '../../api/find/hooks/useFind';
import type { StepKey } from '../../constants/find';
import {
  PAGE_TITLES,
  FIND_STEPS,
  NON_VALUABLE_FLOW,
  VALUABLE_FLOW,
  ETC_CATEGORY_ID,
  NEXT_BUTTON_LABEL,
} from '../../constants/find';
import { WIZARD_PRIMARY_BTN } from '../../constants/common';
import WizardLayout from '../../layouts/WizardLayout';
import type { NextButtonValidator, FindOutletContext } from '../../types/find';
import { showApiErrorToast } from '../../api/common/apiErrorToast';

export default function FindLayout() {
  const { lostItemId: lostItemIdParam } = useParams<{ lostItemId: string }>();
  const lostItemId = Number(lostItemIdParam);
  const navigate = useNavigate();
  const location = useLocation();

  const { data, isLoading, error } = useLostItemBriefQuery(lostItemId);

  const [isClickingNext, setIsClickingNext] = useState(false);
  const [isValuableItem, setIsValuableItem] = useState(true);

  useEffect(() => {
    if (!Number.isFinite(lostItemId)) {
      navigate('/', { replace: true });
    }
  }, [lostItemId, navigate]);

  useEffect(() => {
    if (!error) return;

    showApiErrorToast(error);
    navigate('/', { replace: true });
  }, [error, navigate]);

  useEffect(() => {
    if (data) {
      setIsValuableItem(data.categoryId !== ETC_CATEGORY_ID);
    }
  }, [data]);

  const currentRouteSegment: StepKey =
    (location.pathname.split('/').filter(Boolean).pop() as StepKey) ?? 'info';

  const stepFlow = isValuableItem ? VALUABLE_FLOW : NON_VALUABLE_FLOW;
  const stepLabels = (isValuableItem ? FIND_STEPS.VALUABLE : FIND_STEPS.NON_VALUABLE) as string[];
  const currentStepIndex = Math.max(0, stepFlow.indexOf(currentRouteSegment));
  const currentStepNumber = currentStepIndex + 1;
  const currentStepKey: StepKey = stepFlow[currentStepIndex] ?? 'info';
  const nextButtonLabel = NEXT_BUTTON_LABEL[currentStepKey];
  const pageTitle = PAGE_TITLES[currentStepKey];

  const nextButtonValidatorRef = useRef<NextButtonValidator | null>(null);
  const setNextButtonValidator = useCallback<FindOutletContext['setNextButtonValidator']>(
    (handler) => {
      nextButtonValidatorRef.current = handler;
    },
    [],
  );

  const basePath = `/find/${lostItemId}`;
  const goToNextStep = () => {
    const nextStep = stepFlow[currentStepIndex + 1];
    if (!nextStep) navigate('/', { replace: true });
    else navigate(`${basePath}/${nextStep}`);
  };

  const handleClickNext = async () => {
    const handler = nextButtonValidatorRef.current;
    if (!handler) {
      goToNextStep();
      return;
    }
    setIsClickingNext(true);
    try {
      const ok = await handler();
      if (ok !== false) goToNextStep();
    } catch (err) {
      console.error('beforeNext error:', err);
    } finally {
      setIsClickingNext(false);
    }
  };

  const footer = (
    <button
      onClick={handleClickNext}
      disabled={isClickingNext}
      aria-busy={isClickingNext}
      className={`w-full ${WIZARD_PRIMARY_BTN}`}
    >
      {nextButtonLabel}
    </button>
  );

  if (isLoading) {
    return (
      <WizardLayout
        title="분실물 찾기"
        steps={FIND_STEPS.VALUABLE as string[]}
        currentStep={1}
        footer={
          <button disabled className={`w-full ${WIZARD_PRIMARY_BTN}`}>
            다음
          </button>
        }
      >
        <div className="rounded-lg bg-gray-50 p-4 text-center text-sm text-gray-500">
          로딩 중…
        </div>
      </WizardLayout>
    );
  }

  return (
    <WizardLayout
      title={pageTitle}
      steps={stepLabels}
      currentStep={currentStepNumber}
      footer={footer}
    >
      <Outlet context={{ setNextButtonValidator }} />
    </WizardLayout>
  );
}
