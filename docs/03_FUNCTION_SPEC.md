---
title: "제출 전 문서 리스크 점검기 Function Spec v0.1"
date: "2026-05-01"
status: "draft-for-mvp"
project: "pre-submit-document-risk-checker"
---

# 기능정의서 v0.1

## 1. 기능 목록

| 기능 ID | 화면 ID | 기능명 | 설명 | 트리거 | UI 요소 | 입력값 | 출력값 | 상태 | 예외 | 우선순위 | 수용 기준 |
|---|---|---|---|---|---|---|---|---|---|---:|---|
| F-001 | LAND-001 | 검사 CTA | 사용자를 검사 입력 화면으로 이동 | 버튼 클릭 | Button | 없음 | `/check` 이동 | default/hover/focus | 없음 | High | CTA 클릭 시 검사 화면으로 이동 |
| F-002 | CHECK-001 | 문서 유형 선택 | 문서 목적을 선택 | 카드/셀렉트 클릭 | Select/Card | 자소서/리포트/블로그/업무문서/기타 | 선택 상태 | selected/default | 미선택 시 기본값 기타 | High | 선택값이 리포트에 반영 |
| F-003 | CHECK-001 | 텍스트 입력 | 문서 본문 입력 | 타이핑/붙여넣기 | Textarea | 본문 | 글자 수, 문장 수 | default/focus/error | 빈 입력, 너무 짧음 | High | 글자 수 표시 및 유효성 안내 |
| F-004 | CHECK-001 | 글자 수 카운트 | 입력 글자 수 표시 | 입력 변경 | Counter | 본문 | 현재 글자 수 | normal/warning/error | 최소 미만 | High | 실시간 카운트 표시 |
| F-005 | CHECK-001 | 검사 실행 | mock 분석 수행 | 버튼 클릭 | Button | 문서 유형, 본문 | 리포트 데이터 | loading/success/error | 빈 입력 | High | 유효 입력 시 리포트로 이동 |
| F-006 | CHECK-001 | 빈 입력 오류 | 본문 미입력 안내 | 검사 실행 | Inline error | 없음 | 오류 메시지 | error | 빈 입력 | High | “검사할 문서를 입력해 주세요.” 표시 |
| F-007 | CHECK-002 | 로딩 상태 | 분석 진행 상태 표시 | 검사 실행 | Loading panel | 없음 | 진행 단계 | loading | 분석 실패 mock | High | 최소 1개 로딩 상태 표시 |
| F-008 | REPORT-001 | 종합 리스크 요약 | 전체 결과 요약 | 리포트 진입 | Summary card | mock 결과 | 낮음/보통/높음 | success | 데이터 없음 | High | 리스크 구간과 안내 문구 표시 |
| F-009 | REPORT-001 | 4축 카드 | 문체/AI/출처/제출 안정성 표시 | 리포트 진입 | Cards | mock score | 각 축 상태 | success | 데이터 없음 | High | 4개 카드 모두 표시 |
| F-010 | REPORT-002 | 문장별 하이라이트 | 위험 문장 표시 | 리포트 진입 | Highlight list | 문장 분석 결과 | 하이라이트/라벨 | selected/default | 분석 문장 없음 | High | 위험 문장 클릭 가능 |
| F-011 | REPORT-002 | 문장 근거 패널 | 클릭 문장의 근거 표시 | 문장 클릭 | Detail panel | sentenceId | 근거, 위험 유형, 신뢰도 | selected | 미선택 | High | 클릭한 문장 정보 표시 |
| F-012 | REPORT-003 | 개선 제안 표시 | 원문과 제안문 비교 | 문장 선택 | Diff/Compare card | selected sentence | 개선안 | default | 제안 없음 | High | 원문/제안문이 구분 표시 |
| F-013 | REPORT-003 | 개선문 복사 | 제안문 클립보드 복사 | 버튼 클릭 | Button/Toast | 제안문 | 토스트 | success/error | 복사 실패 | Medium | 복사 완료 토스트 표시 |
| F-014 | REPORT-004 | 체크리스트 | 제출 전 확인 항목 체크 | 체크 클릭 | Checkbox | 체크 상태 | 완료율 | checked/unchecked | 없음 | High | 완료율 갱신 |
| F-015 | REPORT-001 | 리포트 저장 mock | 리포트 저장 피드백 | 버튼 클릭 | Button/Toast | reportId | 토스트 | success | 없음 | Medium | “리포트를 임시 저장했습니다.” 표시 |
| F-016 | REPORT-001 | 다운로드 mock | 다운로드 준비 중 안내 | 버튼 클릭 | Button/Toast | reportId | 토스트 | info | 없음 | Medium | “PDF 다운로드는 다음 버전에서 제공됩니다.” 표시 |
| F-017 | REPORT-001 | 재검사 | 입력 화면으로 복귀 | 버튼 클릭 | Button | 없음 | `/check` 이동 | default | 없음 | Medium | 기존 입력값 유지 가능하면 유지 |
| F-018 | COMMON | 면책 안내 | 절대 판정 아님 안내 | 리포트 진입 | Notice | 없음 | 안내문 | visible | 없음 | High | 리포트 상단에 표시 |
| F-019 | COMMON | 토스트 | 복사/저장/다운로드 상태 표시 | 액션 후 | Toast | 메시지 | 상태 알림 | success/error/info | 없음 | Medium | 3초 내 자동 사라짐 |
| F-020 | COMMON | 반응형 | 모바일 레이아웃 대응 | viewport 변경 | Layout | viewport | 재배치 | responsive | overflow | High | 375px 폭에서 주요 UI 깨짐 없음 |

## 2. 유효성 규칙

| 항목 | 규칙 | 메시지 |
|---|---|---|
| 본문 필수 | trim 후 0자이면 오류 | 검사할 문서를 입력해 주세요. |
| 최소 글자 | 200자 미만은 경고 | 짧은 문서는 분석 신뢰도가 낮을 수 있습니다. |
| 권장 글자 | 500자 이상 권장 | 더 정확한 점검을 위해 500자 이상을 권장합니다. |
| 최대 글자 | MVP에서는 10,000자 제한 권장 | 한 번에 검사할 수 있는 글자 수를 초과했습니다. |
| 문서 유형 | 미선택 시 기타 | 문서 유형이 기본값으로 설정되었습니다. |

## 3. 상태 정의

| 상태 | 설명 |
|---|---|
| empty | 입력값 없음 |
| default | 기본 표시 |
| focus | 입력 또는 선택 중 |
| warning | 글자 수 부족, 신뢰도 낮음 |
| error | 빈 입력, 초과 입력, 분석 실패 |
| loading | 분석 중 |
| success | 리포트 생성 완료 |
| selected | 문장 또는 카드 선택 상태 |
