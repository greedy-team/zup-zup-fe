import ListItem, { type LostItem } from './lostListItem';

type Props = {
  items: LostItem[];
  selectedCategory: string;
  selectedArea?: string | null;
  onFindClick: (item: LostItem) => void;
};

const normKo = (s?: string | null) => (s ?? '').normalize('NFC').trim();

export default function LostList({ items, selectedCategory, selectedArea, onFindClick }: Props) {
  const areaNorm = normKo(selectedArea);
  const areaApplied = !!areaNorm && areaNorm !== '전체';
  const categoryApplied = selectedCategory !== '전체';

  const matchCategory = (i: LostItem) =>
    !categoryApplied || i.categoryName === selectedCategory || i.categoryId === selectedCategory;

  const matchArea = (i: LostItem) => {
    if (!areaApplied) return true;
    const loc = normKo(i.foundLocation);
    return loc.includes(areaNorm);
  };

  const totalCount = items.length;
  const areaCount = areaApplied ? items.filter(matchArea).length : totalCount;

  const filteredLostItems = items
    .filter(matchCategory)
    .filter(matchArea)
    .slice()
    .sort((a, b) => +new Date(b.foundDate) - +new Date(a.foundDate));

  const empty = filteredLostItems.length === 0;

  if (empty) {
    let message = '';
    if (totalCount === 0) {
      message = '현재 확인된 분실물이 존재하지 않습니다.';
    } else if (areaApplied && areaCount === 0) {
      message = '선택한 지역에 분실물이 존재하지 않습니다.';
    } else if (categoryApplied) {
      message = '선택한 카테고리에 분실물이 존재하지 않습니다.';
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
      <div className="mb-3 text-xs text-gray-500">{filteredLostItems.length}개 항목</div>

      <ul className="space-y-3 pb-6">
        {filteredLostItems.map((item) => (
          <ListItem key={item.lostItemId} item={item} onFindClick={onFindClick} />
        ))}
      </ul>
    </div>
  );
}
