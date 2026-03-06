import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import {
  TOOLTIP_MAX_WIDTH,
  TOOLTIP_HEIGHT_ESTIMATE,
  getTargetRect,
} from './onboardingUtils';
import type { Placement } from './onboardingUtils';
import { SECTIONS } from './onboardingSteps';
import type { OnboardingSection, OnboardingStep } from './onboardingSteps';
import { useOnboardingStore } from '../../store/onboardingStore';

export type SectionTourControls = {
  section: OnboardingSection;
  current: OnboardingStep;
  stepIdx: number;
  isFirst: boolean;
  isLast: boolean;
  isTourPage: boolean;
  isDesktop: boolean;
  isSheetOpen: boolean;
  setIsSheetOpen: (open: boolean) => void;
  targetRect: DOMRect | null;
  tooltipRef: React.RefObject<HTMLDivElement>;
  measuredHeight: number;
  activePlacement: Placement | undefined;
  tooltipWidth: number;
  handleClose: () => void;
  handleNext: () => void;
  handlePrev: () => void;
  goToStep: (idx: number) => void;
};

export function useSectionTour(): SectionTourControls {
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
      if (location.pathname !== targetStep.route) navigate(targetStep.route);
    } else if (location.pathname !== section.route) {
      navigate(section.route);
    }
  };

  const handleNext = () => (isLast ? handleClose() : goToStep(stepIdx + 1));
  const handlePrev = () => {
    if (!isFirst) goToStep(stepIdx - 1);
  };

  return {
    section,
    current,
    stepIdx,
    isFirst,
    isLast,
    isTourPage,
    isDesktop,
    isSheetOpen,
    setIsSheetOpen,
    targetRect,
    tooltipRef,
    measuredHeight,
    activePlacement,
    tooltipWidth,
    handleClose,
    handleNext,
    handlePrev,
    goToStep,
  };
}
