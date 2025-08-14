import Map from './map';
import LostList from './list/lostList';
import type { SchoolArea } from '../../../types/map/map';
import type { MapSelectionState, ModeState, PaginationState } from '../../../types/main/main';
import type { Category, LostItemListItem, LostItemSummaryRow } from '../../../types/main/mainApi';

type Props = {
  pagination: PaginationState;
  mapSelection: MapSelectionState;
  mode: ModeState;
  lists: {
    items: LostItemListItem[];
    categories: Category[];
  };
  areas: {
    schoolAreas: SchoolArea[];
    lostItemSummary: LostItemSummaryRow[];
  };
  ui: {
    setIsRegisterConfirmModalOpen: (b: boolean) => void;
  };
};

const Main = ({ pagination, mapSelection, mode, lists, areas, ui }: Props) => {
  return (
    <main className="min-h-0 flex-1">
      <div className="grid h-full min-h-0 grid-cols-[360px_1fr]">
        <aside className="h-full overflow-y-auto border-r">
          <LostList
            items={lists.items}
            total={pagination.total}
            page={pagination.page}
            setPage={pagination.setPage}
          />
        </aside>
        <section className="relative h-full min-h-0">
          <Map
            setIsRegisterConfirmModalOpen={ui.setIsRegisterConfirmModalOpen}
            setSelectedCoordinates={mapSelection.setSelectedCoordinates}
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
