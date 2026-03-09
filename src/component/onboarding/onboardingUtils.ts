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
 * arrowOffset: 툴팁이 뷰포트 경계에 clamp될 때 화살표를 타겟 중심에 정렬하기 위한 오프셋(px)
 *   - top/bottom 배치: 수평 오프셋 (left 기준)
 *   - right/left 배치: 수직 오프셋 (top 기준)
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
      const rawTop = rect.top + rect.height / 2 - H / 2;
      top = Math.max(16, Math.min(vh - H - 16, rawTop));
      left = Math.min(vw - tooltipWidth - 16, rect.right + G);
      // 화살표를 타겟 수직 중앙에 정렬
      arrowOffset = rect.top + rect.height / 2 - (top + H / 2);
      arrowOffset = Math.max(-(H / 2) + 16, Math.min(H / 2 - 16, arrowOffset));
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
      const rawTop = rect.top + rect.height / 2 - H / 2;
      top = Math.max(16, Math.min(vh - H - 16, rawTop));
      left = Math.max(16, rect.left - G - tooltipWidth);
      // 화살표를 타겟 수직 중앙에 정렬
      arrowOffset = rect.top + rect.height / 2 - (top + H / 2);
      arrowOffset = Math.max(-(H / 2) + 16, Math.min(H / 2 - 16, arrowOffset));
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
