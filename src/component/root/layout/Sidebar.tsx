import Authentication from './Authentication';
import Logo from './Logo';
import { useContext, useEffect } from 'react';
import { SelectedAreaIdContext, SelectedModeContext } from '../../../contexts/AppContexts';
import { useAuthFlag } from '../../../contexts/AuthFlag';
import { useLocation, useNavigate } from 'react-router-dom';
import PlusIcon from '../../../../assets/plus.svg?react';
import FindIcon from '../../../../assets/find.svg?react';
import ProfileIcon from '../../../../assets/profile.svg?react';

const Sidebar = () => {
  const { selectedMode, setSelectedMode } = useContext(SelectedModeContext)!;
  const { setSelectedAreaId } = useContext(SelectedAreaIdContext)!;
  const { isAuthenticated } = useAuthFlag();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    if (pathname.startsWith('/register')) {
      setSelectedMode('register');
    }
    if (pathname.startsWith('/find')) {
      setSelectedMode('find');
    }
  }, [pathname, setSelectedMode]);

  const handleChangeMode = (mode: 'register' | 'find') => {
    setSelectedMode(mode);
    const url = new URLSearchParams();
    setSelectedAreaId(0);
    navigate({ pathname: '/', search: `${url.toString()}` }, { replace: true });
  };

  const goHome = () => navigate('/');
  const iconBtn = 'flex w-full h-full flex-col items-center justify-center cursor-pointer';

  const activeFind = selectedMode === 'find';
  const activeReg = selectedMode === 'register';

  return (
    <aside className="w-full shrink-0 border-t border-gray-300 bg-teal-50 md:h-dvh md:w-18 md:border-t-0 md:border-r">
      {/* ---------- 모바일(<md): 가로 5칸 바 ---------- */}
      <div className="grid grid-cols-5 place-items-center md:hidden">
        {/* 1) 찾기 */}
        <button
          onClick={() => handleChangeMode('find')}
          className={`${iconBtn} ${activeFind ? 'bg-teal-700 text-white' : ''}`}
          aria-label="찾기"
        >
          <FindIcon
            className={`h-6 w-6 sm:h-15 sm:w-15 ${activeFind ? 'text-white' : 'text-gray-600 group-hover:text-teal-500'}`}
          />
          <span
            className={`text-xs sm:text-lg ${activeFind ? 'text-white' : 'text-gray-600 group-hover:text-teal-500'}`}
          >
            찾기
          </span>
        </button>

        {/* 2) 추가 */}
        <button
          onClick={() => handleChangeMode('register')}
          className={`${iconBtn} ${activeReg ? 'bg-teal-700 text-white' : ''}`}
          aria-label="추가"
        >
          <PlusIcon
            className={`h-6 w-6 sm:h-15 sm:w-15 ${activeReg ? 'text-white' : 'text-gray-600 group-hover:text-teal-500'}`}
          />
          <span
            className={`text-xs sm:text-lg ${activeReg ? 'text-white' : 'text-gray-600 group-hover:text-teal-500'}`}
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

        {/* 4) 마이페이지(추후 구현 예정, 현재는 로그인 페이지로 redirect) */}
        <button
          onClick={() => (isAuthenticated ? navigate('') : navigate('/login'))}
          className={`${iconBtn}`}
          aria-label="마이페이지"
        >
          <ProfileIcon className="h-6 w-6 sm:h-15 sm:w-15" />
          <span className="text-xs text-gray-600 group-hover:text-teal-500 sm:text-lg">마이</span>
        </button>

        {/* 5) 로그인 */}
        <Authentication />
      </div>

      {/* ---------- 데스크탑(md+): 기존 세로 레이아웃 ---------- */}
      <div className="hidden h-full flex-col md:flex">
        <div className="mb-4 px-2 pt-2">
          <Logo />
        </div>

        <div className="flex flex-shrink-0 flex-col items-center justify-center gap-0">
          {/* 찾기 */}
          <button
            onClick={() => handleChangeMode('find')}
            className={`${iconBtn} aspect-square ${activeFind ? 'bg-teal-700 text-white' : ''}`}
          >
            <FindIcon
              className={`h-8 w-8 ${activeFind ? 'text-white' : 'text-gray-600 group-hover:text-teal-500'}`}
            />
            <span
              className={`text-sm ${activeFind ? 'text-white' : 'text-gray-600 group-hover:text-teal-500'}`}
            >
              찾기
            </span>
          </button>

          {/* 추가 */}
          <button
            onClick={() => handleChangeMode('register')}
            className={`${iconBtn} aspect-square ${activeReg ? 'bg-teal-700 text-white' : ''}`}
          >
            <PlusIcon
              className={`h-8 w-8 ${activeReg ? 'text-white' : 'text-gray-600 group-hover:text-teal-500'}`}
            />
            <span
              className={`text-sm ${activeReg ? 'text-white' : 'text-gray-600 group-hover:text-teal-500'}`}
            >
              추가
            </span>
          </button>
        </div>

        <div className="mt-auto mb-4">
          <button
            onClick={() => (isAuthenticated ? navigate('') : navigate('/login'))}
            className={`${iconBtn} aspect-square`}
            aria-label="마이페이지"
          >
            <ProfileIcon className="h-8 w-8" />
            <span className="text-sm text-gray-600 group-hover:text-teal-500">마이</span>
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
