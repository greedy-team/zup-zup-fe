export type Coordinate = { lat: number; lng: number };

export type SchoolArea = {
  id: number;
  areaName: string;
  areaPolygon: { coordinates: Coordinate[] };
  marker: Coordinate;
};

export const schoolAreas: SchoolArea[] = [];

export function resetSchoolAreas() {
  schoolAreas.length = 0;
}
