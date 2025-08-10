import { useState } from 'react';

export type LostItem = {
  status: 'registered' | 'found';
  lostItemId: number;
  categoryId: string;
  categoryName: string;
  foundLocation: string;
  foundDate: string; // ISO
  imageUrl?: string;
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
    <span className={`text-[11px] px-2 py-0.5 rounded-full border ${cls}`}>
      {isFound ? '습득물' : '분실물'}
    </span>
  );
}

type Props = {
  item: LostItem;
  className?: string;
};

export default function ListItem({ item, className = '' }: Props) {
  const [imgError, setImgError] = useState(false);

  return (
    <li className={`rounded-2xl bg-white shadow-sm ring-1 ring-black/5 p-4 ${className}`}>
      <div className="flex gap-3">
        {item.imageUrl && !imgError ? (
          <img
            src={item.imageUrl}
            alt={item.categoryName}
            className="w-16 h-16 rounded-xl object-cover bg-emerald-50 shrink-0"
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : (
          <div className="w-16 h-16 rounded-xl bg-emerald-50 shrink-0" />
        )}

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium truncate">{item.categoryName}</span>
            <StatusBadge status={item.status} />
          </div>

          <div className="text-xs text-gray-500 mt-1 truncate">
            {item.foundLocation} · {formatKST(item.foundDate)}
          </div>

          <div className="mt-2 flex gap-2">
            <button className="text-xs px-2.5 py-1 rounded-lg border border-emerald-200 text-emerald-700 hover:bg-emerald-50">
              분실물 찾기
            </button>
          </div>
        </div>
      </div>
    </li>
  );
}
