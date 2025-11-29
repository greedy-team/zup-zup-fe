import { useState } from 'react';
import { MapPin, Archive, CalendarDays, Clock4, XCircle, CheckCircle2 } from 'lucide-react';
import type { PledgedLostItem } from '../../types/mypage';
import ImageLightbox from '../common/ImageLightbox';
import { ConfirmModal } from '../common/ConfirmModal';

type PledgedLostItemCardProps = {
  item: PledgedLostItem;
  onCancelPledge: () => void;
  onCompleteFound: () => void;
  isCancelLoading?: boolean;
  isCompleteLoading?: boolean;
};

const formatKoreanDate = (iso: string) =>
  new Intl.DateTimeFormat('ko-KR', {
    dateStyle: 'long',
  }).format(new Date(iso));

const formatKoreanTime = (iso: string) =>
  new Intl.DateTimeFormat('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(new Date(iso));

export const PledgedLostItemCard = ({
  item,
  onCancelPledge,
  onCompleteFound,
  isCancelLoading,
  isCompleteLoading,
}: PledgedLostItemCardProps) => {
  const disabled = isCancelLoading || isCompleteLoading;
  const hasImage = Boolean(item.representativeImageUrl);

  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  const handleClickImage = () => {
    if (!hasImage) return;
    setIsLightboxOpen(true);
  };

  const handleClickCompleteButton = () => {
    if (disabled) return;
    setIsCompleteModalOpen(true);
  };

  const handleClickCancelButton = () => {
    if (disabled) return;
    setIsCancelModalOpen(true);
  };

  const handleConfirmComplete = () => {
    onCompleteFound();
    setIsCompleteModalOpen(false);
  };

  const handleConfirmCancel = () => {
    onCancelPledge();
    setIsCancelModalOpen(false);
  };

  return (
    <>
      <article className="flex flex-col gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_4px_12px_rgba(15,23,42,0.03)] sm:flex-row">
        <div
          className={`relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-slate-100 sm:w-64 lg:w-72 ${
            hasImage ? 'cursor-pointer' : ''
          }`}
          onClick={hasImage ? handleClickImage : undefined}
        >
          {hasImage ? (
            <img
              src={item.representativeImageUrl}
              alt={`${item.categoryName} 대표 이미지`}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center rounded-md border border-dashed border-slate-300 text-xs text-slate-400">
              이미지 없음
            </div>
          )}

          <span className="absolute top-3 left-3 inline-flex items-center rounded-full bg-white/80 px-3 py-1 text-[10px] font-medium text-teal-700 shadow-sm">
            {item.categoryName}
          </span>
        </div>

        <div className="flex flex-1 flex-col justify-between gap-4 sm:border-l sm:border-slate-100 sm:pl-6">
          <div className="grid gap-x-12 gap-y-6 sm:grid-cols-2">
            <div className="space-y-1 text-sm">
              <p className="flex items-center gap-1 text-xs font-medium text-teal-600">
                <MapPin className="h-3 w-3" aria-hidden="true" />
                습득 장소
              </p>
              <p className="font-medium text-slate-900">{item.schoolAreaName}</p>
              <p className="text-xs text-slate-500">{item.foundAreaDetail}</p>
            </div>

            <div className="space-y-1 text-sm">
              <p className="flex items-center gap-1 text-xs font-medium text-teal-600">
                <Archive className="h-3 w-3" aria-hidden="true" />
                보관 장소
              </p>
              <p className="text-sm text-slate-900">{item.depositArea}</p>
            </div>

            <div className="space-y-1 text-sm">
              <p className="flex items-center gap-1 text-xs font-medium text-teal-600">
                <CalendarDays className="h-3 w-3" aria-hidden="true" />
                습득일
              </p>
              <p className="text-sm text-slate-900">{formatKoreanDate(item.createdAt)}</p>
              <p className="text-xs text-slate-500">{formatKoreanTime(item.createdAt)}</p>
            </div>

            <div className="space-y-1 text-sm">
              <p className="flex items-center gap-1 text-xs font-medium text-teal-600">
                <Clock4 className="h-3 w-3" aria-hidden="true" />
                서약일
              </p>
              <p className="text-sm text-slate-900">{formatKoreanDate(item.pledgedAt)}</p>
              <p className="text-xs text-slate-500">{formatKoreanTime(item.pledgedAt)}</p>
            </div>
          </div>

          <div className="mt-2 border-t border-slate-100 pt-4">
            <div className="flex gap-3">
              <button
                type="button"
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-teal-500 px-4 py-3 text-sm font-medium text-white hover:bg-teal-600 disabled:cursor-not-allowed disabled:opacity-60"
                onClick={handleClickCompleteButton}
                disabled={disabled}
              >
                <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                {isCompleteLoading ? '처리 중...' : '찾기 완료'}
              </button>

              <button
                type="button"
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-rose-300 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700 hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
                onClick={handleClickCancelButton}
                disabled={disabled}
              >
                <XCircle className="h-4 w-4" aria-hidden="true" />
                {isCancelLoading ? '취소 중...' : '서약 취소'}
              </button>
            </div>
          </div>
        </div>
      </article>

      {hasImage && (
        <ImageLightbox
          open={isLightboxOpen}
          onClose={() => setIsLightboxOpen(false)}
          images={[item.representativeImageUrl]}
        />
      )}

      <ConfirmModal
        isOpen={isCompleteModalOpen}
        onClose={() => setIsCompleteModalOpen(false)}
        onConfirm={handleConfirmComplete}
        title="찾기 완료 확인"
        description="분실물을 되찾으셨나요?"
        subDescription="찾기 완료 처리하시면 서약 목록에서 제거됩니다."
        confirmLabel="확인"
        cancelLabel="취소"
        variant="safe"
        disabled={isCompleteLoading}
      />

      <ConfirmModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        onConfirm={handleConfirmCancel}
        title="서약 취소 확인"
        description="등록한 분실물 서약을 취소하시겠습니까?"
        subDescription="취소된 내용은 복구할 수 없습니다."
        confirmLabel="취소하기"
        cancelLabel="닫기"
        variant="danger"
        disabled={isCancelLoading}
      />
    </>
  );
};
