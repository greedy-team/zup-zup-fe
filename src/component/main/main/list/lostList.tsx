import LostListItem from './lostListItem';
import Pagenation from './pagenation';
import type { LostListProps } from '../../../../types/main/components';

export default function LostList({ items, totalCount, page, setPage }: LostListProps) {
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
    <div className="px-4 py-4">
      <h2 className="mb-2 text-sm font-semibold text-teal-700">분실물 목록</h2>
      <div className="mb-3 text-xs text-gray-500">총 {totalCount}개</div>

      <ul className="space-y-3 pb-6">
        {items.map((item) => (
          <LostListItem key={item.lostItemId} item={item} />
        ))}
      </ul>

      <div className="flex items-center justify-center">
        <Pagenation page={page} totalCount={totalCount} setPage={setPage} />
      </div>
    </div>
  );
}
