import { useEffect } from 'react';
import { createNumberedMarker } from '../../utils/Map/mapUtils';
import type { SchoolArea } from '../../types/map/map';
import type { LostItemSummaryRow } from '../../types/main/lostItemSummeryRow';

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

    const markers = schoolAreas.map((area) => {
      const count = summary.find((r) => r.schoolAreaId === area.id)?.count ?? 0;
      return createNumberedMarker(map, area.marker, count);
    });

    return () => {
      markers.forEach((m) => m?.setMap?.(null));
    };
  }, [map, schoolAreas, summary, enabled]);
}
