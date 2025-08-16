import type { CategoryRadioComponentProps } from '../../../types/main/components';

const CategoryRadio = ({
  categories,
  selectedCategoryId,
  setSelectedCategoryId,
}: CategoryRadioComponentProps) => {
  return (
    <>
      <fieldset className="overflow-x-auto border-0 bg-white px-4 py-3">
        <legend className="sr-only">카테고리 선택</legend>
        <div className="flex min-w-max gap-2">
          {categories.map((category) => {
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
                  className="cursor-pointer rounded-full border border-black/20 px-4.5 py-2 text-sm peer-checked:border-black/20 peer-checked:bg-teal-600 peer-checked:text-white hover:bg-teal-50 peer-checked:hover:bg-teal-700 focus:ring-2 focus:ring-teal-400 focus:outline-none"
                >
                  {name}
                </label>
              </div>
            );
          })}
        </div>
      </fieldset>
    </>
  );
};

export default CategoryRadio;
