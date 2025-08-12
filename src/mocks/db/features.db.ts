export type FeatureOption = { optionId: number; text: string };
export type FeatureDef = { featureId: number; featureText: string; options: FeatureOption[] };

export type CategoryFeatures = {
  categoryId: number;
  features: FeatureDef[];
};

export const categoryFeatures: CategoryFeatures[] = [];

export function resetCategoryFeatures() {
  categoryFeatures.length = 0;
}
