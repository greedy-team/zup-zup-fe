import { useQuery } from '@tanstack/react-query';
import { fetchCategories, fetchCategoryFeatures, fetchSchoolAreas } from '..';
import { defaultQueryRetry } from '../../common/querySetting';
import type { Category, Feature, SchoolArea } from '../../../types/register';
import type { ApiError } from '../../../types/common';

export const useRegisterCategoriesQuery = () =>
  useQuery<Category[], ApiError>({
    queryKey: ['register', 'categories'],
    queryFn: fetchCategories,
    staleTime: Infinity,
    retry: defaultQueryRetry,
  });

export const useRegisterCategoryFeaturesQuery = (categoryId: number | null) =>
  useQuery<Feature[], ApiError>({
    queryKey: ['register', 'features', categoryId],
    queryFn: () => fetchCategoryFeatures(categoryId!),
    enabled: categoryId != null && categoryId > 0,
    staleTime: Infinity,
    retry: defaultQueryRetry,
  });

export const useRegisterSchoolAreasQuery = () =>
  useQuery<SchoolArea[], ApiError>({
    queryKey: ['register', 'school-areas'],
    queryFn: fetchSchoolAreas,
    staleTime: Infinity,
    retry: defaultQueryRetry,
  });
