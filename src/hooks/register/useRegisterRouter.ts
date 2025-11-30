import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';

export const useRegisterRouter = (schoolAreaIdArg?: number | null) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const { schoolAreaId: schoolAreaIdParam } = useParams<{ schoolAreaId: string }>();

  const categoryIdFromQuery = (() => {
    const v = Number(searchParams.get('categoryId'));
    return Number.isFinite(v) ? v : null;
  })();

  const validSchoolAreaId = (() => {
    if (typeof schoolAreaIdArg === 'number') return schoolAreaIdArg;
    const n = Number(schoolAreaIdParam);
    return Number.isFinite(n) ? n : null;
  })();

  return {
    navigate,
    location,
    searchParams,
    categoryIdFromQuery,
    validSchoolAreaId,
  };
};
