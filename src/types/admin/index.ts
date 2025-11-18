export type FeatureOption = {
  id: number;
  optionValue: string;
  quizQuestion: string;
};

export type LostItem = {
  id: number;
  categoryId: number;
  categoryName: string;
  schoolAreaId: number;
  schoolAreaName: string;
  foundAreaDetail: string;
  createdAt: string;
  description: string;
  depositArea: string;
  imageUrl: string[];
  featureOptions: FeatureOption[];
};

export type PageInfo = {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasPrev: boolean;
  hasNext: boolean;
};

export type PendingLostItemsResponse = {
  count: number;
  items: LostItem[];
  pageInfo: PageInfo;
};

export type AdminLostItemActionResponse = {
  successfulCount: number;
  totalRequestedCount: number;
  message: string;
};
