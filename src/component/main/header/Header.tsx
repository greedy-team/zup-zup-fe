import { useContext } from 'react';
import { SelectedModeContext } from '../../../contexts/AppContexts';
import CategoryRadio from './CategoryRadio';

const Header = () => {
  const { selectedMode } = useContext(SelectedModeContext)!;

  return (
    <header className="shrink-0 border-b">
      <CategoryRadio />
      {selectedMode === 'register' && (
        <div className="absolute top-0 right-0 left-0 z-40 h-30 bg-gray-500/30" />
      )}
    </header>
  );
};

export default Header;
