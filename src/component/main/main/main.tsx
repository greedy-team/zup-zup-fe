import LostList from './lostList';
import Map from './map';
import type { LostItemListItem } from '../../../types/main/lostItemListItem';
import type { SchoolArea } from '../../../types/map/map';
import type { LostItemSummaryRow } from '../../../types/main/lostItemSummeryRow';
import type { SelectedMode } from '../../../types/main/mode';
type Props = {
  items: LostItemListItem[];
  total: number;
  selectedLat: number | null;
  setSelectedLat: (lat: number | null) => void;
  selectedLng: number | null;
  setSelectedLng: (lng: number | null) => void;
  setIsRegisterConfirmModalOpen: () => void;
  setSelectedAreaId: (areaId: number) => void;
  selectedAreaId: number;
  schoolAreas: SchoolArea[];
  page: number;
  pageSize: number;
  setPage: (page: number) => void;
  lostItemSummary: LostItemSummaryRow[];
  selectedMode: SelectedMode;
  setSelectedMode: () => void;
  toggleMode: () => void;
};

const Main = ({
  items,
  total,
  selectedLat,
  setSelectedLat,
  selectedLng,
  setSelectedLng,
  setIsRegisterConfirmModalOpen,
  setSelectedAreaId,
  selectedAreaId,
  schoolAreas,
  page,
  pageSize,
  setPage,
  lostItemSummary,
  selectedMode,
  setSelectedMode,
  toggleMode,
}: Props) => {
  const canSubmit = selectedLat != null && selectedLng != null;

  return (
    <main className="min-h-0 flex-1">
      <div className="grid h-full min-h-0 grid-cols-[360px_1fr]">
        <aside className="h-full overflow-y-auto border-r">
          <LostList items={items} total={total} page={page} pageSize={pageSize} setPage={setPage} />
        </aside>
        <section className="relative h-full min-h-0">
          <Map
            setIsRegisterConfirmModalOpen={setIsRegisterConfirmModalOpen}
            setSelectedLat={setSelectedLat}
            setSelectedLng={setSelectedLng}
            schoolAreas={schoolAreas}
            setSelectedAreaId={setSelectedAreaId}
            selectedAreaId={selectedAreaId}
            lostItemSummary={lostItemSummary}
            selectedMode={selectedMode}
            setSelectedMode={setSelectedMode}
          />
          <button
            className="absolute right-5 bottom-5 z-10 rounded-full bg-blue-600 px-4 py-3 text-sm text-white shadow-lg hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-600"
            onClick={toggleMode}
          >
            {selectedMode === 'register' ? '분실물 조회' : '분실물 추가'}
          </button>
        </section>
      </div>
    </main>
  );
};

export default Main;
