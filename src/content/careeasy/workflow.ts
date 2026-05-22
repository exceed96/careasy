/**
 * CareEasy의 기본 사용 흐름입니다.
 * 기록, 대상 지정, 확인 응답을 핵심 워크플로우로 잡습니다.
 */
export const careEasyWorkflow = {
  eyebrow: 'How it works',
  title: '기록하면, 다음 담당자에게 전달됩니다.',
  steps: [
    {
      number: '01',
      title: '돌봄 내용 기록',
      body: '병원 일정, 약 복용, 식사 여부, 컨디션, 특이사항을 간단히 남깁니다.',
      mobileBody: '일정, 약, 컨디션을 간단히 남깁니다.',
    },
    {
      number: '02',
      title: '인수인계 대상 지정',
      body: '다음에 부모님을 돌볼 가족을 선택하고 필요한 내용을 전달합니다.',
      mobileBody: '다음에 볼 가족에게 필요한 내용만 전달합니다.',
    },
    {
      number: '03',
      title: '확인 응답 받기',
      body: '담당자는 확인했어요, 시간 변경이 필요해요, 오늘은 어려워요 중 하나로 응답합니다.',
      mobileBody: '확인 여부와 변경 필요 여부를 바로 남깁니다.',
    },
  ],
};
