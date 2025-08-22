import type { Category, LostItemListItem, LostItemSummaryRow } from '../lost/lostApi';
import type { PaginationState, MapSelectionState, ModeState, lostItemMode } from './main';
import type { SchoolArea } from '../map/map';

export type CategoryRadioComponentProps = {
  categories: Category[];
  selectedCategoryId: number;
  setSelectedCategoryId: (c: number) => void;
  selectedMode: lostItemMode;
};

export type ModalComponentProps = {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  setIsRegisterConfirmModalOpen: (b: boolean) => void;
  setIsRegisterModalOpen: (b: boolean) => void;
  isRegisterModalOpen: boolean;
};

export type ButtonComponentProps = {
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
};

export type ListItemComponentProps = {
  item: LostItemListItem;
  className?: string;
  onFindButtonClick: (item: LostItemListItem) => void;
};

export type PaginationComponentProps = {
  page: number;
  totalCount: number;
  setPage: (page: number) => void;
};

export type LostListComponentProps = {
  items: LostItemListItem[];
  totalCount: number;
  page: number;
  setPage: (page: number) => void;
  onFindButtonClick: (item: LostItemListItem) => void;
};

export type MainComponentProps = {
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
    setIsRegisterModalOpen: (b: boolean) => void;
    setIsFindModalOpen: (b: boolean) => void;
  };
  isRegisterModalOpen: boolean;
  isFindModalOpen: boolean;
};

export type MapComponentProps = {
  setIsRegisterConfirmModalOpen: (isOpen: boolean) => void;
  setSelectedAreaId: (areaId: number) => void;
  selectedAreaId: number;
  schoolAreas: SchoolArea[];
  lostItemSummary: LostItemSummaryRow[];
  selectedMode: lostItemMode;
};

export type StatusBadgeComponentProps = {
  status: LostItemListItem['status'];
};
