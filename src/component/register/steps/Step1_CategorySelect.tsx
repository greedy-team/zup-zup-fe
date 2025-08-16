import { CATEGORY_GROUPS } from '../../../constants/register';

type Props = {
  selectedCategory: string | null;
  onSelect: (category: string) => void;
};

const Step1_CategorySelect = ({ selectedCategory, onSelect }: Props) => (
  <div>
    <h2 className="mb-4 text-lg font-semibold text-gray-700">카테고리를 선택해주세요</h2>
    <div className="mb-4 grid grid-cols-3 gap-4 sm:grid-cols-5">
      {CATEGORY_GROUPS.map((group) => (
        <button
          key={group.category}
          onClick={() => onSelect(group.category)}
          className={`flex aspect-square flex-col items-center justify-center rounded-lg border-2 p-4 transition-all ${
            selectedCategory === group.category
              ? 'border-teal-500 bg-emerald-50'
              : 'border-gray-200 bg-white hover:border-gray-400'
          }`}
        >
          <div className="mb-2 h-10 w-10 rounded bg-gray-200">
            {/* 아이콘이 있다면 여기에 표시 */}
          </div>
          <span className="text-sm font-medium text-gray-800">{group.category}</span>
        </button>
      ))}
    </div>
  </div>
);

export default Step1_CategorySelect;
