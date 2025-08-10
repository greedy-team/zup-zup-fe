import type { Category } from '../../../types/main/category';

type Props = {
  categories: Category[];
  category: Category;
  onChangeCategory: (c: Category) => void;
};

const Header = ({ categories, category, onChangeCategory }: Props) => {
  return (
    <header className="shrink-0 border-b">
      <div className="bg-white text-black px-4 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded bg-emerald-600 grid place-items-center">
            <img src="/logo.png" alt="logo" className="size-7 object-contain" />
          </div>
          <span className="text-[30px] font-bold text-black">줍줍</span>
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

      <div role="radiogroup" className="bg-white px-4 py-3 overflow-x-auto">
        <div className="flex gap-2 min-w-max">
          {categories.map((c) => {
            const selected = c === category;
            return (
              <button
                key={c}
                role="radio"
                aria-checked={selected}
                onClick={() => onChangeCategory(c)}
                className={[
                  'px-3 py-1.5 rounded-full text-sm border border-black/20',
                  selected
                    ? 'bg-emerald-600 text-white border-black/20 focus:ring-emerald-400'
                    : 'bg-white text-emerald-700 border-black/20 hover:bg-emerald-50 focus:ring-emerald-300',
                ].join(' ')}
              >
                {c}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};

export default Header;
