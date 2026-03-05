import { Smartphone } from 'lucide-react';
import FormSection from '../../../component/register/FormSection';

const SAMPLE_FEATURES = [
  { id: 1, question: '핸드폰의 색상은 무엇인가요?', selected: '검정' },
  { id: 2, question: '핸드폰의 케이스 종류는 무엇인가요?', selected: '투명 케이스' },
];

export default function RegisterTourDetails() {
  return (
    <div className="space-y-4">
      <FormSection title="카테고리 특징">
        <div className="space-y-4">
          {SAMPLE_FEATURES.map((feat) => (
            <div key={feat.id}>
              <label className="mb-1 block font-medium text-gray-700">{feat.question}</label>
              <div className="w-full rounded-lg border border-gray-300 bg-white p-2 text-gray-800 shadow-md">
                {feat.selected}
              </div>
            </div>
          ))}
        </div>
      </FormSection>

      <FormSection title="위치 상세 정보">
        <div className="space-y-4">
          <div>
            <label className="mb-1 block font-normal text-gray-700">선택된 건물</label>
            <div className="w-full rounded-md border-gray-200 bg-gray-200 p-2 font-medium text-gray-700 shadow-inner">
              대양홀
            </div>
          </div>
          <div>
            <label className="mb-1 block font-medium text-gray-700">
              상세 위치 (예: 401호, 정문 앞 소파)
            </label>
            <div className="w-full rounded-lg border border-gray-300 bg-white p-2 text-gray-800 shadow-md">
              1층 로비
            </div>
          </div>
        </div>
      </FormSection>

      <FormSection title="보관 장소 (예: 학생회관 401호)">
        <div className="w-full rounded-lg border border-gray-300 bg-white p-2 text-gray-800 shadow-md">
          학생회관 401호
        </div>
      </FormSection>

      <FormSection title="사진 업로드 (최소 1장, 최대 3장)">
        <div className="flex flex-col items-center justify-center gap-3">
          <p className="text-gray-400">가장 왼쪽에 있는 사진이 대표 사진으로 설정됩니다.</p>
          <div className="grid w-full grid-cols-3 gap-4">
            <div className="relative aspect-square">
              <div className="flex h-full w-full items-center justify-center rounded-md bg-gray-200">
                <div className="flex flex-col items-center gap-1 text-gray-400">
                  <Smartphone className="h-8 w-8" />
                  <span className="text-xs">예시 사진</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </FormSection>

      <FormSection title="분실물 상세 정보 (선택)">
        <div className="w-full rounded-lg border border-gray-300 bg-white p-2 text-gray-800 shadow-md">
          검정색 안드로이드 핸드폰입니다. 뒷면에 투명 케이스가 있습니다.
        </div>
      </FormSection>
    </div>
  );
}
