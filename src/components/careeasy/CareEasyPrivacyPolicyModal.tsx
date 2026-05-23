'use client';

import { useCallback, useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { CareEasyTrialPrivacyTerms } from '@/components/careeasy/CareEasyTrialPrivacyTerms';
import { careEasySite } from '@/content/careeasy/site';
import { CAREEASY_PRIVACY_POLICY_MODAL_EVENT } from '@/lib/openCareEasyPrivacyPolicyModal';

/**
 * 랜딩페이지 푸터 등에서 열리는 개인정보처리방침 모달입니다.
 */
export function CareEasyPrivacyPolicyModal() {
  const [isOpen, setIsOpen] = useState(false);

  const closeModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  useEffect(() => {
    const handleOpenModal = () => {
      setIsOpen(true);
    };

    window.addEventListener(
      CAREEASY_PRIVACY_POLICY_MODAL_EVENT,
      handleOpenModal,
    );

    return () => {
      window.removeEventListener(
        CAREEASY_PRIVACY_POLICY_MODAL_EVENT,
        handleOpenModal,
      );
    };
  }, []);

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
        aria-labelledby="careeasy-privacy-policy-modal-title"
        className="flex h-[calc(100dvh-1.5rem)] w-full max-w-md flex-col overflow-hidden rounded-[1.75rem] border border-[var(--care-border-soft)] bg-[var(--care-bg-soft)] p-4 shadow-[0_-16px_54px_rgba(32,36,38,0.18)] sm:rounded-[2rem] sm:p-5"
      >
        <div className="shrink-0">
          <div
            className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-[rgba(117,107,98,0.2)] sm:hidden"
            aria-hidden="true"
          />

          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="careeasy-kicker">{careEasySite.serviceName}</p>

              <h2
                id="careeasy-privacy-policy-modal-title"
                className="careeasy-balanced-text mt-2 text-lg font-bold leading-tight tracking-tight text-[var(--care-text)] sm:mt-3 sm:text-2xl"
              >
                개인정보처리방침
              </h2>

              <p className="careeasy-balanced-text mt-1.5 text-sm leading-5 text-[var(--care-muted)] sm:mt-2 sm:leading-6">
                {careEasySite.serviceName} 서비스 이용과 관련한 개인정보 처리
                방침입니다.
              </p>
            </div>

            <button
              type="button"
              onClick={closeModal}
              aria-label="개인정보처리방침 모달 닫기"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--care-border-soft)] bg-white/72 text-[var(--care-muted)] transition hover:bg-white hover:text-[var(--care-text)] sm:h-10 sm:w-10"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div
          className="mt-3 min-h-0 flex-1 touch-pan-y overflow-y-auto overscroll-y-contain rounded-xl border border-[var(--care-border-soft)] bg-white/80 p-3 [-webkit-overflow-scrolling:touch]"
          tabIndex={0}
          role="region"
          aria-label="개인정보처리방침 전문"
        >
          <CareEasyTrialPrivacyTerms variant="policy" className="pb-2" />
        </div>

        <button
          type="button"
          onClick={closeModal}
          className="careeasy-pressable careeasy-cta-primary mt-3 inline-flex min-h-11 w-full shrink-0 items-center justify-center rounded-full px-5 py-3 text-sm font-bold"
        >
          확인
        </button>
      </section>
    </div>
  );
}
