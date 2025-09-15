import { useOutletContext } from 'react-router-dom';
import type { RegisterContextType } from '../../types/register';

const RegisterCategory = () => {
  const { categories, selectedCategory, setSelectedCategory } =
    useOutletContext<RegisterContextType>();

  return (
    <div>
      <h2 className="mb-4 text-lg font-normal text-gray-700">카테고리를 선택해주세요</h2>
      <div
        role="radiogroup"
        className="mb-4 grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6"
      >
        {categories.map((category) => (
          <label
            key={category.id}
            className={`flex aspect-square cursor-pointer flex-col items-center justify-center rounded-lg border-2 p-4 transition-all ${
              selectedCategory?.id === category.id
                ? 'border-teal-500 bg-emerald-50'
                : 'border-gray-200 bg-white hover:border-gray-400'
            }`}
          >
            <input
              type="radio"
              name="category"
              value={category.id}
              checked={selectedCategory?.id === category.id}
              onChange={() => setSelectedCategory(category)}
              className="hidden"
            />
            <div className="mb-2 h-13 w-13 rounded sm:h-11 sm:w-11">
              <img
                src={category.iconUrl}
                alt={category.name}
                className="h-full w-full object-contain"
              />
            </div>
            <span className="text-sm font-medium text-gray-800 lg:text-sm">{category.name}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default RegisterCategory;
