import { CareEasyContainer } from '@/components/ui/CareEasyContainer';
import { careEasyProblem } from '@/content/careeasy/problem';

/**
 * CareEasy가 해결하는 문제를 설명하는 섹션입니다.
 * 가족 단톡방의 공유와 실제 인수인계 사이의 차이를 강조합니다.
 */
export function CareEasyProblemSection() {
  return (
    <section id="problem" className="bg-white py-20">
      <CareEasyContainer>
        <div className="max-w-4xl">
          <p className="text-sm font-bold uppercase tracking-wide text-[var(--care-primary-dark)]">
            {careEasyProblem.eyebrow}
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-5xl">
            {careEasyProblem.title}
          </h2>

          <p className="mt-5 text-lg leading-8 text-[var(--care-muted)]">
            {careEasyProblem.description}
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {careEasyProblem.cards.map((card) => (
            <article
              key={card.title}
              className="careeasy-card rounded-[var(--care-radius-2xl)] p-6"
            >
              <h3 className="text-xl font-bold">{card.title}</h3>
              <p className="mt-3 leading-7 text-[var(--care-muted)]">
                {card.body}
              </p>
            </article>
          ))}
        </div>
      </CareEasyContainer>
    </section>
  );
}