export const DOCUMENT_TYPES = [
  {
    id: "resume",
    label: "자소서",
    description: "경험, 역할, 결과가 충분히 드러나는지 점검합니다."
  },
  {
    id: "report",
    label: "리포트",
    description: "주장과 근거, 출처·인용 보완 필요성을 확인합니다."
  },
  {
    id: "blog",
    label: "블로그",
    description: "반복 표현, 독자 흐름, 문장 호흡을 살펴봅니다."
  },
  {
    id: "business",
    label: "업무문서",
    description: "핵심 메시지, 실행 항목, 제출 안정성을 점검합니다."
  },
  {
    id: "other",
    label: "기타",
    description: "문서 목적이 혼합된 경우 기본 기준으로 확인합니다."
  }
];

export const CHECK_OPTIONS = [
  "문체 자연도",
  "AI 작성 리스크",
  "출처·인용 리스크",
  "제출 안정성"
];

export const CHECKLIST = [
  {
    id: "C-001",
    label: "문서 목적에 맞는 문체인지 확인했습니다."
  },
  {
    id: "C-002",
    label: "구체적 경험이나 근거가 부족한 문장을 보완했습니다."
  },
  {
    id: "C-003",
    label: "출처가 필요한 주장에 인용 또는 근거를 추가했습니다."
  },
  {
    id: "C-004",
    label: "AI 작성 리스크가 높은 문장을 직접 검토했습니다."
  },
  {
    id: "C-005",
    label: "최종 제출 전 원문과 수정본을 비교했습니다."
  }
];

export const LEVEL_META = {
  low: {
    label: "낮음",
    tone: "good",
    summary: "현재 기준에서 큰 위험 신호는 낮습니다."
  },
  medium: {
    label: "보통",
    tone: "watch",
    summary: "일부 문장에서 문체 일관성 또는 근거 보완이 필요할 수 있습니다."
  },
  high: {
    label: "높음",
    tone: "alert",
    summary: "문서 일부 구간에서 추가 검토가 필요한 신호가 발견되었습니다."
  }
};

export const MOCK_SCENARIO_COUNT = 12;

const AXIS_LABELS = {
  style: "문체 자연도",
  ai: "AI 작성 리스크",
  citation: "출처·인용 리스크",
  submission: "제출 안정성"
};

const SHORT_TEXT_LIMIT = 200;

const SENSITIVE_PATTERN =
  /(\d{2,3}-\d{3,4}-\d{4})|([A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,})|(\d{6}-\d{7})|(주민등록번호|계좌번호|주소|전화번호|이메일)/i;

