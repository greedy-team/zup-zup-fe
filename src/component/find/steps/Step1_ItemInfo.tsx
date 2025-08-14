import type { LostItem } from '../../main/main/lostListItem';

const Step1_ItemInfo = ({ item }: { item: LostItem }) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-semibold text-gray-600">분실물 카테고리</label>
        <div className="mt-1 rounded-lg bg-gray-100 p-3 text-gray-800">{item.categoryName}</div>
      </div>
      <div>
        <label className="text-sm font-semibold text-gray-600">발견 장소</label>
        <div className="mt-1 rounded-lg bg-gray-100 p-3 text-gray-800">{item.foundLocation}</div>
      </div>
      <div>
        <label className="text-sm font-semibold text-gray-600">발견 날짜</label>
        <div className="mt-1 rounded-lg bg-gray-100 p-3 text-gray-800">
          {new Date(item.foundDate).toLocaleDateString('ko-KR')}
        </div>
      </div>
    </div>
  );
};
export default Step1_ItemInfo;
