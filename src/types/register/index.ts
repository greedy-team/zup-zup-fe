import type React from 'react';

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

export type ResultProps = {
  onClose: () => void;
  schoolAreaId: number | null;
  onModeChange?: () => void;
};

export type ResultModalContent = {
  status: 'success' | 'error' | 'info';
  title: string;
  message: string;
  buttonText: string;
  onConfirm: () => void;
};

export type Step1Props = {
  categories: Category[];
  selectedCategory: Category | null;
  onSelect: (category: Category) => void;
};

export type Step2Props = {
  isLoading: boolean;
  formData: RegisterFormData;
  setFormData: React.Dispatch<React.SetStateAction<RegisterFormData>>;
  categoryFeatures: Feature[];
  schoolAreas: SchoolArea[];
  handleFeatureChange: (featureId: number, optionId: number) => void;
};

export type Step3Props = {
  selectedCategory: Category | null;
  formData: RegisterFormData;
  categoryFeatures: Feature[];
  schoolAreas: SchoolArea[];
};

export type LostItemRegisterRequest = {
  categoryId: number;
  schoolAreaId: number;
  detailLocation: string;
  storageName: string;
  features: FeatureSelection[];
  description?: string;
};
