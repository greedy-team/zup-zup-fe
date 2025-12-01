import { createPortal } from 'react-dom';
import { X, CheckCircle2, XCircle } from 'lucide-react';

type ConfirmDialogVariant = 'safe' | 'danger';

type ConfirmModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  subDescription?: string;
  confirmLabel: string;
  cancelLabel?: string;
  variant?: ConfirmDialogVariant;
  disabled?: boolean;
  icon?: React.ReactNode;
};

export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  subDescription,
  confirmLabel,
  cancelLabel = '취소',
  variant = 'safe',
  disabled,
  icon,
}: ConfirmModalProps) => {
  if (!isOpen) return null;

  const isDanger = variant === 'danger';

  const DefaultIcon = isDanger ? XCircle : CheckCircle2;
  const circleBg = isDanger ? 'bg-rose-50' : 'bg-teal-50';
  const iconColor = isDanger ? 'text-rose-500' : 'text-teal-500';

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <button
          type="button"
          onClick={onClose}
          className="ml-auto flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          aria-label="닫기"
          disabled={disabled}
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>

        <div className="mt-2 flex flex-col items-center text-center">
          <div
            className={`mb-4 flex h-16 w-16 items-center justify-center rounded-full ${circleBg}`}
          >
            {icon || <DefaultIcon className={`h-8 w-8 ${iconColor}`} aria-hidden="true" />}
          </div>

          <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
          <p className="mt-3 text-sm text-slate-500">{description}</p>
          {subDescription && <p className="mt-1 text-xs text-slate-400">{subDescription}</p>}

          <div className="mt-6 grid w-full grid-cols-2 gap-3">
            <button
              type="button"
              onClick={onConfirm}
              disabled={disabled}
              className="inline-flex h-11 items-center justify-center rounded-xl bg-teal-500 text-sm font-medium text-white hover:bg-teal-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {confirmLabel}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={disabled}
              className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {cancelLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
