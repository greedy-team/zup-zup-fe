import ListItem from './lostListItem';
import type { LostItemListItem } from '../../../types/main/lostItemListItem';

type Props = {
  items: LostItemListItem[];
};

export default function LostList({ items }: Props) {
  const empty = items.length === 0;

  if (empty) {
    let message = '';
    if (items.length === 0) {
      message = '현재 확인된 분실물이 존재하지 않습니다.';
    }

    return (
      <div className="px-4 py-6">
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-sm text-emerald-700">
          {message}
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-4">
      <h2 className="mb-2 text-sm font-semibold text-emerald-700">분실물 목록</h2>
      <div className="mb-3 text-xs text-gray-500">{items.length}개 항목</div>

      <ul className="space-y-3 pb-6">
        {items.map((item) => (
          <ListItem key={item.lostItemId} item={item} />
        ))}
      </ul>
    </div>
  );
}
