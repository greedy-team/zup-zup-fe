import ListItem from './lostListItem';
import type { LostItemListItem } from '../../../types/main/lostItemListItem';

type Props = {
  items: LostItemListItem[];
  total: number;
  page: number;
  pageSize: number;
  setPage: (page: number) => void;
};

export default function LostList({ items, total, page, pageSize, setPage }: Props) {
  const empty = total === 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  console.log('list total =', total);

  if (empty) {
    return (
      <div className="px-4 py-6">
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-sm text-emerald-700">
          현재 확인된 분실물이 존재하지 않습니다.
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-4">
      <h2 className="mb-2 text-sm font-semibold text-emerald-700">분실물 목록</h2>
      <div className="mb-3 text-xs text-gray-500">총 {total}개</div>

      <ul className="space-y-3 pb-6">
        {items.map((item) => (
          <ListItem key={item.lostItemId} item={item} />
        ))}
      </ul>

      <div className="flex items-center justify-center gap-2 pb-6">
        <button
          className="rounded-md border px-3 py-1.5 text-sm hover:bg-gray-100 disabled:opacity-50"
          disabled={page <= 1}
          onClick={() => setPage(page - 1)}
        >
          이전
        </button>
        <span className="text-sm">
          {page} / {totalPages}
        </span>
        <button
          className="rounded-md border px-3 py-1.5 text-sm hover:bg-gray-100 disabled:opacity-50"
          disabled={page >= totalPages}
          onClick={() => setPage(page + 1)}
        >
          다음
        </button>
      </div>
    </div>
  );
}
