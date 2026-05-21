export const CAREEASY_TRIAL_MODAL_EVENT = 'careeasy:open-trial-modal';

export type CareEasyTrialModalDetail = {
  source?: string;
};

/**
 * 무료 체험 모달을 전역에서 열기 위한 함수입니다.
 * Header, Intro, CTA 등 서로 다른 컴포넌트에서 같은 모달을 열 수 있게 합니다.
 */
export function openCareEasyTrialModal(source?: string) {
  if (typeof window === 'undefined') {
    return;
  }

  window.dispatchEvent(
    new CustomEvent<CareEasyTrialModalDetail>(CAREEASY_TRIAL_MODAL_EVENT, {
      detail: { source },
    }),
  );
}