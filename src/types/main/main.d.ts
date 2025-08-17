export type FiltersState = {
  selectedCategoryId: number;
  setSelectedCategoryId: (v: number) => void;
};

export type PaginationState = {
  page: number;
  setPage: (p: number) => void;
  totalCount: number;
};

export type MapSelectionState = {
  selectedAreaId: number;
  setSelectedAreaId: (id: number) => void;
};

export type ModeState = {
  selectedMode: lostItemMode;
  toggleMode: () => void;
};

export type lostItemMode = 'register' | 'append';
