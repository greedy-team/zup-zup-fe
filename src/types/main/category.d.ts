export type Category = {
  categoryId: number;
  categoryName: string;
};

export type CategoryRadioProps = {
  categories: Category[];
  selectedCategoryId: number;
  setSelectedCategoryId: (c: number) => void;
};
