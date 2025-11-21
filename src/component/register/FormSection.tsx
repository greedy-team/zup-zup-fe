const FormSection: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <div className="mb-6">
    <h3 className="mb-3 text-xl font-medium text-gray-800">{title}</h3>
    <div className="rounded-lg bg-gray-100 p-6">{children}</div>
  </div>
);

export default FormSection;
