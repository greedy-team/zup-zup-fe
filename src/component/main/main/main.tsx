import LostList from './lostList';
import Map from './map';
import type { LostItemListItem } from '../../../types/main/lostItemListItem';
import type { SchoolArea } from '../../../types/map/map';

type Props = {
  items: LostItemListItem[];
  selectedLat: number | null;
  setSelectedLat: (lat: number | null) => void;
  selectedLng: number | null;
  setSelectedLng: (lng: number | null) => void;
  setIsRegisterConfirmModalOpen: (isOpen: boolean) => void;
  setSelectedAreaId: (areaId: number) => void;
  selectedAreaId: number;
  schoolAreas: SchoolArea[];
};

const Main = ({
  items,
  selectedLat,
  setSelectedLat,
  selectedLng,
  setSelectedLng,
  setIsRegisterConfirmModalOpen,
  setSelectedAreaId,
  selectedAreaId,
  schoolAreas,
}: Props) => {
  const canSubmit = selectedLat != null && selectedLng != null;

  return (
    <main className="min-h-0 flex-1">
      <div className="grid h-full min-h-0 grid-cols-[360px_1fr]">
        <aside className="h-full overflow-y-auto border-r">
          <LostList items={items} />
        </aside>
        <section className="relative h-full min-h-0">
          <Map
            setSelectedLat={setSelectedLat}
            setSelectedLng={setSelectedLng}
            schoolAreas={schoolAreas}
            setSelectedAreaId={setSelectedAreaId}
            selectedAreaId={selectedAreaId}
          />
          <button
            disabled={!canSubmit}
            className="absolute right-5 bottom-5 z-10 rounded-full bg-blue-600 px-4 py-3 text-sm text-white shadow-lg hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-600"
            onClick={() => {
              setIsRegisterConfirmModalOpen(true);
            }}
          >
            분실물 추가
          </button>
        </section>
      </div>
    </main>
  );
};

export default Main;
