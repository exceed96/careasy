'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { CheckCircle2, ChevronDown, Loader2, X } from 'lucide-react';
import {
  careEasyEvents,
  trackCareEasyEvent,
} from '@/lib/careeasyAnalytics';
import {
  CAREEASY_TRIAL_MODAL_EVENT,
  type CareEasyTrialModalDetail,
} from '@/lib/openCareEasyTrialModal';
import { CareEasyTrialPrivacyTermsPanel } from '@/components/careeasy/CareEasyTrialPrivacyTerms';

type SubmitState = 'idle' | 'submitting' | 'success' | 'error';

type TrialResponse = {
  ok: boolean;
  message?: string;
  id?: string | null;
};

/**
 * 현재 페이지 URL에서 UTM 값을 추출합니다.
 * Firebase 저장과 GA/Clarity 분석에 함께 사용합니다.
 */
function getAttribution() {
  if (typeof window === 'undefined') {
    return {
      pageUrl: '',
      referrer: '',
      utm: {},
    };
  }

  const url = new URL(window.location.href);
  const utm: Record<string, string> = {};

  ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].forEach(
    (key) => {
      const value = url.searchParams.get(key);

      if (value) {
        utm[key] = value;
      }
    },
  );

  return {
    pageUrl: window.location.href,
    referrer: document.referrer,
    utm,
  };
}

/**
 * 입력값이 이메일인지 전화번호인지 판별합니다.
 */
function getContactType(contact: string): 'email' | 'phone' | 'unknown' {
  const trimmedContact = contact.trim();
  const digitOnly = trimmedContact.replace(/\D/g, '');
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (emailRegex.test(trimmedContact)) {
    return 'email';
  }

  if (digitOnly.length >= 9 && digitOnly.length <= 11) {
    return 'phone';
  }

  return 'unknown';
}

/**
 * 무료 체험 신청 모달입니다.
 * 모바일에서는 bottom sheet처럼 보이고, 데스크톱에서는 중앙 모달로 보입니다.
 */
