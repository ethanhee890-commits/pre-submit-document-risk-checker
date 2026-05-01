---
title: "제출 전 문서 리스크 점검기 - Codex Handoff"
date: "2026-05-01"
status: "handoff-ready"
project: "pre-submit-document-risk-checker"
---

# 덱스 작업지시서

## 1. 프로젝트 개요

| 항목 | 내용 |
|---|---|
| 제품명 | 제출 전 문서 리스크 점검기 |
| 프로젝트 slug | `pre-submit-document-risk-checker` |
| 권장 경로 | `D:\VibeProject\CodexProjects\pre-submit-document-risk-checker` |
| 작업 유형 | MVP 클릭형 웹 프로토타입 |
| 구현 책임 | 덱스 |
| 제품/UX 기준 | 제니 문서 기준 |
| 최종 승인 | 에던 |

## 2. 목표

한국어 문서를 제출하기 전에 사용자가 다음 리스크를 확인할 수 있는 웹 프로토타입을 구현한다.

1. 문체 자연도
2. AI 작성 리스크
3. 출처·인용 리스크
4. 제출 안정성

초기 MVP는 실제 AI 모델을 사용하지 않고 `mockAnalysis` 데이터로 화면 흐름과 UX를 검증한다.

## 3. 구현 범위

### 3.1 필수 화면

| 화면 ID | 화면명 | 구현 요구 |
|---|---|---|
| LAND-001 | 랜딩 페이지 | 제품 소개, 핵심 가치, CTA |
| CHECK-001 | 문서 검사 입력 | 문서 유형 선택, 텍스트 입력, 검사 실행 |
| CHECK-002 | 검사 진행 상태 | loading, 분석 단계 표시 |
| REPORT-001 | 종합 리포트 | 4개 분석 축, 종합 리스크, 요약 |
| REPORT-002 | 문장별 분석 | 위험 문장 하이라이트, 위험 라벨, 근거 패널 |
| REPORT-003 | 개선 제안 | 원문/개선문 비교, 복사 버튼 |
| REPORT-004 | 제출 전 체크리스트 | 체크박스, 완료 상태 |
| ERROR-001 | 오류 상태 | 빈 입력, 글자 수 부족, 분석 실패 mock |

### 3.2 필수 인터랙션

| 인터랙션 | 수용 기준 |
|---|---|
| 문서 유형 선택 | 선택값이 입력 화면과 리포트에 반영된다. |
| 빈 입력 검사 실행 | 오류 메시지가 표시된다. |
| 글자 수 부족 | 분석 신뢰도 낮음 안내가 표시된다. |
| 검사 실행 | 로딩 상태 후 리포트 화면으로 이동한다. |
| 문장 클릭 | 해당 문장의 근거와 개선 제안이 표시된다. |
| 개선문 복사 | 복사 완료 토스트가 표시된다. |
| 체크리스트 체크 | 체크 상태와 완료율이 갱신된다. |
| 리포트 저장 | MVP에서는 mock 토스트로 처리한다. |
| 리포트 다운로드 | MVP에서는 준비 중 또는 mock 다운로드 상태로 처리한다. |

## 4. 비범위

- 실제 AI 탐지 모델 연동
- 외부 AI detector API 연동
- 특정 탐지기 우회 최적화
- 통과 보장 점수
- 결제
- 사용자 계정
- LMS/ATS/CMS 연동
- 실제 표절 DB 검색
- 실제 PDF 생성

## 5. 권장 기술

덱스가 기존 환경에 맞게 조정 가능하다.

| 영역 | 권장 |
|---|---|
| Frontend | Next.js 또는 React/Vite |
| Styling | CSS Modules, Tailwind, 또는 프로젝트 표준 |
| State | 간단한 local state |
| Data | `src/data/mockAnalysis.ts` |
| Persistence | MVP에서는 localStorage 선택 가능 |
| Test | 기본 렌더링/입력 검증 테스트 가능 시 추가 |

## 6. 권장 프로젝트 구조

```text
pre-submit-document-risk-checker
├─ AGENTS.md
├─ README.md
├─ docs
│  ├─ 00_CODEX_HANDOFF.md
│  ├─ 01_PRD.md
│  ├─ 02_IA.md
│  ├─ 03_FUNCTION_SPEC.md
│  ├─ 04_SCREEN_SPEC.md
│  ├─ 05_UX_POLICY.md
│  ├─ 06_DESIGN_DIRECTION.md
│  ├─ 07_MOCK_DATA_SPEC.md
│  ├─ 08_QA_CHECKLIST.md
│  ├─ 09_ACCEPTANCE_CRITERIA.md
│  ├─ 10_DATA_POLICY.md
│  └─ 11_COPY_POLICY.md
├─ src
│  ├─ app or pages
│  ├─ components
│  ├─ data
│  ├─ lib
│  └─ styles
├─ public
├─ tests
└─ package.json
```

## 7. 완료 보고 양식

덱스는 작업 완료 후 아래 형식으로 보고한다.

```md
# 덱스 완료 보고 - 제출 전 문서 리스크 점검기

## 산출물 위치
- 경로:

## 실행 방법
```bash
```

## 확인 URL / HTML 경로
-

## Route list
-

## 구현 화면
-

## 미구현 화면
-

## 주요 변경 파일
-

## QA 결과
| 항목 | 결과 | 메모 |
|---|---|---|

## Git diff / 변경 요약
-

## 가정한 내용
-

## 알려진 이슈
-

## 제니에게 검토 요청할 사항
-
```
