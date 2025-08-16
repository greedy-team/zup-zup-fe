import type { Category, LostItemListItem, LostItemSummaryRow } from '../lost/lostApi';
import type { PaginationState, MapSelectionState, ModeState } from './main';
import type { SchoolArea } from '../map/map';

export type CategoryRadioProps = {
  categories: Category[];
  selectedCategoryId: number;
  setSelectedCategoryId: (c: number) => void;
};

export type ModalProps = {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export type ButtonProps = {
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
};

export type ListItemProps = {
  item: LostItemListItem;
  className?: string;
};

export type PaginationProps = {
  page: number;
  totalCount: number;
  setPage: (page: number) => void;
};

export type LostListProps = {
  items: LostItemListItem[];
  totalCount: number;
  page: number;
  setPage: (page: number) => void;
};

export type MainProps = {
  pagination: PaginationState;
  mapSelection: MapSelectionState;
  mode: ModeState;
  lists: {
    items: LostItemListItem[];
    categories: Category[];
  };
  areas: {
    schoolAreas: SchoolArea[];
    lostItemSummary: LostItemSummaryRow[];
  };
  ui: {
    setIsRegisterConfirmModalOpen: (b: boolean) => void;
  };
};

export type MapProps = {
  setIsRegisterConfirmModalOpen: (isOpen: boolean) => void;
  setSelectedCoordinates: (coordinates: { lat: number; lng: number } | null) => void;
  setSelectedAreaId: (areaId: number) => void;
  selectedAreaId: number;
  schoolAreas: SchoolArea[];
  lostItemSummary: LostItemSummaryRow[];
  selectedMode: 'register' | 'append';
};

export type StatusBadgeProps = {
  status: LostItemListItem['status'];
};
