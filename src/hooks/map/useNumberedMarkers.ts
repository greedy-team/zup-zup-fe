import { useEffect } from 'react';
import { createNumberedMarker } from '../../utils/Map/mapUtils';
import type { UseNumberedMarkersHookOptions } from '../../types/hooks/map';

export function useNumberedMarkers({
  map,
  schoolAreas,
  summary,
  enabled,
}: UseNumberedMarkersHookOptions) {
  useEffect(() => {
    if (!map || !enabled || !summary || !Array.isArray(summary)) return;

    const summaryMap = new Map(summary.map((item) => [item.schoolAreaId, item.count]));
    const markers = schoolAreas.map((area) => {
      const count = summaryMap.get(area.id) ?? 0;
      return createNumberedMarker(map, area.marker, count);
    });

    return () => markers.forEach((m) => m?.setMap?.(null));
  }, [map, schoolAreas, summary, enabled]);
}
