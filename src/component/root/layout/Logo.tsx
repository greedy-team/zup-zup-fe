import { Link } from 'react-router-dom';
import ZupzupLogoWebp from '../../../../assets/Logo.svg';

const Logo = () => {
  return (
    <Link to="/" className="flex flex-shrink-0 items-center gap-3" aria-label="메인 페이지로 이동">
      <img
        src={ZupzupLogoWebp}
        alt="줍줍"
        className="h-auto object-cover"
        loading="eager"
        decoding="async"
        fetchPriority="high"
      />

      <h1 className="sr-only">줍줍</h1>
    </Link>
  );
};

export default Logo;
