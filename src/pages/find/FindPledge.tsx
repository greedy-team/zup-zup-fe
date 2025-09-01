import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { postPledge } from '../../api/find';
import { PLEDGE_TEXT } from '../../constants/find';
import { useAuthFlag } from '../../contexts/AuthFlag';
import { redirectToLoginKeepPath } from '../../utils/auth/loginRedirect';
import { useFindOutlet } from './FindLayout';

export default function FindPledge() {
  const { setNextHandler } = useFindOutlet();
  const { setUnauthenticated } = useAuthFlag();
  const { lostItemId: idParam } = useParams<{ lostItemId: string }>();
  const lostItemId = Number(idParam);

  const [submitting, setSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setNextHandler(async () => {
      const value = inputRef.current?.value.trim() || '';
      if (value !== PLEDGE_TEXT) {
        alert('서약 문구를 정확히 입력해주세요.');
        return false;
      }
      setSubmitting(true);
      try {
        await postPledge(lostItemId);
        return true;
      } catch (e: any) {
        if (e?.status === 401) {
          setUnauthenticated();
          redirectToLoginKeepPath();
        } else {
          alert('서약 처리 중 오류가 발생했습니다.');
        }
        return false;
      } finally {
        setSubmitting(false);
      }
    });
    return () => setNextHandler(null);
  }, [lostItemId]);

  return (
    <div className="flex flex-col items-center space-y-4">
      <h3 className="text-lg font-bold">✨ Zupzup 성실 이용 서약 ✨</h3>
      <div className="max-h-30 w-full space-y-2 overflow-y-auto rounded-lg border bg-gray-100 p-4 text-center text-gray-600">
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
          <span className="font-bold">셋</span>, 부적절한 목적으로 서비스를 절대 악용하지
          않겠습니다.
        </p>
        <p>
          <span className="font-bold">넷</span>, 위반 시 모든 책임은 저에게 있음을 확인합니다.
        </p>
      </div>
      <div className="w-full rounded-lg bg-gray-100 p-4 text-center">
        <p className="font-bold text-teal-700">{PLEDGE_TEXT}</p>
      </div>
      <input
        ref={inputRef}
        type="text"
        className="mt-2 w-full rounded-lg border-2 p-3 transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500"
        placeholder="상단 문구를 똑같이 입력해주세요."
        disabled={submitting}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            // 엔터로 바로 진행하고 싶다면: setNextHandler가 등록한 로직을 호출할 통로가 필요
            // 현재는 레이아웃의 '다음' 버튼만 트리거하므로 이 입력에서는 막아둡니다.
          }
        }}
      />
    </div>
  );
}
