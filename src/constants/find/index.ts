export type StepKey = 'info' | 'quiz' | 'detail' | 'pledge' | 'deposit';

export const PLEDGE_TEXT = '성숙한 분실물 찾기 문화를 함께 만들어가요!';

export const FIND_STEPS: Record<'VALUABLE' | 'NON_VALUABLE', string[]> = {
  VALUABLE: ['물건 정보', '인증 퀴즈', '상세 정보', '서약 동의', '보관 장소'],
  NON_VALUABLE: ['물건 정보', '상세 정보', '서약 동의', '보관 장소'],
};

export const NON_VALUABLE_FLOW: ReadonlyArray<StepKey> = ['info', 'detail', 'pledge', 'deposit'];

export const VALUABLE_FLOW: ReadonlyArray<StepKey> = [
  'info',
  'quiz',
  'detail',
  'pledge',
  'deposit',
];

export const PAGE_TITLES: Record<StepKey, string> = {
  info: '물건 정보',
  quiz: '인증 퀴즈',
  detail: '상세 정보',
  pledge: '약관 동의',
  deposit: '보관 장소',
};

export const NEXT_BUTTON_LABEL: Record<StepKey, string> = {
  info: '다음',
  quiz: '퀴즈 제출',
  detail: '내 분실물이 맞습니다',
  pledge: '서약 제출',
  deposit: '완료',
};

export const ETC_CATEGORY_ID = 11;
