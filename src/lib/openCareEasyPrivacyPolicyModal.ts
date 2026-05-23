export const CAREEASY_PRIVACY_POLICY_MODAL_EVENT =
  'careeasy:open-privacy-policy-modal';

/**
 * 랜딩페이지 푸터 등에서 개인정보처리방침 모달을 열기 위한 함수입니다.
 */
export function openCareEasyPrivacyPolicyModal() {
  if (typeof window === 'undefined') {
    return;
  }

  window.dispatchEvent(new CustomEvent(CAREEASY_PRIVACY_POLICY_MODAL_EVENT));
}
