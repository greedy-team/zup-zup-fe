const InfoBox: React.FC<{ title: string; children: React.ReactNode; className?: string }> = ({
  title,
  children,
  className,
}) => (
  <div className={`rounded-lg bg-gray-100 p-4 ${className}`}>
    <h4 className="mb-2 text-xl font-medium text-gray-500">{title}</h4>
    <div className="text-gray-800">{children}</div>
  </div>
);

export default InfoBox;
