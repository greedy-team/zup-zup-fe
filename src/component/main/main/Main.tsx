import { useContext, useState, useEffect } from 'react';
import Map from './Map';
import LostList from './list/LostList';
import {
  SelectedModeContext,
  TotalCountContext,
  SelectedAreaIdContext,
} from '../../../contexts/AppContexts';
import { COMMON_BUTTON_CLASSNAME } from '../../../constants/common';

const Main = () => {
  const { selectedMode } = useContext(SelectedModeContext)!;
  const { selectedAreaId } = useContext(SelectedAreaIdContext)!;
  const [isMobileListOpen, setIsMobileListOpen] = useState(false);
  const [isDesktopListOpen, setIsDesktopListOpen] = useState(true);
  const [shouldRenderAside, setShouldRenderAside] = useState(selectedMode !== 'register');
  const { totalCount } = useContext(TotalCountContext)!;

  useEffect(() => {
    if (selectedMode !== 'register' && selectedAreaId !== 0) {
      setIsDesktopListOpen(true);
    }
  }, [selectedAreaId, selectedMode]);

  useEffect(() => {
    if (selectedMode === 'find') {
      setShouldRenderAside(true);
      setIsDesktopListOpen(true);
    } else if (selectedMode === 'register') {
      setShouldRenderAside(true);
      setIsDesktopListOpen(false);
      setIsMobileListOpen(false);
    }
  }, [selectedMode]);

  return (
    <main className="min-h-0 flex-1">
      <div className="grid h-full min-h-0 min-w-0 grid-cols-1 md:grid-cols-1">
        <section className="relative flex h-full min-h-0 min-w-0 flex-col overflow-x-hidden">
          {shouldRenderAside && (
            <aside
              className={`absolute top-0 left-0 z-30 hidden h-full w-[380px] border-r border-gray-300 bg-white transition-transform duration-300 ease-out md:block ${
                isDesktopListOpen ? 'translate-x-0' : '-translate-x-full'
              }`}
              onTransitionEnd={(e) => {
                if (e.propertyName !== 'transform') return;
                if (selectedMode === 'register' && !isDesktopListOpen) {
                  setShouldRenderAside(false);
                }
              }}
            >
              <LostList />

              {selectedMode !== 'register' && (
                <button
                  className="absolute top-1/2 right-0 z-80 hidden h-12 w-6 translate-x-full -translate-y-1/2 cursor-pointer items-center justify-center rounded-r-md bg-teal-600 text-white shadow-lg transition-all duration-300 hover:bg-teal-700 md:flex"
                  onClick={() => setIsDesktopListOpen(!isDesktopListOpen)}
                  aria-label={isDesktopListOpen ? '목록 닫기' : '목록 열기'}
                >
                  <svg
                    className={`h-5 w-5 transition-transform duration-300 ${isDesktopListOpen ? '' : 'rotate-180'}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              )}
            </aside>
          )}

          <div className="min-h-0 flex-1">
            <Map isDesktopListOpen={isDesktopListOpen} />
          </div>

          {selectedMode === 'find' && (
            <button
              className="absolute bottom-0 left-1/2 z-30 mb-2 w-20 -translate-x-1/2 cursor-pointer self-center rounded-full bg-teal-600 px-3 py-3 text-sm text-white hover:bg-teal-700 focus-visible:ring-1 focus-visible:ring-teal-300 focus-visible:outline-none active:translate-y-[1px] md:hidden"
              onClick={() => setIsMobileListOpen(true)}
            >
              분실물
              <br />
              목록
            </button>
          )}

          <div
            className={`absolute inset-0 z-40 flex transform flex-col bg-white transition-transform duration-300 ease-out md:hidden ${
              isMobileListOpen ? 'translate-y-0' : 'pointer-events-none translate-y-full'
            }`}
          >
            <div className="flex items-center justify-between border-b px-4 py-3">
              <h3 className="text-lg font-semibold">분실물 목록</h3>
              <p className="text-lg text-gray-500">총 {totalCount}건</p>
              <button
                className={`${COMMON_BUTTON_CLASSNAME} border border-gray-300 px-3 py-1 text-sm text-gray-700 hover:bg-gray-50`}
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
