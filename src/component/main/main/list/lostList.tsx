import LostListItem from './lostListItem';
import Pagenation from './pagenation';
import type { LostListComponentProps } from '../../../../types/main/components';

export default function LostList({
  selectedMode,
  items,
  totalCount,
  page,
  setPage,
  onSelectItemForFind,
}: LostListComponentProps) {
  const empty = totalCount === 0;

  if (empty) {
    return (
      <div className="px-4 py-6">
        <div className="rounded-2xl border border-teal-200 bg-teal-50 p-6 text-sm text-teal-700">
          현재 확인된 분실물이 존재하지 않습니다.
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-y-auto px-4 py-4">
      <h2 className="mb-2 text-sm font-semibold text-teal-700">분실물 목록</h2>
      <div className="mb-3 text-xs text-gray-500">총 {totalCount}개</div>

      <div className="max-h-[61vh] min-h-0 flex-1 overflow-y-auto overscroll-contain px-2 [scrollbar-gutter:stable]">
        <ul className="m-0 list-none space-y-3 p-0 pb-6">
          {items.map((item) => (
            <LostListItem
              key={item.lostItemId}
              item={item}
              onFindClick={onSelectItemForFind}
            />
          ))}
        </ul>
      </div>

      <div className="flex items-center justify-center">
        <Pagenation page={page} totalCount={totalCount} setPage={setPage} />
      </div>
    </div>
  );
}
