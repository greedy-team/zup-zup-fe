import { categoryFeatures, resetCategoryFeatures, type CategoryFeatures } from '../db/features.db';

const COLOR = {
  featureId: 1,
  featureText: '색상',
  quizQuestion: '다음 중 분실물의 색상으로 가장 적절한 것은 무엇인가요?',
  options: [
    { optionId: 1, text: '빨강' },
    { optionId: 2, text: '파랑' },
    { optionId: 3, text: '검정' },
    { optionId: 4, text: '회색' },
    { optionId: 5, text: '갈색' },
    { optionId: 6, text: '기타' },
  ],
};

const BRAND = {
  featureId: 2,
  featureText: '브랜드',
  quizQuestion: '이 분실물의 브랜드는 무엇인가요?',
  options: [
    { optionId: 10, text: '애플' },
    { optionId: 11, text: '삼성' },
    { optionId: 12, text: '소니' },
    { optionId: 13, text: 'LG' },
    { optionId: 14, text: '기타' },
  ],
};

const BAG_TYPE = {
  featureId: 3,
  featureText: '종류',
  quizQuestion: '이 가방의 종류는 무엇인가요?',
  options: [
    { optionId: 20, text: '백팩' },
    { optionId: 21, text: '메신저/크로스백' },
    { optionId: 22, text: '핸드백/에코백' },
    { optionId: 23, text: '클러치' },
    { optionId: 24, text: '파우치' },
    { optionId: 25, text: '캐리어' },
    { optionId: 26, text: '기타' },
  ],
};

const BANK = {
  featureId: 4,
  featureText: '은행',
  quizQuestion: '카드의 은행사는 어디인가요?',
  options: [
    { optionId: 30, text: '국민' },
    { optionId: 31, text: '신한' },
    { optionId: 32, text: '우리' },
    { optionId: 33, text: '하나' },
    { optionId: 34, text: '농협' },
    { optionId: 35, text: '기타' },
  ],
};

const WALLET_TYPE = {
  featureId: 5,
  featureText: '종류',
  quizQuestion: '이 지갑의 종류는 무엇인가요?',
  options: [
    { optionId: 40, text: '장지갑' },
    { optionId: 41, text: '반지갑' },
    { optionId: 42, text: '카드지갑' },
    { optionId: 43, text: '머니클립' },
    { optionId: 44, text: '기타' },
  ],
};

const ACC_TYPE = {
  featureId: 6,
  featureText: '종류',
  quizQuestion: '이 악세서리의 종류는 무엇인가요?',
  options: [
    { optionId: 50, text: '팔찌' },
    { optionId: 51, text: '반지' },
    { optionId: 52, text: '목걸이' },
    { optionId: 53, text: '귀걸이' },
    { optionId: 54, text: '시계' },
    { optionId: 55, text: '기타' },
  ],
};

const ACC_COLOR = {
  featureId: 7,
  featureText: '색상',
  quizQuestion: '이 악세서리의 색상은 무엇인가요?',
  options: [
    { optionId: 60, text: '골드' },
    { optionId: 61, text: '실버' },
    { optionId: 62, text: '블랙' },
    { optionId: 63, text: '화이트' },
    { optionId: 64, text: '기타' },
  ],
};

const PAYMENT_NETWORK = {
  featureId: 8,
  featureText: '결제망',
  quizQuestion: '이 카드의 결제망은 어디인가요?',
  options: [
    { optionId: 80, text: 'VISA' },
    { optionId: 81, text: 'MasterCard' },
    { optionId: 82, text: 'UnionPay' },
    { optionId: 83, text: 'AMERICAN EXPRESS' },
    { optionId: 84, text: 'JCB' },
    { optionId: 85, text: '기타' },
  ],
};

const ID_CARD_TYPE = {
  featureId: 9,
  featureText: 'ID 카드 종류',
  quizQuestion: '이 ID 카드의 종류는 무엇인가요?',
  options: [
    { optionId: 90, text: '신분증' },
    { optionId: 91, text: '여권' },
    { optionId: 92, text: '면허증' },
    { optionId: 93, text: '학생증' },
    { optionId: 94, text: '기타' },
  ],
};

const BIRTH_MONTH = {
  featureId: 10,
  featureText: '생일 월',
  quizQuestion: '이 분실물 주인의 생일 월은 무엇인가요?',
  options: Array.from({ length: 12 }, (_, i) => ({
    optionId: 100 + i,
    text: `${i + 1}월`,
  })),
};

const DORMITORY_TYPE = {
  featureId: 11,
  featureText: '기숙사 카드 타입',
  quizQuestion: '이 기숙사 카드의 타입은 무엇인가요?',
  options: [
    { optionId: 120, text: 'A' },
    { optionId: 121, text: 'B' },
  ],
};

const DORMITORY_ROOM_NUMBER = {
  featureId: 12,
  featureText: '기숙사 카드 호수',
  quizQuestion: '이 기숙사 카드의 호수는 무엇인가요?',
  options: Array.from({ length: 12 }, (_, i) => ({
    optionId: 160 + i,
    text: `${i + 1}호`,
  })),
};

const PAD_BRAND = {
  featureId: 13,
  featureText: '패드 브랜드',
  quizQuestion: '이 패드의 브랜드는 무엇인가요?',
  options: [
    { optionId: 130, text: '삼성' },
    { optionId: 131, text: '애플' },
    { optionId: 132, text: '레노버' },
    { optionId: 133, text: '기타' },
  ],
};

const LAPTOP_BRAND = {
  featureId: 14,
  featureText: '노트북 브랜드',
  quizQuestion: '이 노트북의 브랜드는 무엇인가요?',
  options: [
    { optionId: 140, text: '삼성' },
    { optionId: 141, text: '애플' },
    { optionId: 142, text: 'LG' },
    { optionId: 143, text: '기타' },
  ],
};

const ELECTRONIC_SOUND_DEVICE_BRAND = {
  featureId: 15,
  featureText: '전자 음향기기 브랜드',
  quizQuestion: '이 전자 음향기기의 브랜드는 무엇인가요?',
  options: [
    { optionId: 150, text: '삼성' },
    { optionId: 151, text: '애플' },
    { optionId: 152, text: '소니' },
    { optionId: 153, text: '보스' },
    { optionId: 154, text: '기타' },
  ],
};

export function seedCategoryFeatures() {
  resetCategoryFeatures();
  const rows: CategoryFeatures[] = [
    { categoryId: 1, features: [COLOR, BRAND] },
    { categoryId: 2, features: [COLOR, BAG_TYPE] },
    { categoryId: 3, features: [BANK, PAYMENT_NETWORK] },
    { categoryId: 4, features: [ID_CARD_TYPE, BIRTH_MONTH] },
    { categoryId: 5, features: [DORMITORY_ROOM_NUMBER, DORMITORY_TYPE] },
    { categoryId: 6, features: [WALLET_TYPE, COLOR] },
    { categoryId: 7, features: [ACC_TYPE, ACC_COLOR] },
    { categoryId: 8, features: [PAD_BRAND, COLOR] },
    { categoryId: 9, features: [LAPTOP_BRAND, COLOR] },
    { categoryId: 10, features: [ELECTRONIC_SOUND_DEVICE_BRAND, COLOR] },
    { categoryId: 99, features: [] },
  ];

  categoryFeatures.push(...rows);
}
