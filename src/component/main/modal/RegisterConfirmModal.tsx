import { useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  RegisterConfirmModalContext,
  SchoolAreasContext,
  SelectedAreaIdContext,
} from '../../../contexts/AppContexts';
import { ConfirmModal } from '../../common/ConfirmModal';
import { MapPinCheckInside } from 'lucide-react';

const RegisterConfirmModal = () => {
  const { isRegisterConfirmModalOpen, setIsRegisterConfirmModalOpen } = useContext(
    RegisterConfirmModalContext,
  )!;

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setSelectedAreaId } = useContext(SelectedAreaIdContext)!;
  const { schoolAreas } = useContext(SchoolAreasContext)!;

  const selectedAreaId = Number(searchParams.get('schoolAreaId')) || 0;
  const selectedArea = schoolAreas.find((area) => area.id === selectedAreaId);

  const handleClose = () => {
    setSelectedAreaId(0);
    navigate({ search: '?schoolAreaId=0' }, { replace: true });
    setIsRegisterConfirmModalOpen(false);
  };

  const handleConfirm = () => {
    const areaId = selectedAreaId || 0;
    setSelectedAreaId(0);
    setIsRegisterConfirmModalOpen(false);
    navigate(`/register/${areaId}`);
  };

  return (
    <ConfirmModal
      isOpen={isRegisterConfirmModalOpen && !!selectedArea}
      onClose={handleClose}
      onConfirm={handleConfirm}
      title={selectedArea ? `${selectedArea.areaName}` : '분실물 등록'}
      description={
        selectedArea ? '해당 위치에 분실물을 등록하시겠습니까?' : '선택된 구역이 없습니다.'
      }
      confirmLabel="등록"
      cancelLabel="취소"
      variant="safe"
      icon={<MapPinCheckInside className="h-8 w-8 text-teal-500" />}
    />
  );
};

export default RegisterConfirmModal;
