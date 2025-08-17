export type LostItemListItem = {
  status: 'registered' | 'found' | 'pledged';
  lostItemId: number;
  categoryId: number;
  categoryName: string;
  schoolAreaId: number;
  foundLocation: string;
  foundDate: string;
  imageUrl: string;
};

export type Category = {
  categoryId: number;
  categoryName: string;
};

export type LostItemDetailResponse = {
  items: LostItemListItem[];
  total: number;
};

export type LostItemSummaryRow = {
  schoolAreaId: number;
  count: number;
};
