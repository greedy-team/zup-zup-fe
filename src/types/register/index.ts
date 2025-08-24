import { useRegisterProcess } from '../../hooks/register/useRegisterProcess';

export type Category = {
  categoryId: number;
  categoryName: string;
};

export type Feature = {
  featureId: number;
  featureText: string;
  options: FeatureOption[];
};

export type FeatureOption = {
  id: number;
  text: string;
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
  schoolAreaId: number | null;
  detailLocation: string;
  storageName: string;
  features: FeatureSelection[];
  description?: string;
  images: File[];
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
  schoolAreaId: number;
  detailLocation: string;
  storageName: string;
  features: FeatureSelection[];
  description?: string;
};

export type RegisterContextType = ReturnType<typeof useRegisterProcess> & {
  schoolAreas: SchoolArea[];
};