const REPORT_SCENARIOS = {
  resume: {
    id: "MOCK-001",
    title: "자소서 제출 전 리스크 리포트",
    overallLevel: "medium",
    summary:
      "일부 문장에서 문체가 지나치게 정돈되어 보일 수 있으며, 지원자 본인의 구체적 경험 보완이 필요합니다.",
    axes: [
      {
        id: "style",
        level: "medium",
        summary: "추상적 표현과 반복적인 문장 구조가 일부 발견되었습니다.",
        evidenceCount: 3
      },
      {
        id: "ai",
        level: "medium",
        summary: "일부 문장이 일반적이고 예측 가능한 구조로 구성되어 있습니다.",
        evidenceCount: 2
      },
      {
        id: "citation",
        level: "low",
        summary: "자소서 문서 유형상 별도 인용 리스크는 낮게 보입니다.",
        evidenceCount: 0
      },
      {
        id: "submission",
        level: "medium",
        summary: "경험의 구체성과 결과 수치 보완이 필요합니다.",
        evidenceCount: 2
      }
    ],
    findingTemplates: [
      {
        id: "S-001",
        labels: ["문체", "AI 리스크"],
        level: "medium",
        fallbackText: "저는 항상 최선을 다하며 문제를 해결하는 과정에서 성장해 왔습니다.",
        reason: "문장이 일반적이고 구체적 경험이나 상황 정보가 부족합니다.",
        recommendation: "실제 경험, 역할, 결과를 직접 추가해 문서 신뢰도를 높이세요.",
        suggestedRewrite:
          "[프로젝트명]에서 [문제 상황]이 있었을 때, 저는 [본인의 역할]을 맡아 [직접 한 행동]을 진행했고 [결과 수치 또는 변화]를 확인했습니다."
      },
      {
        id: "S-002",
        labels: ["안정성"],
        level: "medium",
        fallbackText: "이 경험은 저에게 큰 의미가 있었고 앞으로도 도움이 될 것입니다.",
        reason: "의미와 기대 효과가 넓게 표현되어 제출 문서에서 설득력이 약해질 수 있습니다.",
        recommendation: "배운 점을 지원 직무와 연결해 확인 가능한 행동으로 바꾸세요.",
        suggestedRewrite:
          "이 경험을 통해 [배운 기준]을 익혔고, 지원 직무에서는 [직무와 연결되는 행동]에 활용할 수 있습니다."
      }
    ]
  },
  report: {
    id: "MOCK-002",
    title: "리포트 제출 전 리스크 리포트",
    overallLevel: "high",
    summary: "핵심 주장에 비해 출처와 인용 근거가 부족한 구간이 있어 보완 검토가 필요합니다.",
    axes: [
      {
        id: "style",
        level: "medium",
        summary: "서론과 결론의 표현이 반복되어 논리 전개가 약하게 보일 수 있습니다.",
        evidenceCount: 2
      },
      {
        id: "ai",
        level: "medium",
        summary: "일부 단락이 균일한 구조로 정리되어 추가 검토 신호가 있습니다.",
        evidenceCount: 2
      },
      {
        id: "citation",
        level: "high",
        summary: "주장, 수치, 연구 결과에 대한 출처 보완이 필요합니다.",
        evidenceCount: 4
      },
      {
        id: "submission",
        level: "medium",
        summary: "참고문헌 형식과 본문 인용 연결을 확인해야 합니다.",
        evidenceCount: 3
      }
    ],
    findingTemplates: [
      {
        id: "S-101",
        labels: ["출처", "안정성"],
        level: "high",
        fallbackText: "최근 청년층의 디지털 학습 참여는 빠르게 증가하고 있다.",
        reason: "변화 추세를 설명하지만 기준 시점, 조사 대상, 출처가 함께 제시되지 않았습니다.",
        recommendation: "관련 통계나 연구 자료를 본문 인용과 참고문헌으로 연결하세요.",
        suggestedRewrite:
          "최근 청년층의 디지털 학습 참여가 증가했다는 주장은 조사명, 발표 연도, 조사 대상을 함께 제시해 근거를 보완해 주세요."
      },
      {
        id: "S-102",
        labels: ["문체", "AI 리스크"],
        level: "medium",
        fallbackText: "따라서 이러한 현상은 사회 전반에 중요한 시사점을 제공한다.",
        reason: "결론 문장이 넓고 추상적이어서 앞선 분석과의 연결이 약하게 느껴질 수 있습니다.",
        recommendation: "어떤 시사점인지 범위를 좁히고 앞 문단의 근거와 연결하세요.",
        suggestedRewrite:
          "따라서 이 현상은 대학의 학습 지원 정책에서 비대면 자료 접근성과 피드백 체계를 함께 설계해야 함을 시사합니다."
      }
    ]
  },
  blog: {
    id: "MOCK-003",
    title: "블로그 글 제출 전 리스크 리포트",
    overallLevel: "medium",
    summary: "읽기 흐름은 유지되지만 반복 표현과 단정적인 문장이 일부 발견되었습니다.",
    axes: [
      {
        id: "style",
        level: "high",
        summary: "비슷한 문장 길이와 반복적인 표현이 여러 구간에서 보입니다.",
        evidenceCount: 4
      },
      {
        id: "ai",
        level: "medium",
        summary: "일반적인 설명 문장이 이어지는 구간이 있어 개별 경험 보완이 좋습니다.",
        evidenceCount: 2
      },
      {
        id: "citation",
        level: "medium",
        summary: "제품, 통계, 비교 표현에는 근거 링크가 필요할 수 있습니다.",
        evidenceCount: 2
      },
      {
        id: "submission",
        level: "low",
        summary: "전체 길이와 문단 구성은 기본 기준을 충족합니다.",
        evidenceCount: 1
      }
    ],
    findingTemplates: [
      {
        id: "S-201",
        labels: ["문체"],
        level: "high",
        fallbackText: "이 방법은 매우 유용하며 누구에게나 도움이 될 수 있습니다.",
        reason: "평가 표현이 넓고 반복되면 독자가 실제 장점을 파악하기 어렵습니다.",
        recommendation: "구체적인 사용 상황과 체감 변화를 함께 적어 주세요.",
        suggestedRewrite:
          "이 방법은 출근 전 10분 안에 할 일을 정리해야 하는 사람에게 특히 유용했고, 저는 오전 회의 준비 시간이 줄어드는 효과를 느꼈습니다."
      },
      {
        id: "S-202",
        labels: ["출처"],
        level: "medium",
        fallbackText: "많은 사람들이 이 방식을 선택하고 있습니다.",
        reason: "범위가 넓은 주장에는 조사 출처나 관찰 기준이 필요할 수 있습니다.",
        recommendation: "직접 관찰인지, 설문이나 자료 기반인지 구분해 주세요.",
        suggestedRewrite:
          "제가 확인한 커뮤니티 후기와 관련 설문 자료에서는 이 방식을 선택하는 사례가 꾸준히 언급됩니다."
      }
    ]
  },
  business: {
    id: "MOCK-004",
    title: "업무문서 제출 전 리스크 리포트",
    overallLevel: "high",
    summary: "실행 주체와 일정이 흐릿한 문장이 있어 제출 안정성 보완이 필요합니다.",
    axes: [
      {
        id: "style",
        level: "medium",
        summary: "정중하지만 핵심 행동이 뒤로 밀리는 문장이 있습니다.",
        evidenceCount: 2
      },
      {
        id: "ai",
        level: "low",
        summary: "업무 맥락의 구체 표현이 있어 관련 신호는 낮게 보입니다.",
        evidenceCount: 1
      },
      {
        id: "citation",
        level: "medium",
        summary: "성과 수치나 시장 설명에는 근거 자료 연결이 필요합니다.",
        evidenceCount: 2
      },
      {
        id: "submission",
        level: "high",
        summary: "담당자, 마감일, 다음 행동이 명확하지 않은 구간이 있습니다.",
        evidenceCount: 4
      }
    ],
    findingTemplates: [
      {
        id: "S-301",
        labels: ["안정성", "문체"],
        level: "high",
        fallbackText: "관련 내용을 빠르게 검토한 뒤 적절한 방향으로 진행하겠습니다.",
        reason: "담당자, 검토 기준, 완료 시점이 없어 실행 문서로서 안정성이 낮아질 수 있습니다.",
        recommendation: "주체, 일정, 산출물을 한 문장 안에 포함하세요.",
        suggestedRewrite:
          "운영팀은 5월 8일까지 고객 문의 유형을 재분류하고, 다음 회의에서 우선 개선 항목 3가지를 공유하겠습니다."
      },
      {
        id: "S-302",
        labels: ["출처"],
        level: "medium",
        fallbackText: "시장 반응은 전반적으로 긍정적인 편입니다.",
        reason: "시장 반응을 설명하는 근거가 없어 내부 검토에서 질문이 생길 수 있습니다.",
        recommendation: "응답 수, 기간, 수집 채널 같은 근거를 덧붙이세요.",
        suggestedRewrite:
          "4월 고객 인터뷰 18건 중 12건에서 초기 설정 편의성이 장점으로 언급되어, 시장 반응은 긍정적으로 해석할 수 있습니다."
      }
    ]
  },
  other: {
    id: "MOCK-000",
    title: "문서 제출 전 리스크 리포트",
    overallLevel: "medium",
    summary: "문서 목적이 넓어 기본 점검 기준으로 문체, 근거, 제출 안정성을 함께 확인했습니다.",
    axes: [
      {
        id: "style",
        level: "medium",
        summary: "문장 길이와 표현 방식이 일부 구간에서 반복됩니다.",
        evidenceCount: 2
      },
      {
        id: "ai",
        level: "medium",
        summary: "추상적인 일반 진술이 있어 추가 검토가 필요할 수 있습니다.",
        evidenceCount: 2
      },
      {
        id: "citation",
        level: "medium",
        summary: "근거가 필요한 주장에는 출처 보완이 권장됩니다.",
        evidenceCount: 2
      },
      {
        id: "submission",
        level: "medium",
        summary: "문서 목적과 독자를 더 명확히 표시하면 안정성이 높아집니다.",
        evidenceCount: 2
      }
    ],
    findingTemplates: [
      {
        id: "S-401",
        labels: ["문체", "AI 리스크"],
        level: "medium",
        fallbackText: "이는 매우 중요한 문제이며 다양한 관점에서 살펴볼 필요가 있다.",
        reason: "문장이 넓고 추상적이라 문서의 목적이 흐릿해질 수 있습니다.",
        recommendation: "중요한 이유와 검토 관점을 구체적으로 좁혀 주세요.",
        suggestedRewrite:
          "이 문제는 제출 대상자가 실제로 확인해야 할 기준이 달라질 수 있으므로, 평가 기준과 근거 자료를 나누어 살펴볼 필요가 있습니다."
      },
      {
        id: "S-402",
        labels: ["안정성"],
        level: "medium",
        fallbackText: "앞으로 더 나은 방향으로 개선해 나가야 한다.",
        reason: "개선 주체와 다음 행동이 부족해 결론의 실행 가능성이 약해 보입니다.",
        recommendation: "누가 무엇을 언제까지 보완할지 명시하세요.",
        suggestedRewrite:
          "작성자는 제출 전 체크리스트를 기준으로 근거가 부족한 문장과 문체가 반복되는 문장을 먼저 보완해야 합니다."
      }
    ]
  },
  resumeLow: {
    id: "MOCK-005",
    title: "자소서 제출 전 리스크 리포트",
    overallLevel: "low",
    summary: "구체적인 경험과 역할 설명이 포함되어 현재 기준에서 큰 위험 신호는 낮게 보입니다.",
    axes: [
      { id: "style", level: "low", summary: "문장 구조가 비교적 자연스럽고 경험 서술이 이어집니다.", evidenceCount: 1 },
      { id: "ai", level: "low", summary: "구체 사례가 포함되어 추가 검토 신호가 낮습니다.", evidenceCount: 1 },
      { id: "citation", level: "low", summary: "자소서 문서 유형상 별도 출처 보완 필요성은 낮습니다.", evidenceCount: 0 },
      { id: "submission", level: "low", summary: "역할, 행동, 결과가 연결되어 제출 전 기본 점검 기준을 충족합니다.", evidenceCount: 1 }
    ],
    actionItems: [
      "최종 제출 전 지원 직무와 연결되는 표현을 한 번 더 확인해 주세요.",
      "결과 수치가 실제 자료와 일치하는지 검토해 주세요.",
      "문단별 핵심 메시지가 반복되지 않는지 마지막으로 읽어 보세요."
    ],
    findingTemplates: [
      {
        id: "S-501",
        labels: ["안정성"],
        level: "low",
        fallbackText: "저는 고객 문의 120건을 유형별로 정리하고 반복 문의를 줄이기 위한 FAQ 초안을 작성했습니다.",
        reason: "역할과 결과가 드러나며 제출 전 보완 부담이 낮은 문장입니다.",
        recommendation: "가능하면 이 경험이 지원 직무와 어떻게 연결되는지 한 문장 더 덧붙이세요.",
        suggestedRewrite:
          "저는 고객 문의 120건을 유형별로 정리하고 FAQ 초안을 작성했으며, 이 경험을 통해 고객 요구를 구조화하는 역량을 키웠습니다."
      }
    ]
  },
  resumeAbstract: {
    id: "MOCK-006",
    title: "자소서 제출 전 리스크 리포트",
    overallLevel: "high",
    summary: "추상 표현과 미사여구가 많아 실제 경험, 역할, 결과를 직접 보완해야 합니다.",
    axes: [
      { id: "style", level: "high", summary: "넓은 평가 표현과 반복적인 자기소개 문장이 많습니다.", evidenceCount: 4 },
      { id: "ai", level: "medium", summary: "일반적인 성장 서술이 이어져 추가 검토가 필요합니다.", evidenceCount: 3 },
      { id: "citation", level: "low", summary: "자소서 문서 유형상 별도 인용 리스크는 낮습니다.", evidenceCount: 0 },
      { id: "submission", level: "high", summary: "문서 목적 대비 본인 경험의 확인 가능한 정보가 부족합니다.", evidenceCount: 3 }
    ],
    actionItems: [
      "프로젝트명, 본인 역할, 결과 수치 중 최소 1개를 직접 추가해 주세요.",
      "넓은 성격 표현을 실제 상황 중심 문장으로 바꿔 주세요.",
      "지원 직무와 연결되는 행동 근거를 보완해 주세요."
    ],
    findingTemplates: [
      {
        id: "S-601",
        labels: ["문체", "안정성"],
        level: "high",
        fallbackText: "저는 뛰어난 열정과 책임감을 바탕으로 언제나 최상의 결과를 만들어 왔습니다.",
        reason: "평가 표현이 많지만 실제 상황, 역할, 결과가 없어 제출 문서의 설득력이 낮아질 수 있습니다.",
        recommendation: "없는 경험을 만들지 말고 실제 사례의 프로젝트명, 역할, 결과를 직접 입력해 주세요.",
        suggestedRewrite:
          "[실제 프로젝트명]에서 저는 [본인 역할]을 맡았고, [직접 한 행동]을 통해 [확인 가능한 결과]를 만들었습니다."
      }
    ]
  },
  reportCitationHeavy: {
    id: "MOCK-007",
    title: "리포트 제출 전 리스크 리포트",
    overallLevel: "high",
    summary: "통계와 일반화된 주장에 비해 출처·인용 근거가 부족한 구간이 여러 곳에서 보입니다.",
    axes: [
      { id: "style", level: "medium", summary: "주장 문장이 이어지지만 근거와 연결되는 문장이 부족합니다.", evidenceCount: 2 },
      { id: "ai", level: "medium", summary: "일부 문장이 넓은 일반론으로 구성되어 추가 검토가 필요합니다.", evidenceCount: 2 },
      { id: "citation", level: "high", summary: "수치, 추세, 연구 결과 문장에 출처 보완이 필요합니다.", evidenceCount: 5 },
      { id: "submission", level: "high", summary: "본문 인용과 참고문헌 연결 여부를 제출 전 확인해야 합니다.", evidenceCount: 4 }
    ],
    actionItems: [
      "수치나 추세를 말하는 문장마다 출처를 연결해 주세요.",
      "본문 인용과 참고문헌 목록의 형식을 맞춰 주세요.",
      "근거가 없는 일반화 표현을 범위가 좁은 주장으로 바꿔 주세요."
    ],
    findingTemplates: [
      {
        id: "S-701",
        labels: ["출처", "안정성"],
        level: "high",
        fallbackText: "대부분의 청년은 온라인 학습을 선호하며 이 흐름은 계속 확대되고 있다.",
        reason: "대상 범위와 추세를 단정하는 문장이지만 조사 출처와 기준 시점이 없습니다.",
        recommendation: "조사명, 발표 연도, 대상 범위를 함께 제시해 주세요.",
        suggestedRewrite:
          "이 문장은 조사명, 발표 연도, 조사 대상이 필요합니다. 해당 자료를 본문 인용과 참고문헌에 연결해 주세요."
      }
    ]
  },
  shortText: {
    id: "MOCK-008",
    title: "짧은 문서 리스크 리포트",
    overallLevel: "medium",
    summary: "본문이 짧아 분석 신뢰도가 낮을 수 있습니다. 결과는 방향 확인용으로만 활용해 주세요.",
    axes: [
      { id: "style", level: "medium", summary: "문장 수가 적어 문체 경향을 안정적으로 보기 어렵습니다.", evidenceCount: 1 },
      { id: "ai", level: "medium", summary: "짧은 글에서는 작성 패턴 신호가 제한적으로만 확인됩니다.", evidenceCount: 1 },
      { id: "citation", level: "medium", summary: "주장에 필요한 근거가 생략되었는지 확인해야 합니다.", evidenceCount: 1 },
      { id: "submission", level: "high", summary: "제출 목적을 판단하기에는 본문 길이와 맥락이 부족합니다.", evidenceCount: 2 }
    ],
    actionItems: [
      "문서 목적과 제출 맥락을 2~3문장 더 추가해 주세요.",
      "핵심 주장 뒤에 근거나 예시를 보완해 주세요.",
      "최소 200자 이상으로 확장한 뒤 다시 점검해 주세요."
    ],
    findingTemplates: [
      {
        id: "S-801",
        labels: ["안정성"],
        level: "high",
        fallbackText: "이 문서는 아직 짧아 제출 전 판단에 필요한 맥락이 부족합니다.",
        reason: "짧은 문서는 문체, 근거, 제출 목적을 충분히 확인하기 어렵습니다.",
        recommendation: "주장, 근거, 제출 목적을 추가한 뒤 다시 점검해 주세요.",
        suggestedRewrite:
          "이 문장 뒤에 [제출 목적], [핵심 근거], [구체 사례]를 각각 한 문장씩 직접 추가해 주세요."
      }
    ]
  },
  blogRepetition: {
    id: "MOCK-009",
    title: "블로그 글 제출 전 리스크 리포트",
    overallLevel: "high",
    summary: "반복 구조와 넓은 일반론이 많아 독자가 핵심 정보를 파악하기 어려울 수 있습니다.",
    axes: [
      { id: "style", level: "high", summary: "비슷한 문장 구조와 평가 표현이 반복됩니다.", evidenceCount: 5 },
      { id: "ai", level: "medium", summary: "템플릿처럼 보일 수 있는 정보성 문장이 일부 있습니다.", evidenceCount: 2 },
      { id: "citation", level: "medium", summary: "정보성 주장에는 링크나 출처 보완이 좋습니다.", evidenceCount: 2 },
      { id: "submission", level: "medium", summary: "독자에게 필요한 결론과 다음 행동이 더 분명해야 합니다.", evidenceCount: 2 }
    ],
    actionItems: [
      "반복되는 평가 표현을 실제 사용 상황 중심으로 줄여 주세요.",
      "정보성 주장에는 출처 링크 또는 직접 경험 기준을 표시해 주세요.",
      "독자가 바로 실행할 수 있는 다음 행동을 결론에 추가해 주세요."
    ],
    findingTemplates: [
      {
        id: "S-901",
        labels: ["문체"],
        level: "high",
        fallbackText: "이 방법은 매우 좋고 많은 사람에게 도움이 되며 여러 상황에서 유용합니다.",
        reason: "비슷한 긍정 표현이 이어져 실제 장점이 흐릿해질 수 있습니다.",
        recommendation: "구체적인 사용 상황과 독자가 얻는 변화를 함께 적어 주세요.",
        suggestedRewrite:
          "이 방법은 출근 전 10분 안에 할 일을 정리해야 하는 독자에게 유용하며, 우선순위를 빠르게 나누는 데 도움이 됩니다."
      }
    ]
  },
  businessUnclear: {
    id: "MOCK-010",
    title: "업무문서 제출 전 리스크 리포트",
    overallLevel: "high",
    summary: "수치, 기한, 책임자가 불명확해 실행 문서로서 보완이 필요합니다.",
    axes: [
      { id: "style", level: "medium", summary: "표현은 정중하지만 핵심 행동이 뒤로 밀려 있습니다.", evidenceCount: 2 },
      { id: "ai", level: "low", summary: "업무 맥락이 있어 관련 신호는 낮게 보입니다.", evidenceCount: 1 },
      { id: "citation", level: "medium", summary: "성과 수치와 시장 설명에 근거가 필요합니다.", evidenceCount: 2 },
      { id: "submission", level: "high", summary: "담당자, 마감일, 산출물이 명확하지 않습니다.", evidenceCount: 5 }
    ],
    actionItems: [
      "담당자, 마감일, 산출물을 한 문장 안에 명시해 주세요.",
      "성과 수치가 있다면 기준 기간과 수집 방법을 덧붙여 주세요.",
      "결론 문단에 다음 회의 또는 보고 일정을 추가해 주세요."
    ],
    findingTemplates: [
      {
        id: "S-1001",
        labels: ["안정성"],
        level: "high",
        fallbackText: "관련 내용을 검토한 뒤 적절한 시점에 공유하겠습니다.",
        reason: "검토 주체와 공유 시점이 없어 업무 문서의 실행 안정성이 낮아질 수 있습니다.",
        recommendation: "누가 무엇을 언제까지 공유하는지 구체화해 주세요.",
        suggestedRewrite:
          "[담당 팀/이름]은 [날짜]까지 [검토 항목]을 정리하고, [공유 방식]으로 결과를 전달하겠습니다."
      }
    ]
  },
  sensitiveInfo: {
    id: "MOCK-011",
    title: "민감정보 포함 문서 리스크 리포트",
    overallLevel: "high",
    summary: "본문에 개인정보로 보일 수 있는 정보가 포함되어 제출 전 삭제 또는 마스킹 검토가 필요합니다.",
    privacyNotice:
      "개인정보로 보일 수 있는 정보가 감지되었습니다. 제출 전 필요한 범위인지 확인하고, 불필요한 정보는 삭제 또는 마스킹해 주세요.",
    axes: [
      { id: "style", level: "medium", summary: "문체보다 개인정보 포함 여부를 우선 확인해야 합니다.", evidenceCount: 1 },
      { id: "ai", level: "low", summary: "작성 패턴보다 데이터 노출 위험 검토가 우선입니다.", evidenceCount: 0 },
      { id: "citation", level: "medium", summary: "민감정보가 근거로 필요한지 제출 목적과 비교해야 합니다.", evidenceCount: 1 },
      { id: "submission", level: "high", summary: "제출 전 개인정보 최소화 기준을 확인해야 합니다.", evidenceCount: 4 }
    ],
    actionItems: [
      "전화번호, 이메일, 주소 등 개인 식별 정보를 제출 목적상 필요한 범위로 줄여 주세요.",
      "불필요한 개인정보는 삭제하거나 일부 마스킹해 주세요.",
      "제출처의 개인정보 제출 기준을 확인해 주세요."
    ],
    findingTemplates: [
      {
        id: "S-1101",
        labels: ["안정성"],
        level: "high",
        fallbackText: "연락처와 주소 등 개인 정보가 포함된 문장입니다.",
        reason: "개인 식별 정보는 제출 목적에 꼭 필요한 경우가 아니라면 노출을 줄이는 편이 안전합니다.",
        recommendation: "필요한 정보만 남기고 나머지는 삭제 또는 마스킹해 주세요.",
        suggestedRewrite:
          "개인정보가 꼭 필요한 제출 양식이 아니라면 연락처, 주소, 식별 번호는 삭제하거나 일부 마스킹해 주세요."
      }
    ]
  },
  mixedDraft: {
    id: "MOCK-012",
    title: "혼합 작성 문서 리스크 리포트",
    overallLevel: "medium",
    summary: "직접 작성한 내용과 도구 도움을 받은 문장이 섞여 보일 수 있어 작성 과정과 근거를 정리하는 것이 좋습니다.",
    axes: [
      { id: "style", level: "medium", summary: "일부 문단 사이 문체 호흡이 달라 보입니다.", evidenceCount: 2 },
      { id: "ai", level: "medium", summary: "작성 방식을 단정하지 않고 혼합 작성 가능 신호만 참고 지표로 표시합니다.", evidenceCount: 2 },
      { id: "citation", level: "medium", summary: "외부 도움을 받은 정보성 문장은 근거를 함께 확인해야 합니다.", evidenceCount: 2 },
      { id: "submission", level: "medium", summary: "제출 전 작성 과정 메모와 원문 수정 이력을 정리하면 안정성이 높아집니다.", evidenceCount: 2 }
    ],
    actionItems: [
      "도구 도움을 받은 문장이 있다면 본인이 확인한 근거와 수정 이유를 정리해 주세요.",
      "문단마다 문체가 급격히 달라지는 구간을 직접 다시 읽어 주세요.",
      "주장과 경험이 실제 자료 또는 본인 기록과 맞는지 확인해 주세요."
    ],
    findingTemplates: [
      {
        id: "S-1201",
        labels: ["문체", "AI 리스크"],
        level: "medium",
        fallbackText: "초안 작성 후 일부 문장을 도구 도움으로 다듬은 문서입니다.",
        reason: "문단 사이 표현 밀도와 문장 호흡이 달라 보일 수 있어 작성 과정 확인이 도움이 됩니다.",
        recommendation: "작성 방식 자체를 단정하지 말고, 본인이 확인한 근거와 수정 의도를 남겨 주세요.",
        suggestedRewrite:
          "이 문단은 본인이 확인한 자료와 수정 이유를 바탕으로 표현을 다시 정리해 주세요."
      }
    ]
  }
};

