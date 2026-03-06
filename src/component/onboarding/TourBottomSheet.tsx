import { BookOpen, ChevronLeft, ChevronRight, Lightbulb, X } from 'lucide-react';
import type { OnboardingSection, OnboardingStep } from './onboardingSteps';

type Props = {
  section: OnboardingSection;
  current: OnboardingStep;
  stepIdx: number;
  isFirst: boolean;
  isLast: boolean;
  isSheetOpen: boolean;
  onOpenSheet: () => void;
  onDismissSheet: () => void;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  onGoToStep: (idx: number) => void;
};

export default function TourBottomSheet({
  section,
  current,
  stepIdx,
  isFirst,
  isLast,
  isSheetOpen,
  onOpenSheet,
  onDismissSheet,
  onClose,
  onPrev,
  onNext,
  onGoToStep,
}: Props) {
  if (!isSheetOpen) {
    return (
      <button
        type="button"
        onClick={onOpenSheet}
        className="fixed right-4 bottom-22 z-[110] flex cursor-pointer items-center gap-2 rounded-full bg-teal-500 px-4 py-2.5 text-sm font-medium text-white shadow-lg transition-transform hover:bg-teal-600 active:scale-95 md:right-6 md:bottom-6"
        aria-label="가이드 열기"
      >
        <BookOpen className="h-4 w-4" />
        <span>
          가이드 {stepIdx + 1}/{section.steps.length}
        </span>
      </button>
    );
  }

  return (
    <div
      className="fixed right-0 bottom-0 left-0 z-[100] rounded-t-2xl bg-white shadow-[0_-4px_24px_rgba(0,0,0,0.15)] md:left-18"
      role="dialog"
      aria-modal="false"
      aria-label={`${section.label} 가이드`}
    >
      {/* 핸들 바 */}
      <div className="flex justify-center pt-3 pb-1">
        <div className="h-1 w-10 rounded-full bg-gray-200" />
      </div>

      <div className="max-h-[55vh] overflow-y-auto px-5 pt-2 pb-6">
        {/* 헤더: 섹션 + 스텝 라벨 + 진행도 + X 버튼 */}
        <div className="mb-3 flex items-center gap-2">
          <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-medium text-teal-600">
            {section.label}
          </span>
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500">
            {current.stepLabel}
          </span>
          <span className="ml-auto shrink-0 text-xs text-slate-400">
            {stepIdx + 1} / {section.steps.length}
          </span>
          <button
            type="button"
            onClick={onDismissSheet}
            className="flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-full text-slate-400 hover:bg-slate-100"
            aria-label="가이드 닫기"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <h2 className="text-base font-bold text-slate-900">{current.title}</h2>
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

        {/* 스텝 도트 */}
        <div className="mt-4 flex items-center justify-center gap-1.5">
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

        {/* 이전 / 다음 */}
        <div className="mt-4 flex items-center gap-3">
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
  );
}
