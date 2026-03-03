import { useEffect } from 'react';
import { loadFormData } from '../../utils/register/registerStorage';
import { useRegisterActions, useRegisterFormData } from '../../store/hooks/useRegisterStore';

export const useRegisterState = (validSchoolAreaId: number | null) => {
  const formData = useRegisterFormData();
  const { setFoundAreaId, setFormData, setField, setImages, setFeature, resetForm } =
    useRegisterActions();

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

  // schoolAreaId 변경 시 formData 동기화
  useEffect(() => {
    setFoundAreaId(validSchoolAreaId);
  }, [validSchoolAreaId]);

  return {
    formData,
    setField,
    setImages,
    setFeature,
    resetForm,
  };
};
