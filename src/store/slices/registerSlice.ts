import type { StateCreator } from 'zustand';
import type {
  Category,
  FeatureSelection,
  RegisterFormData,
  ResultModalContent,
} from '../../types/register';
import { clearFormData, saveFormData } from '../../utils/register/registerStorage';

const INITIAL_FORM_DATA: RegisterFormData = {
  foundAreaId: null,
  foundAreaDetail: '',
  depositArea: '',
  featureOptions: [],
  description: '',
  images: [],
  imageOrder: [],
};

export type RegisterSlice = {
  selectedCategory: Category | null;
  formData: RegisterFormData;
  isPending: boolean;
  resultModalContent: ResultModalContent | null;
  actions: {
    setSelectedCategory: (category: Category | null) => void;
    setField: (name: string, value: string) => void;
    setImages: (images: File[], imageOrder: number[]) => void;
    setFeature: (feature: FeatureSelection) => void;
    setFoundAreaId: (id: number | null) => void;
    setFormData: (data: RegisterFormData) => void;
    resetForm: () => void;
    setIsPending: (pending: boolean) => void;
    setResultModalContent: (content: ResultModalContent | null) => void;
  };
};

export const createRegisterSlice: StateCreator<RegisterSlice> = (set, get) => ({
  selectedCategory: null,
  formData: INITIAL_FORM_DATA,
  isPending: false,
  resultModalContent: null,
  actions: {
    setSelectedCategory: (category) => set({ selectedCategory: category }),
    setField: (name, value) => {
      const newFormData = { ...get().formData, [name]: value };
      saveFormData(newFormData);
      set({ formData: newFormData });
    },
    setImages: (images, imageOrder) => {
      const newFormData = { ...get().formData, images, imageOrder };
      saveFormData(newFormData);
      set({ formData: newFormData });
    },
    setFeature: (feature) => {
      const otherFeatures = get().formData.featureOptions.filter(
        (f) => f.featureId !== feature.featureId,
      );
      const newFormData = {
        ...get().formData,
        featureOptions: [...otherFeatures, feature],
      };
      saveFormData(newFormData);
      set({ formData: newFormData });
    },
    setFoundAreaId: (id) => set((state) => ({ formData: { ...state.formData, foundAreaId: id } })),
    setFormData: (data) => set({ formData: data }),
    resetForm: () => {
      clearFormData();
      set((state) => ({
        formData: { ...INITIAL_FORM_DATA, foundAreaId: state.formData.foundAreaId },
      }));
    },
    setIsPending: (pending) => set({ isPending: pending }),
    setResultModalContent: (content) => set({ resultModalContent: content }),
  },
});
