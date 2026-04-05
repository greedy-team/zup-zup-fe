import { useSearchParams } from 'react-router-dom';
import { useSelectedMode } from '../../../store/hooks/useMainStore';
import { useCategoriesQuery } from '../../../api/main/hooks/useMain';
import { isValidId } from '../../../utils/isValidId';
import type { Category } from '../../../types/lost/lostApi';

const CategoryRadio = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedMode = useSelectedMode();

  const { data } = useCategoriesQuery();
  const categories = data ?? [];

  const allCategory: Category = { categoryId: 0, categoryName: '전체', categoryIconUrl: '' };
  const categoryList = [allCategory, ...categories];

  const rawCategoryId = searchParams.get('categoryId');
  const selectedCategoryId = isValidId(rawCategoryId) ? Number(rawCategoryId) : 0;

  // 카테고리 선택 시 페이지 1로 이동시키는 핸들러
  const handleSelectCategory = (id: number) => {
    const next = new URLSearchParams(searchParams);
    if (id === 0) {
      next.delete('categoryId');
    } else {
      next.set('categoryId', String(id));
    }
    next.delete('page');
    setSearchParams(next, { replace: true });
  };

  // 등록 모드에서는 아예 표시하지 않음
  if (selectedMode === 'register') {
    return null;
  }

  return (
    <>
      <div className="scrollbar-hide relative z-10 w-full touch-pan-x overflow-x-auto px-4 py-3 [-webkit-overflow-scrolling:touch] md:overflow-visible">
        <fieldset className="m-0 border-0 p-0">
          <legend className="sr-only">카테고리 선택</legend>
          <div className="inline-flex min-w-max gap-2 whitespace-nowrap md:min-w-0 md:flex-wrap md:gap-x-2 md:gap-y-7 md:whitespace-normal">
            {categoryList.map((category) => {
              const id = category.categoryId;
              const name = category.categoryName;
              const inputId = `category-${id}`;
              return (
                <div key={inputId}>
                  <input
                    type="radio"
                    id={inputId}
                    name="category"
                    value={id}
                    checked={id === selectedCategoryId}
                    onChange={() => handleSelectCategory(id)}
                    className="peer hidden"
                  />
                  <label
                    htmlFor={inputId}
                    className="cursor-pointer rounded-full border border-gray-400/20 bg-white px-4 py-2 text-sm peer-checked:border-gray-400/20 peer-checked:bg-teal-600 peer-checked:text-white hover:bg-teal-50 peer-checked:hover:bg-teal-700 focus:ring-2 focus:ring-teal-400 focus:outline-none md:px-6 md:py-3 md:text-base"
                  >
                    {name}
                  </label>
                </div>
              );
            })}
          </div>
        </fieldset>
      </div>
    </>
  );
};

export default CategoryRadio;
