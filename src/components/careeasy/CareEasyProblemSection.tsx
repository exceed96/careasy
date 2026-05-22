import { CareEasyContainer } from '@/components/ui/CareEasyContainer';
import { careEasyProblem } from '@/content/careeasy/problem';

/**
 * CareEasy가 해결하는 문제를 설명하는 섹션입니다.
 * 가족 단톡방의 공유와 실제 인수인계 사이의 차이를 강조합니다.
 */
export function CareEasyProblemSection() {
  return (
    <section id="problem" className="bg-white py-12 md:py-20">
      <CareEasyContainer>
        <div className="max-w-4xl">
          <p className="text-sm font-bold uppercase tracking-wide text-[var(--care-primary-dark)]">
            {careEasyProblem.eyebrow}
          </p>

          <h2 className="careeasy-balanced-text mt-3 text-3xl font-bold tracking-tight md:text-5xl">
            {careEasyProblem.title}
          </h2>

          <p className="careeasy-balanced-text mt-5 text-base leading-7 text-[var(--care-muted)] md:hidden">
            {careEasyProblem.mobileDescription}
          </p>

          <p className="careeasy-balanced-text mt-5 hidden text-lg leading-8 text-[var(--care-muted)] md:block">
            {careEasyProblem.description}
          </p>
        </div>

        <div className="mt-7 grid gap-3 md:mt-10 md:grid-cols-3 md:gap-5">
          {careEasyProblem.cards.map((card) => (
            <article
              key={card.title}
              className="careeasy-card rounded-[var(--care-radius-2xl)] p-4 md:p-6"
            >
              <h3 className="careeasy-balanced-text text-xl font-bold">
                {card.title}
              </h3>
              <p className="careeasy-balanced-text mt-2 text-sm leading-6 text-[var(--care-muted)] md:mt-3 md:text-base md:leading-7">
                {card.body}
              </p>
            </article>
          ))}
        </div>
      </CareEasyContainer>
    </section>
  );
}
