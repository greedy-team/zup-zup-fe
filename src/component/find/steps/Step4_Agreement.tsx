import { type RefObject } from 'react';
import { PLEDGE_TEXT } from '../../../constants/find';

const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
  e.preventDefault();
  alert('붙여넣기는 사용할 수 없습니다.');
};

const Step4_Agreement = ({
  agreementRef,
}: {
  agreementRef: RefObject<HTMLInputElement | null>;
}) => {
  return (
    <div className="flex flex-col items-center space-y-4">
      <h3 className="text-lg font-bold">✨ Zupzup 성실 이용 서약 ✨ </h3>
      <div className="max-h-30 flex-grow space-y-2 overflow-y-auto rounded-lg border-1 bg-gray-100 p-4 text-center text-gray-600">
        <p>'줍줍'은 모두가 선한 마음으로 서로를 돕는 따뜻한 캠퍼스 문화를 만들어가고자 합니다.</p>
        <p>분실물 찾기 기능을 이용하기 전, 아래 내용을 확인하고 동의해주세요.</p>
        <p>
          <span className="font-bold">하나</span>, 저는 본인 소유의 분실물만 찾을 것을 약속합니다.
        </p>
        <p>
          <span className="font-bold">둘</span>, 분실물 주인을 확인하는 과정(퀴즈 등)에서 거짓된
          정보를 입력하지 않겠습니다.
        </p>
        <p>
          <span className="font-bold">셋</span>, 장난, 사기, 타인에게 피해를 주는 등 부적절한
          목적으로 분실물 찾기 서비스를 절대 악용하지 않겠습니다.
        </p>
        <p>
          <span className="font-bold">넷</span>, 위 사항을 위반하여 문제가 발생할 경우, 서비스 이용
          영구 제한 등의 조치 및 모든 책임은 저에게 있음을 확인합니다.
        </p>
      </div>
      <div className="w-full rounded-lg bg-gray-100 p-4 text-center">
        <p className="font-bold text-teal-700">{PLEDGE_TEXT}</p>
      </div>
      <input
        ref={agreementRef}
        type="text"
        onPaste={handlePaste}
        className="mt-2 w-full rounded-lg border-1 p-3 transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500"
        placeholder="상단 문구를 똑같이 입력해주세요."
      />
    </div>
  );
};

export default Step4_Agreement;
