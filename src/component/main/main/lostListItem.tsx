import { useState } from 'react';

export type LostItem = {
  status: 'registered' | 'found';
  lostItemId: number;
  categoryId: string;
  categoryName: string;
  foundLocation: string;
  foundDate: string; // ISO
  imageUrl?: string;
  detail?: string;
};

function formatKST(iso: string) {
  try {
    return new Date(iso).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return iso;
  }
}

function StatusBadge({ status }: { status: LostItem['status'] }) {
  const isFound = status === 'found';
  const cls = isFound
    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
    : 'bg-gray-50 text-gray-700 border-gray-200';
  return (
    <span className={`rounded-full border px-2 py-0.5 text-[11px] ${cls}`}>
      {isFound ? '습득물' : '분실물'}
    </span>
  );
}

type Props = {
  item: LostItem;
  className?: string;
  onFindClick: (item: LostItem) => void;
};

export default function ListItem({ item, className = '', onFindClick }: Props) {
  const [imgError, setImgError] = useState(false);

  return (
    <li className={`rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5 ${className}`}>
      <div className="flex gap-3">
        {item.imageUrl && !imgError ? (
          <img
            src={item.imageUrl}
            alt={item.categoryName}
            className="h-16 w-16 shrink-0 rounded-xl bg-emerald-50 object-cover"
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : (
          <div className="h-16 w-16 shrink-0 rounded-xl bg-emerald-50" />
        )}

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="truncate text-sm font-medium" title={item.categoryName}>
              {item.categoryName}
            </span>
            <StatusBadge status={item.status} />
          </div>

          <div className="mt-1 truncate text-xs text-gray-500" title={item.foundLocation}>
            {item.foundLocation} · {formatKST(item.foundDate)}
          </div>

          <div className="mt-2 flex gap-2">
            <button
              onClick={() => onFindClick(item)}
              className="rounded-lg border border-emerald-200 px-2.5 py-1 text-xs text-emerald-700 hover:bg-emerald-50"
            >
              분실물 찾기
            </button>
          </div>
        </div>
      </div>
    </li>
  );
}
