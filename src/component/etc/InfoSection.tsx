import { PropsWithChildren, ReactNode } from 'react';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

type InfoSectionProps = PropsWithChildren<
  {
    title: string;
    icon?: ReactNode;
  } & (
    | {
        type: 'link';
        href: string;
      }
    | {
        type: 'component';
      }
  )
>;

export const InfoSection = (props: InfoSectionProps) => {
  const { title, icon } = props;
  const isComponent = props.type === 'component';

  const renderContent = () => {
    if (!isComponent) return null;
    return <div className="mt-4 text-sm text-gray-600">{props.children}</div>;
  };

  const content = (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        {icon && <span className="text-teal-600">{icon}</span>}
        <span className="text-lg font-medium text-gray-800">{title}</span>
      </div>
      {!isComponent && <ChevronRight className="h-5 w-5 text-gray-400" />}
    </div>
  );

  if (isComponent) {
    return (
      <li className="py-4">
        <div className="w-full text-left">{content}</div>
        {renderContent()}
      </li>
    );
  }

  const isInternalLink = props.href.startsWith('/');

  return (
    <li className="py-4">
      {isInternalLink ? (
        <Link to={props.href} className="block">
          {content}
        </Link>
      ) : (
        <a href={props.href} target="_blank" rel="noopener noreferrer" className="block">
          {content}
        </a>
      )}
    </li>
  );
};
