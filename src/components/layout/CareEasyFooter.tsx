import { CareEasyContainer } from '@/components/ui/CareEasyContainer';

/**
 * CareEasy 랜딩페이지 푸터입니다.
 * 사업자 정보, 약관, 개인정보처리방침 링크는 추후 추가합니다.
 */
export function CareEasyFooter() {
  return (
    <footer className="border-t border-[var(--care-border)] bg-white py-10">
      <CareEasyContainer className="flex flex-col gap-3 text-sm text-[var(--care-muted)] md:flex-row md:items-center md:justify-between">
        <p>© 2026 CareEasy. All rights reserved.</p>
        <p>부모님 돌봄을 가족이 함께 이어갈 수 있도록.</p>
      </CareEasyContainer>
    </footer>
  );
}