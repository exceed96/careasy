export const careEasyIntroSlides = [
  {
    id: "record",
    relatedSectionId: "problem",
    eyebrow: "돌봄 기록",
    titleLines: ["부모님 돌봄 기록,", "이제 단톡방에 묻히지 않게."],
    descriptionLines: [
      "병원 일정, 약 변경, 식사 여부, 컨디션, 특이사항까지",
      "가족 단톡방에 흩어지지 않도록 한곳에 남깁니다.",
    ],
    backgroundImageSrc: "/images/careeasy-intro/record-bg.png",
    backgroundImageAlt:
      "가족 단톡방에 묻히던 부모님 돌봄 기록이 케어이지 앱으로 정리되는 이미지",
    buttons: [
      {
        label: "문제 보기",
        sectionId: "problem",
        variant: "primary",
      },
      {
        label: "앱 화면 보기",
        sectionId: "app-screens",
        variant: "secondary",
      },
    ],
  },
  {
    id: "handoff",
    relatedSectionId: "flow",
    eyebrow: "인수인계",
    titleLines: ["공유에서 끝나지 않고,", "다음 돌봄까지 이어지게."],
    descriptionLines: [
      "오늘 기록을 다음 가족 담당자에게 전달하고,",
      "무엇을 해야 하는지 바로 이어받게 합니다.",
    ],
    backgroundImageSrc: "/images/careeasy-intro/handoff-bg.png",
    backgroundImageAlt:
      "케어이지 앱에서 다음 담당자에게 돌봄 내용을 인수인계하는 이미지",
    buttons: [
      {
        label: "사용 흐름 보기",
        sectionId: "flow",
        variant: "primary",
      },
      {
        label: "자주하는 질문 보기",
        sectionId: "faq",
        variant: "secondary",
      },
    ],
  },
  {
    id: "confirm",
    relatedSectionId: "flow",
    eyebrow: "확인 응답",
    titleLines: ["누가 확인했는지,", "누가 이어 맡는지 보이게."],
    descriptionLines: [
      "가족은 “확인했어요”, “시간 변경이 필요해요”,",
      "“오늘은 어려워요”처럼 바로 응답해 돌봄 공백을 줄일 수 있습니다.",
    ],
    backgroundImageSrc: "/images/careeasy-intro/confirm-bg.png",
    backgroundImageAlt:
      "가족이 케어이지 앱에서 인수인계 내용을 확인하고 응답하는 이미지",
    buttons: [
      {
        label: "인수인계 보기",
        sectionId: "flow",
        variant: "primary",
      },
      {
        label: "무료 체험 시작",
        sectionId: "trial",
        variant: "secondary",
      },
    ],
  },
  {
    id: "app",
    relatedSectionId: "app-screens",
    eyebrow: "앱 화면",
    titleLines: ["오늘 무엇을 챙겼는지,", "다음에 무엇을 해야 하는지."],
    descriptionLines: [
      "약, 식사, 병원 일정, 특이사항을 한 화면에서 정리하고",
      "가족 모두가 같은 정보를 봅니다.",
    ],
    backgroundImageSrc: "/images/careeasy-intro/app-bg.png",
    backgroundImageAlt:
      "케어이지 앱의 오늘의 돌봄 기록, 인수인계, 리포트 화면 이미지",
    buttons: [
      {
        label: "앱 화면 보기",
        sectionId: "app-screens",
        variant: "primary",
      },
      {
        label: "무료 체험 시작",
        sectionId: "trial",
        variant: "secondary",
      },
    ],
  },
  {
    id: "report",
    relatedSectionId: "trial",
    eyebrow: "가족 리포트",
    titleLines: ["부모님 돌봄을", "가족의 공동 기록으로."],
    descriptionLines: [
      "1개월 무료 체험으로 케어이지의 기록, 인수인계,",
      "리포트 기능을 먼저 경험해보세요.",
    ],
    backgroundImageSrc: "/images/careeasy-intro/report-bg.png",
    backgroundImageAlt:
      "가족들이 부모님 케어 리포트를 함께 확인하는 따뜻한 이미지",
    buttons: [
      {
        label: "1개월 무료 체험 시작",
        sectionId: "trial",
        variant: "primary",
      },
      {
        label: "자주하는 질문 보기",
        sectionId: "faq",
        variant: "secondary",
      },
    ],
  },
] as const;
