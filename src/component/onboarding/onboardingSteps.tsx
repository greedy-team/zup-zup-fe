import { Map, Search, CirclePlus, CircleUser, LogIn, Ellipsis } from 'lucide-react';
import type { Placement } from './onboardingUtils';

// ── 첫 방문 오버레이용 (5-step) ───────────────────────────────────────────────

export type Step = {
  icon: React.ReactNode;
  title: string;
  description: string;
  selector: string | null;
  placement?: Placement;
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
    icon: <CirclePlus className="h-10 w-10 text-teal-500" />,
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
  {
    icon: <Ellipsis className="h-10 w-10 text-teal-500" />,
    title: '더 자세한 내용이 궁금하다면?',
    description:
      '사이드바의 더보기 메뉴에서 서비스 소개, 팀 소개, 피드백 전송 및 서비스 가이드를 다시 확인할 수 있어요.',
    selector: '[data-tour="sidebar-more"]',
    placement: 'right',
    mobileSelector: null,
  },
];

// ── 섹션 투어용 (6-section) ────────────────────────────────────────────────────

export type OnboardingStep = {
  stepLabel: string;
  title: string;
  description: string;
  tip?: string;
  selector: string | null;
  placement?: Placement;
  mobileSelector?: string | null;
  mobilePlacement?: Placement;
  /** 이 스텝 진입 시 navigate할 경로 (undefined면 현재 페이지 유지) */
  route?: string;
};

export type OnboardingSection = {
  id: string;
  label: string;
  summary: string;
  icon: React.ReactNode;
  route: string;
  steps: OnboardingStep[];
};

