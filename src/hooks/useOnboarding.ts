import { useState } from 'react';

const STORAGE_KEY = 'sejong-zupzup-onboarding-done';

export function useOnboarding() {
  const [isOpen, setIsOpen] = useState(() => !localStorage.getItem(STORAGE_KEY));

  const complete = () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    setIsOpen(false);
  };

  return { isOpen, complete };
}
