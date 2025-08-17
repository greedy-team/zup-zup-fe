const Logo = () => {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-3">
        <div className="grid size-12 place-items-center rounded bg-teal-600">
          <img src="/logo.png" alt="logo" className="size-8 object-contain" />
        </div>
        <h1 className="text-5xl font-bold text-black">줍줍</h1>
      </div>
      <div>분실물 관리 서비스</div>
    </div>
  );
};

export default Logo;
