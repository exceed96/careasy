'use client';

import Image from 'next/image';
import Link from 'next/link';
import { CareEasyContainer } from '@/components/ui/CareEasyContainer';
import { CareEasyButtonLink } from '@/components/ui/CareEasyButtonLink';
import {
  careEasyEvents,
  trackCareEasyEvent,
} from '@/lib/careeasyAnalytics';

const KAKAO_OPEN_CHAT_URL =
  process.env.NEXT_PUBLIC_KAKAO_OPEN_CHAT_URL ?? '';

/**
 * 카카오톡 오픈채팅 연결용 아이콘입니다.
 * 별도 아이콘 패키지 추가 없이 SVG로 직접 관리합니다.
 */
function KakaoTalkIcon() {
  return (
    <svg
      viewBox="0 0 32 32"
      aria-hidden="true"
      className="h-5 w-5"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M16 5C9.37 5 4 9.27 4 14.55C4 17.92 6.18 20.88 9.47 22.58L8.36 26.62C8.26 26.98 8.66 27.27 8.97 27.06L13.84 23.84C14.54 23.95 15.26 24.1 16 24.1C22.63 24.1 28 19.83 28 14.55C28 9.27 22.63 5 16 5Z"
        fill="currentColor"
      />
    </svg>
  );
}

/**
 * CareEasy 랜딩페이지 상단 네비게이션입니다.
 * 기존 메뉴 구조를 유지하고, 우측에 카카오톡 오픈채팅 연결 버튼을 추가합니다.
 */
export function CareEasyHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--care-border)] bg-[rgba(251,244,234,0.88)] backdrop-blur-xl">
      <CareEasyContainer className="flex h-14 items-center justify-between gap-3 md:h-16">
        <Link
          href="/"
          aria-label="CareEasy 홈"
          className="flex min-w-0 shrink-0 items-center"
        >
          <Image
            src="/brand/careeasy-logo-heart-left-transparent.svg"
            alt="CareEasy"
            width={220}
            height={72}
            priority
            className="h-8 w-auto object-contain md:h-10"
          />
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-[var(--care-muted)] lg:flex">
          <a href="#problem" className="transition hover:text-[var(--care-text)] font-bold text-lg">
            문제
          </a>
          <a href="#flow" className="transition hover:text-[var(--care-text)] font-bold text-lg">
            사용 흐름
          </a>
          <a href="#app-screens" className="transition hover:text-[var(--care-text)] font-bold text-lg">
            앱 화면
          </a>
          <a href="#faq" className="transition hover:text-[var(--care-text)] font-bold text-lg">
            자주 묻는 질문
          </a>
          <a href="#trial" className="transition hover:text-[var(--care-text)] font-bold text-lg">
            무료 체험
          </a>
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <a
            href={KAKAO_OPEN_CHAT_URL || '#trial'}
            target={KAKAO_OPEN_CHAT_URL ? '_blank' : undefined}
            rel={KAKAO_OPEN_CHAT_URL ? 'noreferrer' : undefined}
            aria-label="카카오톡 오픈채팅으로 문의하기"
            data-careeasy-event="kakao_open_chat_click"
            onClick={(event) => {
              trackCareEasyEvent(careEasyEvents.kakaoOpenChatClick, {
                link_url: KAKAO_OPEN_CHAT_URL || '',
              });

              if (!KAKAO_OPEN_CHAT_URL) {
                event.preventDefault();
              }
            }}
            className="careeasy-pressable inline-flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(32,36,38,0.08)] bg-[#FEE500] text-[#191919] shadow-sm hover:border-[rgba(32,36,38,0.14)] hover:bg-[#FFE812] md:h-11 md:w-11"
          >
            <KakaoTalkIcon />
          </a>

          <CareEasyButtonLink
            href="#trial"
            eventName={careEasyEvents.headerTrialClick}
            eventSource="header_trial_cta"
            className="min-h-10 shrink-0 px-4 py-2 text-xs md:min-h-11 md:px-5 md:text-sm"
          >
            무료 체험
          </CareEasyButtonLink>
        </div>
      </CareEasyContainer>
    </header>
  );
}
