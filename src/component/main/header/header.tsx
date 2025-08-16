import type { CategoryRadioComponentProps } from '../../../types/main/components';
import Authentication from './Authentication';
import CategoryRadio from './categoryRadio';
import Logo from './logo';

const Header = ({
  categories,
  selectedCategoryId,
  setSelectedCategoryId,
  selectedMode,
}: CategoryRadioComponentProps) => {
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
        selectedMode={selectedMode}
      />
      {selectedMode === 'register' && (
        <div className="absolute top-0 right-0 left-0 z-40 h-30 bg-gray-500/30" />
      )}
    </header>
  );
};

export default Header;
