import { useRef, useState, useEffect, useCallback } from 'react';
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import { getLostItemBrief } from '../../api/find';
import type { StepKey } from '../../constants/find';
import {
  FIND_STEPS,
  NON_VALUABLE_FLOW,
  VALUABLE_FLOW,
  PAGE_TITLES,
  ETC_CATEGORY_ID,
  NEXT_BUTTON_LABEL,
} from '../../constants/find';
import ProgressBar from '../../component/common/ProgressBar';
import type { NextButtonValidator, FindOutletContext } from '../../types/find';

export default function FindLayout() {
  const { lostItemId: lostItemIdParam } = useParams<{ lostItemId: string }>();
  const lostItemId = Number(lostItemIdParam);
  const navigate = useNavigate();
  const location = useLocation();

  const [isLoading, setIsLoading] = useState(true);
  const [isValuableItem, setIsValuableItem] = useState(true);

  const currentRouteSegment: StepKey =
    (location.pathname.split('/').filter(Boolean).pop() as StepKey) ?? 'info';

  const stepFlow = isValuableItem ? VALUABLE_FLOW : NON_VALUABLE_FLOW;
  const stepLabels = (isValuableItem ? FIND_STEPS.VALUABLE : FIND_STEPS.NON_VALUABLE) as string[];
  const currentStepIndex = Math.max(0, stepFlow.indexOf(currentRouteSegment));
  const currentStepNumber = currentStepIndex + 1;
  const currentStepKey: StepKey = stepFlow[currentStepIndex] ?? 'info';
  const pageTitle = PAGE_TITLES[currentStepKey];
  const nextButtonLabel = NEXT_BUTTON_LABEL[currentStepKey];

  useEffect(() => {
    if (!Number.isFinite(lostItemId)) {
      navigate('/', { replace: true });
      return;
    }
    let alive = true;
    (async () => {
      setIsLoading(true);
      try {
        const brief = await getLostItemBrief(lostItemId);
        if (!alive) return;
        setIsValuableItem(brief?.categoryId !== ETC_CATEGORY_ID);
      } catch (e: any) {
        if (!alive) return;
        if (e?.status === 403) {
          alert('해당 분실물에 대한 열람 권한이 없습니다.');
          navigate('/', { replace: true });
          return;
        } else if (e?.status === 404) {
          alert('해당 분실물 정보를 찾을 수 없습니다.');
          navigate('/', { replace: true });
          return;
        }
      } finally {
        if (alive) setIsLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [lostItemId, navigate]);

  const nextButtonValidatorRef = useRef<NextButtonValidator | null>(null);
  const setNextButtonValidator = useCallback<FindOutletContext['setNextButtonValidator']>(
    (handler) => {
      nextButtonValidatorRef.current = handler;
    },
    [],
  ); // OUTLET에서 해당 함수의 참조를 의존성 배열에서 관리하므로 마운트 이후의 참조값 유지로 최적화

  const basePath = `/find/${lostItemId}`;
  const goToNextStep = () => {
    const nextStep = stepFlow[currentStepIndex + 1];
    if (!nextStep) navigate('/', { replace: true });
    else navigate(`${basePath}/${nextStep}`);
  };

  const [isClickingNext, setIsClickingNext] = useState(false);
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
      <div className="flex items-center justify-center pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
        <div className="relative flex h-[90vh] w-full max-w-4xl flex-col rounded-2xl bg-white p-6 lg:p-8">
          <h1 className="text-center text-2xl font-bold text-gray-800 md:text-3xl">분실물 찾기</h1>
          <div className="mt-6 rounded-lg bg-gray-50 p-4 text-center text-sm text-gray-500">
            로딩 중…
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="flex items-center justify-center pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
      <div className="relative flex h-[90vh] w-full max-w-4xl flex-col rounded-2xl bg-white p-6 pb-10 lg:p-8 lg:pb-12">
        <h1 className="text-center text-2xl font-bold text-gray-800 md:text-3xl">{pageTitle}</h1>

        <div className="mt-3">
          <ProgressBar steps={stepLabels} currentStep={currentStepNumber} />
        </div>

        <div className="mt-4 flex-grow overflow-y-auto pr-2 pb-3 sm:pr-3 md:pb-4">
          <Outlet context={{ setNextButtonValidator }} />
        </div>

        <button
          onClick={handleClickNext}
          disabled={isClickingNext}
          aria-busy={isClickingNext}
          className="min-w-[240px] rounded-lg bg-teal-500 px-8 py-3 text-base font-bold whitespace-nowrap text-white shadow-md transition hover:bg-teal-600 focus-visible:ring-2 focus-visible:ring-teal-300 focus-visible:outline-none active:translate-y-[1px] disabled:pointer-events-none disabled:opacity-60 md:min-w-[320px] md:text-lg"
        >
          {nextButtonLabel}
        </button>
      </div>
    </main>
  );
}
