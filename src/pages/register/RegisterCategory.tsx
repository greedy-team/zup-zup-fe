import { useOutletContext } from 'react-router-dom';
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
import { COMMON_BUTTON_CLASSNAME } from '../../constants/common';
import type { RegisterContextType } from '../../types/register';

const getCategoryIcon = (id: number) => {
  switch (id) {
    case 1:
      return Smartphone;
    case 2:
      return Briefcase;
    case 3:
      return CreditCard;
    case 4:
      return IdCard;
    case 5:
      return IdCardLanyard;
    case 6:
      return Wallet;
    case 7:
      return Gem;
    case 8:
      return Tablet;
    case 9:
      return Laptop;
    case 10:
      return Headphones;
    default:
      return Ellipsis;
  }
};

const RegisterCategory = () => {
  const { categories, selectedCategory, setSelectedCategory } =
    useOutletContext<RegisterContextType>();

  return (
    <div>
      <h2 className="mb-4 text-lg font-normal text-gray-700">카테고리를 선택해주세요</h2>
      <div role="radiogroup" className="mb-4 grid grid-cols-4 gap-4">
        {categories.map((category) => {
          const Icon = getCategoryIcon(category.id);
          const isSelected = selectedCategory?.id === category.id;

          return (
            <label
              key={category.id}
              className={`flex aspect-square flex-col items-center justify-center border-2 p-1.5 ${COMMON_BUTTON_CLASSNAME} ${
                isSelected
                  ? 'border-teal-500 bg-emerald-50 focus-visible:ring-teal-300'
                  : 'border-gray-200 bg-white hover:border-gray-400 focus-visible:ring-gray-300'
              }`}
            >
              <input
                type="radio"
                name="category"
                value={category.id}
                checked={isSelected}
                onChange={() => setSelectedCategory(category)}
                className="hidden"
              />
              <div className="mb-2 flex h-6 w-6 items-center justify-center rounded sm:h-14 sm:w-14">
                <Icon className="h-8 w-8 sm:h-10 sm:w-10" aria-hidden="true" />
              </div>
              <span className="text-xs font-medium text-gray-800 sm:text-sm">{category.name}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
};

export default RegisterCategory;
