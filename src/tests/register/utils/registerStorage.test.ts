import { describe, it, expect, afterEach } from 'vitest';
import 'fake-indexeddb/auto';
import { saveFormData, loadFormData, clearFormData } from '../../../utils/register/registerStorage';
import type { RegisterFormData } from '../../../types/register';

describe('registerStorage 유틸리티 테스트', () => {
  const mockFormData: RegisterFormData = {
    foundAreaId: 1,
    foundAreaDetail: '집현관 1층',
    depositArea: '학생회관',
    featureOptions: [{ featureId: 1, optionId: 1 }],
    images: [new File([''], 'test.png')],
    imageOrder: [0],
    description: '테스트 설명',
  };

  afterEach(async () => {
    await clearFormData();
  });

  it('saveFormData와 loadFormData가 정상적으로 동작해야 한다', async () => {
    await saveFormData(mockFormData);
    const loadedData = await loadFormData();

    // File 객체는 테스트 환경에서 완벽한 직렬화/역직렬화를 보장하기 어려우므로,
    // 다른 기본 데이터 타입들이 정상적으로 저장되고 로드되는지만 확인합니다.
    expect(loadedData).toBeDefined();
    expect(loadedData?.foundAreaId).toBe(mockFormData.foundAreaId);
    expect(loadedData?.description).toBe(mockFormData.description);
    expect(loadedData?.featureOptions).toEqual(mockFormData.featureOptions);
  });

  it('clearFormData가 데이터를 정상적으로 삭제해야 한다', async () => {
    await saveFormData(mockFormData);
    let loadedData = await loadFormData();
    expect(loadedData).toBeDefined();

    await clearFormData();
    loadedData = await loadFormData();
    expect(loadedData).toBeUndefined();
  });
});
