import { useState, useEffect } from 'react';
import type { EmailAlertResponse } from '../../types/mypage';

export const DOMAIN_OPTIONS = ['naver.com', 'kakao.com', 'daum.net', 'gmail.com'];
export const DIRECT_INPUT = '직접 입력';
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type ParsedEmail = {
  localPart: string;
  selectedDomain: string;
  isCustomDomain: boolean;
  customDomain: string;
};

const parseEmail = (emailValue: string): ParsedEmail | null => {
  if (!emailValue) return null;
  const atIndex = emailValue.indexOf('@');
  if (atIndex === -1) return null;

  const local = emailValue.slice(0, atIndex);
  const dom = emailValue.slice(atIndex + 1);

  if (DOMAIN_OPTIONS.includes(dom)) {
    return { localPart: local, selectedDomain: dom, isCustomDomain: false, customDomain: '' };
  }
  return { localPart: local, selectedDomain: DOMAIN_OPTIONS[0], isCustomDomain: true, customDomain: dom };
};

export const useEmailEditState = (
  emailAlertData: EmailAlertResponse | undefined,
  isOpen: boolean,
) => {
  const [localPart, setLocalPart] = useState('');
  const [selectedDomain, setSelectedDomain] = useState(DOMAIN_OPTIONS[0]);
  const [customDomain, setCustomDomain] = useState('');
  const [isCustomDomain, setIsCustomDomain] = useState(false);
  const [emailBeforeEdit, setEmailBeforeEdit] = useState('');
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [emailAlertEnabled, setEmailAlertEnabled] = useState(false);

  const activeDomain = isCustomDomain ? customDomain : selectedDomain;
  const email = localPart && activeDomain ? `${localPart}@${activeDomain}` : '';
  const isEmailValid = EMAIL_REGEX.test(email);

  useEffect(() => {
    if (!emailAlertData) return;
    const emailValue = emailAlertData.email ?? '';
    setEmailAlertEnabled(emailAlertData.emailAlertEnabled);
    setIsEditingEmail(!emailValue);
    const parsed = parseEmail(emailValue);
    if (parsed) {
      setLocalPart(parsed.localPart);
      setSelectedDomain(parsed.selectedDomain);
      setIsCustomDomain(parsed.isCustomDomain);
      setCustomDomain(parsed.customDomain);
    }
  }, [emailAlertData]);

  useEffect(() => {
    if (isOpen) return;
    const emailValue = emailAlertData?.email ?? '';
    setEmailAlertEnabled(emailAlertData?.emailAlertEnabled ?? false);
    setIsEditingEmail(!emailValue);
    const parsed = parseEmail(emailValue);
    if (parsed) {
      setLocalPart(parsed.localPart);
      setSelectedDomain(parsed.selectedDomain);
      setIsCustomDomain(parsed.isCustomDomain);
      setCustomDomain(parsed.customDomain);
    }
  }, [isOpen, emailAlertData]);

  const handleStartEditEmail = () => {
    setEmailBeforeEdit(email);
    setIsEditingEmail(true);
  };

  const handleCancelEditEmail = () => {
    const parsed = parseEmail(emailBeforeEdit);
    if (parsed) {
      setLocalPart(parsed.localPart);
      setSelectedDomain(parsed.selectedDomain);
      setIsCustomDomain(parsed.isCustomDomain);
      setCustomDomain(parsed.customDomain);
    }
    setIsEditingEmail(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') handleCancelEditEmail();
  };

  const handleDomainChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === DIRECT_INPUT) {
      setIsCustomDomain(true);
    } else {
      setIsCustomDomain(false);
      setSelectedDomain(e.target.value);
      setCustomDomain('');
    }
  };

  return {
    email,
    isEmailValid,
    isEditingEmail,
    isCustomDomain,
    localPart,
    setLocalPart,
    selectedDomain,
    customDomain,
    setCustomDomain,
    emailBeforeEdit,
    emailAlertEnabled,
    setEmailAlertEnabled,
    handleStartEditEmail,
    handleCancelEditEmail,
    handleKeyDown,
    handleDomainChange,
  };
};
