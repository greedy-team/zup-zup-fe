import type { LostItem } from '../../types/admin';
import { useSelectedLostItemIds } from '../../store/hooks/useAdmin';
import PendingLostItemRow from './PendingLostItemRow';

type PendingLostItemListProps = {
  pendingLostItems: LostItem[];
  onImageClick: (urls: string[]) => void;
};

const PendingLostItemList = ({ pendingLostItems, onImageClick }: PendingLostItemListProps) => {
  const selectedLostItemIds = useSelectedLostItemIds();
  return (
    <div className="flex-1 overflow-x-auto overflow-y-auto">
      <table className="w-full min-w-[1000px] border-collapse text-xs sm:text-sm">
        <thead>
          <tr>
            {[
              '선택',
              'ID',
              '이미지',
              '분실물 상세 설명',
              '특징',
              '습득 위치',
              '습득 상세 위치',
              '보관 장소',
              '등록일',
            ].map((label) => (
              <th
                key={label}
                className="sticky top-0 z-10 border-b border-gray-300 bg-gray-50 px-2 py-1.5 text-left text-[11px] font-semibold text-gray-700 sm:text-xs"
              >
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {pendingLostItems.map((item) => (
            <PendingLostItemRow
              key={item.id}
              pendingLostItem={item}
              isSelected={selectedLostItemIds.includes(item.id)}
              onImageClick={onImageClick}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PendingLostItemList;
