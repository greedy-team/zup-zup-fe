type AdminPageHeaderProps = {
  totalCount: number;
};

const AdminPageHeader = ({ totalCount }: AdminPageHeaderProps) => {
  return (
    <header className="mb-4 flex flex-col items-start gap-1 sm:flex-row sm:items-baseline sm:gap-3">
      <h1 className="text-xl font-bold sm:text-2xl">관리자 페이지</h1>
      <p className="text-xs text-gray-600 sm:text-sm">총 {totalCount}건</p>
    </header>
  );
};

export default AdminPageHeader;
