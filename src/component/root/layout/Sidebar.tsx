import Authentication from './Authentication';
import Logo from './Logo';

const Sidebar = () => {
  return (
    <aside className="h-dvh w-18 shrink-0 border-r bg-teal-50">
      <div className="md: flex h-full flex-col justify-between p-4">
        <div>
          <Logo />
        </div>
        <div className="mt-4">
          <Authentication />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
