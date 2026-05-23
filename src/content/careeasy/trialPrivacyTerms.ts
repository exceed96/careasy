import {
  careEasyPrivacyPolicy,
  type CareEasyPrivacyPolicySection,
} from '@/content/careeasy/privacyPolicy';
import { careEasySite } from '@/content/careeasy/site';

export type CareEasyTrialPrivacyTermSection = CareEasyPrivacyPolicySection;

/**
 * 무료 체험 신청 모달에서 표시하는 개인정보 수집·이용 동의 약관입니다.
 * 전문은 개인정보처리방침과 동일하며, 서두 안내만 동의 목적에 맞게 구성합니다.
 */
export const careEasyTrialPrivacyConsent = {
  documentTitle: '개인정보 수집·이용 동의서',
  intro: [
    `${careEasySite.serviceName}(${careEasySite.name})는 무료 체험 신청 및 안내를 위해 아래 개인정보처리방침에 따른 개인정보를 수집·이용합니다. 내용을 충분히 읽으신 후 동의 여부를 선택해 주세요.`,
    '필수 항목에 대한 동의를 거부하실 경우 무료 체험 신청·안내 서비스 이용이 제한될 수 있습니다.',
  ],
  sections: careEasyPrivacyPolicy.sections,
  effectiveDate: careEasyPrivacyPolicy.effectiveDate,
  supplement: careEasyPrivacyPolicy.supplement,
};
