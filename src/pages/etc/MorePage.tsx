import { MorePageHeader } from '../../component/etc/MorePageHeader';
import { InfoSection } from '../../component/etc/InfoSection';
import { Users, MessageCircleMore, Info } from 'lucide-react';

const MorePage = () => {
  return (
    <div className="flex w-full justify-center bg-gray-50">
      <div className="flex min-h-full w-full max-w-[1104px] flex-col gap-6 px-4 py-8">
        <MorePageHeader />
        <main className="rounded-2xl bg-white p-6 shadow-sm">
          <ul className="divide-y divide-gray-200">
            <InfoSection
              title="팀 소개"
              type="link"
              href="https://quiet-pyroraptor-d30.notion.site/ZupZup-2a443457829580908f4af5f4122459de?pvs=73"
              icon={<Users className="h-5 w-5" />}
            />
            <InfoSection
              title="피드백 남기기"
              type="link"
              href="https://forms.gle/xzvHjcbKh3vumBXQA"
              icon={<MessageCircleMore className="h-5 w-5" />}
            />
            <InfoSection title="아이콘 저작권" type="component" icon={<Info className="h-5 w-5" />}>
              <div className="space-y-2 text-gray-700">
                <p>이 서비스에 사용된 아이콘 중 일부는 icons8, Lucide에서 제공받았습니다.</p>
                <ul className="list-disc pl-5 text-sm">
                  <li>
                    <a
                      href="https://icons8.kr/"
                      title="plus icons"
                      className="text-teal-600 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Category icons by icons8
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://lucide.dev/license#lucide-license"
                      title="lucide icons license"
                      className="text-teal-600 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Sidebar icons by Lucide-react
                    </a>
                  </li>
                </ul>
              </div>
            </InfoSection>
          </ul>

          <p className="mt-6 text-center text-lg text-teal-600">
            Copyright © 2025 줍줍. All rights reserved.
          </p>
        </main>
      </div>
    </div>
  );
};

export default MorePage;
