import { useOutletContext } from 'react-router-dom';
import type { RegisterContextType } from '../../types/register';

// 정보 필드를 보여주는 UI 컴포넌트
const InfoBox: React.FC<{ title: string; children: React.ReactNode; className?: string }> = ({
  title,
  children,
  className,
}) => (
  <div className={`rounded-lg bg-gray-100 p-4 ${className}`}>
    <h4 className="mb-2 font-bold text-gray-500">{title}</h4>
    <div className="text-gray-800">{children}</div>
  </div>
);

const RegisterReview = () => {
  const { selectedCategory, formData, categoryFeatures, schoolAreas } =
    useOutletContext<RegisterContextType>();

  // 질문 ID를 실제 질문 텍스트로 변환하기 위한 맵 생성
  const questionMap = new Map(
    categoryFeatures.map((feature) => [feature.id, feature.quizQuestion]),
  );

  // 옵션 ID를 실제 옵션 텍스트로 변환하기 위한 맵 생성
  const optionsMap = new Map(
    categoryFeatures.flatMap((feature) =>
      feature.options.map((option) => [option.id, option.optionValue]),
    ),
  );

  const selectedAreaName = schoolAreas.find((a) => a.id === formData.foundAreaId)?.areaName;

  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold text-gray-700">입력 정보를 확인해주세요</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* 왼쪽 */}
        <div className="space-y-3 md:col-span-1">
          <InfoBox title="카테고리">
            <p className="text-base font-bold">{selectedCategory?.name || '선택되지 않음'}</p>
          </InfoBox>
          <InfoBox title="등록된 사진" className="min-h-[200px]">
            <div className="grid grid-cols-3 gap-2">
              {formData.images.map((file, index) => (
                <img
                  key={index}
                  src={URL.createObjectURL(file)}
                  alt={`confirm ${index}`}
                  className="aspect-square h-full w-full rounded-md object-cover"
                />
              ))}
            </div>
          </InfoBox>
        </div>

        {/* 중앙 */}
        <div className="space-y-3 md:col-span-1">
          <InfoBox title="분실물 특징" className="min-h-[150px]">
            <ul className="space-y-3 text-base">
              {formData.featureOptions.map(({ featureId, optionId }) => (
                <li key={featureId}>
                  <p className="text-gray-500">{questionMap.get(featureId) || '질문'} </p>
                  <p className="font-bold text-black">{optionsMap.get(optionId) || '답변'}</p>
                </li>
              ))}
            </ul>
          </InfoBox>
          <InfoBox title="보관 장소">
            <p className="text-base font-bold text-black">{formData.depositArea}</p>
          </InfoBox>
        </div>

        {/* 오른쪽 */}
        <div className="space-y-3 lg:col-span-1">
          <InfoBox title="위치 정보">
            <p className="mb-2 text-base text-gray-500">
              건물: <span className="font-bold text-black">{selectedAreaName || '선택 X'}</span>
            </p>
            <p className="text-base text-gray-500">
              상세 위치: <span className="font-bold text-black">{formData.foundAreaDetail}</span>
            </p>
          </InfoBox>
          <InfoBox title="상세 정보">
            <p className="text-base font-bold whitespace-pre-wrap text-black">
              {formData.description || '입력된 내용이 없습니다.'}
            </p>
          </InfoBox>
        </div>
      </div>
    </div>
  );
};

export default RegisterReview;
