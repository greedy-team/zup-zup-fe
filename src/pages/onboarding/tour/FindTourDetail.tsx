import { Smartphone } from 'lucide-react';

export default function FindTourDetail() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <div className="flex flex-col">
        <label className="mb-1 text-sm font-semibold text-gray-600">사진</label>
        <div className="flex aspect-square items-center justify-center overflow-hidden rounded-lg bg-gray-100">
          <div className="flex flex-col items-center gap-2 text-gray-300">
            <Smartphone className="h-16 w-16" />
            <span className="text-sm">예시 이미지</span>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <label className="mb-1 text-sm font-semibold text-gray-600">상세 설명</label>
        <div className="flex-grow rounded-lg bg-gray-100 p-4">
          <p className="whitespace-pre-wrap text-gray-800">
            검정색 안드로이드 핸드폰입니다. 뒷면에 투명 케이스가 있으며, 화면 우측 하단에 작은 스크래치가 있습니다.
          </p>
        </div>
      </div>
    </div>
  );
}
