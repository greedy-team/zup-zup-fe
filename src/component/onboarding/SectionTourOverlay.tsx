import { createPortal } from 'react-dom';
import { useSectionTour } from './useSectionTour';
import TourBottomSheet from './TourBottomSheet';
import TourOverlayMap from './TourOverlayMap';

export default function SectionTourOverlay() {
  const {
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
  } = useSectionTour();

  if (isTourPage) {
    return createPortal(
      <TourBottomSheet
        section={section}
        current={current}
        stepIdx={stepIdx}
        isFirst={isFirst}
        isLast={isLast}
        isSheetOpen={isSheetOpen}
        onOpenSheet={() => setIsSheetOpen(true)}
        onDismissSheet={() => setIsSheetOpen(false)}
        onClose={handleClose}
        onPrev={handlePrev}
        onNext={handleNext}
        onGoToStep={goToStep}
      />,
      document.body,
    );
  }

  return createPortal(
    <TourOverlayMap
      section={section}
      current={current}
      stepIdx={stepIdx}
      isFirst={isFirst}
      isLast={isLast}
      isDesktop={isDesktop}
      targetRect={targetRect}
      tooltipRef={tooltipRef}
      measuredHeight={measuredHeight}
      activePlacement={activePlacement}
      tooltipWidth={tooltipWidth}
      onClose={handleClose}
      onPrev={handlePrev}
      onNext={handleNext}
      onGoToStep={goToStep}
    />,
    document.body,
  );
}
