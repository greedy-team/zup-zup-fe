export type LostItemStatus = 'registered' | 'found' | 'pledged';

export type FeatureSelection = {
  featureId: number;
  optionId: number;
};

export type LostItem = {
  lostItemId: number;
  status: LostItemStatus;
  categoryId: number;
  categoryName: string;
  schoolAreaId: number;
  foundAreaName: string;
  detailLocation: string;
  storageName: string;
  features?: FeatureSelection[];
  description?: string;
  foundDate: string;
  imageUrl: string;
};

export const lostItems: LostItem[] = [];

export function resetLostItems() {
  lostItems.length = 0;
}
