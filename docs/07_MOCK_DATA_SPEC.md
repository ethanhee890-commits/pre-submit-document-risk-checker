---
title: "제출 전 문서 리스크 점검기 Mock Data Spec v0.1"
date: "2026-05-01"
status: "draft-for-mvp"
project: "pre-submit-document-risk-checker"
---

# Mock Data Spec v0.1

## 1. 목적

MVP에서는 실제 AI 모델을 연결하지 않고 mock 분석 데이터를 사용한다. 목표는 리포트 UX, 문장별 하이라이트, 개선 제안, 체크리스트 흐름을 검증하는 것이다.

## 2. Mock 시나리오

| Mock ID | 문서 유형 | 결과 시나리오 |
|---|---|---|
| MOCK-001 | 자소서 | 문체 자연도 보통, AI 작성 리스크 보통 |
| MOCK-002 | 대학 리포트 | 출처·인용 리스크 높음 |
| MOCK-003 | 블로그 글 | 반복 표현과 문체 자연도 리스크 높음 |
| MOCK-004 | 업무 보고서 | 제출 안정성 리스크 높음, 문장 명확도 낮음 |

## 3. Risk Level

```ts
type RiskLevel = "low" | "medium" | "high";
```

표시 문구:

| 값 | 표시 |
|---|---|
| low | 낮음 |
| medium | 보통 |
| high | 높음 |

## 4. TypeScript 구조 예시

```ts
export type DocumentType = "resume" | "report" | "blog" | "business" | "other";

export interface RiskAxis {
  id: "style" | "ai" | "citation" | "submission";
  label: string;
  level: RiskLevel;
  summary: string;
  evidenceCount: number;
}

export interface SentenceFinding {
  id: string;
  text: string;
  labels: Array<"문체" | "AI 리스크" | "출처" | "안정성">;
  level: RiskLevel;
  reason: string;
  recommendation: string;
  suggestedRewrite?: string;
}

export interface MockReport {
  id: string;
  documentType: DocumentType;
  title: string;
  overallLevel: RiskLevel;
  summary: string;
  disclaimer: string;
  axes: RiskAxis[];
  findings: SentenceFinding[];
  checklist: Array<{
    id: string;
    label: string;
    checked: boolean;
  }>;
}
```

## 5. MOCK-001 자소서 예시

```json
{
  "id": "MOCK-001",
  "documentType": "resume",
  "title": "자소서 제출 전 리스크 리포트",
  "overallLevel": "medium",
  "summary": "일부 문장에서 문체가 지나치게 정돈되어 보일 수 있으며, 지원자 본인의 구체적 경험 보완이 필요합니다.",
  "axes": [
    {
      "id": "style",
      "label": "문체 자연도",
      "level": "medium",
      "summary": "추상적 표현과 반복적인 문장 구조가 일부 발견되었습니다.",
      "evidenceCount": 3
    },
    {
      "id": "ai",
      "label": "AI 작성 리스크",
      "level": "medium",
      "summary": "일부 문장이 일반적이고 예측 가능한 구조로 구성되어 있습니다.",
      "evidenceCount": 2
    },
    {
      "id": "citation",
      "label": "출처·인용 리스크",
      "level": "low",
      "summary": "자소서 문서 유형상 별도 인용 리스크는 낮습니다.",
      "evidenceCount": 0
    },
    {
      "id": "submission",
      "label": "제출 안정성",
      "level": "medium",
      "summary": "경험의 구체성과 결과 수치 보완이 필요합니다.",
      "evidenceCount": 2
    }
  ],
  "findings": [
    {
      "id": "S-001",
      "text": "저는 항상 최선을 다하며 문제를 해결하는 과정에서 성장해 왔습니다.",
      "labels": ["문체", "AI 리스크"],
      "level": "medium",
      "reason": "문장이 일반적이고 구체적 경험이나 상황 정보가 부족합니다.",
      "recommendation": "실제 경험, 역할, 결과를 함께 제시해 작성자 고유성을 높이세요.",
      "suggestedRewrite": "○○ 프로젝트에서 일정 지연 문제가 발생했을 때, 저는 주간 작업표를 다시 구성하고 팀원별 병목을 정리해 마감 2일 전 결과물을 제출했습니다."
    }
  ]
}
```

## 6. Checklist 기본값

| ID | 항목 |
|---|---|
| C-001 | 문서 목적에 맞는 문체인지 확인했습니다. |
| C-002 | 구체적 경험이나 근거가 부족한 문장을 보완했습니다. |
| C-003 | 출처가 필요한 주장에 인용 또는 근거를 추가했습니다. |
| C-004 | AI 작성 리스크가 높은 문장을 직접 검토했습니다. |
| C-005 | 최종 제출 전 원문과 수정본을 비교했습니다. |
