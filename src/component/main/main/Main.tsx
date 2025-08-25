import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import Map from './Map';
import LostList from './list/LostList';
import { SelectedModeContext } from '../../../contexts/AppContexts';

const Main = ({
  pagination,
  mapSelection,
  mode,
  lists,
  areas,
  ui,
}: MainComponentProps) => {
  const [selectedItemForFind, setSelectedItemForFind] = useState<LostItemListItem | null>(null);
  const navigate = useNavigate();
  const { selectedMode, setSelectedMode } = useContext(SelectedModeContext)!;

  // 모드 토글 핸들러
  const toggleMode = () => {
    setSelectedMode(selectedMode === 'register' ? 'append' : 'register');
  };

  const handleRegisterButtonClick = () => {
    if (mode.selectedMode === 'register') {
      mode.toggleMode();
    } else {
      navigate(`/register/${mapSelection.selectedAreaId}`);
    }
  };

  return (
    <main className="min-h-0 flex-1">
      <div className="grid h-full min-h-0 grid-cols-[380px_1fr]">
        <aside className="relative h-full border-r">
          <LostList />

          {selectedMode === 'register' && <div className="absolute inset-0 z-10 bg-gray-500/30" />}
        </aside>
        <section className="relative h-full min-h-0">
          <Map />
          <button
            className="absolute right-5 bottom-5 z-10 rounded-full bg-teal-600 px-4 py-3 text-sm text-white shadow-lg hover:bg-teal-700 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-600"
            onClick={handleRegisterButtonClick}
            disabled={mode.selectedMode !== 'register' && !mapSelection.selectedAreaId}
          >
            {selectedMode === 'register' ? '분실물 조회' : '분실물 추가'}
          </button>
        </section>
      </div>
    </main>
  );
};

export default Main;
