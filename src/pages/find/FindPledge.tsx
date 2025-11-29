import { useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { PLEDGE_TEXT } from '../../constants/find';
import { useAuthActions } from '../../store/hooks/useAuth';
import { useRedirectToLoginKeepPath } from '../../utils/auth/loginRedirect';
import { usePledgeMutation } from '../../api/find/hooks/useFind';
import type { ApiError } from '../../types/common';
import { useFindOutlet } from '../../hooks/find/useFindOutlet';
import { showApiErrorToast } from '../../api/common/apiErrorToast';
import { COMMON_INPUT_CLASSNAME } from '../../constants/common';

export default function FindPledge() {
  const navigate = useNavigate();
  const { setNextButtonValidator } = useFindOutlet();
  const { setAuthenticated, setUnauthenticated } = useAuthActions();
  const { lostItemId: idParam } = useParams<{ lostItemId: string }>();
  const lostItemId = Number(idParam);
  const redirectToLoginKeepPath = useRedirectToLoginKeepPath();

  const inputRef = useRef<HTMLInputElement>(null);
  const pledgeMutation = usePledgeMutation(lostItemId);

  useEffect(() => {
    setNextButtonValidator(async () => {
      const value = inputRef.current?.value.trim() || '';

      if (value !== PLEDGE_TEXT) {
        toast.error('서약 문구를 정확히 입력해주세요.');
        return false;
      }

      try {
        await pledgeMutation.mutateAsync();
        setAuthenticated();
        return true;
      } catch (e) {
        const err = e as ApiError | undefined;
        if (!err) return false;

        showApiErrorToast(err);

        if (err.status === 401) {
          setUnauthenticated();
          redirectToLoginKeepPath();
        } else {
          navigate('/', { replace: true });
        }
        return false;
      }
    });

    return () => setNextButtonValidator(null);
  }, [
    pledgeMutation,
    setNextButtonValidator,
    setAuthenticated,
    setUnauthenticated,
    navigate,
    redirectToLoginKeepPath,
  ]);

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <h3 className="text-center text-lg font-bold">✨ Zupzup 성실 이용 서약 ✨</h3>

      <div className="max-h-40 w-full space-y-2 overflow-y-auto rounded-lg border bg-gray-50 p-4 text-center text-gray-700">
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
        className={`${COMMON_INPUT_CLASSNAME} mt-2 w-full border-2 border-gray-400 p-3 focus-visible:ring-gray-300`}
        placeholder="상단 문구를 똑같이 입력해주세요."
        disabled={pledgeMutation.isPending}
        onKeyDown={(e) => {
          if (e.key === 'Enter') e.preventDefault();
        }}
        onPaste={(e) => {
          e.preventDefault();
          toast.error('붙여넣기가 불가능합니다. 직접 입력해 주세요.');
        }}
      />
    </div>
  );
}
