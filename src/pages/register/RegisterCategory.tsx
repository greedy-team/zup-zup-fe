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

const getCategoryIcon = (name: string) => {
  const trimmed = name.trim();

  switch (trimmed) {
    case '핸드폰':
      return Smartphone;

    case '가방':
      return Briefcase;

    case '결제 카드':
      return CreditCard;

    case 'ID 카드':
      return IdCard;

    case '기숙사 카드':
      return IdCardLanyard;

    case '지갑':
      return Wallet;

    case '액세서리':
      return Gem;

    case '패드':
      return Tablet;

    case '노트북':
      return Laptop;

    case '전자 음향기기':
      return Headphones;

    case '기타':
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
      <div
        role="radiogroup"
        className="mb-4 grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6"
      >
        {categories.map((category) => {
          const Icon = getCategoryIcon(category.name);
          const isSelected = selectedCategory?.id === category.id;

          return (
            <label
              key={category.id}
              className={`flex aspect-square flex-col items-center justify-center border-2 p-4 ${COMMON_BUTTON_CLASSNAME} ${
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
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded sm:h-13 sm:w-13">
                <Icon className="h-7 w-7 sm:h-8 sm:w-8" aria-hidden="true" />
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
