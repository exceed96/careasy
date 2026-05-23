'use client';

import { CareEasyContainer } from '@/components/ui/CareEasyContainer';
import { openCareEasyPrivacyPolicyModal } from '@/lib/openCareEasyPrivacyPolicyModal';

/**
 * CareEasy 랜딩페이지 푸터입니다.
 */
export function CareEasyFooter() {
  return (
    <footer className="border-t border-[var(--care-border)] bg-white py-10">
      <CareEasyContainer className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 text-sm text-[var(--care-muted)] sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 CareEasy. All rights reserved.</p>

          <button
            type="button"
            onClick={() => openCareEasyPrivacyPolicyModal()}
            className="inline-flex w-fit items-center text-sm font-semibold text-[var(--care-text)] underline decoration-[var(--care-border)] underline-offset-4 transition hover:text-[var(--care-primary-dark)] hover:decoration-[var(--care-primary)]"
          >
            개인정보처리방침
          </button>
        </div>

        <p className="text-sm text-[var(--care-muted)]">
          부모님 돌봄을 가족이 함께 이어갈 수 있도록.
        </p>
      </CareEasyContainer>
    </footer>
  );
}
