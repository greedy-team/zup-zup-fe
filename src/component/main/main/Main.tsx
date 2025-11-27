import { useContext, useState } from 'react';
import Map from './Map';
import LostList from './list/LostList';
import { SelectedModeContext, TotalCountContext } from '../../../contexts/AppContexts';

const Main = () => {
  const { selectedMode } = useContext(SelectedModeContext)!;
  const [isMobileListOpen, setIsMobileListOpen] = useState(false);
  const { totalCount } = useContext(TotalCountContext)!;

  return (
    <main className="min-h-0 flex-1">
      <div className="grid h-full min-h-0 min-w-0 grid-cols-1 md:grid-cols-[380px_1fr]">
        <aside className="relative hidden h-full border-r border-gray-300 md:block">
          <LostList />

          {selectedMode === 'register' && <div className="absolute inset-0 z-70 bg-gray-500/30" />}
        </aside>
        <section className="relative flex h-full min-h-0 min-w-0 flex-col">
          <div className="min-h-0 flex-1">
            <Map />
          </div>

          {selectedMode === 'find' && (
            <button
              className="absolute bottom-0 left-1/2 z-30 mb-2 w-20 -translate-x-1/2 cursor-pointer self-center rounded-full bg-teal-600 px-3 py-3 text-sm text-white hover:bg-teal-700 md:hidden"
              onClick={() => setIsMobileListOpen(true)}
            >
              분실물
              <br />
              목록
            </button>
          )}

          <div
            className={`fixed inset-0 z-40 flex transform flex-col bg-white transition-transform duration-300 ease-out md:hidden ${
              isMobileListOpen ? 'translate-y-0' : 'pointer-events-none translate-y-full'
            }`}
          >
            <div className="flex items-center justify-between border-b px-4 py-3">
              <h3 className="text-lg font-semibold">분실물 목록</h3>
              <p className="text-lg text-gray-500">총 {totalCount}건</p>
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
        </section>
      </div>
    </main>
  );
};

export default Main;
