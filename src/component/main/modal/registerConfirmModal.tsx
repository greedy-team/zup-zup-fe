type Props = {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

const RegisterConfirmModal = ({ isOpen, onConfirm, onCancel }: Props) => {
  if (!isOpen) return null;
  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onCancel}
    >
      <div
        className="w-[90vw] max-w-2xl max-h-[80vh] overflow-y-auto bg-white rounded-2xl p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold">분실물을 해당 위치에 등록하시겠습니까?</h2>
        <div className="flex justify-end gap-2">
          <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg" onClick={onConfirm}>
            등록
          </button>
          <button className="bg-gray-300 text-gray-600 px-4 py-2 rounded-lg" onClick={onCancel}>
            취소
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterConfirmModal;
