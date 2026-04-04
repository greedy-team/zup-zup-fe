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
} from 'lucide-react';
import { useSelectedMode, useSetSelectedMode } from '../../../store/hooks/useMainStore';
import { useAuthFlag } from '../../../store/hooks/useAuth';
import { clearFormData } from '../../../utils/register/registerStorage';
import type { Mode } from '../../../store/slices/mainSlice';
import { useOnboardingStore } from '../../../store/onboardingStore';
import { SECTION_MODE_MAP } from '../../onboarding/onboardingSteps';

const Sidebar = () => {
  const selectedMode = useSelectedMode();
  const setSelectedMode = useSetSelectedMode();
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
    } else if (pathname.startsWith('/mypage')) {
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
      navigate('/login');
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
    <aside className="w-full shrink-0 border-t border-gray-300 bg-teal-50 md:h-dvh md:w-18 md:border-t-0 md:border-r">
      {/* ---------- 모바일(<md): 가로 5칸 바 ---------- */}
      <div className="grid min-h-18 grid-cols-5 items-stretch md:hidden">
        {/* 1) 찾기 */}
        <button
          data-tour="mobile-sidebar-find"
          onClick={() => handleChangeMode('find')}
          className={`${iconBtnBase} ${activeFind ? 'bg-teal-700 text-white' : ''} group`}
          aria-label="찾기"
        >
          <Map
            className={`h-6 w-6 sm:h-15 sm:w-15 ${
              activeFind ? 'text-white' : 'text-gray-600 group-hover:text-teal-500'
            }`}
          />
          <span
            className={`mt-1 text-xs sm:text-lg ${
              activeFind ? 'text-white' : 'text-gray-600 group-hover:text-teal-500'
            }`}
          >
            찾기
          </span>
        </button>

        {/* 2) 추가 */}
        <button
          data-tour="mobile-sidebar-register"
          onClick={() => handleChangeMode('register')}
          className={`${iconBtnBase} ${activeReg ? 'bg-teal-700 text-white' : ''} group`}
          aria-label="추가"
        >
          <CirclePlus
            className={`h-6 w-6 sm:h-15 sm:w-15 ${
              activeReg ? 'text-white' : 'text-gray-600 group-hover:text-teal-500'
            }`}
          />
          <span
            className={`mt-1 text-xs sm:text-lg ${
              activeReg ? 'text-white' : 'text-gray-600 group-hover:text-teal-500'
            }`}
          >
            추가
          </span>
        </button>

        {/* 3) 로고(중앙, 홈 이동) */}
        <button
          onClick={goHome}
          className="flex h-full w-full items-center justify-center"
          aria-label="홈으로"
        >
          <div className="scale-90">
            <Logo />
          </div>
        </button>

        {/* 4) 마이페이지 */}
        <button
          data-tour="mobile-sidebar-mypage"
          onClick={handleClickMyPage}
          className={`${iconBtnBase} ${activeMy ? 'bg-teal-700 text-white' : ''} group`}
          aria-label="마이페이지"
        >
          <CircleUser
            className={`h-6 w-6 sm:h-15 sm:w-15 ${
              activeMy ? 'text-white' : 'text-gray-600 group-hover:text-teal-500'
            }`}
          />
          <span
            className={`mt-1 text-xs sm:text-lg ${
              activeMy ? 'text-white' : 'text-gray-600 group-hover:text-teal-500'
            }`}
          >
            마이
          </span>
        </button>

        {/* 5) 로그인/로그아웃 */}
        <Authentication />
      </div>

      {/* 모바일 전용: 더보기 FAB */}
      <div
        ref={moreFabRef}
        className="fixed right-4 bottom-24 z-50 flex flex-col items-end gap-2 md:hidden"
      >
        {[
          {
            label: '서비스 소개',
            icon: <BookOpen className="h-4 w-4 shrink-0" />,
            onClick: () => {
              navigate('/onboarding');
              setIsMoreOpen(false);
            },
          },
          {
            label: '줍줍 소개',
            icon: <Users className="h-4 w-4 shrink-0" />,
            onClick: () => {
              navigate('/more/team');
              setIsMoreOpen(false);
            },
          },
          {
            label: '피드백 남기기',
            icon: <MessageCircleMore className="h-4 w-4 shrink-0" />,
            href: 'https://forms.gle/xzvHjcbKh3vumBXQA',
          },
        ].map((item, i, arr) => (
          <div
            key={item.label}
            style={{
              transitionDelay: isMoreOpen ? `${(arr.length - 1 - i) * 50}ms` : `${i * 50}ms`,
            }}
            className={`transition-all duration-200 ease-out ${
              isMoreOpen
                ? 'translate-y-0 opacity-100'
                : 'pointer-events-none translate-y-4 opacity-0'
            }`}
          >
            {item.href ? (
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsMoreOpen(false)}
                className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 shadow-md transition hover:text-teal-500"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-teal-50 text-teal-500">
                  {item.icon}
                </div>
                <span>{item.label}</span>
              </a>
            ) : (
              <button
                onClick={item.onClick}
                className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 shadow-md transition hover:text-teal-500"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-teal-50 text-teal-500">
                  {item.icon}
                </div>
                <span>{item.label}</span>
              </button>
            )}
          </div>
        ))}
        <button
          data-tour="mobile-sidebar-more"
          onClick={() => setIsMoreOpen((v) => !v)}
          className={`flex h-12 w-12 items-center justify-center rounded-full border shadow-lg transition duration-200 active:scale-95 ${
            isMoreOpen
              ? 'border-teal-500 bg-teal-500 text-white'
              : activeMore
                ? 'border-gray-300 bg-teal-50 text-teal-700'
                : 'border-gray-300 bg-teal-50 text-gray-600 hover:text-teal-500'
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
