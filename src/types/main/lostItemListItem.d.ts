export type LostItemListItem = {
  status: 'registered' | 'found' | 'pledged';
  lostItemId: number;
  categoryId: number;
  categoryName: string;
  schoolAreaId: number;
  foundLocation: string; // = foundAreaName + ' ' + detailLocation
  foundDate: string; // ISO 문자열
  imageUrl: string; // 카테고리 아이콘(기타=99만 실제 이미지)
};
