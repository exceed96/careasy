import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { CareEasyContainer } from '@/components/ui/CareEasyContainer';
import { careEasyWorkflow } from '@/content/careeasy/workflow';

/**
 * CareEasy의 사용 흐름 섹션입니다.
 * 과한 장식을 줄이고, 따뜻하고 정돈된 카드형 흐름으로 보여줍니다.
 */
export function CareEasyWorkflowSection() {
  return (
    <section id="flow" className="careeasy-flow-section py-20 md:py-24">
      <CareEasyContainer>
        <div className="mx-auto max-w-3xl text-center">
          <span className="careeasy-kicker">{careEasyWorkflow.eyebrow}</span>

          <h2 className="careeasy-balanced-text mt-5 text-3xl font-bold tracking-tight md:text-5xl">
            {careEasyWorkflow.title}
          </h2>

          <p className="careeasy-balanced-text mt-5 text-base leading-7 text-[var(--care-muted)] md:text-lg md:leading-8">
            기록은 한 번으로 끝나지 않습니다. 다음 담당자가 바로 이해하고 이어받을 수 있어야 합니다.
          </p>
        </div>

        <div className="relative mt-12 grid gap-5 md:grid-cols-3">
          <div className="pointer-events-none absolute left-[17%] right-[17%] top-10 hidden h-px bg-[var(--care-border)] md:block" />

          {careEasyWorkflow.steps.map((step, index) => {
            const isLast = index === careEasyWorkflow.steps.length - 1;

            return (
              <article
                key={step.number}
                className="careeasy-clean-card rounded-[2rem] p-6 md:p-7"
              >
                <div className="relative z-10">
                  <div className="flex items-center justify-between">
                    <div className="careeasy-flow-number flex h-11 w-11 items-center justify-center rounded-2xl text-sm font-black">
                      {step.number}
                    </div>

                    <div className="hidden h-9 w-9 items-center justify-center rounded-full border border-[var(--care-border-soft)] bg-white text-[var(--care-muted)] md:flex">
                      {isLast ? (
                        <CheckCircle2 className="h-4 w-4 text-[var(--care-primary-dark)]" />
                      ) : (
                        <ArrowRight className="h-4 w-4" />
                      )}
                    </div>
                  </div>

                  <h3 className="careeasy-balanced-text mt-6 text-xl font-bold tracking-tight text-[var(--care-text)]">
                    {step.title}
                  </h3>

                  <p className="careeasy-balanced-text mt-3 text-sm leading-7 text-[var(--care-muted)] md:text-base">
                    {step.body}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </CareEasyContainer>
    </section>
  );
}
