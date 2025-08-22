import Authentication from './Authentication';
import Logo from './Logo';

const Header = () => {
  return (
    <header className="shrink-0 bg-teal-50">
      {/* 반응형으로 높이 설정(sm, lg) */}
      <div className="relative flex h-20 items-center sm:h-24 lg:h-28">
        {/* 로고를 좌측에 고정하고 중앙에 오도록 */}
        <div className="absolute top-1/2 left-4 -translate-y-1/2">
          <Logo />
        </div>

        {/* 중앙 문구를 헤더의 정중앙에 오도록 함
          반응형: (xs에서는 중앙 문구를 안보여 줌, sm부터 표시, 폰트의 크기도 단계적으로 변화)
          whitespace-nowrap: 줄 내 강제 줄바꿈을 못하게 하여 스타일을 유자
        */}
        <p className="absolute top-1/2 left-1/2 hidden -translate-x-1/2 -translate-y-1/2 text-center text-lg leading-tight font-extrabold whitespace-nowrap sm:block sm:text-xl md:text-2xl lg:text-3xl">
          {/* 첫번째 줄 검정색 폰트 */}
          <span className="block text-black">잃어버린 물건은?</span>
          {/* 둘번째 줄은 줍줍을 강조하기 위해서 웹사이트 색상 적용 */}
          <span className="block text-teal-600">줍줍!!</span>
        </p>

        {/* 로그인 버튼의 위치를 오른쪽 위에 고정 */}
        <div className="absolute top-2 right-4">
          <Authentication />
        </div>
      </div>
    </header>
  );
};

export default Header;
