import { Link } from 'react-router-dom';
import ZupzupLiteLogo from '../../../../assets/zupzupLiteLogo1.jpg';
import ZupzupDetailLogo from '../../../../assets/zupzupDetailLogo1.jpg';

const Logo = () => {
  return (
    <Link
      to="/"
      className="flex flex-shrink-0 items-center gap-3"
      aria-label="메인 페이지로 이동" // 링크를 누르면 홈으로 이동한다는 것을 알 수 있도록
    >
      <picture>
        {/* 작은 화면일 경우 디테일이 적은 로고를 보여줌 */}
        <source media="(max-width: 480px)" srcSet={ZupzupLiteLogo} />

        {/* 일반적인 경우 아래 부분에 상세정보가 있는 이미지를 보여줌 */}
        <img
          src={ZupzupDetailLogo}
          alt="줍줍"
          className="h-12 w-auto object-contain sm:h-14 md:h-16 lg:h-20" // 반응형 화면 사이즈에 따라 다른 이미지 높이
          loading="eager" // 페이지 로드와 함께 즉시 로드(로고는 가장핵심적인 요소이므로)
          decoding="async" // 디코딩을 메인 스레드와 분리하여 렌더링 최적화
          fetchPriority="high" // 네트워크 우선 순위를 정해주는 요소 (loading, decoding, fetchPriority 요소들이 합쳐져 해당 로고를 최우선적으로 그리도록 설정할수 있음)
        />
      </picture>
      {/** 웹 접근성을 위한 숨겨진 제목 */}
      <h1 className="sr-only">줍줍</h1>
    </Link>
  );
};

export default Logo;
