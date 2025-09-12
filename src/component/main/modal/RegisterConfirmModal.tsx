import { useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  RegisterConfirmModalContext,
  SchoolAreasContext,
  SelectedModeContext,
} from '../../../contexts/AppContexts';

const RegisterConfirmModal = () => {
  const { isRegisterConfirmModalOpen, setIsRegisterConfirmModalOpen } = useContext(
    RegisterConfirmModalContext,
  )!;

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setSelectedMode } = useContext(SelectedModeContext)!;

  const selectedAreaId = Number(searchParams.get('schoolAreaId')) || 0;
  const { schoolAreas } = useContext(SchoolAreasContext)!;

  const handleCancel = () => {
    navigate({ search: `?schoolAreaId=${0}` }, { replace: true });
    setSelectedMode('append');
    setIsRegisterConfirmModalOpen(false);
  };

  if (!isRegisterConfirmModalOpen) return null;

  const selectedArea = schoolAreas.find((area) => area.id === selectedAreaId);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={handleCancel}
    >
      <div
        className="max-h-[80vh] w-[90vw] max-w-2xl overflow-y-auto rounded-2xl bg-white/70 p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold">
          분실물을 <span className="font-bold text-teal-600">{selectedArea?.areaName}</span>에
          등록하시겠습니까?
        </h2>
        <div className="flex justify-end gap-2">
          <button
            className="rounded-lg bg-teal-600 px-4 py-2 text-white hover:bg-teal-700"
            onClick={() => {
              setIsRegisterConfirmModalOpen(false);
              navigate(`/register/${selectedAreaId}`);
            }}
          >
            등록
          </button>
          <button
            className="rounded-lg bg-gray-300 px-4 py-2 text-gray-600 hover:bg-gray-400"
            onClick={handleCancel}
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterConfirmModal;
