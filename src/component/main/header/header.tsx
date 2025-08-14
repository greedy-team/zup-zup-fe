import type { CategoryRadioProps } from '../../../types/main/category';
import Authentication from './Authentication';
import CategoryRadio from './categoryRadio';
import Logo from './logo';

const Header = ({ categories, selectedCategoryId, setSelectedCategoryId }: CategoryRadioProps) => {
  return (
    <header className="shrink-0 border-b">
      <div className="flex h-30 items-center justify-between bg-teal-50 px-4 text-black">
        <Logo />
        <div className="text-3xl text-teal-600">잃어버린 물건은? 줍줍!</div>
        <Authentication />
      </div>

      <CategoryRadio
        categories={categories}
        selectedCategoryId={selectedCategoryId}
        setSelectedCategoryId={setSelectedCategoryId}
      />
    </header>
  );
};

export default Header;
