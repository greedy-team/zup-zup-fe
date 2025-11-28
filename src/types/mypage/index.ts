export type PledgedLostItem = {
  id: number;
  categoryId: number;
  categoryName: string;
  schoolAreaId: number;
  schoolAreaName: string;
  foundAreaDetail: string;
  createdAt: string;
  representativeImageUrl: string;
  pledgedAt: string;
  depositArea: string;
};

export type PageInfo = {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasPrev: boolean;
  hasNext: boolean;
};

export type PledgedLostItemsResponse = {
  count: number;
  items: PledgedLostItem[];
  pageInfo: PageInfo;
};
