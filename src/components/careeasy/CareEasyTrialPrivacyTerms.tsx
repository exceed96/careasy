import { ChevronLeft } from 'lucide-react';
import { careEasyPrivacyPolicy } from '@/content/careeasy/privacyPolicy';
import {
  careEasyTrialPrivacyConsent,
  type CareEasyTrialPrivacyTermSection,
} from '@/content/careeasy/trialPrivacyTerms';

function PrivacyTermSection({ section }: { section: CareEasyTrialPrivacyTermSection }) {
  return (
    <section className="space-y-2">
      <h4 className="text-xs font-bold text-[var(--care-text)]">{section.title}</h4>

      {section.paragraphs?.map((paragraph) => (
        <p key={paragraph} className="text-xs leading-5 text-[var(--care-muted)]">
          {paragraph}
        </p>
      ))}

      {section.bullets ? (
        <ul className="list-disc space-y-1 pl-4 text-xs leading-5 text-[var(--care-muted)]">
          {section.bullets.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : null}

      {section.subsections?.map((subsection) => (
        <div key={subsection.title} className="space-y-1.5 pl-1">
          <p className="text-xs font-semibold text-[var(--care-text)]">
            {subsection.title}
          </p>

          <ul className="list-disc space-y-1 pl-4 text-xs leading-5 text-[var(--care-muted)]">
            {subsection.bullets.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
}

type CareEasyPrivacyTermsVariant = 'consent' | 'policy';

type CareEasyTrialPrivacyTermsProps = {
  className?: string;
  variant?: CareEasyPrivacyTermsVariant;
};

/**
 * 개인정보처리방침·수집·이용 동의 전문을 표시합니다.
 */
export function CareEasyTrialPrivacyTerms({
  className = '',
  variant = 'consent',
}: CareEasyTrialPrivacyTermsProps) {
  const content =
    variant === 'policy' ? careEasyPrivacyPolicy : careEasyTrialPrivacyConsent;
  const { documentTitle, intro, sections, effectiveDate, supplement } = content;

  return (
    <div className={`space-y-4 text-left ${className}`.trim()}>
      <div className="space-y-2">
        <p className="text-xs font-bold text-[var(--care-text)]">{documentTitle}</p>

        {intro.map((paragraph) => (
          <p key={paragraph} className="text-xs leading-5 text-[var(--care-muted)]">
            {paragraph}
          </p>
        ))}
      </div>

      {sections.map((section) => (
        <PrivacyTermSection key={section.title} section={section} />
      ))}

      <div className="space-y-1 border-t border-[var(--care-border-soft)] pt-3 text-[0.7rem] leading-5 text-[var(--care-muted-light)]">
        <p>시행일: {effectiveDate}</p>
        {supplement ? <p>{supplement}</p> : null}
      </div>
    </div>
  );
}

type CareEasyTrialPrivacyTermsPanelProps = {
  onBack: () => void;
};

/**
 * 약관 전문을 별도 화면으로 보여줍니다.
 * 본문만 스크롤되며, 신청 폼 모달에는 스크롤이 생기지 않습니다.
 */
export function CareEasyTrialPrivacyTermsPanel({
  onBack,
}: CareEasyTrialPrivacyTermsPanelProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <button
        type="button"
        onClick={onBack}
        aria-label="신청 화면으로 돌아가기"
        className="careeasy-pressable group mb-1 inline-flex shrink-0 items-center gap-2 rounded-full border border-[var(--care-border-soft)] bg-white/85 px-3 py-2 text-sm font-bold text-[var(--care-text)] shadow-[0_6px_18px_rgba(32,36,38,0.05)] transition hover:border-[rgba(233,85,19,0.22)] hover:bg-white hover:text-[var(--care-primary-dark)]"
      >
        <span
          className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--care-primary-soft)] text-[var(--care-primary-dark)] transition group-hover:bg-[rgba(233,85,19,0.14)]"
          aria-hidden="true"
        >
          <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
        </span>
        신청 화면으로
      </button>

      <div
        className="mt-3 min-h-0 flex-1 touch-pan-y overflow-y-auto overscroll-y-contain rounded-xl border border-[var(--care-border-soft)] bg-white/80 p-3 [-webkit-overflow-scrolling:touch]"
        tabIndex={0}
        role="region"
        aria-label="개인정보 처리 약관 전문"
      >
        <CareEasyTrialPrivacyTerms className="pb-2" />
      </div>
    </div>
  );
}
