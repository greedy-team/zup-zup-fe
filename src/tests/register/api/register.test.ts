import { describe, it, expect, vi } from 'vitest';
import { fetchCategoryFeatures, postLostItem } from '../../../api/register';

window.fetch = vi.fn();

describe('등록 API 함수', () => {
  it('fetchCategoryFeatures는 모의 데이터를 반환해야 합니다', async () => {
    const features = await fetchCategoryFeatures('phone');
    expect(Array.isArray(features)).toBe(true);
    expect(features[0]).toHaveProperty('question', '무슨 색상인가요?');
  });

  it('postLostItem은 success: true를 반환해야 합니다', async () => {
    const response = await postLostItem({ test: 'data' });
    expect(response).toEqual({ success: true });
  });
});
