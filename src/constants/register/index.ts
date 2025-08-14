import type { CategoryGroup } from '../../types/register';

export const REGISTER_PROCESS_STEPS = {
  STEPS: ['카테고리 선택', '상세 정보', '최종 확인'],
};

export const CATEGORY_GROUPS: CategoryGroup[] = [
  {
    groupName: '휴대폰',
    categories: [
      { id: 'phone1', name: '휴대폰' },
      { id: 'phone2', name: '스마트폰' },
    ],
  },
  {
    groupName: '가방',
    categories: [
      { id: 'bag1', name: '백팩' },
      { id: 'bag2', name: '토트백' },
    ],
  },
  {
    groupName: '결제 카드',
    categories: [
      { id: 'card1', name: '신용카드' },
      { id: 'card2', name: '체크카드' },
    ],
  },
  {
    groupName: 'ID 카드',
    categories: [
      { id: 'idcard1', name: '주민등록증' },
      { id: 'idcard2', name: '학생증' },
    ],
  },
  {
    groupName: '기숙사 카드',
    categories: [{ id: 'dorm1', name: '기숙사 출입카드' }],
  },
  {
    groupName: '지갑',
    categories: [{ id: 'wallet1', name: '지갑' }],
  },
  {
    groupName: '악세서리(금속)',
    categories: [
      { id: 'metal1', name: '반지' },
      { id: 'metal2', name: '목걸이' },
    ],
  },
  {
    groupName: '패드',
    categories: [{ id: 'pad1', name: '태블릿' }],
  },
  {
    groupName: '노트북',
    categories: [{ id: 'laptop1', name: '노트북' }],
  },
  {
    groupName: '전자 음향기기',
    categories: [
      { id: 'audio1', name: '이어폰' },
      { id: 'audio2', name: '헤드폰' },
    ],
  },
  {
    groupName: '기타',
    categories: [{ id: 'etc1', name: '기타' }],
  },
];
