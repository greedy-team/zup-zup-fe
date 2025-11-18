import type { LostItem } from '../../types/admin';
import { useAdminActions } from '../../store/hooks/useAdmin';

type PendingLostItemRowProps = {
  pendingLostItem: LostItem;
  isSelected: boolean;
  onImageClick: (urls: string[]) => void;
};

const PendingLostItemRow = ({
  pendingLostItem,
  isSelected,
  onImageClick,
}: PendingLostItemRowProps) => {
  const { toggleSelectedLostItemId } = useAdminActions();
  const handleCkeckBoxClick = () => {
    toggleSelectedLostItemId(pendingLostItem.id);
  };
  return (
    <tr className="align-top">
      <td className="border-b border-gray-200 px-2 py-1.5 text-center align-top">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={handleCkeckBoxClick}
          className="h-4 w-4"
        />
      </td>
      <td className="border-b border-gray-200 px-2 py-1.5 align-top break-words">
        {pendingLostItem.id}
      </td>

      <td className="border-b border-gray-200 px-2 py-1.5 align-top">
        {pendingLostItem.imageUrl.length === 0 ? (
          <span className="text-[11px] text-gray-400">이미지 없음</span>
        ) : (
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex flex-col items-start gap-1">
              <img
                src={pendingLostItem.imageUrl[0]}
                alt="대표 이미지"
                onClick={() => onImageClick(pendingLostItem.imageUrl)}
                className="h-16 w-16 cursor-pointer rounded border border-gray-300 object-cover sm:h-20 sm:w-20"
              />
              <span className="text-[11px] text-gray-600 sm:text-xs">
                총 {pendingLostItem.imageUrl.length}장
              </span>
            </div>
          </div>
        )}
      </td>

      <td className="border-b border-gray-200 px-2 py-1.5 align-top break-words">
        {pendingLostItem.description}
      </td>

      <td className="border-b border-gray-200 px-2 py-1.5 align-top break-words">
        {pendingLostItem.featureOptions.length === 0 ? (
          <span className="text-[11px] text-gray-400 sm:text-xs">기타 분실물 or 특징 X </span>
        ) : (
          <ul className="m-0 list-disc space-y-1 pl-4 text-[11px] sm:text-xs">
            {pendingLostItem.featureOptions.map((opt) => (
              <li key={opt.id}>
                <div className="font-semibold">{opt.quizQuestion}</div>
                <div className="text-teal-700">{opt.optionValue}</div>
              </li>
            ))}
          </ul>
        )}
      </td>

      <td className="border-b border-gray-200 px-2 py-1.5 align-top break-words">
        {pendingLostItem.schoolAreaName}
      </td>

      <td className="border-b border-gray-200 px-2 py-1.5 align-top text-[11px] break-words text-gray-600 sm:text-xs">
        {pendingLostItem.foundAreaDetail}
      </td>

      <td className="border-b border-gray-200 px-2 py-1.5 align-top break-words">
        {pendingLostItem.depositArea}
      </td>

      <td className="border-b border-gray-200 px-2 py-1.5 align-top break-words">
        {new Date(pendingLostItem.createdAt).toLocaleString()}
      </td>
    </tr>
  );
};

export default PendingLostItemRow;
