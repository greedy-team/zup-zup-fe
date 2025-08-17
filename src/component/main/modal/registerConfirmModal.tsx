import type { ModalComponentProps } from '../../../types/main/components';

const RegisterConfirmModal = ({ isOpen, onConfirm, onCancel }: ModalComponentProps) => {
  if (!isOpen) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onCancel}
    >
      <div
        className="max-h-[80vh] w-[90vw] max-w-2xl overflow-y-auto rounded-2xl bg-white/70 p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold">분실물을 해당 위치에 등록하시겠습니까?</h2>
        <div className="flex justify-end gap-2">
          <button
            className="rounded-lg bg-teal-600 px-4 py-2 text-white hover:bg-teal-700"
            onClick={onConfirm}
          >
            등록
          </button>
          <button
            className="rounded-lg bg-gray-300 px-4 py-2 text-gray-600 hover:bg-gray-400"
            onClick={onCancel}
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterConfirmModal;
