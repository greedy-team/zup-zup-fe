import { useNavigate, useSearchParams } from 'react-router-dom';
import { useRegisterConfirmModal, useSetRegisterConfirmModal } from '../../../store/hooks/useMainStore';
import { useSchoolAreasQuery } from '../../../api/main/hooks/useMain';
import { ConfirmModal } from '../../common/ConfirmModal';
import { MapPinCheckInside } from 'lucide-react';

const RegisterConfirmModal = () => {
  const isRegisterConfirmModalOpen = useRegisterConfirmModal();
  const setIsRegisterConfirmModalOpen = useSetRegisterConfirmModal();

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { data: schoolAreas = [] } = useSchoolAreasQuery();

  const selectedAreaId = Number(searchParams.get('schoolAreaId')) || 0;
  const selectedArea = schoolAreas.find((area) => area.id === selectedAreaId);

  const handleClose = () => {
    const next = new URLSearchParams(searchParams);
    next.delete('schoolAreaId');
    navigate({ search: next.toString() }, { replace: true });
    setIsRegisterConfirmModalOpen(false);
  };

  const handleConfirm = () => {
    setIsRegisterConfirmModalOpen(false);
    navigate(`/register/${selectedArea?.areaName}`);
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
