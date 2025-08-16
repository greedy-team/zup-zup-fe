import { useEffect } from 'react';
import { createNumberedMarker } from '../../utils/Map/mapUtils';
import type { SchoolArea } from '../../types/map/map';
import type { LostItemSummaryRow } from '../../types/lost/lostApi';

export function useNumberedMarkers({
  map,
  schoolAreas,
  summary,
  enabled,
}: {
  map: kakao.maps.Map | null;
  schoolAreas: SchoolArea[];
  summary: LostItemSummaryRow[];
  enabled: boolean;
}) {
  useEffect(() => {
    if (!map || !enabled) return;

    const summaryMap = new Map(summary.map((item) => [item.schoolAreaId, item.count]));
    const markers = schoolAreas.map((area) => {
      const count = summaryMap.get(area.id) ?? 0;
      return createNumberedMarker(map, area.marker, count);
    });

    return () => {
      markers.forEach((m) => m?.setMap?.(null));
    };
  }, [map, schoolAreas, summary, enabled]);
}
