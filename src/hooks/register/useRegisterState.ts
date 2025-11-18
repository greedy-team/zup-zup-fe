import { useEffect, useReducer } from 'react';
import { clearFormData, loadFormData, saveFormData } from '../../utils/register/registerStorage';
import type { FeatureSelection, RegisterFormData } from '../../types/register';

type RegisterState = RegisterFormData;

type Action =
  | { type: 'SET_FIELD'; payload: { name: string; value: string } }
  | { type: 'SET_IMAGES'; payload: { images: File[]; imageOrder: number[] } }
  | { type: 'SET_FEATURE'; payload: FeatureSelection }
  | { type: 'SET_FOUND_AREA'; payload: { foundAreaId: number | null } }
  | { type: 'REHYDRATE_STATE'; payload: RegisterState };

const INITIAL_FORM_DATA: Omit<RegisterFormData, 'foundAreaId'> = {
  foundAreaDetail: '',
  depositArea: '',
  featureOptions: [],
  description: '',
  images: [],
  imageOrder: [],
};

const reducer = (state: RegisterState, action: Action): RegisterState => {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, [action.payload.name]: action.payload.value };
    case 'SET_IMAGES':
      return { ...state, images: action.payload.images, imageOrder: action.payload.imageOrder };
    case 'SET_FEATURE': {
      const otherFeatures = state.featureOptions.filter(
        (f) => f.featureId !== action.payload.featureId,
      );
      return { ...state, featureOptions: [...otherFeatures, action.payload] };
    }
    case 'SET_FOUND_AREA':
      return { ...state, foundAreaId: action.payload.foundAreaId };
    case 'REHYDRATE_STATE':
      return { ...action.payload };
    default:
      return state;
  }
};

export const useRegisterState = (validSchoolAreaId: number | null) => {
  const [formData, dispatch] = useReducer(reducer, {
    ...INITIAL_FORM_DATA,
    foundAreaId: validSchoolAreaId,
  });

  // 마운트 시 IndexedDB에서 데이터 불러오기
  useEffect(() => {
    const rehydrateForm = async () => {
      const savedData = await loadFormData();
      if (savedData) {
        dispatch({ type: 'REHYDRATE_STATE', payload: savedData });
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
    dispatch({ type: 'SET_FOUND_AREA', payload: { foundAreaId: validSchoolAreaId } });
  }, [validSchoolAreaId]);

  return { formData, dispatch, clearPersistedData: clearFormData };
};
