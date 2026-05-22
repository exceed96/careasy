'use client';

import { type KeyboardEvent, useRef, useState } from 'react';
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  Sparkles,
} from 'lucide-react';
import { CareEasyContainer } from '@/components/ui/CareEasyContainer';
import { careEasyFaq } from '@/content/careeasy/faq';
import { careEasyFaqGuide } from '@/content/careeasy/faqGuide';
import { trackCareEasyEvent } from '@/lib/careeasyAnalytics';

/**
 * FAQ 카테고리명을 비교하기 위한 정규화 함수입니다.
 * "주 보호자"와 "주보호자"처럼 띄어쓰기 차이가 있어도 같은 값으로 비교합니다.
 */
function normalizeCategoryName(value: string) {
  return value.replace(/\s/g, '').trim();
}

/**
 * CareEasy FAQ 섹션입니다.
 * 역할 버튼과 FAQ 탭이 같은 active index를 공유합니다.
 * 모바일에서는 탭 영역 좌우에 은은한 화살표를 두어 이전/다음 FAQ로 이동할 수 있게 합니다.
 */
export function CareEasyFaqSection() {
  const categories = careEasyFaq.categories;
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState<
    'from-left' | 'from-right'
  >('from-right');

  const tabButtonRefs = useRef<Record<number, HTMLButtonElement | null>>({});
  const tabPanelRef = useRef<HTMLDivElement | null>(null);

  const activeCategory = categories[activeCategoryIndex] ?? categories[0];

  /**
   * 역할 버튼의 targetCategory를 실제 FAQ 카테고리 index로 변환합니다.
   */
  const getCategoryIndexByName = (targetCategory: string) => {
    const normalizedTarget = normalizeCategoryName(targetCategory);

    const matchedIndex = categories.findIndex(
      (category) => normalizeCategoryName(category.name) === normalizedTarget,
    );

    return matchedIndex >= 0 ? matchedIndex : 0;
  };

  /**
   * FAQ 탭을 변경합니다.
   * 모바일 가로 스크롤 영역에서는 선택된 탭이 중앙 근처로 오도록 이동합니다.
   */
  const selectCategoryByIndex = (
    nextIndex: number,
    source: 'role' | 'tab' | 'keyboard' | 'arrow',
  ) => {
    const safeIndex =
      nextIndex >= 0 && nextIndex < categories.length ? nextIndex : 0;

    if (safeIndex === activeCategoryIndex) {
      return;
    }

    setSlideDirection(
      safeIndex > activeCategoryIndex ? 'from-right' : 'from-left',
    );
    setActiveCategoryIndex(safeIndex);

    const selectedCategory = categories[safeIndex];

    trackCareEasyEvent('careeasy_faq_category_select', {
      category: selectedCategory?.name ?? '',
      source,
    });

    window.setTimeout(() => {
      const selectedTabButton = tabButtonRefs.current[safeIndex];

      selectedTabButton?.focus();

      selectedTabButton?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });

      if (source === 'role') {
        tabPanelRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    }, 0);
  };

  /**
   * 역할 버튼 클릭 시 연결된 FAQ 탭으로 이동합니다.
   */
  const selectCategoryByName = (categoryName: string) => {
    const nextIndex = getCategoryIndexByName(categoryName);
    selectCategoryByIndex(nextIndex, 'role');
  };

  /**
   * 모바일 FAQ 탭 영역의 이전/다음 화살표 동작입니다.
   * 끝에 도달하면 반대편으로 순환합니다.
   */
  const moveToPreviousCategory = () => {
    const nextIndex =
      activeCategoryIndex === 0
        ? categories.length - 1
        : activeCategoryIndex - 1;

    selectCategoryByIndex(nextIndex, 'arrow');
  };

  const moveToNextCategory = () => {
    const nextIndex = (activeCategoryIndex + 1) % categories.length;

    selectCategoryByIndex(nextIndex, 'arrow');
  };

  /**
   * 키보드 접근성을 위한 탭 이동입니다.
   */
  const handleTabKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    categoryIndex: number,
  ) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      selectCategoryByIndex((categoryIndex + 1) % categories.length, 'keyboard');
    }

    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      selectCategoryByIndex(
        categoryIndex === 0 ? categories.length - 1 : categoryIndex - 1,
        'keyboard',
      );
    }

    if (event.key === 'Home') {
      event.preventDefault();
      selectCategoryByIndex(0, 'keyboard');
    }

    if (event.key === 'End') {
      event.preventDefault();
      selectCategoryByIndex(categories.length - 1, 'keyboard');
    }
  };

  if (!activeCategory) {
    return null;
  }

  return (
    <section id="faq" className="bg-white py-16 md:py-20">
      <CareEasyContainer>
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[var(--care-border)] bg-[var(--care-bg-soft)] px-4 py-2 text-sm font-semibold text-[var(--care-primary-dark)]">
            <HelpCircle className="h-4 w-4" />
            {careEasyFaq.eyebrow}
          </div>

          <h2 className="text-3xl font-bold tracking-tight md:text-5xl">
            {careEasyFaq.title}
          </h2>

          <p className="mt-5 text-base leading-7 text-[var(--care-muted)] md:text-lg md:leading-8">
            {careEasyFaq.description}
          </p>
        </div>

        <div className="mt-10 rounded-[2rem] border border-[var(--care-border-soft)] bg-[var(--care-bg-soft)] p-5 md:mt-12 md:p-7">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 text-xs font-bold text-[var(--care-primary-dark)]">
              <Sparkles className="h-3.5 w-3.5" />
              {careEasyFaqGuide.eyebrow}
            </div>

            <h3 className="text-2xl font-bold tracking-tight">
              {careEasyFaqGuide.question}
            </h3>

            <p className="mt-2 text-sm leading-6 text-[var(--care-muted)]">
              {careEasyFaqGuide.description}
            </p>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {careEasyFaqGuide.options.map((option) => {
              const targetIndex = getCategoryIndexByName(option.targetCategory);
              const isSelected = activeCategoryIndex === targetIndex;

              return (
                <button
                  key={option.label}
                  type="button"
                  onClick={() => selectCategoryByName(option.targetCategory)}
                  className={[
                    'careeasy-faq-role-card rounded-2xl py-4 pl-8 pr-4 text-left focus:outline-none focus:ring-2 focus:ring-[var(--care-primary)] focus:ring-offset-2',
                    isSelected ? 'careeasy-faq-role-card-active' : '',
                  ].join(' ')}
                >
                  <span className="block text-base font-bold text-[var(--care-text)]">
                    {option.label}
                  </span>

                  <span className="mt-1 block text-sm leading-6 text-[var(--care-muted)]">
                    {option.helper}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div ref={tabPanelRef} className="mt-10 scroll-mt-24">
          {/*
            모바일: 가로 슬라이드 + 좌우 화살표
            데스크톱: 탭 전체를 줄바꿈으로 노출 (가로 스크롤 없음)
          */}
          <div className="careeasy-faq-tab-scroll-shell -mx-5 md:mx-0">
            {/*
              모바일 전용 이전/다음 화살표입니다.
              탭 버튼과 겹치지 않도록 스크롤 영역 바깥 flex 열에 배치합니다.
            */}
            <button
              type="button"
              aria-label="이전 FAQ 탭 보기"
              onClick={moveToPreviousCategory}
              className="careeasy-faq-tab-nav hidden shrink-0 max-md:flex"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <div className="careeasy-faq-tab-scroll-track min-w-0 flex-1 md:flex-none md:overflow-visible">
              <div
                role="tablist"
                aria-label="CareEasy FAQ categories"
                className="careeasy-faq-tablist flex snap-x gap-2 overflow-x-auto px-2 py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              >
                {categories.map((category, categoryIndex) => {
                  const isActive = activeCategoryIndex === categoryIndex;
                  const panelId = `careeasy-faq-panel-${categoryIndex}`;

                  return (
                    <button
                      key={category.name}
                      ref={(node) => {
                        tabButtonRefs.current[categoryIndex] = node;
                      }}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      aria-controls={panelId}
                      onClick={() =>
                        selectCategoryByIndex(categoryIndex, 'tab')
                      }
                      onKeyDown={(event) =>
                        handleTabKeyDown(event, categoryIndex)
                      }
                      className={[
                        'careeasy-faq-tab shrink-0 snap-start rounded-full px-5 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[var(--care-primary)] focus:ring-offset-2',
                        isActive
                          ? 'careeasy-faq-tab-active'
                          : 'careeasy-faq-tab-idle',
                      ].join(' ')}
                    >
                      {category.name}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="button"
              aria-label="다음 FAQ 탭 보기"
              onClick={moveToNextCategory}
              className="careeasy-faq-tab-nav hidden shrink-0 max-md:flex"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="overflow-hidden">
            <div
              key={activeCategoryIndex}
              id={`careeasy-faq-panel-${activeCategoryIndex}`}
              role="tabpanel"
              className={[
                'mt-6 rounded-[2rem] border border-[var(--care-border)] bg-[var(--care-bg-soft)] p-5 md:p-7',
                slideDirection === 'from-right'
                  ? 'careeasy-faq-panel-slide-from-right'
                  : 'careeasy-faq-panel-slide-from-left',
              ].join(' ')}
            >
              <div className="mb-6">
                <p className="text-sm font-bold text-[var(--care-primary-dark)]">
                  선택된 FAQ
                </p>

                <h3 className="mt-1 text-2xl font-bold tracking-tight">
                  {activeCategory.name}
                </h3>

                <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--care-muted)]">
                  {activeCategory.description}
                </p>
              </div>

              <div className="space-y-3">
                {activeCategory.items.map((item) => (
                  <details
                    key={`${activeCategory.name}-${item.question}`}
                    className="group rounded-2xl border border-[var(--care-border)] bg-white p-5 shadow-sm"
                  >
                    <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-base font-semibold leading-7 text-[var(--care-text)]">
                      <span>{item.question}</span>

                      <span className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--care-primary-soft)] text-[var(--care-primary-dark)] transition group-open:rotate-180">
                        <ChevronDown className="h-4 w-4" />
                      </span>
                    </summary>

                    <div
                      data-faq-answer
                      className="mt-4 border-t border-[var(--care-border)] pt-4"
                    >
                      <p className="whitespace-pre-line text-sm leading-7 text-[var(--care-muted)] md:text-base">
                        {item.answer}
                      </p>
                    </div>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CareEasyContainer>
    </section>
  );
}