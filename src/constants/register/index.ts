import type { CategoryGroup } from '../../types/register';

export const REGISTER_PROCESS_STEPS = {
  STEPS: ['카테고리 선택', '상세 정보', '최종 확인'],
};

export const CATEGORY_GROUPS: CategoryGroup[] = [
  { category: '휴대폰' },
  { category: '가방' },
  { category: '결제 카드' },
  { category: 'ID 카드' },
  { category: '기숙사 카드' },
  { category: '지갑' },
  { category: '악세서리(금속)' },
  { category: '패드' },
  { category: '노트북' },
  { category: '전자 음향기기' },
  { category: '기타' },
];
