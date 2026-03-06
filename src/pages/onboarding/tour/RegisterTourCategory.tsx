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
import { COMMON_BUTTON_CLASSNAME } from '../../../constants/common';

const SAMPLE_CATEGORIES = [
  { id: 1, name: '핸드폰', Icon: Smartphone },
  { id: 2, name: '가방', Icon: Briefcase },
  { id: 3, name: '결제 카드', Icon: CreditCard },
  { id: 4, name: 'ID 카드', Icon: IdCard },
  { id: 5, name: '기숙사 카드', Icon: IdCardLanyard },
  { id: 6, name: '지갑', Icon: Wallet },
  { id: 7, name: '액세서리', Icon: Gem },
  { id: 8, name: '패드', Icon: Tablet },
  { id: 9, name: '노트북', Icon: Laptop },
  { id: 10, name: '전자 음향기기', Icon: Headphones },
  { id: 11, name: '기타', Icon: Ellipsis },
];

const SELECTED_ID = 1; // 핸드폰 예시 선택

export default function RegisterTourCategory() {
  return (
    <div>
      <h2 className="mb-4 text-lg font-normal text-gray-700">카테고리를 선택해주세요</h2>
      <div className="mb-4 grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
        {SAMPLE_CATEGORIES.map(({ id, name, Icon }) => {
          const isSelected = id === SELECTED_ID;
          return (
            <div
              key={id}
              className={`flex aspect-square flex-col items-center justify-center border-2 p-4 ${COMMON_BUTTON_CLASSNAME} ${
                isSelected
                  ? 'border-teal-500 bg-emerald-50'
                  : 'border-gray-200 bg-white'
              }`}
            >
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded sm:h-13 sm:w-13">
                <Icon className="h-7 w-7 sm:h-8 sm:w-8" aria-hidden="true" />
              </div>
              <span className="text-xs font-medium text-gray-800 sm:text-sm">{name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
