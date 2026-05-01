# 제니가 덱스에게 - 작업지시

## 프로젝트

- 제품명: 제출 전 문서 리스크 점검기
- 프로젝트 경로: `D:\VibeProject\CodexProjects\pre-submit-document-risk-checker`
- 목표: 한국어 문서를 제출하기 전에 문체, AI 작성 리스크, 출처/인용 리스크, 제출 안정성을 점검하는 MVP 클릭형 웹 프로토타입 구현

## 전달 문서

아래 문서를 프로젝트 repo의 `docs` 폴더에 반영하고, 이를 기준으로 구현해 주세요.

```text
docs/00_CODEX_HANDOFF.md
docs/01_PRD.md
docs/02_IA.md
docs/03_FUNCTION_SPEC.md
docs/04_SCREEN_SPEC.md
docs/05_UX_POLICY.md
docs/06_DESIGN_DIRECTION.md
docs/07_MOCK_DATA_SPEC.md
docs/08_QA_CHECKLIST.md
docs/09_ACCEPTANCE_CRITERIA.md
docs/10_DATA_POLICY.md
docs/11_COPY_POLICY.md
AGENTS.md
```

## 우선 구현 범위

1. 랜딩 페이지
2. 문서 검사 입력 화면
3. Mock 분석 기반 리스크 리포트
4. 문장별 하이라이트 분석
5. 개선 제안 화면
6. 제출 전 체크리스트
7. Empty / loading / error / success 상태
8. 기본 반응형

## 구현 원칙

- 실제 AI 모델 연동 없이 mock 데이터로 UX 검증
- AI 탐지 우회, 통과 보장, humanizer, bypass 표현 금지
- 결과는 절대 판정이 아니라 리스크 참고 지표로 표현
- 단일 AI 확률보다 문체/AI 작성 리스크/출처·인용/제출 안정성 4축 리포트로 표현
- 한글 UI 가독성 우선
- 브라우저에서 확인 가능한 실행 결과 제공

## 완료 보고 필수

- 산출물 위치
- 실행 방법
- 확인 URL 또는 HTML 파일 경로
- route list
- 구현 화면 목록
- 미구현 화면 목록
- 주요 변경 파일
- QA 결과
- Git diff 또는 변경 요약
- 알려진 이슈
- 가정한 내용
