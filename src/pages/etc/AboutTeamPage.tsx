import { useState } from 'react';
import { Loader2 } from 'lucide-react';

const NOTION_PAGE_URL =
  'https://quiet-pyroraptor-d30.notion.site/ebd/2a443457829580908f4af5f4122459de';

export const AboutTeamPage = () => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="relative flex min-h-0 w-full flex-1 flex-col">
      {isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70">
          <div className="flex flex-col items-center gap-2 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-teal-600" aria-hidden="true" />
            <p className="text-sm font-medium text-gray-900">페이지를 불러오는 중입니다...</p>
          </div>
        </div>
      )}

      <iframe
        src={NOTION_PAGE_URL}
        className={`w-full flex-1 border-0 ${isLoading ? 'invisible' : 'visible'}`}
        onLoad={() => setIsLoading(false)}
        title="팀 소개 페이지"
      />
    </div>
  );
};
