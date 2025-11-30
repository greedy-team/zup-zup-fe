export const getPageFromSearchParams = (
  searchParams: URLSearchParams,
  defaultPage: number,
): number => {
  const pageParam = searchParams.get('page');
  if (!pageParam) return defaultPage;

  const pageNumber = Number(pageParam);

  if (!Number.isFinite(pageNumber) || pageNumber < 1) {
    return defaultPage;
  }

  return pageNumber;
};
