/**
 * FAQ 상단에서 사용자가 자신의 돌봄 포지션을 선택하도록 돕는 가이드 콘텐츠입니다.
 * 각 버튼은 FAQ의 특정 탭 이름과 연결됩니다.
 */
export const careEasyFaqGuide = {
  eyebrow: '내 상황에 맞는 질문 찾기',
  question: '가족 돌봄에서 지금 내 위치는 어디에 가깝나요?',
  description:
    '가장 가까운 역할을 선택하면, 그 역할에 맞는 질문으로 바로 이동합니다.',
  options: [
    {
      label: '내가 주로 챙기고 있어요',
      helper: '주보호자 부담을 줄이고 싶을 때',
      targetCategory: '주 보호자',
    },
    {
      label: '이번에 이어 받아야 해요',
      helper: '무엇을 해야 할지 바로 알고 싶을 때',
      targetCategory: '인수인계 받는 사람',
    },
    {
      label: '오늘 내용을 넘겨야 해요',
      helper: '다음 가족에게 정확히 전달하고 싶을 때',
      targetCategory: '인수인계 하는 사람',
    },
    {
      label: '앱 설치 없이 확인만 할래요',
      helper: '링크로 간단히 참여하고 싶을 때',
      targetCategory: '링크로 참여하는 가족',
    },
    {
      label: '부모님께 추천하려고 해요',
      helper: '부모님이 혼자 챙기시는 게 걱정될 때',
      targetCategory: '부모님께 추천하는 자녀',
    },
    {
      label: '서비스 기능이 궁금해요',
      helper: '케어이지가 정확히 뭘 하는지 알고 싶을 때',
      targetCategory: '서비스',
    },
    {
      label: '요금이 궁금해요',
      helper: '무료 체험과 가족 플랜을 확인하고 싶을 때',
      targetCategory: '이용 요금',
    },
  ],
} as const;
