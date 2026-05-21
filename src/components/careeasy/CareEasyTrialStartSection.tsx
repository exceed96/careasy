import Image from 'next/image';
import { CheckCircle2 } from 'lucide-react';
import { CareEasyContainer } from '@/components/ui/CareEasyContainer';
import { CareEasyButtonLink } from '@/components/ui/CareEasyButtonLink';
import { careEasyTrialStart } from '@/content/careeasy/trialStart';
import { careEasyEvents } from '@/lib/careeasyAnalytics';

/**
 * 마지막 무료 체험 신청 유도 섹션입니다.
 * CTA 버튼 안의 불필요한 화살표 아이콘은 제거하고,
 * 핵심 메시지와 무료 체험 버튼만 간결하게 노출합니다.
 */
export function CareEasyTrialStartSection() {
  return (
    <section
      id="trial"
      className="relative overflow-hidden bg-[linear-gradient(180deg,#fffaf5_0%,#fff0e7_100%)] py-14 text-[var(--care-text)] md:py-20"
    >
      {/*
        기존 링크 호환용 보조 앵커입니다.
        #free-trial로 이동해도 이 섹션에 도달합니다.
      */}
      <span id="free-trial" className="absolute -top-16" aria-hidden="true" />

      <div className="pointer-events-none absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-[rgba(233,85,19,0.08)] blur-3xl" />

      <CareEasyContainer>
        <div className="relative mx-auto max-w-4xl rounded-[2rem] border border-[var(--care-border-soft)] bg-[rgba(255,255,255,0.58)] px-5 py-9 text-center shadow-[var(--care-shadow-soft)] backdrop-blur-xl md:px-10 md:py-12">
          {/*
            CareEasy 로고입니다.
            배경색이 섞이지 않도록 투명 SVG 로고 사용을 권장합니다.
          */}
          <div className="mb-5 flex justify-center opacity-95">
            <Image
              src="/brand/careeasy-logo-heart-left-transparent.svg"
              alt="CareEasy"
              width={220}
              height={72}
              className="h-11 w-auto object-contain md:h-14"
            />
          </div>

          <p className="careeasy-kicker justify-center">CareEasy Trial</p>

          <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-bold leading-tight tracking-tight md:text-5xl">
            {careEasyTrialStart.title}
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-[var(--care-muted)] md:text-lg md:leading-8">
            {careEasyTrialStart.description}
          </p>

          {/*
            긴 benefit 카드 대신 한 줄 요약을 사용해
            모바일에서 섹션 높이를 줄입니다.
          */}
          <div className="mx-auto mt-6 flex max-w-2xl flex-col gap-2 text-left text-sm font-medium text-[var(--care-muted)] sm:flex-row sm:items-center sm:justify-center sm:text-center">
            <span className="inline-flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-[var(--care-primary-dark)]" />
              기록
            </span>
            <span className="hidden text-[var(--care-border)] sm:inline">·</span>
            <span className="inline-flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-[var(--care-primary-dark)]" />
              인수인계
            </span>
            <span className="hidden text-[var(--care-border)] sm:inline">·</span>
            <span className="inline-flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-[var(--care-primary-dark)]" />
              가족 리포트
            </span>
          </div>

          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <CareEasyButtonLink
              href="#trial"
              eventName={careEasyEvents.trialStartClick}
              className="w-full sm:w-auto"
            >
              {careEasyTrialStart.cta}
            </CareEasyButtonLink>

            <p className="text-sm font-medium text-[var(--care-muted)]">
              1개월 동안 먼저 경험해보세요.
            </p>
          </div>
        </div>
      </CareEasyContainer>
    </section>
  );
}