export function CareEasyTrialModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [source, setSource] = useState('unknown');
  const [contact, setContact] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [privacyAgreed, setPrivacyAgreed] = useState(false);
  const [isPrivacyTermsOpen, setIsPrivacyTermsOpen] = useState(false);
  const [submitState, setSubmitState] = useState<SubmitState>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const contactType = useMemo(() => getContactType(contact), [contact]);

  /**
   * 모달 닫기 함수입니다.
   * useEffect에서 사용하므로 useCallback으로 먼저 선언해 Hook dependency 문제를 방지합니다.
   */
  const closeModal = useCallback(() => {
    setIsOpen(false);
    setIsPrivacyTermsOpen(false);

    trackCareEasyEvent(careEasyEvents.trialModalClose, {
      source,
    });
  }, [source]);

  /**
   * 전역 이벤트를 받아 무료 체험 모달을 엽니다.
   * Header, Intro, CTA 등 어디서든 openCareEasyTrialModal()로 열 수 있습니다.
   */
  useEffect(() => {
    const handleOpenModal = (event: Event) => {
      const customEvent = event as CustomEvent<CareEasyTrialModalDetail>;
      const nextSource = customEvent.detail?.source ?? 'unknown';

      setIsOpen(true);
      setSource(nextSource);
      setSubmitState('idle');
      setErrorMessage('');
      setPrivacyAgreed(false);
      setIsPrivacyTermsOpen(false);

      trackCareEasyEvent(careEasyEvents.trialModalOpen, {
        source: nextSource,
      });
    };

    window.addEventListener(CAREEASY_TRIAL_MODAL_EVENT, handleOpenModal);

    return () => {
      window.removeEventListener(CAREEASY_TRIAL_MODAL_EVENT, handleOpenModal);
    };
  }, []);

  /**
   * ESC 키로 모달을 닫습니다.
   * closeModal을 dependency에 포함해 최신 source 값으로 추적 이벤트를 보냅니다.
   */
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeModal();
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, closeModal]);

  /**
   * 무료 체험 신청 폼 제출 처리입니다.
   * 입력값 검증 후 /api/trial로 전송하고, 서버에서 Firebase에 저장합니다.
   */
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedContact = contact.trim();
    const nextContactType = getContactType(trimmedContact);

    if (!trimmedContact) {
      setErrorMessage('전화번호 또는 이메일을 입력해 주세요.');
      return;
    }

    if (nextContactType === 'unknown') {
      setErrorMessage('전화번호 또는 이메일 형식으로 입력해 주세요.');
      return;
    }

    if (!privacyAgreed) {
      setErrorMessage('개인정보 처리 약관에 동의해 주세요.');
      return;
    }

    setSubmitState('submitting');
    setErrorMessage('');

    trackCareEasyEvent(careEasyEvents.trialSubmitAttempt, {
      source,
      contact_type: nextContactType,
    });

    try {
      const attribution = getAttribution();

      const response = await fetch('/api/trial', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contact: trimmedContact,
          contactType: nextContactType,
          age,
          gender,
          source,
          privacyAgreed: true,
          ...attribution,
        }),
      });

      const result = (await response.json()) as TrialResponse;

      if (!response.ok || !result.ok) {
        throw new Error(result.message ?? '무료 체험 신청에 실패했습니다.');
      }

      setSubmitState('success');

      trackCareEasyEvent(careEasyEvents.trialSubmitSuccess, {
        source,
        contact_type: nextContactType,
        lead_id: result.id ?? '',
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : '무료 체험 신청에 실패했습니다.';

      setSubmitState('error');
      setErrorMessage(message);

      trackCareEasyEvent(careEasyEvents.trialSubmitFailure, {
        source,
        contact_type: nextContactType,
        reason: message,
      });
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div
      role="presentation"
      className="fixed inset-0 z-[100] flex items-end justify-center bg-[rgba(32,36,38,0.34)] px-3 pb-3 backdrop-blur-sm sm:items-center sm:px-5 sm:pb-0"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          closeModal();
        }
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="careeasy-trial-modal-title"
        className={`flex w-full max-w-md flex-col overflow-hidden rounded-[1.75rem] border border-[var(--care-border-soft)] bg-[var(--care-bg-soft)] p-4 shadow-[0_-16px_54px_rgba(32,36,38,0.18)] sm:rounded-[2rem] sm:p-5 ${isPrivacyTermsOpen
          ? 'h-[calc(100dvh-1.5rem)]'
          : 'max-h-[calc(100dvh-1.5rem)]'
          }`}
      >
        <div className="shrink-0">
          <div
            className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-[rgba(117,107,98,0.2)] sm:hidden"
            aria-hidden="true"
          />

          <div className="flex items-start justify-between flex-col gap-3">
            <div className='flex items-start justify-between w-full'>
              <div className='flex flex-col'>
                <p className="careeasy-kicker">1개월 무료 체험</p>
                <h2
                  id="careeasy-trial-modal-title"
                  className="careeasy-balanced-text mt-2 text-lg font-bold leading-tight tracking-tight text-[var(--care-text)] sm:mt-3 sm:text-2xl"
                >
                  {isPrivacyTermsOpen
                    ? '개인정보 처리 약관'
                    : '케어이지 무료 체험을 안내해드릴게요.'}
                </h2>
              </div>
              <button
                type="button"
                onClick={closeModal}
                aria-label="무료 체험 신청 모달 닫기"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--care-border-soft)] bg-white/72 text-[var(--care-muted)] transition hover:bg-white hover:text-[var(--care-text)] sm:h-10 sm:w-10"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {!isPrivacyTermsOpen ? (
              <div className='flex flex-col gap-1'>
                <p className="careeasy-balanced-text mt-1.5 text-xs sm:text-sm leading-5 text-[var(--care-muted)] sm:mt-2 sm:leading-6">
                  가족 단톡방 속 반복되는 케어 스트레스를 줄여보세요.
                </p>
                <p className="careeasy-balanced-text text-xs sm:text-sm leading-5 text-[var(--care-muted)] sm:leading-6">
                  전화번호 또는 이메일만 남기면, 무료 체험 안내를 보내드립니다.
                </p>
                <p className="careeasy-balanced-text text-xs sm:text-sm font-bold gleading-5 text-[var(--care-muted)] sm:leading-6">
                  무료 체험 안내 외에 광고, 홍보성 연락은 일절 보내지 않습니다.
                </p>
              </div>
            ) : (
              <p className="careeasy-balanced-text mt-1.5 text-sm leading-5 text-[var(--care-muted)]">
                아래 내용을 확인한 뒤 신청 화면에서 동의해 주세요.
              </p>
            )}
            {/* </div> */}

            {/* <button
              type="button"
              onClick={closeModal}
              aria-label="무료 체험 신청 모달 닫기"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--care-border-soft)] bg-white/72 text-[var(--care-muted)] transition hover:bg-white hover:text-[var(--care-text)] sm:h-10 sm:w-10"
            >
              <X className="h-5 w-5" />
            </button> */}
          </div>
        </div>

        <div
          className={
            isPrivacyTermsOpen
              ? 'flex min-h-0 flex-1 flex-col overflow-hidden'
              : undefined
          }
        >
          {isPrivacyTermsOpen ? (
            <CareEasyTrialPrivacyTermsPanel
              onBack={() => setIsPrivacyTermsOpen(false)}
            />
          ) : submitState === 'success' ? (
            <div className="mt-5 rounded-[1.5rem] border border-[var(--care-border-soft)] bg-white/72 p-5 text-center sm:mt-6">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--care-primary-soft)] text-[var(--care-primary-dark)]">
                <CheckCircle2 className="h-6 w-6" />
              </div>

              <h3 className="text-lg font-bold text-[var(--care-text)]">
                신청이 접수됐습니다.
              </h3>

              <p className="mt-2 text-sm leading-6 text-[var(--care-muted)]">
                현재 케어이지는 더 나은 체험을 위해 준비 중이며, 빠른 시일 내에 신청해주신 분들께 무료 체험 안내를 드릴 예정입니다.
                <br />감사합니다.
              </p>

              <button
                type="button"
                onClick={closeModal}
                className="careeasy-pressable careeasy-cta-primary mt-5 inline-flex min-h-11 w-full items-center justify-center rounded-full px-5 py-3 text-sm font-bold"
              >
                확인
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 sm:mt-5 sm:space-y-4">
              <div>
                <label
                  htmlFor="trial-contact"
                  className="text-sm font-bold text-[var(--care-text)]"
                >
                  전화번호 또는 이메일{' '}
                  <span className="text-[var(--care-primary)]">*</span>
                </label>

                <input
                  id="trial-contact"
                  name="contact"
                  type="text"
                  inputMode="text"
                  autoComplete="email"
                  value={contact}
                  onChange={(event) => setContact(event.target.value)}
                  placeholder="010-0000-0000 / email@example.com"
                  className="mt-1.5 h-12 w-full rounded-2xl border border-[rgba(233,85,19,0.24)] bg-white px-4 text-base font-semibold text-[var(--care-text)] shadow-[0_8px_20px_rgba(32,36,38,0.05)] outline-none transition placeholder:font-medium placeholder:text-[var(--care-muted-light)] focus:border-[var(--care-primary)]"
                />

                {contact && contactType === 'unknown' ? (
                  <p className="mt-2 text-xs font-medium text-[var(--care-primary-dark)]">
                    전화번호 또는 이메일 형식으로 입력해 주세요.
                  </p>
                ) : null}
              </div>

              <div>
                <div className="mb-1.5 flex items-center justify-between gap-3">
                  <p className="text-sm font-bold text-[var(--care-text)]">
                    기본 정보
                  </p>

                  <span className="rounded-full bg-white/70 px-2.5 py-1 text-[0.7rem] font-bold text-[var(--care-muted)]">
                    선택 사항
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label
                      htmlFor="trial-age"
                      className="text-xs font-bold text-[var(--care-muted)]"
                    >
                      나이
                    </label>

                    <div className="relative mt-1.5">
                      <select
                        id="trial-age"
                        name="age"
                        value={age}
                        onChange={(event) => setAge(event.target.value)}
                        className="h-11 w-full appearance-none rounded-2xl border border-[var(--care-border)] bg-white/90 px-4 pr-10 text-sm font-semibold text-[var(--care-text)] outline-none transition focus:border-[var(--care-primary)]"
                      >
                        <option value="">선택 안 함</option>
                        <option value="20대">20대 이하</option>
                        <option value="30대">30대</option>
                        <option value="40대">40대</option>
                        <option value="50대">50대</option>
                        <option value="60대 이상">60대 이상</option>
                      </select>
                      <ChevronDown
                        className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--care-muted)]"
                        aria-hidden="true"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="trial-gender"
                      className="text-xs font-bold text-[var(--care-muted)]"
                    >
                      성별
                    </label>

                    <div className="relative mt-1.5">
                      <select
                        id="trial-gender"
                        name="gender"
                        value={gender}
                        onChange={(event) => setGender(event.target.value)}
                        className="h-11 w-full appearance-none rounded-2xl border border-[var(--care-border)] bg-white/90 px-4 pr-10 text-sm font-semibold text-[var(--care-text)] outline-none transition focus:border-[var(--care-primary)]"
                      >
                        <option value="">선택 안 함</option>
                        <option value="여성">여성</option>
                        <option value="남성">남성</option>
                      </select>
                      <ChevronDown
                        className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--care-muted)]"
                        aria-hidden="true"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-[var(--care-border-soft)] bg-white/55 px-3 py-2.5">
                <label className="flex cursor-pointer items-start gap-2.5">
                  <input
                    type="checkbox"
                    name="privacyAgreed"
                    checked={privacyAgreed}
                    onChange={(event) => {
                      setPrivacyAgreed(event.target.checked);

                      if (event.target.checked && errorMessage === '개인정보 처리 약관에 동의해 주세요.') {
                        setErrorMessage('');
                      }
                    }}
                    className="mt-0.5 h-4 w-4 shrink-0 rounded border-[var(--care-border)] text-[var(--care-primary)] accent-[var(--care-primary)]"
                  />

                  <span className="text-sm leading-5 text-[var(--care-text)]">
                    <span className="font-bold text-[var(--care-primary)]">[필수]</span>{' '}
                    개인정보 처리 약관에 동의합니다.{' '}
                    <button
                      type="button"
                      onClick={() => setIsPrivacyTermsOpen(true)}
                      className="font-semibold text-[var(--care-primary-dark)] underline underline-offset-2"
                    >
                      약관 보기
                    </button>
                  </span>
                </label>
              </div>

              {errorMessage ? (
                <p className="rounded-2xl bg-[var(--care-primary-soft)] px-3 py-2.5 text-sm font-medium text-[var(--care-primary-dark)]">
                  {errorMessage}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={submitState === 'submitting' || !privacyAgreed}
                data-careeasy-event="trial_form_submit"
                className="careeasy-pressable careeasy-cta-primary inline-flex min-h-12 w-full items-center justify-center rounded-full px-6 py-3 text-base font-bold disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitState === 'submitting' ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    신청 중
                  </span>
                ) : (
                  '무료 체험 신청하기'
                )}
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
