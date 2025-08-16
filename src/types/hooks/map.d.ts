import type { SchoolArea } from '../map/map';
import type { LostItemSummaryRow } from '../lost/lostApi';

export type UsePolygonsHookOptions = {
  map: kakao.maps.Map | null;
  schoolAreas: SchoolArea[];
  selectedAreaId: number;
  selectedMode: 'append' | 'register';
  onOpenRegisterConfirm: () => void;
  onSelectArea: (areaId: number) => void;
};

export type UseNumberedMarkersHookOptions = {
  map: kakao.maps.Map | null;
  schoolAreas: SchoolArea[];
  summary: LostItemSummaryRow[];
  enabled: boolean;
};

export type UseLoaderHookReturnValue = boolean;
