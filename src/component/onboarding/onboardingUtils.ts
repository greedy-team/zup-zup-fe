export const TOOLTIP_MAX_WIDTH = 288;
export const TOOLTIP_GAP = 16; // 요소 경계와 툴팁 사이 간격
export const TOOLTIP_HEIGHT_ESTIMATE = 205; // 툴팁 높이 추정값 (top 배치 계산용)

export type Placement = 'right' | 'bottom' | 'left' | 'top';

export function getTargetRect(selector: string): DOMRect | null {
  const el = document.querySelector(selector);
  if (!el) return null;
  const rect = el.getBoundingClientRect();
  if (rect.width === 0 && rect.height === 0) return null;
  return rect;
}

/**
 * 툴팁 위치와 화살표 오프셋을 계산한다.
 * arrowOffset: top/bottom 배치에서 화살표를 타겟 중심에 정렬하기 위한 툴팁 중앙 기준 오프셋(px)
 */
export function computeTooltipLayout(
  rect: DOMRect,
  placement: Placement,
  tooltipWidth: number,
  tooltipHeight: number,
): { position: { top: number; left: number }; arrowOffset: number } {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const G = TOOLTIP_GAP;
  const H = tooltipHeight;

  let top: number;
  let left: number;
  let arrowOffset = 0;

  switch (placement) {
    case 'right': {
      top = Math.max(16, Math.min(vh - H - 16, rect.top + rect.height / 2 - H / 2));
      left = Math.min(vw - tooltipWidth - 16, rect.right + G);
      break;
    }
    case 'bottom': {
      const rawLeft = rect.left + rect.width / 2 - tooltipWidth / 2;
      left = Math.max(16, Math.min(vw - tooltipWidth - 16, rawLeft));
      top = rect.bottom + G;
      // 화살표를 타겟 수평 중앙에 정렬
      arrowOffset = rect.left + rect.width / 2 - (left + tooltipWidth / 2);
      arrowOffset = Math.max(-tooltipWidth / 2 + 16, Math.min(tooltipWidth / 2 - 16, arrowOffset));
      break;
    }
    case 'left': {
      top = Math.max(16, Math.min(vh - H - 16, rect.top + rect.height / 2 - H / 2));
      left = Math.max(16, rect.left - G - tooltipWidth);
      break;
    }
    case 'top': {
      const rawLeft = rect.left + rect.width / 2 - tooltipWidth / 2;
      left = Math.max(16, Math.min(vw - tooltipWidth - 16, rawLeft));
      top = Math.max(16, rect.top - G - H);
      // 화살표를 타겟 수평 중앙에 정렬
      arrowOffset = rect.left + rect.width / 2 - (left + tooltipWidth / 2);
      arrowOffset = Math.max(-tooltipWidth / 2 + 16, Math.min(tooltipWidth / 2 - 16, arrowOffset));
      break;
    }
  }

  return { position: { top, left }, arrowOffset };
}
