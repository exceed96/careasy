import Image from 'next/image';
import { ImagePlus, Smartphone } from 'lucide-react';
import { CareEasyContainer } from '@/components/ui/CareEasyContainer';
import { careEasyAppPreview } from '@/content/careeasy/appPreview';

/**
 * CareEasy 앱 목업 이미지를 보여주는 섹션입니다.
 *
 * 중요:
 * - 앱 목업 이미지는 이미 핸드폰 전체 형태로 제작된 이미지를 사용합니다.
 * - 그래서 별도의 DOM 핸드폰 프레임을 만들지 않습니다.
 * - imageSrc가 비어 있으면 자연스러운 placeholder를 보여줍니다.
 */
export function CareEasyAppPreviewSection() {
  return (
    <section id="app-screens" className="bg-[var(--care-bg)] py-20 md:py-24">
      <CareEasyContainer>
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[var(--care-border)] bg-white/75 px-4 py-2 text-sm font-semibold text-[var(--care-primary-dark)] shadow-sm backdrop-blur">
            <Smartphone className="h-4 w-4" />
            {careEasyAppPreview.eyebrow}
          </div>

          <h2 className="text-3xl font-bold tracking-tight md:text-5xl">
            {careEasyAppPreview.title}
          </h2>

          <p className="mt-5 text-base leading-7 text-[var(--care-mute)] md:text-lg md:leading-8">
            {careEasyAppPreview.description}
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {careEasyAppPreview.screens.map((screen) => {
            const hasImage = Boolean(screen.imageSrc);

            return (
              <article
                key={screen.title}
                className="careeasy-clean-card rounded-[2rem] p-5 md:p-6"
              >
                {/*
                  앱 목업 이미지 영역입니다.
                  이미지 자체가 핸드폰 전체 모양이므로 별도 핸드폰 프레임을 만들지 않습니다.
                  배경은 이미지와 자연스럽게 섞이도록 크림/화이트 그라데이션으로 처리합니다.
                */}
                <div className="relative flex min-h-[440px] items-center justify-center overflow-hidden rounded-[1.75rem] bg-[radial-gradient(circle_at_50%_12%,rgba(233,85,19,0.10),transparent_15rem),linear-gradient(180deg,rgba(255,255,255,0.72),rgba(255,248,240,0.46))] p-4 md:min-h-[500px]">
                  <div className="absolute inset-x-8 bottom-8 h-20 rounded-full bg-[rgba(32,36,38,0.08)] blur-2xl" />

                  {hasImage ? (
                    <Image
                      src={screen.imageSrc}
                      alt={`${screen.title} 앱 목업`}
                      width={720}
                      height={1100}
                      sizes="(max-width: 768px) 88vw, 28vw"
                      className="relative z-10 h-auto max-h-[420px] w-auto max-w-full object-contain drop-shadow-[0_22px_34px_rgba(32,36,38,0.16)] md:max-h-[480px]"
                    />
                  ) : (
                    <div className="relative z-10 flex min-h-[360px] w-full flex-col items-center justify-center rounded-[1.5rem] border border-dashed border-[var(--care-border)] bg-white/46 px-5 text-center backdrop-blur-sm">
                      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--care-primary-soft)] text-[var(--care-primary-dark)]">
                        <ImagePlus className="h-7 w-7" />
                      </div>

                      <p className="text-lg font-bold text-[var(--care-text)]">
                        앱 목업 이미지 삽입 예정
                      </p>

                      <p className="mt-3 max-w-xs text-sm leading-6 text-[var(--care-muted)]">
                        핸드폰 전체 모양으로 만든 앱 화면 이미지를 넣으면 이 영역에 자연스럽게 표시됩니다.
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-6">
                  <h3 className="text-xl font-bold tracking-tight">
                    {screen.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-[var(--care-muted)]">
                    {screen.description}
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