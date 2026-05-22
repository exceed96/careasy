'use client';

import { Quote, Sparkles } from 'lucide-react';
import { CareEasyContainer } from '@/components/ui/CareEasyContainer';
import { careEasySuccessStories } from '@/content/careeasy/successStories';

/**
 * 성공사례 카드 한 장의 UI입니다.
 * 마퀴 트랙 안에서 동일한 카드가 반복 렌더링됩니다.
 */
function SuccessStoryCard({
  family,
  role,
  quote,
  highlight,
}: (typeof careEasySuccessStories.stories)[number]) {
  return (
    <article className="careeasy-success-story-card careeasy-clean-card flex w-[min(88vw,22rem)] shrink-0 flex-col rounded-[1.75rem] p-6 md:w-[24rem] md:p-7">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="careeasy-balanced-text text-lg font-bold tracking-tight text-[var(--care-text)]">
            {family}
          </p>
          <p className="mt-1 text-sm font-semibold text-[var(--care-primary-dark)]">
            {role}
          </p>
        </div>

        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--care-primary-soft)] text-[var(--care-primary-dark)]">
          <Quote className="h-5 w-5" />
        </div>
      </div>

      <p className="careeasy-balanced-text flex-1 text-sm leading-7 text-[var(--care-muted)] md:text-[0.95rem]">
        &ldquo;{quote}&rdquo;
      </p>

      <p className="careeasy-balanced-text mt-5 inline-flex items-center rounded-full border border-[rgba(233,85,19,0.22)] bg-[var(--care-primary-soft)] px-3 py-1.5 text-xs font-semibold text-[var(--care-primary-dark)]">
        {highlight}
      </p>
    </article>
  );
}

/**
 * CareEasy 성공사례 섹션입니다.
 * 카드 5장이 수평으로 흘러가는 마퀴 슬라이드를 사용합니다.
 */
export function CareEasySuccessStoriesSection() {
  const marqueeStories = [
    ...careEasySuccessStories.stories,
    ...careEasySuccessStories.stories,
  ];

  return (
    <section
      id="success-stories"
      className="careeasy-success-stories-section bg-[linear-gradient(180deg,#fffaf5_0%,var(--care-bg)_100%)] py-20 md:py-24"
    >
      <CareEasyContainer>
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[var(--care-border)] bg-white/75 px-4 py-2 text-sm font-semibold text-[var(--care-primary-dark)] shadow-sm backdrop-blur">
            <Sparkles className="h-4 w-4" />
            {careEasySuccessStories.eyebrow}
          </div>

          <h2 className="careeasy-balanced-text text-3xl font-bold tracking-tight md:text-5xl">
            {careEasySuccessStories.title}
          </h2>

          <p className="careeasy-balanced-text mt-5 text-base leading-7 text-[var(--care-muted)] md:text-lg md:leading-8">
            {careEasySuccessStories.description}
          </p>
        </div>
      </CareEasyContainer>

      <div className="careeasy-success-marquee-shell relative mt-12 overflow-hidden">
        <div
          className="careeasy-success-marquee-track flex w-max gap-5 px-5 md:gap-6 md:px-8"
          aria-hidden="true"
        >
          {marqueeStories.map((story, index) => (
            <SuccessStoryCard key={`${story.id}-${index}`} {...story} />
          ))}
        </div>

        {/*
          스크린 리더용: 마퀴는 장식용 반복이므로 원본 5건만 의미 있게 노출합니다.
        */}
        <ul className="sr-only">
          {careEasySuccessStories.stories.map((story) => (
            <li key={story.id}>
              {story.family} — {story.quote}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
