import InfoIcon from '../common/Icons/InfoIcon';
import CheckIcon from '../common/Icons/CheckIcon';
import WrongIcon from '../common/Icons/WrongIcon';
import type { ResultModalProps } from '../../types/find/index';

const ICONS = {
  success: { component: <CheckIcon />, bg: 'bg-green-500' },
  error: { component: <WrongIcon />, bg: 'bg-red-500' },
  info: { component: <InfoIcon />, bg: 'bg-teal-500' },
};

const ResultModal = ({ status, title, message, buttonText, onConfirm }: ResultModalProps) => {
  const { component: Icon, bg: iconBgClass } = ICONS[status];

  return (
    // ResultModal은 부모 모달 위에 띄워지므로 z-index가 더 높음 (z-60)
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
          onClick={onConfirm}
          className="mt-8 w-full rounded-lg bg-teal-600 py-3 text-base font-bold text-white transition hover:bg-teal-700"
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default ResultModal;
