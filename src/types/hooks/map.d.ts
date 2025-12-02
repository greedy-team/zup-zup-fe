import type { SchoolArea } from '../map/map';
import type { LostItemSummaryRow } from '../lost/lostApi';

export type UsePolygonsHookOptions = {
  map: kakao.maps.Map | null;
  schoolAreas: SchoolArea[];
  selectedAreaId: number;

  isDesktopListOpen?: boolean;

  selectedMode: 'find' | 'register' | 'mypage' | 'more';

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
