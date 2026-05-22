"use client";

import { sendGAEvent } from "@next/third-parties/google";

/**
 * Clarity, Meta Pixel 전역 함수를 TypeScript에서 안전하게 사용하기 위한 선언입니다.
 */
declare global {
  interface Window {
    clarity?: (command: "event" | "set", key: string, value?: string) => void;
    fbq?: (
      command: "track" | "trackCustom",
      eventName: string,
      params?: Record<string, string | number | boolean>,
    ) => void;
  }
}

/**
 * CareEasy 랜딩페이지에서 사용하는 GA 이벤트 이름입니다.
 * 이벤트명을 한곳에서 관리하면 GA4, Clarity 분석 시 CTA별 성과를 비교하기 쉽습니다.
 */
export const careEasyEvents = {
  introPrimaryClick: "careeasy_intro_primary_click",
  introSecondaryClick: "careeasy_intro_secondary_click",
  headerTrialClick: "careeasy_header_trial_click",
  trialStartClick: "careeasy_trial_start_click",
  kakaoOpenChatClick: "careeasy_kakao_open_chat_click",

  trialModalOpen: "careeasy_trial_modal_open",
  trialModalClose: "careeasy_trial_modal_close",
  trialSubmitAttempt: "careeasy_trial_submit_attempt",
  trialSubmitSuccess: "careeasy_trial_submit_success",
  trialSubmitFailure: "careeasy_trial_submit_failure",
};

/** Meta Pixel 표준 이벤트로 매핑할 CareEasy 이벤트입니다. */
const metaPixelStandardEvents: Partial<
  Record<string, "Lead" | "Contact" | "CompleteRegistration">
> = {
  [careEasyEvents.trialSubmitSuccess]: "Lead",
  [careEasyEvents.kakaoOpenChatClick]: "Contact",
  [careEasyEvents.trialModalOpen]: "CompleteRegistration",
};

/**
 * GA, Clarity, Meta Pixel 이벤트를 함께 전송합니다.
 * 각 분석 도구 ID가 없어도 화면이 깨지지 않도록 보호합니다.
 */
export function trackCareEasyEvent(
  eventName: string,
  params?: Record<string, string | number | boolean>,
) {
  try {
    sendGAEvent("event", eventName, params ?? {});
  } catch {
    // GA가 아직 연결되지 않은 초기 개발 단계에서는 조용히 무시합니다.
  }

  try {
    if (typeof window !== "undefined" && typeof window.clarity === "function") {
      window.clarity("event", eventName);

      /**
       * Clarity custom tag로도 일부 값을 남깁니다.
       * 너무 많은 값을 넣지 않도록 기본 정보만 문자열로 변환합니다.
       */
      if (params) {
        Object.entries(params)
          .slice(0, 8)
          .forEach(([key, value]) => {
            window.clarity?.("set", key, String(value));
          });
      }
    }
  } catch {
    // Clarity가 아직 로드되지 않은 경우 무시합니다.
  }

  try {
    if (typeof window !== "undefined" && typeof window.fbq === "function") {
      const standardEvent = metaPixelStandardEvents[eventName];

      if (standardEvent) {
        window.fbq("track", standardEvent, params);
      } else {
        window.fbq("trackCustom", eventName, params);
      }
    }
  } catch {
    // Meta Pixel이 아직 로드되지 않은 경우 무시합니다.
  }
}
