import Authentication from './Authentication';
import Logo from './Logo';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Map, CirclePlus, CircleUser, Ellipsis, LogIn, LogOut } from 'lucide-react';
import { useSelectedMode, useSetSelectedMode } from '../../../store/hooks/useMainStore';
import { useAuthFlag } from '../../../store/hooks/useAuth';
import { useLogoutMutation } from '../../../api/auth/hooks/useAuth';
import { useRedirectToLoginKeepPath } from '../../../utils/auth/loginRedirect';
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
  const tourSectionIdx = useOnboardingStore((s) => s.tourSectionIdx);
  const endTour = useOnboardingStore((s) => s.actions.endTour);
  const logoutMutation = useLogoutMutation();
  const redirectToLoginKeepPath = useRedirectToLoginKeepPath();

  const handleFloatingAuth = () => {
    if (isAuthenticated) {
      logoutMutation.mutate(undefined, { onSuccess: () => navigate('/', { replace: true }) });
    } else {
      redirectToLoginKeepPath();
    }
  };

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
      if (tourSectionIdx !== null) {
        setSelectedMode(SECTION_MODE_MAP[tourSectionIdx] ?? 'more');
      } else {
        setSelectedMode('more');
      }
    }
  }, [pathname, setSelectedMode, tourSectionIdx]);

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
    if (tourSectionIdx !== null) endTour();
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

        {/* 5) 더보기 */}
        <button
          data-tour="mobile-sidebar-more"
          onClick={() => navigate('/more')}
          className={`${iconBtnBase} ${activeMore ? 'bg-teal-700 text-white' : ''} group`}
          aria-label="더보기"
        >
          <Ellipsis
            className={`h-6 w-6 sm:h-15 sm:w-15 ${
              activeMore ? 'text-white' : 'text-gray-600 group-hover:text-teal-500'
            }`}
          />
          <span
            className={`mt-1 text-xs sm:text-lg ${
              activeMore ? 'text-white' : 'text-gray-600 group-hover:text-teal-500'
            }`}
          >
            더보기
          </span>
        </button>
      </div>

      {/* 모바일 전용: 로그인/로그아웃 플로팅 버튼 */}
      <button
        onClick={handleFloatingAuth}
        className="fixed right-4 bottom-22 z-50 flex cursor-pointer flex-col items-center justify-center gap-0.5 rounded-full border border-gray-300 bg-teal-50 px-3 py-2 text-gray-600 shadow-lg transition hover:text-teal-500 active:scale-95 md:hidden"
        aria-label={isAuthenticated ? '로그아웃' : '로그인'}
      >
        {isAuthenticated ? (
          <>
            <LogOut className="h-5 w-5" />
            <span className="text-xs">로그아웃</span>
          </>
        ) : (
          <>
            <LogIn className="h-5 w-5" />
            <span className="text-xs">로그인</span>
          </>
        )}
      </button>

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
