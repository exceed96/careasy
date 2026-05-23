import { CareEasyFooter } from '@/components/layout/CareEasyFooter';
import { CareEasyHeader } from '@/components/layout/CareEasyHeader';
import { CareEasyIntroSection } from '@/components/careeasy/CareEasyIntroSection';
import { CareEasyProblemSection } from '@/components/careeasy/CareEasyProblemSection';
import { CareEasyWorkflowSection } from '@/components/careeasy/CareEasyWorkflowSection';
import { CareEasyAppPreviewSection } from '@/components/careeasy/CareEasyAppPreviewSection';
import { CareEasySuccessStoriesSection } from '@/components/careeasy/CareEasySuccessStoriesSection';
import { CareEasyFaqSection } from '@/components/careeasy/CareEasyFaqSection';
import { CareEasyTrialStartSection } from '@/components/careeasy/CareEasyTrialStartSection';
import { CareEasyPrivacyPolicyModal } from '@/components/careeasy/CareEasyPrivacyPolicyModal';
import { CareEasyTrialModal } from '@/components/careeasy/CareEasyTrialModal';

/**
 * CareEasy 랜딩페이지 메인 페이지입니다.
 * 무료 체험 신청 모달은 페이지 하단에 한 번만 마운트하고,
 * 각 CTA 버튼에서 전역 이벤트로 열도록 구성합니다.
 */
export default function HomePage() {
  return (
    <>
      <CareEasyHeader />
      <main>
        <CareEasyIntroSection />
        <CareEasyProblemSection />
        <CareEasyWorkflowSection />
        <CareEasyAppPreviewSection />
        <CareEasySuccessStoriesSection />
        <CareEasyFaqSection />
        <CareEasyTrialStartSection />
      </main>
      <CareEasyFooter />
      <CareEasyTrialModal />
      <CareEasyPrivacyPolicyModal />
    </>
  );
}