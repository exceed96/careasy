import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Tailwind className을 안전하게 병합하는 공통 유틸입니다.
 * 조건부 클래스 처리와 Tailwind 클래스 충돌 정리를 함께 수행합니다.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}