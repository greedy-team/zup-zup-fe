import { useState } from 'react';
import type { LostItemListItem } from '../../../../types/main/mainApi';

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

function StatusBadge({ status }: { status: LostItemListItem['status'] }) {
  const isFound = status === 'found';
  const cls = isFound
    ? 'bg-teal-50 text-teal-700 border-teal-200'
    : 'bg-gray-50 text-gray-700 border-gray-200';
  return (
    <span className={`rounded-full border px-2 py-0.5 text-[11px] ${cls}`}>
      {isFound ? '습득물' : '분실물'}
    </span>
  );
}

type Props = {
  item: LostItemListItem;
  className?: string;
};

export default function LostListItem({ item, className = '' }: Props) {
  const [imgError, setImgError] = useState(false);

  return (
    <li className={`relative rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5 ${className}`}>
      <div className="flex gap-2">
        {item.imageUrl && !imgError ? (
          <img
            src={item.imageUrl}
            alt={item.categoryName}
            className="h-16 w-16 shrink-0 rounded-xl bg-teal-50 object-cover"
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : (
          <div className="h-16 w-16 shrink-0 rounded-xl bg-teal-50" />
        )}

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="truncate text-sm font-medium" title={item.categoryName}>
              {item.categoryName}
            </span>
            <StatusBadge status={item.status} />
          </div>

          <div className="mt-1 truncate text-xs text-gray-500" title={item.foundLocation}>
            {item.foundLocation}
          </div>
          <div className="mt-1 truncate text-xs text-gray-500" title={item.foundDate}>
            {formatKST(item.foundDate)}
          </div>

          <button className="absolute right-3 bottom-3 rounded-lg border border-teal-200 px-2.5 py-1 text-xs text-teal-700 hover:bg-teal-50">
            분실물 찾기
          </button>
        </div>
      </div>
    </li>
  );
}
