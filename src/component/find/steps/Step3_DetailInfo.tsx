type Props = {
  detail: { imageUrl: string; description?: string | null } | null;
};

const Step3_DetailInfo = ({ detail }: Props) => {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {/* 왼쪽: 사진 섹션 */}
      <div className="flex flex-col">
        <label className="mb-1 text-sm font-semibold text-gray-600">사진</label>
        <div className="flex aspect-square flex-grow items-center justify-center overflow-hidden rounded-lg bg-gray-100">
          {detail?.imageUrl ? (
            <img
              src={detail.imageUrl}
              alt="분실물 상세 사진"
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-gray-400">이미지 없음</span>
          )}
        </div>
      </div>

      {/* 오른쪽: 상세 정보 섹션 */}
      <div className="flex flex-col">
        <label className="mb-1 text-sm font-semibold text-gray-600">상세 정보</label>
        <div className="flex-grow rounded-lg bg-gray-100 p-4">
          <p className="whitespace-pre-wrap text-gray-800">
            {detail?.description ?? '상세 정보가 없습니다.'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Step3_DetailInfo;