export function getDocumentType(documentTypeId) {
  return DOCUMENT_TYPES.find((type) => type.id === documentTypeId) || DOCUMENT_TYPES[DOCUMENT_TYPES.length - 1];
}

export function splitKoreanSentences(text) {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (!normalized) {
    return [];
  }

  const matches = normalized.match(/[^.!?。！？]+[.!?。！？]?/g) || [normalized];
  return matches.map((sentence) => sentence.trim()).filter(Boolean);
}

function detectScenarioKey(documentType, body) {
  const trimmed = body.trim();

  if (SENSITIVE_PATTERN.test(trimmed)) {
    return "sensitiveInfo";
  }

  if (trimmed.length > 0 && trimmed.length < SHORT_TEXT_LIMIT) {
    return "shortText";
  }

  if (/(AI|초안|도구|편집|수정본|혼합 작성)/i.test(trimmed)) {
    return "mixedDraft";
  }

  if (documentType === "resume" && /(프로젝트|역할|수치|결과|고객|매출|개선|문의)/.test(trimmed) && trimmed.length >= 450) {
    return "resumeLow";
  }

  if (documentType === "resume" && /(열정|책임감|최선|성장|노력|항상)/.test(trimmed)) {
    return "resumeAbstract";
  }

  if (documentType === "report" && /(통계|조사|연구|대부분|증가|감소|청년|비율)/.test(trimmed)) {
    return "reportCitationHeavy";
  }

  if (documentType === "blog" && /(매우|정말|유용|좋고|도움|많은 사람)/.test(trimmed)) {
    return "blogRepetition";
  }

  if (documentType === "business") {
    return "businessUnclear";
  }

  return documentType;
}

