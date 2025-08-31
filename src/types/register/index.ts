import { useRegisterProcess } from '../../hooks/register/useRegisterProcess';

export type Category = {
  id: number;
  name: string;
  iconUrl: string;
};

export type Feature = {
  id: number;
  name: string;
  quizQuestion: string;
  options: FeatureOption[];
};

export type FeatureOption = {
  id: number;
  optionValue: string;
};

export type FeatureSelection = {
  featureId: number;
  optionId: number;
};

export type Coordinate = { lat: number; lng: number };

export type SchoolArea = {
  id: number;
  areaName: string;
  areaPolygon: { coordinates: Coordinate[] };
  marker: Coordinate;
};

export type RegisterFormData = {
  foundAreaId: number | null;
  foundAreaDetail: string;
  depositArea: string;
  featureOptions: FeatureSelection[];
  description?: string;
  images: File[];
  imageOrder: number[];
};

export type ResultModalContent = {
  status: 'success' | 'error' | 'info';
  title: string;
  message: string;
  buttonText: string;
  onConfirm: () => void;
};

export type LostItemRegisterRequest = {
  categoryId: number;
  foundAreaId: number;
  foundAreaDetail: string;
  depositArea: string;
  featureOptions: FeatureSelection[];
  imageOrder: number[];
  description?: string;
};

export type RegisterContextType = ReturnType<typeof useRegisterProcess> & {
  schoolAreas: SchoolArea[];
};
