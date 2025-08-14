import type { CategoryRadioProps } from '../../../types/main/category';
import Authentication from './Authentication';
import CategoryRadio from './categoryRadio';

const Header = ({ categories, selectedCategoryId, setSelectedCategoryId }: CategoryRadioProps) => {
  return (
    <header className="shrink-0 border-b">
      <Authentication />

      <CategoryRadio
        categories={categories}
        selectedCategoryId={selectedCategoryId}
        setSelectedCategoryId={setSelectedCategoryId}
      />
    </header>
  );
};

export default Header;
