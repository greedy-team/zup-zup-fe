import { Link } from 'react-router-dom';
import ZupzupLiteJpg from '../../../../assets/zupzupLiteLogo1.jpg';
import ZupzupDetailJpg from '../../../../assets/zupzupDetailLogo1.jpg';
import ZupzupLiteWebp from '../../../../assets/lite.webp';
import ZupzupDetailWebp from '../../../../assets/detail.webp';

const Logo = () => {
  return (
    <Link to="/" className="flex flex-shrink-0 items-center gap-3" aria-label="메인 페이지로 이동">
      <picture>
        {/* 작은 화면: WebP → JPG */}
        <source media="(max-width: 480px)" type="image/webp" srcSet={ZupzupLiteWebp} />
        <source media="(max-width: 480px)" srcSet={ZupzupLiteJpg} />

        {/* 기본(큰 화면): WebP → JPG */}
        <source type="image/webp" srcSet={ZupzupDetailWebp} />

        {/* 최종 폴백 */}
        <img
          src={ZupzupDetailJpg}
          alt="줍줍"
          className="h-auto object-cover"
          loading="eager"
          decoding="async"
          fetchPriority="high"
          // 가능하면 실제 원본 가로/세로 px을 넣어 CLS 줄이기:
          // width={72px}
          // height={72px}
        />
      </picture>

      <h1 className="sr-only">줍줍</h1>
    </Link>
  );
};

export default Logo;