function buildActionItems(scenario, findings) {
  if (scenario.actionItems?.length) {
    return scenario.actionItems;
  }

  const items = [];
  const citationCount = scenario.axes.find((axis) => axis.id === "citation")?.evidenceCount || 0;
  const styleCount = scenario.axes.find((axis) => axis.id === "style")?.evidenceCount || 0;
  const submissionCount = scenario.axes.find((axis) => axis.id === "submission")?.evidenceCount || 0;

  if (findings.length) {
    items.push(`${findings.length}개 문장에서 구체적 근거 또는 표현 보완이 필요합니다.`);
  }

  if (citationCount > 0) {
    items.push(`출처·인용 확인이 필요한 주장 ${citationCount}개를 먼저 검토해 주세요.`);
  }

  if (styleCount > 0) {
    items.push(`반복적이거나 추상적인 문장 구조 ${styleCount}곳을 완화해 주세요.`);
  }

  if (submissionCount > 0 && items.length < 3) {
    items.push("문서 목적, 결과 수치, 다음 행동이 명확한지 제출 전 확인해 주세요.");
  }

  return items.slice(0, 3);
}

export function createMockReport({ documentType = "other", body = "" }) {
  const scenarioKey = detectScenarioKey(documentType, body);
  const scenario = REPORT_SCENARIOS[scenarioKey] || REPORT_SCENARIOS[documentType] || REPORT_SCENARIOS.other;
  const documentLabel = getDocumentType(documentType).label;
  const userSentences = splitKoreanSentences(body);
  const now = new Date();

  const findings = scenario.findingTemplates.map((finding, index) => ({
    ...finding,
    text: userSentences[index] || finding.fallbackText
  }));

  return {
    id: `${scenario.id}-${now.getTime()}`,
    scenarioId: scenario.id,
    documentType,
    documentLabel,
    title: scenario.title,
    overallLevel: scenario.overallLevel,
    summary: scenario.summary,
    disclaimer:
      "이 리포트는 문서 제출 전 검토를 돕는 참고 지표입니다. 결과만으로 작성자나 작성 방식을 단정하지 마세요.",
    privacyNotice: scenario.privacyNotice || "",
    actionItems: buildActionItems(scenario, findings),
    axes: scenario.axes.map((axis) => ({
      ...axis,
      label: AXIS_LABELS[axis.id]
    })),
    findings,
    checklist: CHECKLIST.map((item) => ({
      ...item,
      checked: false
    })),
    meta: {
      createdAt: now.toISOString(),
      characterCount: body.trim().length,
      sentenceCount: userSentences.length || findings.length,
      isShortText: body.trim().length > 0 && body.trim().length < SHORT_TEXT_LIMIT,
      mockScenarioCount: MOCK_SCENARIO_COUNT
    }
  };
}

export function createEmptyReport() {
  return createMockReport({
    documentType: "other",
    body:
      "문서 목적이 명확하지 않은 상태에서는 문체와 근거를 함께 확인해야 합니다. 제출 전에 필요한 근거와 체크리스트를 다시 점검해 주세요."
  });
}
