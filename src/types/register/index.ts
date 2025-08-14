export type Category = {
  id: string;
  name: string;
  icon?: string;
};

export type CategoryFeature = {
  id: string;
  question: string;
  options: string[];
};

export type RegisterFormData = {
  featureAnswers: Record<string, string>;
  building: string;
  locationDetail: string;
  description: string;
  storageLocation: string;
  images: File[];
};

export type CategoryGroup = {
  groupName: string;
  categories: Category[];
};

export type Step2Props = {
  isLoading: boolean;
  formData: RegisterFormData;
  setFormData: React.Dispatch<React.SetStateAction<RegisterFormData>>;
  categoryFeatures: CategoryFeature[];
  selectedArea: string;
};
