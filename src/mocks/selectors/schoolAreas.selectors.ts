import { schoolAreas, type SchoolArea } from '../db/schoolAreas.db';

export function getSchoolAreas(): SchoolArea[] {
  return schoolAreas;
}

export function getSchoolAreaById(id: number): SchoolArea | undefined {
  return schoolAreas.find((area) => area.id === id);
}
