import Authentication from './Authentication';
import Logo from './Logo';
import { useContext } from 'react';
import { SelectedAreaIdContext, SelectedModeContext } from '../../../contexts/AppContexts';
import { useLocation, useNavigate } from 'react-router-dom';
import PlusIcon from '../../../../assets/plus.svg?react';
import FindIcon from '../../../../assets/find.svg?react';
import ProfileIcon from '../../../../assets/profile.png';
import { useAuthFlag } from '../../../contexts/AuthFlag';

const Sidebar = () => {
  const { selectedMode, setSelectedMode } = useContext(SelectedModeContext)!;
  const { isAuthenticated } = useAuthFlag();
  const { setSelectedAreaId } = useContext(SelectedAreaIdContext)!;
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isOnMain = pathname === '/';
  const handleChangeMode = (mode: 'register' | 'find') => {
    if (!isOnMain) return;
    setSelectedMode(mode);
    const url = new URLSearchParams();
    setSelectedAreaId(0);
    navigate({ search: `${url.toString()}` }, { replace: true });
  };
  return (
    <aside className="h-dvh w-18 shrink-0 border-r border-gray-300 bg-teal-50">
      <div className="flex h-full flex-col">
        <div className="mb-4">
          <Logo />
        </div>
        <div className="flex flex-shrink-0 flex-col items-center justify-center gap-0 px-0">
          <button
            onClick={() => handleChangeMode('find')}
            className={`hover:gray-100 group flex aspect-square w-full cursor-pointer flex-col items-center justify-center ${selectedMode === 'find' ? 'bg-teal-700' : 'bg-teal-50'} `}
          >
            <FindIcon
              className={`h-8 w-8 ${selectedMode === 'find' ? 'text-white' : 'text-gray-600 group-hover:text-teal-500'}`}
            />
            <span
              className={`${selectedMode === 'find' ? 'text-white' : 'text-gray-600 group-hover:text-teal-500'}`}
            >
              찾기
            </span>
          </button>
          <button
            onClick={() => handleChangeMode('register')}
            className={`hover:gray-100 group flex aspect-square w-full cursor-pointer flex-col items-center justify-center ${selectedMode === 'register' ? 'bg-teal-700' : 'bg-teal-50'} `}
          >
            <PlusIcon
              className={`h-8 w-8 ${selectedMode === 'register' ? 'text-white' : 'text-gray-600 group-hover:text-teal-500'}`}
            />
            <span
              className={` ${selectedMode === 'register' ? 'text-white' : 'text-gray-600 group-hover:text-teal-500'}`}
            >
              추가
            </span>
          </button>
        </div>

        <div className="mt-auto mb-4">
          {isAuthenticated && (
            <div className="mt-auto mb-4 flex flex-shrink-0 flex-col items-center justify-center">
              <img src={ProfileIcon} alt="profile" className="h-8 w-8" />
            </div>
          )}
          <Authentication />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
