import { useOutletContext } from 'react-router-dom';
import { categoryIcons } from '../../constants/category';
import type { RegisterContextType } from '../../types/register';

const RegisterCategory = () => {
  const { categories, selectedCategory, setSelectedCategory } =
    useOutletContext<RegisterContextType>();

  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold text-gray-700">카테고리를 선택해주세요</h2>
      <div className="mb-4 grid grid-cols-3 gap-4 sm:grid-cols-5">
        {categories.map((category) => (
          <button
            key={category.categoryId}
            onClick={() => setSelectedCategory(category)}
            className={`flex aspect-square flex-col items-center justify-center rounded-lg border-2 p-4 transition-all ${
              selectedCategory?.categoryId === category.categoryId
                ? 'border-teal-500 bg-emerald-50'
                : 'border-gray-200 bg-white hover:border-gray-400'
            }`}
          >
            <div className="mb-2 h-10 w-10 rounded bg-gray-200">
              <img src={categoryIcons[category.categoryId]} alt={category.categoryName} />
            </div>
            <span className="text-sm font-medium text-gray-800">{category.categoryName}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default RegisterCategory;
