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
import ProgressBar from '../../component/common/ProgressBar';
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

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
        <div className="relative flex h-[90vh] w-full max-w-4xl flex-col rounded-2xl bg-white p-6 lg:p-8">
          <h1 className="text-center text-2xl font-normal text-gray-800 md:text-3xl">
            분실물 찾기
          </h1>
          <div className="mt-6 rounded-lg bg-gray-50 p-4 text-center text-sm text-gray-500">
            로딩 중…
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="flex h-full w-full items-center justify-center pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
      <div className="relative flex h-[95dvh] w-full max-w-4xl flex-col rounded-2xl bg-white p-6 lg:p-8">
        <h1 className="text-center text-2xl font-normal text-gray-800 md:text-3xl">{pageTitle}</h1>

        <div className="mt-3">
          <ProgressBar steps={stepLabels} currentStep={currentStepNumber} />
        </div>

        <div className="mt-4 flex-grow overflow-y-auto pr-2 pb-3 sm:pr-3 md:pb-4">
          <Outlet context={{ setNextButtonValidator }} />
        </div>

        <div className="mt-3 md:mt-5">
          <button
            onClick={handleClickNext}
            disabled={isClickingNext}
            aria-busy={isClickingNext}
            className="w-full min-w-[240px] cursor-pointer rounded-lg bg-teal-500 px-8 py-3 text-base font-bold whitespace-nowrap text-white shadow-md transition hover:bg-teal-600 focus-visible:ring-2 focus-visible:ring-teal-300 focus-visible:outline-none active:translate-y-[1px] disabled:pointer-events-none disabled:opacity-60 md:min-w-[320px] md:text-lg"
          >
            {nextButtonLabel}
          </button>
        </div>
      </div>
    </main>
  );
}
