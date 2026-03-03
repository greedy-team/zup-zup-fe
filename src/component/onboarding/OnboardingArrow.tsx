import type { Placement } from './onboardingUtils';

interface ArrowProps {
  placement: Placement;
  offset?: number;
}

export default function OnboardingArrow({ placement, offset = 0 }: ArrowProps) {
  switch (placement) {
    case 'right':
      // 툴팁이 오른쪽 → 화살표가 왼쪽 (←)
      return (
        <svg
          className="absolute -translate-y-1/2"
          style={{ left: -12, top: `calc(50% + ${offset}px)` }}
          width={12}
          height={24}
          viewBox="0 0 12 24"
          aria-hidden="true"
        >
          <path d="M12 0 L0 12 L12 24 Z" fill="white" />
        </svg>
      );
    case 'bottom':
      // 툴팁이 아래 → 화살표가 위 (↑)
      return (
        <svg
          className="absolute -translate-x-1/2"
          style={{ top: -12, left: `calc(50% + ${offset}px)` }}
          width={24}
          height={12}
          viewBox="0 0 24 12"
          aria-hidden="true"
        >
          <path d="M0 12 L12 0 L24 12 Z" fill="white" />
        </svg>
      );
    case 'left':
      // 툴팁이 왼쪽 → 화살표가 오른쪽 (→)
      return (
        <svg
          className="absolute -translate-y-1/2"
          style={{ right: -12, top: `calc(50% + ${offset}px)` }}
          width={12}
          height={24}
          viewBox="0 0 12 24"
          aria-hidden="true"
        >
          <path d="M0 0 L12 12 L0 24 Z" fill="white" />
        </svg>
      );
    case 'top':
      // 툴팁이 위 → 화살표가 아래 (↓)
      return (
        <svg
          className="absolute -translate-x-1/2"
          style={{ bottom: -12, left: `calc(50% + ${offset}px)` }}
          width={24}
          height={12}
          viewBox="0 0 24 12"
          aria-hidden="true"
        >
          <path d="M0 0 L12 12 L24 0 Z" fill="white" />
        </svg>
      );
  }
}
