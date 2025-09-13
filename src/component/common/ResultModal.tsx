import { useEffect, useRef } from 'react';
import InfoIcon from '../common/Icons/InfoIcon';
import CheckIcon from '../common/Icons/CheckIcon';
import WrongIcon from '../common/Icons/WrongIcon';
import type { ResultModalContent } from '../../types/register';

const ICONS = {
  success: { component: <CheckIcon />, bg: 'bg-green-500' },
  error: { component: <WrongIcon />, bg: 'bg-red-500' },
  info: { component: <InfoIcon />, bg: 'bg-teal-500' },
};

const ResultModal = ({ status, title, message, buttonText, onConfirm }: ResultModalContent) => {
  const { component: Icon, bg: iconBgClass } = ICONS[status];

  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    buttonRef.current?.focus();
  }, []);

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl bg-gray-100 p-8 text-center shadow-xl">
        <div
          className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${iconBgClass}`}
        >
          {Icon}
        </div>
        <h2 className="mt-6 text-2xl font-bold text-gray-800">{title}</h2>
        <p className="mt-2 text-gray-600">{message}</p>
        <button
          ref={buttonRef}
          onClick={onConfirm}
          className="mt-8 w-full rounded-lg bg-teal-500 py-3 text-base font-bold text-white transition hover:bg-teal-600 focus:ring-2 focus:ring-teal-400 focus:outline-none"
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default ResultModal;
