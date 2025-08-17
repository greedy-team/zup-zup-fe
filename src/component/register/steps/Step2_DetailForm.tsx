import React, { useRef } from 'react';
import SpinnerIcon from '../../common/Icons/SpinnerIcon';
import type { Step2Props } from '../../../types/register';

// 각 섹션을 구분하기 위한 UI 재사용 컴포넌트
const FormSection: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <div className="mb-6">
    <h3 className="mb-3 text-lg font-bold text-gray-800">{title}</h3>
    <div className="rounded-lg bg-gray-100 p-6">{children}</div>
  </div>
);

const Step2_DetailForm = ({
  isLoading,
  formData,
  setFormData,
  categoryFeatures,
  schoolAreas,
  handleFeatureChange,
}: Step2Props) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 입력 필드 변경 핸들러
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === 'detailLocation' || name === 'storageName' ? value.replace(/^\s+/, '') : value,
    }));
  };

  // 이미지 업로드 핸들러
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);

    if (formData.images.length + files.length > 3) {
      return alert('사진은 최대 3장까지 업로드할 수 있습니다.');
    }

    setFormData((prev) => ({ ...prev, images: [...prev.images, ...files] }));
  };

  // 이미지 삭제 핸들러
  const handleRemoveImage = (indexToRemove: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove),
    }));
  };

  // 로딩 중일 때는 로딩 스피너 표시
  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <SpinnerIcon />
        <span className="ml-2">카테고리 정보를 불러오는 중...</span>
      </div>
    );
  }

  const selectedAreaName = schoolAreas.find((area) => area.id === formData.schoolAreaId)?.areaName;

  return (
    <div>
      <FormSection title="카테고리 특징">
        <div className="space-y-4">
          {categoryFeatures.map((feature) => (
            <div key={feature.featureId}>
              <label
                htmlFor={String(feature.featureId)}
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                {feature.featureText}
              </label>
              <select
                id={String(feature.featureId)}
                name={String(feature.featureId)}
                value={
                  formData.features.find((f) => f.featureId === feature.featureId)?.optionId || ''
                }
                onChange={(e) => handleFeatureChange(feature.featureId, Number(e.target.value))}
                className="w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-teal-500 focus:ring-teal-500"
              >
                <option value="" disabled>
                  선택해주세요
                </option>
                {feature.options.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.text}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </FormSection>

      <FormSection title="위치 상세 정보">
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">선택된 건물</label>
            <div className="w-full rounded-md border-gray-200 bg-gray-200 p-2 text-gray-600 shadow-inner">
              {selectedAreaName || '지도에서 건물을 먼저 선택해주세요.'}
            </div>
          </div>
          <div>
            <label
              htmlFor="detailLocation"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              상세 위치 (예: 401호, 정문 앞 소파)
            </label>
            <input
              id="detailLocation"
              type="text"
              name="detailLocation"
              value={formData.detailLocation}
              onChange={handleChange}
              className="w-full rounded-md border-gray-300 p-2 shadow-sm"
            />
          </div>
        </div>
      </FormSection>

      <FormSection title="분실물 상세 정보(선택)">
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          maxLength={500}
          rows={5}
          placeholder="분실물에 대한 추가 정보를 입력해주세요. (최대 500자)"
          className="w-full rounded-md border-gray-300 p-2 shadow-sm"
        />
      </FormSection>

      <FormSection title="보관 장소 (예: 학생회관 401호)">
        <input
          id="storageName"
          type="text"
          name="storageName"
          value={formData.storageName}
          onChange={handleChange}
          placeholder="분실물을 보관하고 있는 장소를 입력해주세요"
          className="w-full rounded-md border-gray-300 p-2 shadow-sm"
        />
      </FormSection>

      <FormSection title="사진 업로드">
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-6">
          {formData.images.length < 3 && (
            <div className="flex flex-col items-center">
              <p className="mb-4 text-sm text-gray-500">
                분실물 사진을 업로드 해주세요 (최소 1장, 최대 3장)
              </p>
              <input
                type="file"
                multiple
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageUpload}
                className="hidden"
                data-testid="file-input"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="rounded-lg bg-teal-500 px-6 py-2 font-bold text-white hover:cursor-pointer hover:bg-teal-600"
              >
                업로드
              </button>
            </div>
          )}
          {formData.images.length > 0 && (
            <div className="mt-4 grid grid-cols-3 gap-4">
              {formData.images.map((file, index) => (
                <div key={index} className="relative aspect-square">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`preview ${index}`}
                    className="h-full w-full rounded-md object-cover"
                  />
                  <button
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-1 right-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white hover:cursor-pointer"
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </FormSection>
    </div>
  );
};

export default Step2_DetailForm;
