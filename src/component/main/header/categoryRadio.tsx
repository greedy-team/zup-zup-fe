import type { CategoryRadioComponentProps } from '../../../types/main/components';

const CategoryRadio = ({
  categories,
  selectedCategoryId,
  setSelectedCategoryId,
  selectedMode,
}: CategoryRadioComponentProps) => {
  const tmpCategoryList = [{ categoryId: 0, categoryName: '전체' }, ...categories];

  return (
    <>
      <fieldset className="relative overflow-x-auto border-0 bg-white px-4 py-3">
        <legend className="sr-only">카테고리 선택</legend>
        <div className="flex min-w-max gap-2">
          {tmpCategoryList.map((category) => {
            const id = category.categoryId;
            const name = category.categoryName;
            return (
              <div key={id}>
                <input
                  type="radio"
                  id={name}
                  name="category"
                  value={id}
                  checked={id === selectedCategoryId}
                  onChange={() => setSelectedCategoryId(id)}
                  className="peer hidden"
                />
                <label
                  htmlFor={name}
                  className={`cursor-pointer rounded-full border border-black/20 px-4.5 py-2 text-sm peer-checked:border-black/20 peer-checked:bg-teal-600 peer-checked:text-white hover:bg-teal-50 peer-checked:hover:bg-teal-700 focus:ring-2 focus:ring-teal-400 focus:outline-none ${
                    selectedMode === 'register' ? 'cursor-not-allowed opacity-50' : ''
                  }`}
                >
                  {name}
                </label>
              </div>
            );
          })}
        </div>

        {/* 등록 모드일 때 fieldset을 반투명하게 덮는 판 */}
        {selectedMode === 'register' && <div className="absolute inset-0 z-10 bg-gray-500/30" />}
      </fieldset>
    </>
  );
};

export default CategoryRadio;
