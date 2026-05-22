'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { ImagePlus, Smartphone } from 'lucide-react';
import { CareEasyContainer } from '@/components/ui/CareEasyContainer';
import { careEasyAppPreview } from '@/content/careeasy/appPreview';

const APP_PREVIEW_AUTO_SLIDE_INTERVAL_MS = 5000;

/**
 * CareEasy 앱 목업 이미지를 보여주는 섹션입니다.
 *
 * 중요:
 * - 앱 목업 이미지는 이미 핸드폰 전체 형태로 제작된 이미지를 사용합니다.
 * - 그래서 별도의 DOM 핸드폰 프레임을 만들지 않습니다.
 * - imageSrc가 비어 있으면 자연스러운 placeholder를 보여줍니다.
 */
export function CareEasyAppPreviewSection() {
  const [activeScreenIndex, setActiveScreenIndex] = useState(0);
  const sliderRef = useRef<HTMLDivElement | null>(null);
  const screenRefs = useRef<Array<HTMLElement | null>>([]);

  const scrollToScreen = (screenIndex: number) => {
    const sliderElement = sliderRef.current;
    const screenElement = screenRefs.current[screenIndex];

    if (!sliderElement || !screenElement) {
      return;
    }

    const nextLeft =
      screenElement.offsetLeft -
      (sliderElement.clientWidth - screenElement.clientWidth) / 2;

    sliderElement.scrollTo({
      left: nextLeft,
      behavior: 'smooth',
    });
  };

  const shouldUseMobileSlider = () => {
    return window.matchMedia('(max-width: 767px)').matches;
  };

  useEffect(() => {
    const sliderElement = sliderRef.current;

    if (!sliderElement) {
      return;
    }

    const handleScroll = () => {
      const sliderCenter = sliderElement.scrollLeft + sliderElement.clientWidth / 2;
      let closestIndex = 0;
      let closestDistance = Number.POSITIVE_INFINITY;

      screenRefs.current.forEach((screenElement, screenIndex) => {
        if (!screenElement) {
          return;
        }

        const screenCenter =
          screenElement.offsetLeft + screenElement.clientWidth / 2;
        const distance = Math.abs(screenCenter - sliderCenter);

        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = screenIndex;
        }
      });

      setActiveScreenIndex(closestIndex);
    };

    handleScroll();
    sliderElement.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      sliderElement.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      if (!shouldUseMobileSlider()) {
        return;
      }

      setActiveScreenIndex((currentIndex) => {
        const nextIndex = (currentIndex + 1) % careEasyAppPreview.screens.length;

        scrollToScreen(nextIndex);
        return nextIndex;
      });
    }, APP_PREVIEW_AUTO_SLIDE_INTERVAL_MS);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  return (
    <section id="app-screens" className="bg-[var(--care-bg)] py-20 md:py-24">
      <CareEasyContainer>
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[var(--care-border)] bg-white/75 px-4 py-2 text-sm font-semibold text-[var(--care-primary-dark)] shadow-sm backdrop-blur">
            <Smartphone className="h-4 w-4" />
            {careEasyAppPreview.eyebrow}
          </div>

          <h2 className="careeasy-balanced-text text-3xl font-bold tracking-tight md:text-5xl">
            {careEasyAppPreview.title}
          </h2>

          <p className="careeasy-balanced-text mt-5 text-base leading-7 text-[var(--care-mute)] md:hidden">
            {careEasyAppPreview.mobileDescription}
          </p>

          <p className="careeasy-balanced-text mt-5 hidden text-lg leading-8 text-[var(--care-mute)] md:block">
            {careEasyAppPreview.description}
          </p>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 text-xs font-semibold text-[var(--care-muted)] md:hidden">
          <span className="h-px w-7 bg-[var(--care-border)]" />
          <span>좌우로 넘겨보기</span>
          <span className="h-px w-7 bg-[var(--care-border)]" />
        </div>

        <div
          ref={sliderRef}
          className="-mx-5 mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:mx-0 md:mt-12 md:grid md:snap-none md:grid-cols-3 md:gap-6 md:overflow-visible md:px-0 md:pb-0"
        >
          {careEasyAppPreview.screens.map((screen, screenIndex) => {
            const hasImage = Boolean(screen.imageSrc);

            return (
              <article
                key={screen.title}
                ref={(node) => {
                  screenRefs.current[screenIndex] = node;
                }}
                className="careeasy-clean-card w-[82vw] max-w-[22rem] shrink-0 snap-center rounded-[2rem] p-4 md:w-auto md:max-w-none md:p-6"
              >
                {/*
                  앱 목업 이미지 영역입니다.
                  이미지 자체가 핸드폰 전체 모양이므로 별도 핸드폰 프레임을 만들지 않습니다.
                  배경은 이미지와 자연스럽게 섞이도록 크림/화이트 그라데이션으로 처리합니다.
                */}
                <div className="relative flex min-h-[390px] items-center justify-center overflow-hidden rounded-[1.75rem] bg-[radial-gradient(circle_at_50%_12%,rgba(233,85,19,0.10),transparent_15rem),linear-gradient(180deg,rgba(255,255,255,0.72),rgba(255,248,240,0.46))] p-4 md:min-h-[500px]">
                  <div className="absolute inset-x-8 bottom-8 h-20 rounded-full bg-[rgba(32,36,38,0.08)] blur-2xl" />

                  {hasImage ? (
                    <Image
                      src={screen.imageSrc}
                      alt={`${screen.title} 앱 목업`}
                      width={720}
                      height={1100}
                      sizes="(max-width: 768px) 88vw, 28vw"
                      className="relative z-10 h-auto max-h-[365px] w-auto max-w-full object-contain drop-shadow-[0_22px_34px_rgba(32,36,38,0.16)] md:max-h-[480px]"
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
                  <h3 className="careeasy-balanced-text text-xl font-bold tracking-tight">
                    {screen.title}
                  </h3>

                  <p className="careeasy-balanced-text mt-2 text-sm leading-6 text-[var(--care-muted)] md:hidden">
                    {screen.mobileDescription}
                  </p>

                  <p className="careeasy-balanced-text mt-2 hidden text-sm leading-6 text-[var(--care-muted)] md:block">
                    {screen.description}
                  </p>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-2 flex justify-center gap-2 md:hidden">
          {careEasyAppPreview.screens.map((screen, index) => (
            <button
              key={screen.title}
              type="button"
              aria-label={`${index + 1}번째 앱 화면 보기`}
              aria-current={activeScreenIndex === index ? 'true' : undefined}
              onClick={() => {
                setActiveScreenIndex(index);
                scrollToScreen(index);
              }}
              className={[
                'h-1.5 rounded-full transition-all duration-300',
                activeScreenIndex === index
                  ? 'w-7 !bg-[var(--care-primary)] shadow-[0_3px_10px_rgba(233,85,19,0.22)]'
                  : 'w-1.5 !bg-[rgba(117,107,98,0.28)]',
              ].join(' ')}
            />
          ))}
        </div>
      </CareEasyContainer>
    </section>
  );
}
