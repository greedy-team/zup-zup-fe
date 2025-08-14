import type { CategoryFeature } from '../../types/register';
import type { RegisterFormData } from '../../types/register';

export const fetchCategoryFeatures = async (categoryId: string): Promise<CategoryFeature[]> => {
  console.log(`[API] Fetching features for category: ${categoryId}`);
  // 실제로는 categoryId에 따라 다른 질문을 반환
  await new Promise((resolve) => setTimeout(resolve, 500));
  return [
    { id: 'q1', question: '무슨 색상인가요?', options: ['검정', '갈색', '흰색', '기타'] },
    { id: 'q2', question: '무슨 브랜드인가요?', options: ['삼성', '애플', '샤오미', '기타'] },
  ];
};

export const postLostItem = async (data: RegisterFormData): Promise<{ success: boolean }> => {
  // 실제로는 분실물 정보를 서버로 POST 요청
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return { success: true };
};
