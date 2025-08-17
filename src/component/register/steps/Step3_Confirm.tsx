import type { RegisterFormData, Category, CategoryFeature } from '../../../types/register';

type Props = {
  selectedCategory: Category | null;
  formData: RegisterFormData;
  categoryFeatures: CategoryFeature[]; // 질문 텍스트를 가져오기 위해 필요
};

// 각 정보 필드를 보여주기 위한 UI 컴포넌트
const InfoBox: React.FC<{ title: string; children: React.ReactNode; className?: string }> = ({
  title,
  children,
  className,
}) => (
  <div className={`rounded-lg bg-gray-100 p-4 ${className}`}>
    <h4 className="text-md mb-2 font-bold text-gray-500">{title}</h4>
    <div className="text-gray-800">{children}</div>
  </div>
);

const Step3_Confirm = ({ selectedCategory, formData, categoryFeatures }: Props) => {
  // 질문 ID를 실제 질문 텍스트로 변환하기 위한 맵 생성
  const questionMap = new Map(categoryFeatures.map((feat) => [feat.id, feat.question]));

  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold text-gray-700">입력 정보를 확인해주세요</h2>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* 왼쪽 */}
        <div className="space-y-3 lg:col-span-1">
          <InfoBox title="카테고리">
            <p className="text-lg font-bold">{selectedCategory?.name || '선택되지 않음'}</p>
          </InfoBox>
          <InfoBox title="등록된 사진" className="min-h-[200px]">
            <div className="grid grid-cols-2 gap-2">
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
        <div className="space-y-3 lg:col-span-1">
          <InfoBox title="분실물 특징" className="min-h-[150px]">
            <ul className="space-y-3 text-sm">
              {Object.entries(formData.featureAnswers).map(([qid, answer]) => (
                <li key={qid}>
                  <span className="text-gray-500">{questionMap.get(qid) || '질문'}: </span>
                  <span className="font-semibold">{answer}</span>
                </li>
              ))}
            </ul>
          </InfoBox>
          <InfoBox title="보관 장소">
            <p className="text-sm font-semibold">{formData.storageLocation}</p>
          </InfoBox>
        </div>

        {/* 오른쪽 */}
        <div className="space-y-3 lg:col-span-1">
          <InfoBox title="위치 정보">
            <p className="mb-2 text-sm text-gray-500">
              건물: <span className="font-semibold text-black">{formData.building}</span>
            </p>
            <p className="text-sm text-gray-500">
              상세 위치: <span className="font-semibold text-black">{formData.locationDetail}</span>
            </p>
          </InfoBox>
          <InfoBox title="상세 정보">
            <p className="text-sm font-semibold whitespace-pre-wrap">
              {formData.description || '입력된 내용이 없습니다.'}
            </p>
          </InfoBox>
        </div>
      </div>
    </div>
  );
};

export default Step3_Confirm;
