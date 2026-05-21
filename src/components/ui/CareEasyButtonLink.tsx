'use client';

import Link from 'next/link';
import { cn } from '@/lib/careeasyUtils';
import { trackCareEasyEvent } from '@/lib/careeasyAnalytics';
import { openCareEasyTrialModal } from '@/lib/openCareEasyTrialModal';

type CareEasyButtonLinkProps = {
  href: string;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  eventName?: string;
  className?: string;
};

/**
 * CareEasy 공통 CTA 링크 버튼입니다.
 * 무료 체험 CTA는 페이지 이동 대신 무료 체험 신청 모달을 엽니다.
 */
export function CareEasyButtonLink({
  href,
  children,
  variant = 'primary',
  eventName,
  className,
}: CareEasyButtonLinkProps) {
  const isPrimary = variant === 'primary';
  const isTrialButton = href === '#trial' || href === '#free-trial';

  return (
    <Link
      href={href}
      onClick={(event) => {
        if (eventName) {
          trackCareEasyEvent(eventName, { link_url: href });
        }

        if (isTrialButton) {
          event.preventDefault();
          openCareEasyTrialModal(eventName ?? 'careeasy_button_link');
        }
      }}
      className={cn(
        'careeasy-pressable inline-flex min-h-12 items-center justify-center rounded-full px-6 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[var(--care-primary)] focus:ring-offset-2',
        isPrimary ? 'careeasy-cta-primary' : 'careeasy-cta-secondary',
        className,
      )}
    >
      {children}
    </Link>
  );
}