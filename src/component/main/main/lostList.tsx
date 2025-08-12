import ListItem, { type LostItem } from './lostListItem';

type Props = {
  items: LostItem[];
  selectedCategory: string;
  area?: string | null;
};

const normKo = (s?: string | null) => (s ?? '').normalize('NFC').trim();

export default function List({ items, selectedCategory, area }: Props) {
  const areaNorm = normKo(area);
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

  const data = items
    .filter(matchCategory)
    .filter(matchArea)
    .slice()
    .sort((a, b) => +new Date(b.foundDate) - +new Date(a.foundDate));

  const empty = data.length === 0;

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
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 text-emerald-700 p-6 text-sm">
          {message}
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-4">
      <h2 className="text-sm font-semibold text-emerald-700 mb-2">분실물 목록</h2>
      <div className="text-xs text-gray-500 mb-3">{data.length}개 항목</div>

      <ul className="space-y-3 pb-6">
        {data.map((item) => (
          <ListItem key={item.lostItemId} item={item} />
        ))}
      </ul>
    </div>
  );
}
