const Authentication = () => {
  return (
    <div className="flex h-20 items-center justify-between bg-white px-4 text-black">
      <div className="flex items-center gap-3">
        <div className="grid size-10 place-items-center rounded bg-emerald-600">
          <img src="/logo.png" alt="logo" className="size-7 object-contain" />
        </div>
        <h1 className="text-[30px] font-bold text-black">줍줍</h1>
      </div>

      <div className="flex items-center gap-2">
        <button className="rounded-lg border border-black/20 bg-white px-3 py-1.5 text-sm text-emerald-700 hover:bg-emerald-50 focus:ring-2 focus:ring-emerald-400 focus:outline-none">
          로그인
        </button>
        <button className="rounded-lg border border-black/20 bg-emerald-600 px-3 py-1.5 text-sm text-white hover:bg-emerald-700 focus:ring-2 focus:ring-emerald-400 focus:outline-none">
          회원가입
        </button>
      </div>
    </div>
  );
};

export default Authentication;
