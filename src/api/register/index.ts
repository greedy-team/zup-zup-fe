import type { Category, Feature, LostItemRegisterRequest, SchoolArea } from '../../types/register';

// 카테고리 목록을 가져오는 API 함수
export const fetchCategories = async (): Promise<Category[]> => {
  const response = await fetch('/api/categories');
  if (!response.ok) {
    throw new Error('카테고리 목록을 가져오는 데 실패했습니다.');
  }
  return response.json();
};

// 카테고리의 특징 목록을 가져오는 API 함수
export const fetchCategoryFeatures = async (categoryId: number): Promise<Feature[]> => {
  const response = await fetch(`/api/categories/${categoryId}/features`);
  if (!response.ok) {
    throw new Error(`categoryId: ${categoryId}에 대한 특징 목록을 가져오는 데 실패했습니다.`);
  }
  return response.json();
};

// 학교 지역 목록을 가져오는 API 함수
export const fetchSchoolAreas = async (): Promise<SchoolArea[]> => {
  const response = await fetch('/api/school-areas');
  if (!response.ok) {
    throw new Error('학교 지역 목록을 가져오는 데 실패했습니다.');
  }
  const data = await response.json();
  return data.schoolAreas;
};

// 새로운 분실물 POST하는 API 함수
export const postLostItem = async (
  request: LostItemRegisterRequest,
  images: File[],
): Promise<{ success: boolean }> => {
  const formData = new FormData();
  formData.append('lostItemRegisterRequest', JSON.stringify(request));
  images.forEach((image) => {
    formData.append('images', image);
  });

  const response = await fetch('/api/lost-items', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorBody = await response.json();
    throw new Error(errorBody.error || '분실물 등록에 실패했습니다.');
  }

  const result = await response.json();
  return { success: result.ok };
};
