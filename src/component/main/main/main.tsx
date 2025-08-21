import { useState } from 'react';
import RegisterModal from '../../register/RegisterModal';
import FindModal from '../../find/FindModal';
import Map from './map';
import LostList from './list/lostList';
import type { MainComponentProps } from '../../../types/main/components';
import type { LostItemListItem } from '../../../types/lost/lostApi';

const Main = ({
  pagination,
  mapSelection,
  mode,
  lists,
  areas,
  ui,
  isRegisterModalOpen,
  isFindModalOpen,
}: MainComponentProps) => {
  const [selectedItemForFind, setSelectedItemForFind] = useState<LostItemListItem | null>(null);

  const handleOpenFindModal = (item: LostItemListItem) => {
    setSelectedItemForFind(item);
    ui.setIsFindModalOpen(true);
  };

  const handleCloseFindModal = () => {
    ui.setIsFindModalOpen(false);
    setSelectedItemForFind(null);
  };

  return (
    <main className="min-h-0 flex-1">
      <div className="grid h-full min-h-0 grid-cols-[380px_1fr]">
        <aside className="relative h-full border-r">
          <LostList
            selectedMode={mode.selectedMode}
            items={lists.items}
            totalCount={pagination.totalCount}
            page={pagination.page}
            setPage={pagination.setPage}
            onFindButtonClick={handleOpenFindModal}
          />

          {mode.selectedMode === 'register' && (
            <div className="absolute inset-0 z-10 bg-gray-500/30" />
          )}
        </aside>
        <section className="relative h-full min-h-0">
          <Map
            setIsRegisterConfirmModalOpen={ui.setIsRegisterConfirmModalOpen}
            schoolAreas={areas.schoolAreas}
            setSelectedAreaId={mapSelection.setSelectedAreaId}
            selectedAreaId={mapSelection.selectedAreaId}
            lostItemSummary={areas.lostItemSummary}
            selectedMode={mode.selectedMode}
          />
          <button
            className="absolute right-5 bottom-5 z-10 rounded-full bg-teal-600 px-4 py-3 text-sm text-white shadow-lg hover:bg-teal-700 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-600"
            onClick={mode.toggleMode}
          >
            {mode.selectedMode === 'register' ? '분실물 조회' : '분실물 추가'}
          </button>
        </section>
        {isFindModalOpen && selectedItemForFind && (
          <FindModal item={selectedItemForFind} onClose={handleCloseFindModal} />
        )}

        {isRegisterModalOpen && (
          <RegisterModal
            onClose={() => ui.setIsRegisterModalOpen(false)}
            schoolAreaId={mapSelection.selectedAreaId}
            onModeChange={mode.toggleMode}
          />
        )}
      </div>
    </main>
  );
};

export default Main;
