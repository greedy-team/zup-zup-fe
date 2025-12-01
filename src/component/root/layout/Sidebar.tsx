import Authentication from './Authentication';
import Logo from './Logo';
import { useContext, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MapPinned, CirclePlus, CircleUser } from 'lucide-react';
import { SelectedAreaIdContext, SelectedModeContext } from '../../../contexts/AppContexts';
import { useAuthFlag } from '../../../store/hooks/useAuth';
import { clearFormData } from '../../../utils/register/registerStorage';
import type { Mode } from '../../../contexts/AppContexts';

const Sidebar = () => {
  const { selectedMode, setSelectedMode } = useContext(SelectedModeContext)!;
  const { setSelectedAreaId } = useContext(SelectedAreaIdContext)!;
  const isAuthenticated = useAuthFlag();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    if (pathname.startsWith('/register')) {
      setSelectedMode('register');
    } else if (pathname.startsWith('/find')) {
      setSelectedMode('find');
    } else if (pathname.startsWith('/mypage')) {
      setSelectedMode('mypage');
    }
  }, [pathname, setSelectedMode]);

  const handleChangeMode = (mode: Mode) => {
    setSelectedMode(mode);

    if (mode === 'find' || mode === 'register') {
      setSelectedAreaId(0);
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
    clearFormData();
    handleChangeMode('find');
  };

  const iconBtnBase =
    'flex h-full w-full flex-col items-center justify-center cursor-pointer transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-300';

  const activeFind = selectedMode === 'find';
  const activeReg = selectedMode === 'register';
  const activeMy = selectedMode === 'mypage';

  return (
    <aside className="w-full shrink-0 border-t border-gray-300 bg-teal-50 md:h-dvh md:w-18 md:border-t-0 md:border-r">
      {/* ---------- 모바일(<md): 가로 5칸 바 ---------- */}
      <div className="grid min-h-18 grid-cols-5 items-stretch md:hidden">
        {/* 1) 찾기 */}
        <button
          onClick={() => handleChangeMode('find')}
          className={`${iconBtnBase} ${activeFind ? 'bg-teal-700 text-white' : ''} group`}
          aria-label="찾기"
        >
          <MapPinned
            className={`h-6 w-6 sm:h-15 sm:w-15 ${
              activeFind ? 'text-white' : 'text-gray-600 group-hover:text-teal-500'
            }`}
          />
          <span
            className={`text-xs sm:text-lg ${
              activeFind ? 'text-white' : 'text-gray-600 group-hover:text-teal-500'
            }`}
          >
            찾기
          </span>
        </button>

        {/* 2) 추가 */}
        <button
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
            className={`text-xs sm:text-lg ${
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
            className={`text-xs sm:text-lg ${
              activeMy ? 'text-white' : 'text-gray-600 group-hover:text-teal-500'
            }`}
          >
            마이
          </span>
        </button>

        {/* 5) 로그인 / 로그아웃 */}
        <Authentication />
      </div>

      {/* ---------- 데스크탑(md+): 세로 레이아웃 ---------- */}
      <div className="hidden h-full flex-col md:flex">
        <button onClick={goHome} aria-label="홈으로">
          <div className="mb-4 px-2 pt-2">
            <Logo />
          </div>
        </button>

        <div className="flex flex-shrink-0 flex-col items-center justify-center gap-0">
          {/* 찾기 */}
          <button
            onClick={() => handleChangeMode('find')}
            className={`${iconBtnBase} aspect-square ${activeFind ? 'bg-teal-700 text-white' : ''} group`}
          >
            <MapPinned
              className={`h-8 w-8 ${
                activeFind ? 'text-white' : 'text-gray-600 group-hover:text-teal-500'
              }`}
            />
            <span
              className={`text-sm ${
                activeFind ? 'text-white' : 'text-gray-600 group-hover:text-teal-500'
              }`}
            >
              찾기
            </span>
          </button>

          {/* 추가 */}
          <button
            onClick={() => handleChangeMode('register')}
            className={`${iconBtnBase} aspect-square ${activeReg ? 'bg-teal-700 text-white' : ''} group`}
          >
            <CirclePlus
              className={`h-8 w-8 ${
                activeReg ? 'text-white' : 'text-gray-600 group-hover:text-teal-500'
              }`}
            />
            <span
              className={`text-sm ${
                activeReg ? 'text-white' : 'text-gray-600 group-hover:text-teal-500'
              }`}
            >
              추가
            </span>
          </button>
        </div>

        <div className="mt-auto mb-4">
          <button
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
              className={`text-sm ${
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
