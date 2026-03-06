import { ChevronLeft, ChevronRight, Lightbulb, X } from 'lucide-react';
import type { OnboardingSection, OnboardingStep } from './onboardingSteps';
import { computeTooltipLayout } from './onboardingUtils';
import type { Placement } from './onboardingUtils';
import OnboardingArrow from './OnboardingArrow';

type Props = {
  section: OnboardingSection;
  current: OnboardingStep;
  stepIdx: number;
  isFirst: boolean;
  isLast: boolean;
  isDesktop: boolean;
  targetRect: DOMRect | null;
  tooltipRef: React.RefObject<HTMLDivElement>;
  measuredHeight: number;
  activePlacement: Placement | undefined;
  tooltipWidth: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  onGoToStep: (idx: number) => void;
};

function Spotlight({ targetRect }: { targetRect: DOMRect }) {
  return (
    <>
      <div
        className="absolute bg-black/70"
        style={{ top: 0, left: 0, right: 0, height: Math.max(0, targetRect.top) }}
      />
      <div
        className="absolute bg-black/70"
        style={{ top: targetRect.bottom, left: 0, right: 0, bottom: 0 }}
      />
      <div
        className="absolute bg-black/70"
        style={{
          top: targetRect.top,
          left: 0,
          width: Math.max(0, targetRect.left),
          height: targetRect.height,
        }}
      />
      <div
        className="absolute bg-black/70"
        style={{
          top: targetRect.top,
          left: targetRect.right,
          right: 0,
          height: targetRect.height,
        }}
      />
      <div
        className="absolute"
        style={{
          top: targetRect.top,
          left: targetRect.left,
          width: targetRect.width,
          height: targetRect.height,
        }}
      />
      <div
        className="pointer-events-none absolute ring-2 ring-teal-600"
        style={{
          top: targetRect.top,
          left: targetRect.left,
          width: targetRect.width,
          height: targetRect.height,
        }}
      />
    </>
  );
}

export default function TourOverlayMap({
  section,
  current,
  stepIdx,
  isFirst,
  isLast,
  isDesktop,
  targetRect,
  tooltipRef,
  measuredHeight,
  activePlacement,
  tooltipWidth,
  onClose,
  onPrev,
  onNext,
  onGoToStep,
}: Props) {
  const tooltipLayout =
    targetRect && activePlacement
      ? computeTooltipLayout(targetRect, activePlacement, tooltipWidth, measuredHeight)
      : null;
  const tooltipPos = tooltipLayout?.position ?? null;
  const arrowOffset = tooltipLayout?.arrowOffset ?? 0;

  return (
    <>
      {/* 어두운 오버레이 (z-100) */}
      <div
        className="fixed inset-0 z-[100]"
        role="dialog"
        aria-modal="true"
        aria-label={`${section.label} 가이드`}
      >
        {targetRect ? (
          <Spotlight targetRect={targetRect} />
        ) : (
          <div className="absolute inset-0 bg-black/70" />
        )}
      </div>

      {/* 툴팁 레이어 (z-101) */}
      {tooltipPos ? (
        <div
          ref={tooltipRef}
          className="fixed z-[101] rounded-xl bg-white p-5 shadow-2xl"
          style={{ top: tooltipPos.top, left: tooltipPos.left, width: tooltipWidth }}
        >
          {activePlacement && <OnboardingArrow placement={activePlacement} offset={arrowOffset} />}

          <div className="mb-2 flex items-center justify-between">
            <span className="rounded-full bg-teal-50 px-2.5 py-0.5 text-xs font-medium text-teal-600">
              {current.stepLabel}
            </span>
            <span className="text-xs text-slate-400">
              {stepIdx + 1} / {section.steps.length}
            </span>
          </div>

          <h3 className="text-base font-semibold text-slate-900">{current.title}</h3>
          <p className="mt-2 text-sm leading-relaxed whitespace-pre-line text-slate-500">
            {current.description}
          </p>

          {current.tip && (
            <div className="mt-3 flex gap-2 rounded-xl bg-amber-50 p-3">
              <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
              <p className="text-xs leading-relaxed whitespace-pre-line text-amber-700">
                {current.tip}
              </p>
            </div>
          )}

          <div className="mt-4 flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="shrink-0 cursor-pointer text-xs text-slate-400 hover:text-slate-600"
            >
              가이드 목록
            </button>
            <div className="ml-auto flex items-center gap-2">
              <button
                type="button"
                onClick={onPrev}
                disabled={isFirst}
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-30"
                aria-label="이전"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={onNext}
                className="flex h-8 cursor-pointer items-center justify-center rounded-lg bg-teal-500 px-4 text-sm font-medium text-white hover:bg-teal-600"
              >
                {isLast ? (
                  '완료'
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
        /* 중앙 카드 레이어 (z-101) */
        <div className="fixed inset-0 z-[101] flex items-center justify-center px-4">
          <div
            className={`w-full rounded-2xl bg-white p-7 shadow-2xl ${isDesktop ? 'max-w-xl' : 'max-w-xs'}`}
          >
            <div className="mb-4 flex items-center gap-2">
              <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-medium text-teal-600">
                {current.stepLabel}
              </span>
              <span className="ml-auto shrink-0 text-xs text-slate-400">
                {stepIdx + 1} / {section.steps.length}
              </span>
              <button
                type="button"
                onClick={onClose}
                className="flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-full text-slate-400 hover:bg-slate-100"
                aria-label="가이드 목록으로"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <h2 className="text-lg font-bold text-slate-900">{current.title}</h2>
            <p className="mt-3 text-sm leading-relaxed whitespace-pre-line text-slate-500">
              {current.description}
            </p>

            {current.tip && (
              <div className="mt-4 flex gap-2 rounded-xl bg-amber-50 p-3">
                <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                <p className="text-xs leading-relaxed whitespace-pre-line text-amber-700">
                  {current.tip}
                </p>
              </div>
            )}

            <div className="mt-5 flex items-center justify-center gap-1.5">
              {section.steps.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => onGoToStep(i)}
                  aria-label={`${i + 1}번 단계로 이동`}
                  className={`block h-1.5 cursor-pointer rounded-full transition-all ${
                    i === stepIdx ? 'w-4 bg-teal-500' : 'w-1.5 bg-slate-200 hover:bg-slate-300'
                  }`}
                />
              ))}
            </div>

            <div className="mt-5 flex items-center gap-3">
              <button
                type="button"
                onClick={onPrev}
                disabled={isFirst}
                className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:cursor-default disabled:opacity-30"
                aria-label="이전"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={onNext}
                className="flex h-10 flex-1 cursor-pointer items-center justify-center rounded-xl bg-teal-500 text-sm font-medium text-white hover:bg-teal-600"
              >
                {isLast ? (
                  '완료'
                ) : (
                  <span className="flex items-center gap-1">
                    다음 <ChevronRight className="h-4 w-4" />
                  </span>
                )}
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="mt-3 w-full cursor-pointer text-center text-sm text-slate-400 hover:text-slate-600"
            >
              가이드 목록으로 돌아가기
            </button>
          </div>
        </div>
      )}
    </>
  );
}
