import { useContext, useState } from 'react';
import Map from './Map';
import LostList from './list/LostList';
import { SelectedModeContext } from '../../../contexts/AppContexts';
import { useNavigate } from 'react-router-dom';

const Main = () => {
  const { selectedMode, setSelectedMode } = useContext(SelectedModeContext)!;
  const [isMobileListOpen, setIsMobileListOpen] = useState(false);

  const navigate = useNavigate();

  const handleRegisterButtonClick = () => {
    setSelectedMode(selectedMode === 'register' ? 'append' : 'register');
    const url = new URLSearchParams();
    url.set('schoolAreaId', '0');
    url.set('page', '1');
    url.set('categoryId', '0');
    navigate(`${url.toString()}`);
  };

  return (
    <main className="min-h-0 flex-1">
      <div className="grid h-full min-h-0 min-w-0 grid-cols-1 md:grid-cols-[380px_1fr]">
        <aside className="relative hidden h-full border-r md:block">
          <LostList />

          {selectedMode === 'register' && <div className="absolute inset-0 z-10 bg-gray-500/30" />}
        </aside>
        <section className="relative h-full min-h-0 min-w-0">
          <Map />
          <button
            className="absolute bottom-5 left-1/2 z-10 block -translate-x-1/2 rounded-full bg-teal-600 px-4 py-3 text-sm text-white shadow-lg hover:bg-teal-700 md:hidden"
            onClick={() => setIsMobileListOpen(true)}
          >
            분실물
            <br />
            목록
          </button>

          {isMobileListOpen && (
            <div className="absolute inset-0 z-20 flex flex-col bg-white md:hidden">
              <div className="flex items-center justify-between border-b px-4 py-3">
                <h3 className="text-sm font-semibold">분실물 목록</h3>
                <button
                  className="rounded-md border border-gray-300 px-3 py-1 text-sm text-gray-700 hover:bg-gray-50"
                  onClick={() => setIsMobileListOpen(false)}
                >
                  닫기
                </button>
              </div>
              <div className="min-h-0 flex-1 overflow-y-auto">
                <LostList />
              </div>
            </div>
          )}

          <button
            className="absolute right-5 bottom-5 z-10 rounded-full bg-teal-600 px-4 py-3 text-sm text-white shadow-lg hover:bg-teal-700 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-600"
            onClick={handleRegisterButtonClick}
          >
            {selectedMode === 'register' ? '분실물 조회' : '분실물 추가'}
          </button>
        </section>
      </div>
    </main>
  );
};

export default Main;
