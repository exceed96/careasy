'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CareEasyContainer } from '@/components/ui/CareEasyContainer';
import { careEasyIntroSlides } from '@/content/careeasy/intro';
import { careEasyEvents, trackCareEasyEvent } from '@/lib/careeasyAnalytics';
import { openCareEasyTrialModal } from '@/lib/openCareEasyTrialModal';

const AUTO_SLIDE_INTERVAL_MS = 6000;

type IntroClickAction =
  | 'primary_cta'
  | 'secondary_cta'
  | 'dot'
  | 'previous'
  | 'next';

/**
 * CareEasy 첫 화면 슬라이드 섹션입니다.
 * 무료 체험 CTA를 누르면 섹션 스크롤이 아니라 무료 체험 신청 모달을 엽니다.
 */
export function CareEasyIntroSection() {
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [isAutoSlidePaused, setIsAutoSlidePaused] = useState(false);
  const [failedImageMap, setFailedImageMap] = useState<Record<string, boolean>>(
    {},
  );

  const touchStartXRef = useRef<number | null>(null);
  const slides = careEasyIntroSlides;
  const activeSlide = slides[activeSlideIndex] ?? slides[0];

  /**
   * 섹션 id로 부드럽게 스크롤 이동합니다.
   */
  const scrollToSection = (sectionId: string) => {
    const targetElement = document.getElementById(sectionId);

    if (!targetElement) {
      return;
    }

    targetElement.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  /**
   * 무료 체험 CTA인지 판단합니다.
   * trial / free-trial 둘 다 모달 오픈 대상으로 처리합니다.
   */
  const isTrialTarget = (sectionId: string) => {
    return sectionId === 'trial' || sectionId === 'free-trial';
  };

  /**
   * 첫 화면 CTA/슬라이드 버튼 클릭 추적용 함수입니다.
   * GA/Clarity 분석 시 action, target, slide_id를 볼 수 있도록 분리합니다.
   */
  const trackIntroClick = (action: IntroClickAction, target: string) => {
    trackCareEasyEvent('careeasy_intro_click', {
      action,
      target,
      slide_id: activeSlide.id,
      slide_index: activeSlideIndex + 1,
    });
  };

  /**
   * CTA 버튼 클릭 처리입니다.
   * - 무료 체험 CTA: 모달 오픈
   * - 그 외 CTA: 해당 섹션으로 스크롤 이동
   */
  const handleSectionClick = (
    action: 'primary_cta' | 'secondary_cta',
    sectionId: string,
  ) => {
    if (isTrialTarget(sectionId)) {
      const source = `intro_${action}_${activeSlide.id}`;

      trackCareEasyEvent(careEasyEvents.trialClick, {
        source,
        action,
        target: sectionId,
        slide_id: activeSlide.id,
        slide_index: activeSlideIndex + 1,
      });

      openCareEasyTrialModal(source);
      return;
    }

    trackIntroClick(action, sectionId);
    scrollToSection(sectionId);
  };

  /**
   * 슬라이드 이동 공통 함수입니다.
   */
  const moveToSlide = (
    nextIndex: number,
    action: 'dot' | 'previous' | 'next' | 'auto',
  ) => {
    const safeIndex = (nextIndex + slides.length) % slides.length;

    if (safeIndex === activeSlideIndex) {
      return;
    }

    setActiveSlideIndex(safeIndex);

    if (action !== 'auto') {
      trackIntroClick(action, slides[safeIndex]?.id ?? '');
    }
  };

  /**
   * 자동 슬라이드 전환 로직입니다.
   * 사용자가 상호작용 중일 때는 자동 전환을 잠시 멈춥니다.
   */
  useEffect(() => {
    if (isAutoSlidePaused || slides.length <= 1) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveSlideIndex((currentIndex) => {
        return (currentIndex + 1) % slides.length;
      });
    }, AUTO_SLIDE_INTERVAL_MS);

    return () => {
      window.clearInterval(timer);
    };
  }, [isAutoSlidePaused, slides.length]);

  /**
   * 모바일 스와이프 시작 지점을 저장합니다.
   */
  const handleTouchStart = (event: React.TouchEvent<HTMLElement>) => {
    touchStartXRef.current = event.touches[0]?.clientX ?? null;
  };

  /**
   * 모바일 좌우 스와이프로 슬라이드를 전환합니다.
   */
  const handleTouchEnd = (event: React.TouchEvent<HTMLElement>) => {
    const startX = touchStartXRef.current;
    const endX = event.changedTouches[0]?.clientX;

    touchStartXRef.current = null;

    if (startX === null || endX === undefined) {
      return;
    }

    const diffX = startX - endX;

    if (Math.abs(diffX) < 48) {
      return;
    }

    if (diffX > 0) {
      moveToSlide(activeSlideIndex + 1, 'next');
    } else {
      moveToSlide(activeSlideIndex - 1, 'previous');
    }
  };

  /**
   * 이미지 로딩 실패 시 해당 슬라이드는 그라데이션 배경 fallback만 사용합니다.
   */
  const markImageAsFailed = (imageSrc: string) => {
    setFailedImageMap((currentMap) => ({
      ...currentMap,
      [imageSrc]: true,
    }));
  };

  if (!activeSlide) {
    return null;
  }

  return (
    <section
      className="relative isolate min-h-[calc(100svh-3.5rem)] overflow-hidden bg-[var(--care-bg)] md:min-h-[760px] lg:min-h-[820px]"
      onMouseEnter={() => setIsAutoSlidePaused(true)}
      onMouseLeave={() => setIsAutoSlidePaused(false)}
      onFocusCapture={() => setIsAutoSlidePaused(true)}
      onBlurCapture={() => setIsAutoSlidePaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="absolute inset-0 z-[-5] bg-[radial-gradient(circle_at_72%_18%,var(--care-primary-soft)_0%,transparent_34rem),linear-gradient(135deg,var(--care-bg)_0%,var(--care-bg-soft)_52%,#fff_100%)]" />

      {slides.map((slide, slideIndex) => {
        const isActive = slideIndex === activeSlideIndex;
        const shouldShowImage =
          slide.backgroundImageSrc &&
          !failedImageMap[slide.backgroundImageSrc];

        if (!shouldShowImage) {
          return null;
        }

        return (
          <Image
            key={slide.id}
            src={slide.backgroundImageSrc}
            alt={slide.backgroundImageAlt}
            fill
            priority={slideIndex === 0}
            sizes="100vw"
            onError={() => markImageAsFailed(slide.backgroundImageSrc)}
            className={[
              'careeasy-intro-image z-[-4] object-cover object-[68%_center] md:object-center',
              isActive
                ? 'careeasy-intro-image-active'
                : 'careeasy-intro-image-inactive',
            ].join(' ')}
          />
        );
      })}

      {/*
        전체 배경 오버레이입니다.
        모바일에서는 텍스트 가독성만 보조하고, 이미지를 과하게 덮지 않도록 약하게 처리합니다.
        데스크톱에서는 좌측 텍스트 영역 쪽에만 자연스럽게 크림 오버레이가 들어갑니다.
      */}
      <div className="absolute inset-0 z-[-3] bg-[linear-gradient(180deg,rgba(251,244,234,0.62)_0%,rgba(251,244,234,0.34)_42%,rgba(251,244,234,0.12)_100%)] md:bg-[linear-gradient(90deg,rgba(251,244,234,0.9)_0%,rgba(251,244,234,0.8)_24%,rgba(251,244,234,0.34)_46%,rgba(251,244,234,0.04)_72%,rgba(251,244,234,0)_100%)]" />

      <div className="absolute inset-x-0 bottom-0 z-[-2] h-28 bg-[linear-gradient(0deg,var(--care-bg)_0%,rgba(251,244,234,0)_100%)]" />

      <CareEasyContainer className="relative z-10 flex min-h-[calc(100svh-3.5rem)] items-center py-8 md:min-h-[760px] md:py-20 lg:min-h-[820px]">
        {/*
          모바일에서는 폭을 꽉 쓰도록 w-full로 둡니다.
          대신 opacity와 blur를 약하게 해서 배경 이미지가 답답하게 가려지지 않도록 처리합니다.
          데스크톱에서는 카드 배경을 제거하고 자연스럽게 텍스트만 보이게 합니다.
        */}
        <div className="w-full md:max-w-[720px]">
          <div className="grid min-h-[390px] sm:min-h-[360px] md:min-h-[460px]">
            {slides.map((slide, slideIndex) => {
              const isActive = slideIndex === activeSlideIndex;

              return (
                <div
                  key={slide.id}
                  aria-hidden={!isActive}
                  className={[
                    'careeasy-intro-copy col-start-1 row-start-1',
                    isActive
                      ? 'careeasy-intro-copy-active'
                      : 'careeasy-intro-copy-inactive',
                  ].join(' ')}
                >
                  <div className="mb-4 md:mb-5">
                    <span className="careeasy-kicker">{slide.eyebrow}</span>
                  </div>

                  <h1 className="careeasy-balanced-text text-[1.85rem] font-semibold leading-[1.16] tracking-tight text-[var(--care-text)] sm:text-5xl sm:font-bold md:text-6xl">
                    {slide.titleLines.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </h1>

                  {'descriptionLines' in slide ? (
                    <p className="careeasy-balanced-text mt-5 max-w-lg rounded-2xl bg-[linear-gradient(90deg,rgba(255,248,241,0.56)_0%,rgba(255,248,241,0.68)_58%,rgba(255,248,241,0.78)_100%)] px-4 py-3 text-sm font-semibold leading-7 text-[rgba(59,54,49,0.88)] ring-1 ring-white/30 backdrop-blur-[3px] sm:text-[0.98rem] md:mt-6 md:max-w-xl md:bg-none md:px-0 md:py-0 md:text-lg md:font-medium md:leading-8 md:ring-0 md:backdrop-blur-0">
                      {slide.descriptionLines.map((line) => (
                        <span key={line} className="block">
                          {line}
                        </span>
                      ))}
                    </p>
                  ) : null}

                  <div className="mt-7 grid gap-3 sm:flex sm:flex-row">
                    {slide.buttons.map((button, buttonIndex) => {
                      const isPrimary = button.variant === 'primary';
                      const action =
                        buttonIndex === 0 ? 'primary_cta' : 'secondary_cta';

                      return (
                        <button
                          key={button.label}
                          type="button"
                          data-careeasy-event="intro_cta_click"
                          data-careeasy-action={action}
                          data-careeasy-target={button.sectionId}
                          onClick={() =>
                            handleSectionClick(action, button.sectionId)
                          }
                          className={[
                            'careeasy-pressable inline-flex min-h-12 w-full items-center justify-center rounded-full px-6 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[var(--care-primary)] focus:ring-offset-2 sm:w-auto',
                            isPrimary
                              ? 'careeasy-cta-primary'
                              : 'careeasy-cta-secondary',
                          ].join(' ')}
                        >
                          {button.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mx-auto mt-7 flex w-full max-w-[15rem] items-center justify-between gap-4 md:mx-0 md:mt-4 md:max-w-[17rem]">
            <button
              type="button"
              aria-label="이전 첫 화면 슬라이드 보기"
              data-careeasy-event="intro_previous_click"
              onClick={() => moveToSlide(activeSlideIndex - 1, 'previous')}
              className="group flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[rgba(59,54,49,0.58)] transition hover:text-[var(--care-primary-dark)] active:scale-95"
            >
              <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            </button>

            <div className="flex min-w-0 flex-1 items-center justify-center gap-2.5">
              {slides.map((slide, slideIndex) => {
                const isActive = slideIndex === activeSlideIndex;

                return (
                  <button
                    key={slide.id}
                    type="button"
                    aria-label={`${slideIndex + 1}번째 첫 화면 슬라이드 보기`}
                    aria-current={isActive ? 'true' : undefined}
                    data-careeasy-event="intro_dot_click"
                    data-careeasy-target={slide.id}
                    onClick={() => moveToSlide(slideIndex, 'dot')}
                    className={[
                      'careeasy-intro-dot h-2 rounded-full transition-all duration-300',
                      isActive
                        ? 'careeasy-intro-dot-active w-6'
                        : 'w-2',
                    ].join(' ')}
                  />
                );
              })}
            </div>

            <button
              type="button"
              aria-label="다음 첫 화면 슬라이드 보기"
              data-careeasy-event="intro_next_click"
              onClick={() => moveToSlide(activeSlideIndex + 1, 'next')}
              className="group flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[rgba(59,54,49,0.58)] transition hover:text-[var(--care-primary-dark)] active:scale-95"
            >
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>
      </CareEasyContainer>
    </section>
  );
}
