import { useEffect, useState } from 'react';
import { fetchCategories, fetchCategoryFeatures } from '../../api/register';
import type { Category, Feature } from '../../types/register';

export const useRegisterData = (categoryIdFromQuery: number | null) => {
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryFeatures, setCategoryFeatures] = useState<Feature[]>([]);

  // 초기 렌더링 시, 카테고리 목록을 가져오기
  useEffect(() => {
    setIsLoading(true);
    fetchCategories()
      .then(setCategories)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  // 카테고리 쿼리스트링이 바뀔 때마다 카테고리 특징 fetch
  useEffect(() => {
    if (!categoryIdFromQuery) {
      setCategoryFeatures([]);
      return;
    }

    setIsLoading(true);
    fetchCategoryFeatures(categoryIdFromQuery)
      .then(setCategoryFeatures)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [categoryIdFromQuery]);

  return {
    isLoading,
    categories,
    categoryFeatures,
  };
};
