/**
 * CareEasy 앱 목업 섹션 콘텐츠입니다.
 * imageSrc가 비어 있으면 실제 이미지 대신 플레이스홀더 화면을 보여줍니다.
 * 앱 목업 이미지가 준비되면 public/mockups 경로에 넣고 imageSrc를 채우면 됩니다.
 */
export const careEasyAppPreview = {
  eyebrow: 'App preview',
  title: '부모님 돌봄 기록이 한 화면에 정리됩니다.',
  description:
    '케어이지는 병원 일정, 약 변경, 컨디션, 다음 담당자 확인까지 가족이 바로 이해할 수 있는 흐름으로 보여줍니다.',
  screens: [
    {
      title: '오늘의 돌봄 현황',
      description: '부모님의 일정, 약, 식사, 컨디션을 한 번에 확인합니다.',
      imageSrc: '/mockups/today.png',
      placeholderItems: ['오늘 병원 일정', '아침 약 복용 완료', '저염식 식사 확인'],
    },
    {
      title: '인수인계 보내기',
      description: '다음 담당자를 지정하고 필요한 내용을 빠짐없이 전달합니다.',
      imageSrc: '/mockups/send-todo.png',
      placeholderItems: ['다음 담당자 선택', '주의사항 입력', '푸시 알림 발송'],
    },
    {
      title: '가족 리포트',
      description: '멀리 있는 가족도 오늘의 돌봄 흐름을 놓치지 않습니다.',
      imageSrc: '/mockups/family-report.png',
      placeholderItems: ['오늘의 특이사항', '확인한 가족', '다음 일정 요약'],
    },
  ],
};