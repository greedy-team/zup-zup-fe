import { useEffect, useState } from 'react';
import { clearFormData, loadFormData, saveFormData } from '../../utils/register/registerStorage';
import type { FeatureSelection, RegisterFormData } from '../../types/register';

const INITIAL_FORM_DATA: Omit<RegisterFormData, 'foundAreaId'> = {
  foundAreaDetail: '',
  depositArea: '',
  featureOptions: [],
  description: '',
  images: [],
  imageOrder: [],
};

export const useRegisterState = (validSchoolAreaId: number | null) => {
  const [formData, setFormData] = useState<RegisterFormData>({
    ...INITIAL_FORM_DATA,
    foundAreaId: validSchoolAreaId,
  });

  // 마운트 시 IndexedDB에서 데이터 불러오기
  useEffect(() => {
    const rehydrateForm = async () => {
      const savedData = await loadFormData();
      if (savedData) {
        setFormData(savedData);
      }
    };
    rehydrateForm();
  }, []);

  // formData 변경 시 IndexedDB에 저장하기
  useEffect(() => {
    // 초기 상태이거나, foundAreaId만 있는 초기 상태일 때 저장 방지
    if (formData.foundAreaDetail || formData.images.length > 0) {
      saveFormData(formData);
    }
  }, [formData]);

  // schoolAreaId 변경 시 formData 동기화
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      foundAreaId: validSchoolAreaId,
    }));
  }, [validSchoolAreaId]);

  // 기존 SET_FIELD
  const setField = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 기존 SET_IMAGES
  const setImages = (images: File[], imageOrder: number[]) => {
    setFormData((prev) => ({
      ...prev,
      images,
      imageOrder,
    }));
  };

  // 기존 SET_FEATURE
  const setFeature = (feature: FeatureSelection) => {
    setFormData((prev) => {
      const otherFeatures = prev.featureOptions.filter((f) => f.featureId !== feature.featureId);
      return {
        ...prev,
        featureOptions: [...otherFeatures, feature],
      };
    });
  };

  // 기존 RESET_FORM
  const resetForm = () => {
    setFormData((prev) => ({
      ...INITIAL_FORM_DATA,
      // 지역(건물) 선택은 유지
      foundAreaId: prev.foundAreaId,
    }));
    clearFormData();
  };

  return {
    formData,
    setField,
    setImages,
    setFeature,
    resetForm,
  };
};
