import {
  useRegisterCategoriesQuery,
  useRegisterCategoryFeaturesQuery,
} from '../../api/register/hooks/useRegister';

export const useRegisterData = (categoryIdFromQuery: number | null) => {
  const { data: categories = [], isFetching: isCategoriesFetching } =
    useRegisterCategoriesQuery();

  const { data: categoryFeatures = [], isFetching: isFeaturesFetching } =
    useRegisterCategoryFeaturesQuery(categoryIdFromQuery);

  return {
    isLoading: isCategoriesFetching || isFeaturesFetching,
    categories,
    categoryFeatures,
  };
};
