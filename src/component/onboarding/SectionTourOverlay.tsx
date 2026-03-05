import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useLocation, useNavigate } from 'react-router-dom';
import { BookOpen, ChevronLeft, ChevronRight, Lightbulb, X } from 'lucide-react';

import {
  TOOLTIP_MAX_WIDTH,
  TOOLTIP_HEIGHT_ESTIMATE,
  getTargetRect,
  computeTooltipLayout,
} from './onboardingUtils';
import { SECTIONS } from './onboardingSteps';
import OnboardingArrow from './OnboardingArrow';
import { useOnboardingStore } from '../../store/onboardingStore';

export default function SectionTourOverlay() {
  const navigate = useNavigate();
  const location = useLocation();
  const tourSectionIdx = useOnboardingStore((s) => s.tourSectionIdx)!;
  const stepIdx = useOnboardingStore((s) => s.tourStepIdx);
  const { endTour, setTourStepIdx } = useOnboardingStore((s) => s.actions);

  const [isDesktop, setIsDesktop] = useState(() => window.innerWidth >= 768);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [measuredHeight, setMeasuredHeight] = useState(TOOLTIP_HEIGHT_ESTIMATE);
  const [isSheetOpen, setIsSheetOpen] = useState(true);

  const section = SECTIONS[tourSectionIdx];
  const current = section.steps[stepIdx];
  const isFirst = stepIdx === 0;
  const isLast = stepIdx === section.steps.length - 1;

  // route가 정의된 스텝 → 투어 페이지(바텀 시트), 아니면 기존 오버레이
  const isTourPage = !!current.route;

  const activeSelector = isDesktop
    ? current.selector
    : current.mobileSelector !== undefined
      ? current.mobileSelector
      : current.selector;
  const activePlacement = isDesktop
    ? current.placement
    : (current.mobilePlacement ?? current.placement);

  const tooltipWidth = Math.min(TOOLTIP_MAX_WIDTH, window.innerWidth - 32);

  useEffect(() => {
    const handler = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  useLayoutEffect(() => {
    if (!activeSelector) {
      setTargetRect(null);
      return;
    }
    const update = () => setTargetRect(getTargetRect(activeSelector));
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [stepIdx, tourSectionIdx, activeSelector]);

  useLayoutEffect(() => {
    if (!tooltipRef.current) return;
    const h = tooltipRef.current.offsetHeight;
    if (h > 0) setMeasuredHeight(h);
  }, [stepIdx, tourSectionIdx, isDesktop, targetRect]);

  // 스텝 이동 시 시트 자동으로 열기
  useEffect(() => {
    setIsSheetOpen(true);
  }, [stepIdx, tourSectionIdx]);

  // 투어 범위 밖 경로로 이동하면 투어 종료 (사이드바·탭바 등으로 이탈 시)
  useEffect(() => {
    const validPaths = new Set<string>([
      '/onboarding', // 투어 시작 허브 (컴포넌트 마운트 시점의 경로)
      section.route,
      ...section.steps.map((s) => s.route).filter((r): r is string => !!r),
    ]);
    if (!validPaths.has(location.pathname)) {
      endTour();
    }
  }, [location.pathname, section, endTour]);

  const handleClose = () => {
    endTour();
    navigate('/onboarding');
  };

  const goToStep = (idx: number) => {
    const targetStep = section.steps[idx];
    setTourStepIdx(idx);
    if (targetStep.route) {
      // 투어 페이지로 이동
      if (location.pathname !== targetStep.route) navigate(targetStep.route);
    } else if (location.pathname !== section.route) {
      // route 없는 스텝(메인 지도)으로 돌아올 때 섹션 기본 경로로 복귀
      navigate(section.route);
    }
  };

  const handleNext = () => (isLast ? handleClose() : goToStep(stepIdx + 1));
  const handlePrev = () => {
    if (!isFirst) goToStep(stepIdx - 1);
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // A. 바텀 시트 모드 (투어 페이지: find-tour / register-tour)
  // ─────────────────────────────────────────────────────────────────────────────
  if (isTourPage) {
    // FAB – 시트가 닫혀 있을 때만 표시
    const fab = !isSheetOpen && (
      <button
        type="button"
        onClick={() => setIsSheetOpen(true)}
        className="fixed right-4 bottom-22 z-[110] flex items-center gap-2 rounded-full bg-teal-500 px-4 py-2.5 text-sm font-medium text-white shadow-lg transition-transform hover:bg-teal-600 active:scale-95 md:right-6 md:bottom-6"
        aria-label="가이드 열기"
      >
        <BookOpen className="h-4 w-4" />
        <span>
          가이드 {stepIdx + 1}/{section.steps.length}
        </span>
      </button>
    );

    // 바텀 시트 – X 버튼은 시트 헤더에 위치
    const bottomSheet = isSheetOpen && (
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
              onClick={() => setIsSheetOpen(false)}
              className="flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-full text-slate-400 hover:bg-slate-100"
              aria-label="가이드 닫기"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* 제목 */}
          <h2 className="text-base font-bold text-slate-900">{current.title}</h2>

          {/* 설명 */}
          <p className="mt-2 text-sm leading-relaxed whitespace-pre-line text-slate-500">
            {current.description}
          </p>

          {/* 팁 */}
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
                onClick={() => goToStep(i)}
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
              onClick={handlePrev}
              disabled={isFirst}
              className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:cursor-default disabled:opacity-30"
              aria-label="이전"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={handleNext}
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

          {/* 가이드 목록으로 */}
          <button
            type="button"
            onClick={handleClose}
            className="mt-3 w-full cursor-pointer text-center text-sm text-slate-400 hover:text-slate-600"
          >
            가이드 목록으로 돌아가기
          </button>
        </div>
      </div>
    );

    return createPortal(
      <>
        {fab}
        {bottomSheet}
      </>,
      document.body,
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // B. 기존 오버레이 모드 (지도가 보이는 단계: 메인·찾기·등록 초반 스텝)
  // ─────────────────────────────────────────────────────────────────────────────
  const spotlightStyle = targetRect
    ? {
        top: targetRect.top,
        left: targetRect.left,
        width: targetRect.width,
        height: targetRect.height,
      }
    : null;

  const tooltipLayout =
    targetRect && activePlacement
      ? computeTooltipLayout(targetRect, activePlacement, tooltipWidth, measuredHeight)
      : null;
  const tooltipPos = tooltipLayout?.position ?? null;
  const arrowOffset = tooltipLayout?.arrowOffset ?? 0;

  const overlayContent = (
    <>
      {/* 어두운 오버레이 (z-100) */}
      <div
        className="fixed inset-0 z-[100]"
        role="dialog"
        aria-modal="true"
        aria-label={`${section.label} 가이드`}
      >
        {spotlightStyle ? (
          <>
            <div
              className="absolute bg-black/70"
              style={{ top: 0, left: 0, right: 0, height: Math.max(0, targetRect!.top) }}
            />
            <div
              className="absolute bg-black/70"
              style={{ top: targetRect!.bottom, left: 0, right: 0, bottom: 0 }}
            />
            <div
              className="absolute bg-black/70"
              style={{
                top: targetRect!.top,
                left: 0,
                width: Math.max(0, targetRect!.left),
                height: targetRect!.height,
              }}
            />
            <div
              className="absolute bg-black/70"
              style={{
                top: targetRect!.top,
                left: targetRect!.right,
                right: 0,
                height: targetRect!.height,
              }}
            />
            <div className="absolute" style={spotlightStyle} />
            <div
              className="pointer-events-none absolute ring-2 ring-teal-600"
              style={spotlightStyle}
            />
          </>
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
              onClick={handleClose}
              className="shrink-0 cursor-pointer text-xs text-slate-400 hover:text-slate-600"
            >
              가이드 목록
            </button>
            <div className="ml-auto flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrev}
                disabled={isFirst}
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
                onClick={handleClose}
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
                  onClick={() => goToStep(i)}
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
                onClick={handlePrev}
                disabled={isFirst}
                className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:cursor-default disabled:opacity-30"
                aria-label="이전"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={handleNext}
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
              onClick={handleClose}
              className="mt-3 w-full cursor-pointer text-center text-sm text-slate-400 hover:text-slate-600"
            >
              가이드 목록으로 돌아가기
            </button>
          </div>
        </div>
      )}
    </>
  );

  return createPortal(overlayContent, document.body);
}
