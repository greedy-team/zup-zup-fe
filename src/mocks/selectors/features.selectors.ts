import { categoryFeatures, type FeatureDef } from '../db/features.db';

export type CategoryFeatureOption = { id: number; text: string };
export type CategoryFeature = {
  featureId: number;
  featureText: string;
  options: CategoryFeatureOption[];
};

export function getFeaturesByCategoryId(categoryId: number): CategoryFeature[] | undefined {
  const targetCategoryFeatures = categoryFeatures.find(
    (category) => category.categoryId === categoryId,
  );
  if (!targetCategoryFeatures) return undefined;

  return targetCategoryFeatures.features.map((feature: FeatureDef) => ({
    featureId: feature.featureId,
    featureText: feature.featureText,
    options: feature.options.map((option) => ({ id: option.optionId, text: option.text })),
  }));
}
