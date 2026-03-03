import { Map, Search, CirclePlus, Tag, CircleUser } from 'lucide-react';
import type { Placement } from './onboardingUtils';

export type Step = {
  icon: React.ReactNode;
  title: string;
  description: string;
  /** 데스크탑 spotlight 타겟 (null = 타겟 없음, 중앙 카드 표시) */
  selector: string | null;
  placement?: Placement;
  /** 모바일 spotlight 타겟 (undefined = selector와 동일) */
  mobileSelector?: string | null;
  mobilePlacement?: Placement;
};

export const STEPS: Step[] = [
  {
    icon: <Map className="h-10 w-10 text-teal-500" />,
    title: '세종 줍줍에 오신 걸 환영해요!',
    description:
      '세종대학교 캠퍼스의 분실물을 지도에서 한눈에 확인하세요.\n잃어버린 물건을 쉽게 찾고, 발견한 물건도 간편하게 등록할 수 있어요.',
    selector: null,
    mobileSelector: null,
  },
  {
    icon: <Search className="h-10 w-10 text-teal-500" />,
    title: '카테고리 필터',
    description: '핸드폰, 가방, 지갑 등\n원하는 분류만 골라볼 수 있어요.',
    selector: '[data-tour="category-bar"]',
    placement: 'bottom',
    // mobileSelector 미지정 → selector와 동일, mobilePlacement 미지정 → placement와 동일
  },
  {
    icon: <CirclePlus className="h-10 w-10 text-teal-500" />,
    title: '분실물 목록',
    description:
      '구역을 클릭하면 분실물 목록이 나타나요.\n분실물을 선택해 퀴즈를 풀고 보관장소를 확인해요.',
    selector: '[data-tour="lost-list"]',
    placement: 'right',
    mobileSelector: '[data-tour="mobile-list-btn"]',
    mobilePlacement: 'top',
  },
  {
    icon: <Tag className="h-10 w-10 text-teal-500" />,
    title: '분실물 등록하기',
    description:
      '발견한 물건을 등록해 주세요.\n등록 모드에서 지도 구역을 클릭하면 등록 폼이 열려요.',
    selector: '[data-tour="sidebar-register"]',
    placement: 'right',
    mobileSelector: '[data-tour="mobile-sidebar-register"]',
    mobilePlacement: 'top',
  },
  {
    icon: <CircleUser className="h-10 w-10 text-teal-500" />,
    title: '마이페이지',
    description: '로그인 후 내가 찾은 분실물 내역을\n확인하고 관리할 수 있어요.',
    selector: '[data-tour="sidebar-mypage"]',
    placement: 'right',
    mobileSelector: '[data-tour="mobile-sidebar-mypage"]',
    mobilePlacement: 'top',
  },
];
