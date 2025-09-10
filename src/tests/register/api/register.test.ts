import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  fetchCategories,
  fetchCategoryFeatures,
  fetchSchoolAreas,
  postLostItem,
} from '../../../api/register';
import type {
  Category,
  Feature,
  LostItemRegisterRequest,
  SchoolArea,
} from '../../../types/register';
import { global } from 'styled-jsx/css';

const BASE_URL = 'https://api.sejong-zupzup.kr/api';

describe('register API functions', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('fetchCategories', () => {
    it('카테고리 목록을 성공적으로 가져와야 한다', async () => {
      const mockCategories: Category[] = [
        { id: 1, name: '전자기기', iconUrl: '' },
        { id: 2, name: '악세사리', iconUrl: '' },
      ];
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ categories: mockCategories }),
      });

      const categories = await fetchCategories();

      expect(fetch).toHaveBeenCalledWith(`${BASE_URL}/categories`);
      expect(categories).toEqual(mockCategories);
    });

    it('카테고리 목록 가져오기에 실패하면 에러를 던져야 한다', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({ ok: false });

      await expect(fetchCategories()).rejects.toThrow('카테고리 목록을 가져오는 데 실패했습니다.');
    });
  });

  describe('fetchCategoryFeatures', () => {
    it('특정 카테고리의 특징 목록을 성공적으로 가져와야 한다', async () => {
      const categoryId = 1;
      const mockFeatures: Feature[] = [
        {
          id: 1,
          name: '색상',
          quizQuestion: '다음 중 분실물의 색상으로 가장 적절한 것은 무엇인가요?',
          options: [
            { id: 1, optionValue: '빨강' },
            { id: 2, optionValue: '파랑' },
          ],
        },
        {
          id: 2,
          name: '브랜드',
          quizQuestion: '이 분실물의 브랜드는 무엇인가요?',
          options: [
            { id: 1, optionValue: '애플' },
            { id: 2, optionValue: '삼성' },
          ],
        },
      ];
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ features: mockFeatures }),
      });

      const features = await fetchCategoryFeatures(categoryId);

      expect(fetch).toHaveBeenCalledWith(`${BASE_URL}/categories/${categoryId}/features`);
      expect(features).toEqual(mockFeatures);
    });

    it('특징 목록 가져오기에 실패하면 에러를 던져야 한다', async () => {
      const categoryId = 1;
      globalThis.fetch = vi.fn().mockResolvedValue({ ok: false });

      await expect(fetchCategoryFeatures(categoryId)).rejects.toThrow(
        `categoryId: ${categoryId}에 대한 특징 목록을 가져오는 데 실패했습니다.`,
      );
    });
  });

  describe('fetchSchoolAreas', () => {
    it('학교 지역 목록을 성공적으로 가져와야 한다', async () => {
      const mockSchoolAreas: SchoolArea[] = [
        {
          id: 1,
          areaName: '집현관',
          areaPolygon: {
            coordinates: [
              { lat: 37.549313, lng: 127.0741179 },
              { lat: 37.5493215, lng: 127.0733401 },
              { lat: 37.5484602, lng: 127.0732891 },
              { lat: 37.548439, lng: 127.0740777 },
              { lat: 37.549313, lng: 127.0741179 },
            ],
          },
          marker: { lat: 37.5490786, lng: 127.0735303 },
        },
        {
          id: 2,
          areaName: '대양홀',
          areaPolygon: {
            coordinates: [
              { lat: 37.5490488, lng: 127.0752376 },
              { lat: 37.549304, lng: 127.0744598 },
              { lat: 37.549304, lng: 127.0741352 },
              { lat: 37.5486371, lng: 127.0740965 },
              { lat: 37.54845, lng: 127.0741018 },
              { lat: 37.5484351, lng: 127.074193 },
              { lat: 37.5482479, lng: 127.0741903 },
              { lat: 37.5482575, lng: 127.0743848 },
              { lat: 37.5482288, lng: 127.074716 },
              { lat: 37.5490488, lng: 127.0752376 },
            ],
          },
          marker: { lat: 37.5486788, lng: 127.0744637 },
        },
      ];
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ schoolAreas: mockSchoolAreas }),
      });

      const schoolAreas = await fetchSchoolAreas();

      expect(fetch).toHaveBeenCalledWith(`${BASE_URL}/school-areas`);
      expect(schoolAreas).toEqual(mockSchoolAreas);
    });

    it('학교 지역 목록 가져오기에 실패하면 에러를 던져야 한다', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({ ok: false });

      await expect(fetchSchoolAreas()).rejects.toThrow(
        '학교 지역 목록을 가져오는 데 실패했습니다.',
      );
    });
  });

  describe('postLostItem', () => {
    it('분실물 등록에 성공해야 한다', async () => {
      const request: LostItemRegisterRequest = {
        categoryId: 1,
        foundAreaId: 1,
        foundAreaDetail: '1층 로비',
        depositArea: '학생회관 분실물 센터',
        featureOptions: [
          { featureId: 1, optionId: 2 },
          { featureId: 2, optionId: 1 },
        ],
        imageOrder: [0],
        description: '케이스 없음',
      };
      const images: File[] = [new File(['image1'], 'image1.png', { type: 'image/png' })];

      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      });

      const result = await postLostItem(request, images);

      expect(fetch).toHaveBeenCalledWith(`${BASE_URL}/lost-items`, {
        method: 'POST',
        body: expect.any(FormData),
        credentials: 'include',
      });
      expect(result).toEqual({ success: true });
    });

    it('분실물 등록에 실패하면 에러를 던져야 한다', async () => {
      const request: LostItemRegisterRequest = {
        categoryId: 1,
        foundAreaId: 1,
        foundAreaDetail: '1층 로비',
        depositArea: '학생회관 분실물 센터',
        featureOptions: [
          { featureId: 1, optionId: 2 },
          { featureId: 2, optionId: 1 },
        ],
        imageOrder: [0],
        description: '케이스 없음',
      };
      const images: File[] = [];
      const errorResponse = { error: '등록 실패' };

      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: false,
        json: () => Promise.resolve(errorResponse),
      });

      await expect(postLostItem(request, images)).rejects.toThrow(errorResponse.error);
    });
  });
});
