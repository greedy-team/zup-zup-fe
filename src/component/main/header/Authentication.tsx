const Authentication = () => {
  return (
    <div className="flex items-center gap-2 self-start pt-4 text-teal-600">
      <button className="rounded-lg border border-black/20 bg-white px-3 py-1.5 text-sm text-teal-700 hover:bg-teal-50 focus:ring-2 focus:ring-teal-400 focus:outline-none">
        로그인
      </button>
      <button className="rounded-lg border border-black/20 bg-teal-600 px-3 py-1.5 text-sm text-white hover:bg-teal-700 focus:ring-2 focus:ring-teal-400 focus:outline-none">
        회원가입
      </button>
    </div>
  );
};

export default Authentication;
