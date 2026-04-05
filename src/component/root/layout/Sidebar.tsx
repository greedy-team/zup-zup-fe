import Authentication from './Authentication';
import Logo from './Logo';
import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Map,
  CirclePlus,
  CircleUser,
  Ellipsis,
  X,
  BookOpen,
  Users,
  MessageCircleMore,
  House,
} from 'lucide-react';
import {
  useSelectedMode,
  useSetSelectedMode,
  useBottomSheetOpen,
} from '../../../store/hooks/useMainStore';
import { useAuthFlag } from '../../../store/hooks/useAuth';
import { clearFormData } from '../../../utils/register/registerStorage';
import type { Mode } from '../../../store/slices/mainSlice';
import { useOnboardingStore } from '../../../store/onboardingStore';
import { SECTION_MODE_MAP } from '../../onboarding/onboardingSteps';

const Sidebar = () => {
  const selectedMode = useSelectedMode();
  const setSelectedMode = useSetSelectedMode();
  const isBottomSheetOpen = useBottomSheetOpen();
  const isAuthenticated = useAuthFlag();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const tourSectionId = useOnboardingStore((s) => s.tourSectionId);
  const endTour = useOnboardingStore((s) => s.actions.endTour);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const moreFabRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isMoreOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (moreFabRef.current && !moreFabRef.current.contains(e.target as Node)) {
        setIsMoreOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMoreOpen]);

  useEffect(() => {
    if (pathname.startsWith('/register')) {
      setSelectedMode('register');
    } else if (pathname.startsWith('/find')) {
      setSelectedMode('find');
    } else if (pathname.startsWith('/mypage') || pathname.startsWith('/login')) {
      setSelectedMode('mypage');
    } else if (pathname.startsWith('/more')) {
      setSelectedMode('more');
    } else if (pathname.startsWith('/onboarding')) {
      if (tourSectionId !== null) {
        setSelectedMode(SECTION_MODE_MAP[tourSectionId] ?? 'more');
      } else {
        setSelectedMode('more');
      }
    }
  }, [pathname, setSelectedMode, tourSectionId]);

  const handleChangeMode = (mode: Mode) => {
    setSelectedMode(mode);

    if (mode === 'find' || mode === 'register') {
      navigate('/', { replace: true });
      return;
    }

    if (mode === 'mypage') {
      navigate('/mypage');
    }
  };

  const handleClickMyPage = () => {
    if (!isAuthenticated) {
      setSelectedMode('mypage');
      navigate(`/login?redirect=${encodeURIComponent('/mypage')}`);
      return;
    }

    handleChangeMode('mypage');
  };

  const goHome = () => {
    if (tourSectionId !== null) endTour();
    clearFormData();
    handleChangeMode('find');
  };

  const iconBtnBase =
    'flex h-full w-full flex-col items-center justify-center cursor-pointer transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-300';

  const activeFind = selectedMode === 'find';
  const activeReg = selectedMode === 'register';
  const activeMy = selectedMode === 'mypage';
  const activeMore = selectedMode === 'more';

  return (
    <aside className="w-full shrink-0 border-t border-gray-200 bg-white md:h-dvh md:w-18 md:border-t-0 md:border-r md:bg-teal-50">
      {/* ---------- 모바일(<md): 가로 5칸 바 ---------- */}
      <div className="grid min-h-14 grid-cols-5 items-stretch md:hidden">
        {/* 1) 찾기 */}
        <button
          data-tour="mobile-sidebar-find"
          onClick={() => handleChangeMode('find')}
          className={`${iconBtnBase} group`}
          aria-label="찾기"
        >
          <Map
            className={`h-5 w-5 ${activeFind ? 'text-teal-600' : 'text-gray-700 group-hover:text-teal-600'}`}
          />
          <span
            className={`mt-0.5 text-[10px] font-medium ${activeFind ? 'text-teal-600' : 'text-gray-700 group-hover:text-teal-600'}`}
          >
            찾기
          </span>
        </button>

        {/* 2) 추가 */}
        <button
          data-tour="mobile-sidebar-register"
          onClick={() => handleChangeMode('register')}
          className={`${iconBtnBase} group`}
          aria-label="추가"
        >
          <CirclePlus
            className={`h-5 w-5 ${activeReg ? 'text-teal-600' : 'text-gray-700 group-hover:text-teal-600'}`}
          />
          <span
            className={`mt-0.5 text-[10px] font-medium ${activeReg ? 'text-teal-600' : 'text-gray-700 group-hover:text-teal-600'}`}
          >
            추가
          </span>
        </button>

        {/* 3) 홈 */}
        <button onClick={goHome} className={`${iconBtnBase} group`} aria-label="홈">
          <House className="h-5 w-5 text-gray-700 group-hover:text-teal-600" />
          <span className="mt-0.5 text-[10px] font-medium text-gray-700 group-hover:text-teal-600">
            홈
          </span>
        </button>

        {/* 4) 마이페이지 */}
        <button
          data-tour="mobile-sidebar-mypage"
          onClick={handleClickMyPage}
          className={`${iconBtnBase} group`}
          aria-label="마이페이지"
        >
          <CircleUser
            className={`h-5 w-5 ${activeMy ? 'text-teal-600' : 'text-gray-700 group-hover:text-teal-600'}`}
          />
          <span
            className={`mt-0.5 text-[10px] font-medium ${activeMy ? 'text-teal-600' : 'text-gray-700 group-hover:text-teal-600'}`}
          >
            마이
          </span>
        </button>

        {/* 5) 로그인/로그아웃 */}
        <Authentication />
      </div>

      {/* 모바일 전용: 더보기 FAB (위저드 플로우 진입 시 숨김) */}
      {(selectedMode === 'find' || selectedMode === 'register') &&
        !pathname.startsWith('/find') &&
        !pathname.startsWith('/register') && (
          <div
            ref={moreFabRef}
            className={`fixed right-4 z-50 flex gap-2 transition-[bottom] duration-300 ease-out md:hidden ${
              isBottomSheetOpen ? 'flex-row items-center' : 'flex-col items-end'
            }`}
            style={{
              bottom:
                selectedMode === 'find'
                  ? isBottomSheetOpen
                    ? 'calc(72vh)'
                    : 'calc(3.5rem + 64px + 1rem)'
                  : '5rem',
            }}
          >
            {[
              {
                label: '가이드',
                icon: <BookOpen className="h-5 w-5" />,
                onClick: () => {
                  navigate('/onboarding');
                  setIsMoreOpen(false);
                },
              },
              {
                label: '팀 소개',
                icon: <Users className="h-5 w-5" />,
                onClick: () => {
                  navigate('/more/team');
                  setIsMoreOpen(false);
                },
              },
              {
                label: '피드백',
                icon: <MessageCircleMore className="h-5 w-5" />,
                href: 'https://forms.gle/xzvHjcbKh3vumBXQA',
              },
            ].map((item, i, arr) => {
              // 수평(시트 열림): 오른쪽(FAB)에서 가까운 항목부터 등장
              const openDelay = isBottomSheetOpen
                ? (arr.length - 1 - i) * 50
                : (arr.length - 1 - i) * 50;
              const closeDelay = isBottomSheetOpen ? i * 50 : i * 50;
              const hiddenClass = isBottomSheetOpen
                ? 'pointer-events-none translate-x-4 opacity-0'
                : 'pointer-events-none translate-y-4 opacity-0';

              return (
                <div
                  key={item.label}
                  style={{ transitionDelay: `${isMoreOpen ? openDelay : closeDelay}ms` }}
                  className={`transition-all duration-200 ease-out ${
                    isMoreOpen ? 'translate-x-0 translate-y-0 opacity-100' : hiddenClass
                  }`}
                >
                  {item.href ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setIsMoreOpen(false)}
                      className="flex flex-col items-center gap-1"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-teal-500 shadow-md transition hover:bg-teal-50">
                        {item.icon}
                      </div>
                      <span className="text-xs text-gray-600">{item.label}</span>
                    </a>
                  ) : (
                    <button onClick={item.onClick} className="flex flex-col items-center gap-1">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-teal-500 shadow-md transition hover:bg-teal-50">
                        {item.icon}
                      </div>
                      <span className="text-xs text-gray-600">{item.label}</span>
                    </button>
                  )}
                </div>
              );
            })}
            <button
              data-tour="mobile-sidebar-more"
              onClick={() => setIsMoreOpen((v) => !v)}
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full border shadow-lg transition duration-200 active:scale-95 ${
                isMoreOpen
                  ? 'border-teal-500 bg-teal-500 text-white'
                  : activeMore
                    ? 'border-gray-300 bg-white text-teal-700'
                    : 'border-gray-300 bg-white text-gray-600 hover:text-teal-500'
              }`}
              aria-label="더보기"
            >
              {isMoreOpen ? (
                <X className="h-5 w-5 transition-transform duration-200" />
              ) : (
                <Ellipsis className="h-5 w-5 transition-transform duration-200" />
              )}
            </button>
          </div>
        )}

      {/* ---------- 데스크탑(md+): 세로 레이아웃 ---------- */}
      <div className="hidden h-full flex-col md:flex">
        <button onClick={goHome} aria-label="홈으로">
          <div className="mb-4 px-2 pt-2">
            <Logo />
          </div>
        </button>

        <div className="flex shrink-0 flex-col items-center justify-center gap-0">
          {/* 찾기 */}
          <button
            data-tour="sidebar-find"
            onClick={() => handleChangeMode('find')}
            className={`${iconBtnBase} aspect-square ${activeFind ? 'bg-teal-700 text-white' : ''} group`}
          >
            <Map
              className={`h-8 w-8 ${
                activeFind ? 'text-white' : 'text-gray-600 group-hover:text-teal-500'
              }`}
            />
            <span
              className={`mt-1 text-sm ${
                activeFind ? 'text-white' : 'text-gray-600 group-hover:text-teal-500'
              }`}
            >
              찾기
            </span>
          </button>

          {/* 추가 */}
          <button
            data-tour="sidebar-register"
            onClick={() => handleChangeMode('register')}
            className={`${iconBtnBase} aspect-square ${activeReg ? 'bg-teal-700 text-white' : ''} group`}
          >
            <CirclePlus
              className={`h-8 w-8 ${
                activeReg ? 'text-white' : 'text-gray-600 group-hover:text-teal-500'
              }`}
            />
            <span
              className={`mt-1 text-sm ${
                activeReg ? 'text-white' : 'text-gray-600 group-hover:text-teal-500'
              }`}
            >
              추가
            </span>
          </button>
        </div>

        <div className="mt-auto">
          <button
            data-tour="sidebar-more"
            onClick={() => navigate('/more')}
            className={`${iconBtnBase} aspect-square ${activeMore ? 'bg-teal-700 text-white' : ''} group`}
            aria-label="더보기"
          >
            <Ellipsis
              className={`h-8 w-8 ${
                activeMore ? 'text-white' : 'text-gray-600 group-hover:text-teal-500'
              }`}
            />
            <span
              className={`mt-1 text-sm ${
                activeMore ? 'text-white' : 'text-gray-600 group-hover:text-teal-500'
              }`}
            >
              더보기
            </span>
          </button>
        </div>

        <div>
          <button
            data-tour="sidebar-mypage"
            onClick={handleClickMyPage}
            className={`${iconBtnBase} aspect-square ${activeMy ? 'bg-teal-700 text-white' : ''} group`}
            aria-label="마이페이지"
          >
            <CircleUser
              className={`h-8 w-8 ${
                activeMy ? 'text-white' : 'text-gray-600 group-hover:text-teal-500'
              }`}
            />
            <span
              className={`mt-1 text-sm ${
                activeMy ? 'text-white' : 'text-gray-600 group-hover:text-teal-500'
              }`}
            >
              마이
            </span>
          </button>
        </div>

        <div className="mb-4">
          <Authentication />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