export const SECTIONS: OnboardingSection[] = [
  {
    id: 'main',
    label: '메인화면',
    summary: '지도에서 캠퍼스 분실물 현황을 한눈에 확인해요.',
    icon: <Map className="h-4 w-4" />,
    route: '/',
    steps: [
      {
        stepLabel: '서비스 소개',
        title: '세종 줍줍에 오신 걸 환영해요!',
        description:
          '세종대학교 캠퍼스의 분실물을 지도에서 한눈에 확인하고 관리하는 서비스예요.\n지도 기반으로 구역별 분실물 현황을 쉽게 파악할 수 있어요.',
        tip: '로그인 없이도 분실물 등록, 목록 확인이 가능해요. 분실물 찾기는 로그인이 필요해요.',
        selector: null,
      },
      {
        stepLabel: '지도 보기',
        title: '지도에서 구역 확인하기',
        description:
          '캠퍼스 지도에 분실물이 존재하는 구역은 총 분실물 갯수가 표시돼요.\n구역을 클릭하면 해당 위치에 있는 분실물 목록을 볼 수 있어요.',
        selector: null,
      },
      {
        stepLabel: '카테고리 필터링',
        title: '카테고리로 빠르게 찾기',
        description:
          '화면 상단의 카테고리 탭을 이용해 원하는 종류의 물건만 모아볼 수 있어요.\n핸드폰, 가방, 지갑 등 다양한 카테고리가 있어요.',
        tip: '기타 카테고리 물건은 퀴즈 없이 서약 작성을 완료하면 바로 보관장소를 안내해 드려요.',
        selector: '[data-tour="category-bar"]',
        placement: 'bottom',
      },
    ],
  },
  {
    id: 'find',
    label: '찾기',
    summary: '지도에서 분실물을 검색하고 보관장소를 확인해요.',
    icon: <Search className="h-4 w-4" />,
    route: '/',
    steps: [
      {
        stepLabel: '찾기 모드',
        title: '찾기 모드로 전환하기',
        description:
          '사이드바의 지도 버튼을 클릭해 찾기 모드로 전환해요.\n찾기 모드에서 지도 구역을 클릭하면 분실물 목록이 나타나요.',
        tip: '분실물 찾기는 로그인한 사용자만 이용할 수 있어요.',
        selector: '[data-tour="sidebar-find"]',
        placement: 'right',
        mobileSelector: '[data-tour="mobile-sidebar-find"]',
        mobilePlacement: 'top',
      },
      {
        stepLabel: '목록 확인',
        title: '분실물 목록 살펴보기',
        description:
          '목록에서 내 물건과 일치하는 항목을 찾아보세요.\n분실물의 카테고리, 발견 장소, 등록 날짜를 함께 확인할 수 있어요.',
        tip: '상단 카테고리 필터를 먼저 설정하면 목록을 더 빠르게 좁힐 수 있어요.',
        selector: '[data-tour="lost-list"]',
        placement: 'right',
        mobileSelector: '[data-tour="mobile-list-btn"]',
        mobilePlacement: 'top',
      },
      {
        stepLabel: '물건 정보',
        title: '분실물 정보 확인하기',
        description:
          '분실물을 선택하면 카테고리, 발견 장소, 등록 날짜를 먼저 확인할 수 있어요.\n내 것과 일치하는지 확인한 후 다음 단계로 진행해요.',
        selector: null,
        route: '/onboarding/find-tour/info',
      },
      {
        stepLabel: '퀴즈 풀기',
        title: '소유자 확인 퀴즈',
        description:
          '등록자가 만든 확인 퀴즈가 나타나요.\n퀴즈는 객관식으로 총 2문제이며, 통과해야만 보관장소를 확인할 수 있어요.',
        tip: '기타 카테고리 분실물은 퀴즈 없이 바로 다음 단계로 넘어가요.\n퀴즈를 틀리면 다시 시도할 수 없으니 신중하게 답변해 주세요!',
        selector: null,
        route: '/onboarding/find-tour/quiz',
      },
      {
        stepLabel: '상세 정보',
        title: '분실물 상세 정보 확인',
        description:
          '퀴즈를 통과하면 분실물의 사진과 상세 설명을 볼 수 있어요.\n꼼꼼히 확인하고 내 것과 일치하면 다음 단계로 넘어가세요.',
        selector: null,
        route: '/onboarding/find-tour/detail',
      },
      {
        stepLabel: '서약 작성',
        title: '분실물 수령 서약',
        description:
          '분실물 수령에 대한 간단한 서약을 작성해 주세요.\n서약 문구를 정확히 입력해야 다음 단계로 넘어갈 수 있어요.',
        selector: null,
        route: '/onboarding/find-tour/pledge',
      },
      {
        stepLabel: '보관장소',
        title: '보관장소 확인하기',
        description:
          '모든 절차를 완료하면 분실물이 있는 정확한 보관장소를 알 수 있어요.\n안내된 장소로 찾아가 물건을 되찾으세요!',
        tip: '기타 카테고리 분실물은 퀴즈 없이 바로 보관장소를 확인할 수 있어요.',
        selector: null,
        route: '/onboarding/find-tour/deposit',
      },
    ],
  },
  {
    id: 'register',
    label: '등록',
    summary: '발견한 분실물을 지도에 직접 등록해요.',
    icon: <CirclePlus className="h-4 w-4" />,
    route: '/',
    steps: [
      {
        stepLabel: '등록 모드',
        title: '등록 모드로 전환하기',
        description:
          '사이드바의 + (추가) 버튼을 클릭해 등록 모드로 바꿔요.\n등록 모드에서는 지도 구역을 클릭하면 분실물 등록 폼이 열려요.',
        tip: '등록 기능은 로그인을 하지 않아도 이용할 수 있어요.',
        selector: '[data-tour="sidebar-register"]',
        placement: 'right',
        mobileSelector: '[data-tour="mobile-sidebar-register"]',
        mobilePlacement: 'top',
      },
      {
        stepLabel: '카테고리 선택',
        title: '분실물 카테고리 선택하기',
        description:
          '발견한 분실물의 카테고리를 선택해요.\n선택된 카테고리에 따라 분실물 퀴즈가 달라질 수 있어요.',
        tip: '제공된 카테고리 내에 없다면, 기타 카테고리를 선택해 주세요.',
        selector: null,
        route: '/onboarding/register-tour/category',
      },
      {
        stepLabel: '상세 정보 입력',
        title: '분실물 정보 입력하기',
        description:
          '분실물의 특징 2가지를 선택하고, 위치 상세 정보와 보관 장소를 입력해요.\n사진은 최소 1장에서 최대 3장까지 등록해야 해요.',
        tip: '분실물 상세 정보는 선택사항이지만, 자세히 입력할수록 진짜 주인이 찾기 쉬워져요.',
        selector: null,
        route: '/onboarding/register-tour/details',
      },
      {
        stepLabel: '최종 확인',
        title: '분실물 입력 정보 확인',
        description:
          '입력한 정보가 정확한지 최종적으로 확인해 주세요.\n특히 퀴즈로 출제될 분실물의 특징 2가지는 신중하게 선택하는 것이 좋아요.',
        tip: '잘못 입력된 정보가 있다면 이전으로 돌아가 수정할 수 있어요.',
        selector: null,
        route: '/onboarding/register-tour/review',
      },
    ],
  },
  {
    id: 'mypage',
    label: '마이페이지',
    summary: '내 찾기 신청 내역과 보관장소를 관리해요.',
    icon: <CircleUser className="h-4 w-4" />,
    route: '/mypage',
    steps: [
      {
        stepLabel: '내 활동',
        title: '내 찾기 신청 내역',
        description:
          '마이페이지에서 내가 찾은 분실물 개수와 서약한 분실물 내역을 확인할 수 있어요.\n신청 상태와 함께 보관장소를 다시 확인할 수도 있어요.',
        tip: '마이페이지는 로그인한 사용자만 이용할 수 있어요.',
        selector: null,
        route: '/onboarding/mypage-tour',
      },
    ],
  },
  {
    id: 'more',
    label: '더보기',
    summary: '서비스 소개, 팀 소개, 피드백을 확인해요.',
    icon: <Ellipsis className="h-4 w-4" />,
    route: '/more',
    steps: [
      {
        stepLabel: '더보기',
        title: '더보기 메뉴',
        description:
          '더보기 메뉴에서 서비스 소개, 팀 소개, 서비스 피드백을 남길 수 있어요.\n개선 의견이 있다면 언제든지 피드백을 보내주세요!',
        selector: null,
      },
    ],
  },
  {
    id: 'login',
    label: '로그인',
    summary: '학교 계정으로 간편하게 로그인해요.',
    icon: <LogIn className="h-4 w-4" />,
    route: '/login',
    steps: [
      {
        stepLabel: '로그인 방법',
        title: '간편하게 로그인하기',
        description:
          '학사정보시스템에서 사용하는 학번과 비밀번호로 간편하게 로그인할 수 있어요.\n별도 회원가입 없이 학교 계정으로 바로 이용 가능해요.',
        tip: '로그인 과정 중에 학번과 비밀번호는 절대 저장되지 않으니 걱정하지 않으셔도 돼요!',
        selector: null,
      },
      {
        stepLabel: '로그인 혜택',
        title: '로그인하면 더 편리해요',
        description:
          '로그인하면 분실물 찾기 기능을 이용할 수 있어요.\n내 활동 내역도 마이페이지에서 언제든 확인할 수 있어요.',
        tip: '이제 세종 줍줍을 모두 알아봤어요. 아래 완료를 눌러 가이드를 마무리해요.',
        selector: null,
      },
    ],
  },
];
