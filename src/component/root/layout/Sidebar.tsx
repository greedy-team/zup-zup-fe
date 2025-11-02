import Authentication from './Authentication';
import Logo from './Logo';
import { useContext } from 'react';
import { SelectedAreaIdContext, SelectedModeContext } from '../../../contexts/AppContexts';
import { useNavigate } from 'react-router-dom';
import PlusIcon from '../../../../assets/plus.svg?react';
import FindIcon from '../../../../assets/find.svg?react';

const Sidebar = () => {
  const { setSelectedMode } = useContext(SelectedModeContext)!;
  const { setSelectedAreaId } = useContext(SelectedAreaIdContext)!;
  const navigate = useNavigate();
  const handleRegisterButtonClick = () => {
    setSelectedMode('register');
    const url = new URLSearchParams();
    setSelectedAreaId(0);
    navigate({ search: `${url.toString()}` }, { replace: true });
  };
  const handleFindButtonClick = () => {
    setSelectedMode('find');
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
            onClick={handleFindButtonClick}
            className="hover:gray-100 group flex aspect-square w-full flex-col items-center justify-center bg-teal-50 transition"
          >
            <FindIcon className="h-8 w-8 text-gray-600 transition-colors group-hover:text-teal-500" />
            <span className="text-gray-600 transition-colors group-hover:text-teal-500">목록</span>
          </button>
          <button
            onClick={handleRegisterButtonClick}
            className="hover:gray-100 group flex aspect-square w-full flex-col items-center justify-center bg-teal-50 transition"
          >
            <PlusIcon className="h-8 w-8 text-gray-600 transition-colors group-hover:text-teal-500" />
            <span className="text-gray-600 transition-colors group-hover:text-teal-500">추가</span>
          </button>
        </div>
        <div className="mt-auto">
          <Authentication />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
