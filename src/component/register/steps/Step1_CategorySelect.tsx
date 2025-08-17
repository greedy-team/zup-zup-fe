import type { Step1Props } from '../../../types/register';

const Step1_CategorySelect = ({ categories, selectedCategory, onSelect }: Step1Props) => (
  <div>
    <h2 className="mb-4 text-lg font-semibold text-gray-700">카테고리를 선택해주세요</h2>
    <div className="mb-4 grid grid-cols-3 gap-4 sm:grid-cols-5">
      {categories.map((category) => (
        <button
          key={category.categoryId}
          onClick={() => onSelect(category)}
          className={`flex aspect-square flex-col items-center justify-center rounded-lg border-2 p-4 transition-all ${
            selectedCategory?.categoryId === category.categoryId
              ? 'border-teal-500 bg-emerald-50'
              : 'border-gray-200 bg-white hover:border-gray-400'
          }`}
        >
          <div className="mb-2 h-10 w-10 rounded bg-gray-200">
            {/* 아이콘이 있다면 여기에 표시 */}
          </div>
          <span className="text-sm font-medium text-gray-800">{category.categoryName}</span>
        </button>
      ))}
    </div>
  </div>
);

export default Step1_CategorySelect;
