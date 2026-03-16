import { useState, useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, Bell, Pencil } from 'lucide-react';
import { useCategoriesQuery } from '../../api/main/hooks/useMain';
import {
  useEmailAlertQuery,
  useSubscriptionsQuery,
  useUpdateAlertSettingsMutation,
} from '../../api/mypage/hooks/useMypageAlert';

type AlertSettingsModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const AlertSettingsModal = ({ isOpen, onClose }: AlertSettingsModalProps) => {
  const emailInputId = useId();
  const emailToggleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);

  const [email, setEmail] = useState('');
  const [emailBeforeEdit, setEmailBeforeEdit] = useState('');
  const [emailAlertEnabled, setEmailAlertEnabled] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);

  const { data: emailAlertData, isLoading: isEmailLoading } = useEmailAlertQuery();
  const { data: subscriptionsData, isLoading: isSubLoading } = useSubscriptionsQuery();
  const { data: categories, isLoading: isCatLoading } = useCategoriesQuery();

  const updateAlertSettingsMutation = useUpdateAlertSettingsMutation();

  useEffect(() => {
    if (emailAlertData) {
      setEmail(emailAlertData.email);
      setEmailAlertEnabled(emailAlertData.emailAlertEnabled);
      setIsEditingEmail(!emailAlertData.email);
    }
  }, [emailAlertData]);

  useEffect(() => {
    if (subscriptionsData) {
      setSelectedCategoryIds(subscriptionsData.categoryIds);
    }
  }, [subscriptionsData]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  const handleStartEditEmail = () => {
    setEmailBeforeEdit(email);
    setIsEditingEmail(true);
  };

  const handleCancelEditEmail = () => {
    setEmail(emailBeforeEdit);
    setIsEditingEmail(false);
  };

  const handleEmailKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      handleCancelEditEmail();
    }
  };

  const handleToggleCategory = (categoryId: number) => {
    setSelectedCategoryIds((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId],
    );
  };

  const handleSave = () => {
    updateAlertSettingsMutation.mutate({
      email,
      emailAlertEnabled,
      categoryIds: selectedCategoryIds,
    });
  };

  const isPending = updateAlertSettingsMutation.isPending;
  const isLoading = isEmailLoading || isSubLoading || isCatLoading;

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={handleBackdropClick}
    >
      <div
        ref={panelRef}
        className="flex max-h-[90vh] w-full max-w-md flex-col rounded-2xl bg-white shadow-2xl"
      >
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-teal-500" aria-hidden="true" />
            <h2 className="text-base font-semibold text-slate-900">이메일 알림 설정</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 disabled:pointer-events-none disabled:opacity-50"
            aria-label="닫기"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="flex flex-col gap-5 overflow-y-auto px-6 pb-6">
          <div className="flex flex-col gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4">
            <label htmlFor={emailInputId} className="text-sm font-semibold text-slate-700">
              이메일 주소
            </label>

            {isEditingEmail ? (
              <div className="flex items-center gap-2">
                <input
                  id={emailInputId}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={handleEmailKeyDown}
                  placeholder={isEmailLoading ? '불러오는 중...' : 'example@email.com'}
                  disabled={isEmailLoading}
                  autoFocus
                  className="h-10 min-w-0 flex-1 rounded-lg border border-teal-400 bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:outline-none disabled:bg-slate-100 disabled:text-slate-400"
                />
                {emailBeforeEdit && (
                  <button
                    type="button"
                    onClick={handleCancelEditEmail}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                    aria-label="수정 취소"
                  >
                    <X className="h-4 w-4" aria-hidden="true" />
                  </button>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2.5">
                <span className="text-sm text-slate-800">{email}</span>
                <button
                  type="button"
                  onClick={handleStartEditEmail}
                  className="ml-2 flex shrink-0 items-center gap-1 rounded-md px-2 py-1 text-xs text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                  aria-label="이메일 수정"
                >
                  <Pencil className="h-3 w-3" aria-hidden="true" />
                  수정
                </button>
              </div>
            )}

            <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2.5">
              <label htmlFor={emailToggleId} className="cursor-pointer text-sm text-slate-700">
                이메일 알림 수신
              </label>
              <button
                id={emailToggleId}
                type="button"
                role="switch"
                aria-checked={emailAlertEnabled}
                onClick={() => setEmailAlertEnabled((prev) => !prev)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:outline-none ${
                  emailAlertEnabled ? 'bg-teal-500' : 'bg-slate-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${
                    emailAlertEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div>
              <p className="text-sm font-semibold text-slate-700">구독 카테고리</p>
              <p className="mt-0.5 text-xs text-slate-400">
                알림 받을 분실물 카테고리를 선택하세요
              </p>
            </div>

            {(isSubLoading || isCatLoading) && (
              <p className="text-xs text-slate-400">카테고리를 불러오는 중입니다...</p>
            )}

            {!isSubLoading && !isCatLoading && categories && (
              <ul className="grid grid-cols-3 gap-2">
                {categories.map((category) => {
                  const isSelected = selectedCategoryIds.includes(category.categoryId);
                  return (
                    <li key={category.categoryId}>
                      <button
                        type="button"
                        onClick={() => handleToggleCategory(category.categoryId)}
                        className={`flex w-full flex-col items-center gap-1.5 rounded-xl border px-2 py-3 text-xs transition focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:outline-none ${
                          isSelected
                            ? 'border-teal-400 bg-teal-50 text-teal-700'
                            : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <img
                          src={category.categoryIconUrl}
                          alt=""
                          aria-hidden="true"
                          className="h-6 w-6 shrink-0 object-contain"
                        />
                        <span className="w-full truncate text-center leading-tight">
                          {category.categoryName}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>

        <div className="shrink-0 border-t border-slate-100 px-6 py-4">
          <button
            type="button"
            onClick={handleSave}
            disabled={isPending || isLoading || email.trim() === ''}
            className="h-12 w-full rounded-xl bg-teal-500 text-sm font-semibold text-white transition hover:bg-teal-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? '저장 중...' : '저장'}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
};
