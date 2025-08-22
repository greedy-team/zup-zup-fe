import ZupzupLogo from '../../../../assets/zupzup_mole.png';

const Logo = () => {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-3">
        <div className="grid size-15 place-items-center rounded">
          <img src={ZupzupLogo} alt="logo" className="size-14 object-contain" />
        </div>
        <h1 className="text-5xl font-bold text-black">줍줍</h1>
      </div>
      <div>분실물 관리 서비스</div>
    </div>
  );
};

export default Logo;
