import { Smartphone } from 'lucide-react';
import InfoBox from '../../../component/register/InfoBox';

export default function RegisterTourReview() {
  return (
    <div>
      <h2 className="mb-4 text-xl font-normal text-gray-700">입력 정보를 확인해주세요</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* 왼쪽 */}
        <div className="space-y-3 md:col-span-1">
          <InfoBox title="카테고리">
            <p className="text-base font-normal">핸드폰</p>
          </InfoBox>
          <InfoBox title="등록된 사진" className="min-h-[200px]">
            <div className="flex items-center justify-center rounded-md bg-gray-200 py-6">
              <div className="flex flex-col items-center gap-1 text-gray-400">
                <Smartphone className="h-10 w-10" />
                <span className="text-xs">예시 사진</span>
              </div>
            </div>
          </InfoBox>
        </div>

        {/* 중앙 */}
        <div className="space-y-3 md:col-span-1">
          <InfoBox title="분실물 특징" className="min-h-[150px]">
            <ul className="space-y-3 text-base">
              <li>
                <p className="text-gray-500">핸드폰의 색상은 무엇인가요?</p>
                <p className="font-normal text-black">검정</p>
              </li>
              <li>
                <p className="text-gray-500">핸드폰의 케이스 종류는 무엇인가요?</p>
                <p className="font-normal text-black">투명 케이스</p>
              </li>
            </ul>
          </InfoBox>
          <InfoBox title="보관 장소">
            <p className="text-base font-normal text-black">학생회관 401호</p>
          </InfoBox>
        </div>

        {/* 오른쪽 */}
        <div className="space-y-3 lg:col-span-1">
          <InfoBox title="위치 정보">
            <p className="mb-2 text-base text-gray-500">
              건물: <span className="font-normal text-black">대양홀</span>
            </p>
            <p className="text-base text-gray-500">
              상세 위치: <span className="font-normal text-black">1층 로비</span>
            </p>
          </InfoBox>
          <InfoBox title="상세 정보">
            <p className="whitespace-pre-wrap text-base font-normal text-black">
              검정색 안드로이드 핸드폰입니다. 뒷면에 투명 케이스가 있습니다.
            </p>
          </InfoBox>
        </div>
      </div>
    </div>
  );
}
