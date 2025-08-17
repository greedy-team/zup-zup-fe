export type SchoolArea = {
  id: number;
  areaName: string;
  areaPolygon: { coordinates: Array<{ lat: number; lng: number }> };
  marker: { lat: number; lng: number };
};

export type Coordinate = { lat: number; lng: number };
