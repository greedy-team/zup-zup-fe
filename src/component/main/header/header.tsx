import type { Category } from '../../../types/main/category';

type Props = {
  categories: Category[];
  selectedCategory: Category;
  onChangeCategory: (c: Category) => void;
};

const Header = ({ categories, selectedCategory, onChangeCategory }: Props) => {
  return (
    <header className="shrink-0 border-b">
      <div className="bg-white text-black px-4 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded bg-emerald-600 grid place-items-center">
            <img src="/logo.png" alt="logo" className="size-7 object-contain" />
          </div>
          <h1 className="text-[30px] font-bold text-black">줍줍</h1>
        </div>

        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 rounded-lg bg-white text-emerald-700 text-sm border border-black/20 hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-emerald-400">
            로그인
          </button>
          <button className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-sm hover:bg-emerald-700 border border-black/20 focus:outline-none focus:ring-2 focus:ring-emerald-400">
            회원가입
          </button>
        </div>
      </div>

      <fieldset className="bg-white px-4 py-3 overflow-x-auto border-0">
        <legend className="sr-only">카테고리 선택</legend>
        <div className="flex gap-2 min-w-max">
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
                  className="hidden peer"
                />
                <label
                  htmlFor={id}
                  className="px-3 py-1.5 rounded-full text-sm border border-black/20 cursor-pointer peer-checked:bg-emerald-600 peer-checked:text-white peer-checked:border-black/20 hover:bg-emerald-50 peer-checked:hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-400"
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
