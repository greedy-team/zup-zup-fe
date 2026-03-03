import { apiFetch } from '../common/apiClient';
import type { Category, Feature, LostItemRegisterRequest, SchoolArea } from '../../types/register';

export const fetchCategories = async (): Promise<Category[]> => {
  const data = await apiFetch<{ categories: Category[] }>('/categories');
  return data?.categories ?? [];
};

export const fetchCategoryFeatures = async (categoryId: number): Promise<Feature[]> => {
  const data = await apiFetch<{ features: Feature[] }>(`/categories/${categoryId}/features`);
  return data?.features ?? [];
};

export const fetchSchoolAreas = async (): Promise<SchoolArea[]> => {
  const data = await apiFetch<{ schoolAreas: SchoolArea[] }>('/school-areas');
  return data?.schoolAreas ?? [];
};

export const postLostItem = async (
  request: LostItemRegisterRequest,
  images: File[],
): Promise<{ success: boolean }> => {
  const formData = new FormData();

  formData.append(
    'lostItemRegisterRequest',
    new Blob([JSON.stringify(request)], { type: 'application/json' }),
  );

  images.forEach((image) => {
    formData.append('images', image);
  });

  await apiFetch<void>('/lost-items', { method: 'POST', body: formData });
  return { success: true };
};
