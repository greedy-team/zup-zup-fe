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
      <h3 className="text-center text-lg font-bold">분실물 수령 개인정보 및 서약 동의</h3>

      <div className="max-h-70 w-full space-y-4 overflow-y-auto rounded-lg border bg-gray-50 p-4 text-left text-gray-700">
        <section className="space-y-2">
          <h4 className="font-bold">제1조 (개인정보 수집 및 이용 동의)</h4>
          <p>
            1. <span className="font-semibold">수집 항목:</span> 학번
          </p>
          <p>
            2. <span className="font-semibold">수집 목적:</span>
          </p>
          <ul className="ml-5 list-disc space-y-1">
            <li>본인 확인 및 수령 기록 관리</li>
            <li>정당한 소유자 여부 확인 및 부정 이용 방지</li>
            <li>분쟁 해결 및 서비스 운영 관리</li>
          </ul>
          <p>
            3. <span className="font-semibold">보유 및 이용 기간:</span> 수령 완료일로부터 6개월 후
            파기 (분쟁 발생 시 해결 시점까지 보관 가능)
          </p>
          <p>
            4. <span className="font-semibold">동의 거부 권리 및 불이익:</span> 귀하는 개인정보
            수집·이용에 대한 동의를 거부할 권리가 있습니다. 다만, 동의를 거부할 경우 분실물 수령
            서비스 이용이 제한될 수 있습니다.
          </p>
        </section>

        <hr className="border-gray-300" />

        <section className="space-y-2">
          <h4 className="font-bold">제2조 (분실물 소유권 확인 및 서약)</h4>
          <p>
            1. 본인은 서비스의 사진 확인 및 인증 절차를 통해 분실물이 본인 소유임을 확인했습니다.
          </p>
          <p>2. 본인은 허위로 서약하지 않았음을 확인합니다.</p>
          <p>
            3. 서비스의 절차는 참고용이며, 최종적인 소유권 판단의 책임은 신청자 본인에게 있습니다.
          </p>
        </section>

        <hr className="border-gray-300" />

        <section className="space-y-2">
          <h4 className="font-bold">제3조 (서비스 악용 방지 및 책임 소재)</h4>
          <p>
            1. 본인은 타인의 분실물을 고의로 수령하거나 허위 정보를 기재하지 않을 것을 서약합니다.
          </p>
          <p>
            2. 본 서비스는 분실물을 중개하는 플랫폼으로, 물품의 상태나 진위 여부를 보증하지
            않습니다.
          </p>
          <p>
            3. 허위 서약·서비스 악용 등으로 인한 모든 문제(분쟁, 손해 등)에 대한 책임은 서약자
            본인에게 있습니다.
          </p>
          <p>
            4. 서비스 제공자는 고의 또는 중대한 과실이 없는 한 이에 대한 법적 책임을 지지 않습니다.
          </p>
          <p>5. 필요 시 학교 당국 등 관련 기관에 사실관계를 통보할 수 있습니다.</p>
        </section>
      </div>

      <div className="w-full rounded-lg bg-gray-100 p-4 text-center">
        <p className="font-bold text-teal-700">{PLEDGE_TEXT}</p>
      </div>

      <input
        ref={inputRef}
        type="text"
        className={`${COMMON_INPUT_CLASSNAME} mt-2 w-full border-2 border-gray-400 p-3 focus-visible:ring-gray-300`}
        placeholder="상단 서약 문구를 똑같이 입력해주세요."
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
