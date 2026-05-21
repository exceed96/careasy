import { cn } from '@/lib/careeasyUtils';

type CareEasyContainerProps = {
  children: React.ReactNode;
  className?: string;
};

/**
 * CareEasy 랜딩페이지의 섹션 너비와 좌우 여백을 통일하는 컨테이너입니다.
 */
export function CareEasyContainer({
  children,
  className,
}: CareEasyContainerProps) {
  return (
    <div className={cn('mx-auto w-full max-w-6xl px-5 md:px-8', className)}>
      {children}
    </div>
  );
}