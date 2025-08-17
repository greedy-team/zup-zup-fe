import Map from './map';
import LostList from './list/lostList';
import type { MainComponentProps } from '../../../types/main/components';

const Main = ({ pagination, mapSelection, mode, lists, areas, ui }: MainComponentProps) => {
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
      </div>
    </main>
  );
};

export default Main;
