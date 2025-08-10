import { http, HttpResponse } from 'msw';
import { getSchoolAreas } from '../selectors/schoolAreas.selectors'; 

export const schoolAreasHandlers = [
  http.get('/api/school-areas', () => {
    const schoolAreas = getSchoolAreas();
    return HttpResponse.json({
      schoolAreas,
      count: schoolAreas.length,
    });
  }),
];
