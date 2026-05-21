'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Loader2, X } from 'lucide-react';
import {
  careEasyEvents,
  trackCareEasyEvent,
} from '@/lib/careeasyAnalytics';
import {
  CAREEASY_TRIAL_MODAL_EVENT,
  type CareEasyTrialModalDetail,
} from '@/lib/openCareEasyTrialModal';

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
  const [submitState, setSubmitState] = useState<SubmitState>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const contactType = useMemo(() => getContactType(contact), [contact]);

  /**
   * 모달 닫기 함수입니다.
   * useEffect에서 사용하므로 useCallback으로 먼저 선언해 Hook dependency 문제를 방지합니다.
   */
  const closeModal = useCallback(() => {
    setIsOpen(false);

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
      className="fixed inset-0 z-[100] flex items-end justify-center bg-[rgba(32,36,38,0.34)] px-0 backdrop-blur-sm sm:items-center sm:px-5"
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
        className="w-full max-w-md rounded-t-[2rem] border border-[var(--care-border-soft)] bg-[var(--care-bg-soft)] p-5 shadow-[0_-16px_54px_rgba(32,36,38,0.18)] sm:rounded-[2rem] sm:p-6"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="careeasy-kicker">1개월 무료 체험</p>

            <h2
              id="careeasy-trial-modal-title"
              className="mt-4 text-2xl font-bold leading-tight tracking-tight text-[var(--care-text)]"
            >
              케어이지 무료 체험을 안내해드릴게요.
            </h2>

            <p className="mt-3 text-sm leading-6 text-[var(--care-muted)]">
              전화번호 또는 이메일만 남기면, 무료 체험 안내를 보내드립니다.
            </p>
          </div>

          <button
            type="button"
            onClick={closeModal}
            aria-label="무료 체험 신청 모달 닫기"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--care-border-soft)] bg-white/72 text-[var(--care-muted)] transition hover:bg-white hover:text-[var(--care-text)]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {submitState === 'success' ? (
          <div className="mt-7 rounded-[1.5rem] border border-[var(--care-border-soft)] bg-white/72 p-5 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--care-primary-soft)] text-[var(--care-primary-dark)]">
              <CheckCircle2 className="h-6 w-6" />
            </div>

            <h3 className="text-lg font-bold text-[var(--care-text)]">
              신청이 접수됐습니다.
            </h3>

            <p className="mt-2 text-sm leading-6 text-[var(--care-muted)]">
              남겨주신 연락처로 케어이지 무료 체험 안내를 보내드릴게요.
            </p>

            <button
              type="button"
              onClick={closeModal}
              className="careeasy-pressable mt-5 inline-flex min-h-11 w-full items-center justify-center rounded-full bg-[var(--care-primary)] px-5 py-3 text-sm font-bold text-white"
            >
              확인
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-7 space-y-4">
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
                placeholder="010-0000-0000 또는 careeasy@email.com"
                className="mt-2 h-12 w-full rounded-2xl border border-[var(--care-border)] bg-white px-4 text-base text-[var(--care-text)] outline-none transition placeholder:text-[var(--care-muted-light)] focus:border-[var(--care-primary)]"
              />

              {contact && contactType === 'unknown' ? (
                <p className="mt-2 text-xs font-medium text-[var(--care-primary-dark)]">
                  전화번호 또는 이메일 형식으로 입력해 주세요.
                </p>
              ) : null}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="trial-age"
                  className="text-sm font-bold text-[var(--care-text)]"
                >
                  나이
                </label>

                <select
                  id="trial-age"
                  name="age"
                  value={age}
                  onChange={(event) => setAge(event.target.value)}
                  className="mt-2 h-12 w-full rounded-2xl border border-[var(--care-border)] bg-white px-4 text-sm text-[var(--care-text)] outline-none transition focus:border-[var(--care-primary)]"
                >
                  <option value="">선택 안 함</option>
                  <option value="20대">20대 이하</option>
                  <option value="30대">30대</option>
                  <option value="40대">40대</option>
                  <option value="50대">50대</option>
                  <option value="60대 이상">60대 이상</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="trial-gender"
                  className="text-sm font-bold text-[var(--care-text)]"
                >
                  성별
                </label>

                <select
                  id="trial-gender"
                  name="gender"
                  value={gender}
                  onChange={(event) => setGender(event.target.value)}
                  className="mt-2 h-12 w-full rounded-2xl border border-[var(--care-border)] bg-white px-4 text-sm text-[var(--care-text)] outline-none transition focus:border-[var(--care-primary)]"
                >
                  <option value="">선택 안 함</option>
                  <option value="여성">여성</option>
                  <option value="남성">남성</option>
                </select>
              </div>
            </div>

            {errorMessage ? (
              <p className="rounded-2xl bg-[var(--care-primary-soft)] px-4 py-3 text-sm font-medium text-[var(--care-primary-dark)]">
                {errorMessage}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={submitState === 'submitting'}
              data-careeasy-event="trial_form_submit"
              className="careeasy-pressable inline-flex min-h-12 w-full items-center justify-center rounded-full bg-[var(--care-primary)] px-6 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-60"
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

            <p className="text-center text-xs leading-5 text-[var(--care-muted)]">
              제출 시 입력하신 개인정보는 문의/신청 처리 목적 외에는 사용되지 않습니다.
            </p>
          </form>
        )}
      </section>
    </div>
  );
}