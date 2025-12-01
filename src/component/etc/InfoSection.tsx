import { PropsWithChildren } from 'react';
import { ChevronRight } from 'lucide-react';

type InfoSectionProps = PropsWithChildren<
  {
    title: string;
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
  const { title } = props;
  const isComponent = props.type === 'component';

  const renderContent = () => {
    if (!isComponent) return null;

    if (props.type === 'component') {
      return <div className="mt-4 text-sm text-gray-600">{props.children}</div>;
    }
    return null;
  };

  const WrapperComponent = isComponent ? 'div' : 'a';
  const wrapperProps = isComponent
    ? { className: 'w-full text-left' }
    : {
        href: props.type === 'link' ? props.href : '#',
        target: '_blank',
        rel: 'noopener noreferrer',
      };

  return (
    <li className="py-4">
      <WrapperComponent {...wrapperProps}>
        <div className="flex items-center justify-between">
          <span className="text-lg font-medium text-gray-800">{title}</span>
          {!isComponent ? <ChevronRight className="h-5 w-5 text-gray-500" /> : <></>}
        </div>
      </WrapperComponent>
      {renderContent()}
    </li>
  );
};
