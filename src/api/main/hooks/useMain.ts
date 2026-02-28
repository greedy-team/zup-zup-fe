import { useQuery } from '@tanstack/react-query';
import { getCategories, getLostItems, getLostItemSummary, getSchoolAreas } from '..';
import type { GetLostItemsResult } from '..';
import type { Category, LostItemSummaryRow } from '../../../types/lost/lostApi';
import type { SchoolArea } from '../../../types/map/map';
import type { ApiError } from '../../../types/common';
import { defaultQueryRetry } from '../../common/querySetting';

export const useCategoriesQuery = () =>
  useQuery<Category[], ApiError>({
    queryKey: ['categories'],
    queryFn: getCategories,
    staleTime: Infinity,
    retry: defaultQueryRetry,
  });

export const useSchoolAreasQuery = () =>
  useQuery<SchoolArea[], ApiError>({
    queryKey: ['school-areas'],
    queryFn: getSchoolAreas,
    staleTime: Infinity,
    retry: defaultQueryRetry,
  });

export const useLostItemsQuery = (page: number, categoryId: number, schoolAreaId: number) =>
  useQuery<GetLostItemsResult, ApiError>({
    queryKey: ['lost-items', { page, categoryId, schoolAreaId }],
    queryFn: () => getLostItems(page, categoryId || undefined, schoolAreaId || undefined),
    retry: defaultQueryRetry,
  });

export const useLostItemSummaryQuery = (categoryId: number) =>
  useQuery<LostItemSummaryRow[], ApiError>({
    queryKey: ['lost-items', 'summary', categoryId],
    queryFn: () => getLostItemSummary(categoryId || undefined),
    retry: defaultQueryRetry,
  });
