import { useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  CategoriesContext,
  SelectedAreaIdContext,
  SelectedModeContext,
} from '../../../contexts/AppContexts';
import { isValidId } from '../../../utils/isValidId';

const CategoryRadio = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const { selectedMode } = useContext(SelectedModeContext)!;
  const { selectedAreaId } = useContext(SelectedAreaIdContext)!;
  const { categories } = useContext(CategoriesContext)!;
  const rawCategoryId = searchParams.get('categoryId');
  const selectedCategoryId = isValidId(rawCategoryId) ? Number(rawCategoryId) : 0;
  const allCategory = { categoryId: 0, categoryName: '전체' };
  const categoryList = [allCategory, ...(Array.isArray(categories) ? categories : [])];

  // 카테고리 선택 시 페이지 1로 이동시키는 핸들러
  const handleSelectCategory = (id: number) => {
    const next = new URLSearchParams();
    if (selectedAreaId === 0) {
      next.delete('schoolAreaId');
    } else {
      next.set('schoolAreaId', String(selectedAreaId));
    }
    if (id === 0) {
      next.delete('categoryId');
    } else {
      next.set('categoryId', String(id));
    }
    next.set('page', '1');
    setSearchParams(next, { replace: true });
  };

  // 등록 모드에서는 아예 표시하지 않음
  if (selectedMode === 'register') {
    return null;
  }

  return (
    <>
      <div className="scrollbar-hide relative z-10 w-full touch-pan-x overflow-x-auto px-4 py-3 [-webkit-overflow-scrolling:touch]">
        <fieldset className="m-0 border-0 p-0">
          <legend className="sr-only">카테고리 선택</legend>
          <div className="inline-flex min-w-max gap-2 whitespace-nowrap">
            {categoryList.map((category) => {
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
                    onChange={() => handleSelectCategory(id)}
                    className="peer hidden"
                  />
                  <label
                    htmlFor={name}
                    className="cursor-pointer rounded-full border border-gray-400/20 bg-white px-4.5 py-2 text-sm peer-checked:border-gray-400/20 peer-checked:bg-teal-600 peer-checked:text-white hover:bg-teal-50 peer-checked:hover:bg-teal-700 focus:ring-2 focus:ring-teal-400 focus:outline-none"
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
