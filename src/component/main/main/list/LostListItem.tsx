import { useContext, useState } from 'react';
import type {
  ListItemComponentProps,
  StatusBadgeComponentProps,
} from '../../../../types/main/components';
import { useNavigate } from 'react-router-dom';
import { SelectedAreaIdContext } from '../../../../contexts/AppContexts';
import { COMMON_BUTTON_CLASSNAME } from '../../../../constants/common';
import {
  Smartphone,
  Briefcase,
  CreditCard,
  IdCard,
  IdCardLanyard,
  Wallet,
  Gem,
  Tablet,
  Laptop,
  Headphones,
  Ellipsis,
} from 'lucide-react';

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

const getCategoryIcon = (categoryName: string) => {
  const trimmedCategoryName = categoryName.trim();

  switch (trimmedCategoryName) {
    case '핸드폰':
      return Smartphone;

    case '가방':
      return Briefcase;

    case '결제 카드':
      return CreditCard;

    case 'ID 카드':
      return IdCard;

    case '기숙사 카드':
      return IdCardLanyard;

    case '지갑':
      return Wallet;

    case '액세서리':
      return Gem;

    case '패드':
      return Tablet;

    case '노트북':
      return Laptop;

    case '전자 음향기기':
      return Headphones;

    case '기타':
    default:
      return Ellipsis;
  }
};

const isEtcCategory = (name: string) => name.trim() === '기타';

function StatusBadge({ status }: StatusBadgeComponentProps) {
  const isFound = status === 'found';
  const badgeClass = isFound
    ? 'bg-teal-50 text-teal-700 border-teal-200'
    : 'bg-gray-50 text-gray-700 border-gray-200';
  return (
    <span className={`rounded-full border px-2 py-0.5 text-[11px] ${badgeClass}`}>
      {isFound ? '습득물' : '분실물'}
    </span>
  );
}

export default function LostListItem({ item, className }: ListItemComponentProps) {
  const [imgError, setImgError] = useState(false);

  const navigate = useNavigate();
  const { setSelectedAreaId } = useContext(SelectedAreaIdContext)!;

  const etcCategory = isEtcCategory(item.categoryName);
  const CategoryIcon = getCategoryIcon(item.categoryName);

  return (
    <li className={`relative rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5 ${className}`}>
      <div className="flex gap-2">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-teal-50">
          {etcCategory && item.imageUrl && !imgError ? (
            <img
              src={item.imageUrl}
              alt={item.categoryName}
              className="h-full w-full object-cover"
              onError={() => setImgError(true)}
              loading="lazy"
            />
          ) : (
            <CategoryIcon className="h-11 w-11 text-teal-700" aria-hidden="true" />
          )}
        </div>

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

          <button
            className={`${COMMON_BUTTON_CLASSNAME} absolute right-3 bottom-3 border border-teal-400 px-2.5 py-1 text-xs text-teal-700 hover:bg-teal-50 focus-visible:ring-teal-300`}
            onClick={() => {
              setSelectedAreaId(0);
              navigate(`/find/${item.lostItemId}`);
            }}
          >
            분실물 찾기
          </button>
        </div>
      </div>
    </li>
  );
}
