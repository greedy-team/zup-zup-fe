import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

import {
  TOOLTIP_MAX_WIDTH,
  TOOLTIP_HEIGHT_ESTIMATE,
  getTargetRect,
  computeTooltipLayout,
} from './onboardingUtils';
import { STEPS } from './onboardingSteps';
import OnboardingArrow from './OnboardingArrow';
import StepDots from './StepDots';

type Props = { onComplete: () => void };

export default function OnboardingOverlay({ onComplete }: Props) {
  const [step, setStep] = useState(0);
  const [isDesktop, setIsDesktop] = useState(() => window.innerWidth >= 768);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  // 이전 스텝 측정값을 초기값으로 사용, 실측 후 useLayoutEffect에서 갱신
  const [measuredHeight, setMeasuredHeight] = useState(TOOLTIP_HEIGHT_ESTIMATE);

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  // 현재 환경에 맞는 selector / placement 선택
  const activeSelector = isDesktop
    ? current.selector
    : current.mobileSelector !== undefined
      ? current.mobileSelector
      : current.selector;
  const activePlacement = isDesktop
    ? current.placement
    : (current.mobilePlacement ?? current.placement);

  // 반응형 툴팁 너비
  const tooltipWidth = Math.min(TOOLTIP_MAX_WIDTH, window.innerWidth - 32);

  // 데스크탑 breakpoint 감지
  useEffect(() => {
    const handler = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  // 타겟 요소 위치 추적
  useEffect(() => {
    if (!activeSelector) {
      setTargetRect(null);
      return;
    }
    const update = () => setTargetRect(getTargetRect(activeSelector));
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [step, activeSelector]);

  // 툴팁 DOM이 렌더된 직후 실측 높이로 위치 보정 (브라우저 페인트 전)
  useLayoutEffect(() => {
    if (!tooltipRef.current) return;
    const h = tooltipRef.current.offsetHeight;
    if (h > 0) setMeasuredHeight(h);
  }, [step, isDesktop]);

  const handleNext = () => (isLast ? onComplete() : setStep((s) => s + 1));
  const handlePrev = () => setStep((s) => s - 1);

  // ── Spotlight 계산 (padding 없이 요소 경계에 딱 맞춤) ──────────────────────
  const spotlightStyle = targetRect
    ? {
        top: targetRect.top,
        left: targetRect.left,
        width: targetRect.width,
        height: targetRect.height,
      }
    : null;

  // ── 툴팁 위치 / 화살표 오프셋 계산 ───────────────────────────────────────
  const tooltipLayout =
    targetRect && activePlacement
      ? computeTooltipLayout(targetRect, activePlacement, tooltipWidth, measuredHeight)
      : null;
  const tooltipPos = tooltipLayout?.position ?? null;
  const arrowOffset = tooltipLayout?.arrowOffset ?? 0;

  const content = (
    <>
      {/* ── 어두운 오버레이 레이어 (z-100) ── */}
      <div
        className="fixed inset-0 z-[100]"
        role="dialog"
        aria-modal="true"
        aria-label="서비스 소개"
      >
        {spotlightStyle ? (
          <>
            {/* 상단 */}
            <div
              className="absolute bg-black/70"
              style={{ top: 0, left: 0, right: 0, height: Math.max(0, targetRect!.top) }}
            />
            {/* 하단 */}
            <div
              className="absolute bg-black/70"
              style={{ top: targetRect!.bottom, left: 0, right: 0, bottom: 0 }}
            />
            {/* 좌측 */}
            <div
              className="absolute bg-black/70"
              style={{
                top: targetRect!.top,
                left: 0,
                width: Math.max(0, targetRect!.left),
                height: targetRect!.height,
              }}
            />
            {/* 우측 */}
            <div
              className="absolute bg-black/70"
              style={{
                top: targetRect!.top,
                left: targetRect!.right,
                right: 0,
                height: targetRect!.height,
              }}
            />
            {/* 투명 클릭 차단 (spotlight 영역 위, 온보딩 중 실수 클릭 방지) */}
            <div className="absolute" style={spotlightStyle} />
            {/* 테두리 링 */}
            <div
              className="pointer-events-none absolute ring-2 ring-teal-600"
              style={spotlightStyle}
            />
          </>
        ) : (
          <div className="absolute inset-0 bg-black/70" />
        )}
      </div>

      {/* ── 툴팁 / 중앙 카드 레이어 (z-101) ── */}
      {tooltipPos ? (
        // Positioned tooltip: 화살표 + 설명 카드
        <div
          ref={tooltipRef}
          className="fixed z-[101] rounded-xl bg-white p-5 shadow-2xl"
          style={{ top: tooltipPos.top, left: tooltipPos.left, width: tooltipWidth }}
        >
          {activePlacement && <OnboardingArrow placement={activePlacement} offset={arrowOffset} />}

          <h3 className="text-base font-semibold text-slate-900">{current.title}</h3>
          <p className="mt-2 text-sm leading-relaxed whitespace-pre-line text-slate-500">
            {current.description}
          </p>

          <div className="mt-4">
            <StepDots total={STEPS.length} current={step} small />
          </div>

          <div className="mt-4 flex items-center gap-2">
            <button
              type="button"
              onClick={onComplete}
              className="shrink-0 cursor-pointer text-xs text-slate-400 hover:text-slate-600"
            >
              건너뛰기
            </button>
            <div className="ml-auto flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrev}
                disabled={step === 0}
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-30"
                aria-label="이전"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="flex h-8 cursor-pointer items-center justify-center rounded-lg bg-teal-500 px-4 text-sm font-medium text-white hover:bg-teal-600"
              >
                {isLast ? (
                  '시작하기'
                ) : (
                  <span className="flex items-center gap-1">
                    다음 <ChevronRight className="h-3.5 w-3.5" />
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      ) : (
        // 중앙 카드: 타겟 없는 intro 스텝
        <div className="fixed inset-0 z-[101] flex items-center justify-center px-4">
          <div
            className={`relative w-full rounded-2xl bg-white p-8 shadow-2xl ${
              isDesktop ? 'max-w-xl' : 'max-w-xs'
            }`}
          >
            <button
              type="button"
              onClick={onComplete}
              className="absolute top-4 right-4 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full text-slate-400 hover:bg-slate-100"
              aria-label="건너뛰기"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="mb-6 flex items-center justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-teal-50">
                {current.icon}
              </div>
            </div>

            <h2 className="text-center text-xl font-semibold text-slate-900">{current.title}</h2>
            <p className="mt-4 text-center text-sm leading-relaxed whitespace-pre-line text-slate-500">
              {current.description}
            </p>

            <div className="mt-6 flex justify-center">
              <StepDots total={STEPS.length} current={step} />
            </div>

            <button
              type="button"
              onClick={handleNext}
              className="mt-6 flex h-11 w-full cursor-pointer items-center justify-center rounded-xl bg-teal-500 text-sm font-medium text-white hover:bg-teal-600"
            >
              {isLast ? (
                '시작하기'
              ) : (
                <span className="flex items-center gap-1">
                  다음 <ChevronRight className="h-4 w-4" />
                </span>
              )}
            </button>
          </div>
        </div>
      )}
    </>
  );

  return createPortal(content, document.body);
}
