import type { SchoolArea } from '../map/map';
import type { LostItemSummaryRow } from '../lost/lostApi';

export type UsePolygonsHookOptions = {
  map: kakao.maps.Map | null;
  schoolAreas: SchoolArea[];
  selectedAreaId: number;
  selectedMode: 'find' | 'register';
  isDesktopListOpen?: boolean;
  onOpenRegisterConfirm: () => void;
  onSelectArea: (areaId: number) => void;
  setHoverAreaId: (areaId: number) => void;
};

export type UseNumberedMarkersHookOptions = {
  map: kakao.maps.Map | null;
  schoolAreas: SchoolArea[];
  summary: LostItemSummaryRow[];
  enabled: boolean;
  selectedCategoryId: number;
};

export type UseLoaderHookReturnValue = boolean;
