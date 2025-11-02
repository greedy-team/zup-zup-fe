import Authentication from './Authentication';
import Logo from './Logo';
import { useContext } from 'react';
import { SelectedAreaIdContext, SelectedModeContext } from '../../../contexts/AppContexts';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const { selectedMode, setSelectedMode } = useContext(SelectedModeContext)!;
  const { setSelectedAreaId } = useContext(SelectedAreaIdContext)!;
  const navigate = useNavigate();
  const handleRegisterButtonClick = () => {
    setSelectedMode(selectedMode === 'register' ? 'append' : 'register');
    const url = new URLSearchParams();
    setSelectedAreaId(0);
    navigate({ search: `${url.toString()}` }, { replace: true });
  };
  return (
    <aside className="h-dvh w-18 shrink-0 border-r bg-teal-50">
      <div className="md: flex h-full flex-col justify-between">
        <div>
          <Logo />
        </div>
        <button
          className="flex flex-shrink-0 items-center gap-3"
          onClick={handleRegisterButtonClick}
        >
          {selectedMode === 'register' ? '분실물 조회' : '분실물 추가'}
        </button>
        <div className="mt-4">
          <Authentication />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
