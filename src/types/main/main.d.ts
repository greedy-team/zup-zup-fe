export type FiltersState = {
  selectedCategoryId: number;
  setSelectedCategoryId: (v: number) => void;
};

export type PaginationState = {
  page: number;
  setPage: (p: number) => void;
  total: number;
  pageSize: number;
};

export type MapSelectionState = {
  selectedAreaId: number;
  setSelectedAreaId: (id: number) => void;
  selectedCoordinates: { lat: number; lng: number } | null;
  setSelectedCoordinates: (c: { lat: number; lng: number } | null) => void;
};

export type ModeState = {
  selectedMode: lostItemMode;
  toggleMode: () => void;
};

export type lostItemMode = 'register' | 'append';
