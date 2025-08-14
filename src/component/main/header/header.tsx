import type { Category } from '../../../types/main/category';

type Props = {
  categories: Category[];
  selectedCategory: Category;
  onChangeCategory: (c: Category) => void;
};

const Header = ({ categories, selectedCategory, onChangeCategory }: Props) => {
  return (
    <header className="shrink-0 border-b">
      <div className="flex h-20 items-center justify-between bg-white px-4 text-black">
        <div className="flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded bg-teal-600">
            <img src="/logo.png" alt="logo" className="size-7 object-contain" />
          </div>
          <h1 className="text-[30px] font-bold text-black">줍줍</h1>
        </div>

        <div className="flex items-center gap-2">
          <button className="rounded-lg border border-black/20 bg-white px-3 py-1.5 text-sm text-teal-700 hover:bg-teal-50 focus:ring-2 focus:ring-teal-400 focus:outline-none">
            로그인
          </button>
          <button className="rounded-lg border border-black/20 bg-teal-600 px-3 py-1.5 text-sm text-white hover:bg-teal-700 focus:ring-2 focus:ring-teal-400 focus:outline-none">
            회원가입
          </button>
        </div>
      </div>

      <fieldset className="overflow-x-auto border-0 bg-white px-4 py-3">
        <legend className="sr-only">카테고리 선택</legend>
        <div className="flex min-w-max gap-2">
          {categories.map((category) => {
            const id = category;
            return (
              <div key={category}>
                <input
                  type="radio"
                  id={id}
                  name="category"
                  value={category}
                  checked={category === selectedCategory}
                  onChange={() => onChangeCategory(category)}
                  className="peer hidden"
                />
                <label
                  htmlFor={id}
                  className="cursor-pointer rounded-full border border-black/20 px-3 py-1.5 text-sm peer-checked:border-black/20 peer-checked:bg-teal-600 peer-checked:text-white hover:bg-teal-50 peer-checked:hover:bg-teal-700 focus:ring-2 focus:ring-teal-400 focus:outline-none"
                >
                  {category}
                </label>
              </div>
            );
          })}
        </div>
      </fieldset>
    </header>
  );
};

export default Header;
