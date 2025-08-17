import { describe, it, expect, vi, afterEach } from 'vitest';
import { server } from '../../../mocks/node';
import { http, HttpResponse } from 'msw';
import {
  fetchCategories,
  fetchCategoryFeatures,
  fetchSchoolAreas,
  postLostItem,
} from '../../../api/register';

describe('Register API 함수', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('fetchCategories는 카테고리 목록을 반환해야 합니다', async () => {
    const categories = await fetchCategories();
    expect(Array.isArray(categories)).toBe(true);
    expect(categories[0].categoryName).toBe('핸드폰');
  });

  it('fetchCategoryFeatures는 특정 카테고리의 특징 목록을 반환해야 합니다', async () => {
    const features = await fetchCategoryFeatures(1);
    expect(Array.isArray(features)).toBe(true);
    expect(features[0].featureText).toBe('색상');
  });

  it('fetchSchoolAreas는 학교 지역 목록을 반환해야 합니다', async () => {
    const areas = await fetchSchoolAreas();
    expect(Array.isArray(areas)).toBe(true);
    expect(areas[0].areaName).toBe('학생회관');
  });

  it('postLostItem은 FormData를 전송하고 성공 응답을 반환해야 합니다', async () => {
    const mockRequest = {
      categoryId: 1,
      schoolAreaId: 1,
      features: [{ featureId: 1, optionId: 1 }],
      detailLocation: 'test',
      storageName: 'test',
    };
    const mockImages = [new File([''], 'test.png', { type: 'image/png' })];

    const response = await postLostItem(mockRequest, mockImages);
    expect(response).toEqual({ success: true });
  });

  it('API 호출 실패 시 에러를 던져야 합니다', async () => {
    server.use(
      http.get('/api/categories', () => {
        return new HttpResponse(null, { status: 500 });
      }),
    );
    await expect(fetchCategories()).rejects.toThrow();
  });
});
