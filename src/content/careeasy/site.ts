/**
 * CareEasy 사이트 전역 정보입니다.
 * SEO, Open Graph, layout metadata에서 공통으로 사용합니다.
 */
export const careEasySite = {
  name: 'CareEasy',
  serviceName: '케어이지',
  title: '케어이지 - 부모님 돌봄 인수인계 서비스',
  description:
    '가족 단톡방에 묻히던 부모님 병원 일정, 약 변경, 식사 여부, 컨디션 기록을 다음 담당자에게 확실하게 인수인계하세요.',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
  /** 개인정보처리방침에 표기하는 운영 주체 상호 */
  operatorName: '케어이지(CareEasy) 운영사',
  privacyOfficer: {
    role: '개인정보 보호책임자',
    department: '고객지원',
    contact: '랜딩페이지 카카오 오픈채팅 및 공식 문의 채널',
  },
};