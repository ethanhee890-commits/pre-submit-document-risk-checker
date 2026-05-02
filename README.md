# 제출 전 문서 리스크 점검기

한국어 문서를 제출하기 전에 문체, AI 작성 리스크, 출처·인용, 제출 안정성을 한 번에 점검하는 클릭형 웹 프로토타입입니다.

## 산출물 위치

```text
D:\VibeProject\CodexProjects\pre-submit-document-risk-checker
```

## 실행 방법

권장 실행:

```powershell
.\start.ps1
```

스크립트는 사용 가능한 포트를 확인한 뒤 로컬 서버를 시작합니다. 기본 확인 URL은 다음 후보 중 하나입니다.

```text
http://localhost:4173
http://localhost:4187
```

직접 Node로 실행하려면 다음 명령을 사용합니다.

```bash
node server.js
```

다른 포트를 지정하려면 PowerShell에서 다음처럼 실행합니다.

```powershell
$env:PORT=4180; node server.js
```

현재 Codex 데스크톱 환경처럼 전역 `node` 또는 `npm`이 잡히지 않는 경우에도 포함된 PowerShell 스크립트가 번들 Node를 먼저 사용합니다.

```powershell
.\start.ps1
```

## 테스트

```bash
node tests/qa-smoke.js
```

## 배포 URL

```text
https://pre-submit-document-risk-checker.onrender.com
```

## PDF API

일반 사용자 화면의 기본 PDF 저장은 브라우저 인쇄 기능으로 동작합니다. `/api/pdf`는 QA 모드와 서버 기반 PDF 저장 검증을 위한 엔드포인트입니다.
PDF 파일을 서버에서 만드는 기능을 사용하는 경우 리포트 출력에 필요한 데이터가 일시적으로 전송될 수 있습니다.
일반 로컬 환경에서 실행할 경우에는 `optionalDependencies`의 `playwright` 설치가 필요할 수 있습니다.

## Route list

| Route | 화면 |
|---|---|
| `/` | 랜딩 페이지 |
| `/check` | 문서 점검 입력 |
| `/check?qa=1` | QA용 오류 화면 테스트 버튼 포함 입력 화면 |
| `/checking` | 문서 점검 로딩 |
| `/report` | 문서 신뢰도 리포트 |
| `/pdf-report` | 인쇄용 PDF 리포트 |
| `/pdf-report?qa=1` | QA용 PDF API 테스트 버튼 포함 PDF 화면 |
| `/documents` | 브라우저 임시 문서함 |
| `/settings` | 기본 설정/보관정책 |
| `/org` | 기관용 데모, 일반 내비게이션에서는 숨김 |

## 주요 파일

| 파일 | 역할 |
|---|---|
| `index.html` | 단일 HTML 진입점 |
| `src/app.js` | 라우팅, 상태 관리, 입력 검증, 리포트 상호작용 |
| `src/data/mockAnalysis.js` | 문서 유형별 샘플 분석 데이터 |
| `src/styles.css` | 반응형 UI 스타일 |
| `server.js` | 로컬 서버와 route fallback |
| `start.ps1` | Codex 번들 Node 우선 실행 스크립트 |
| `tests/qa-smoke.js` | 필수 문구, 제한 문구, route 구현 smoke test |
| `docs/12_JENNY_REVIEW_SPRINT1_2026-05-01.md` | 제니 Sprint 1 조건부 통과 리뷰 |

## 제품 정책

- 실제 AI 모델, 외부 검사 API, 결제, 계정 기능은 연결하지 않습니다.
- 리포트 결과는 작성자를 단정하지 않는 참고 지표로 표현합니다.
- 기본 점검과 임시 저장은 현재 브라우저 기준으로 동작합니다.
- PDF 파일을 서버에서 만드는 기능을 사용하는 경우 리포트 출력에 필요한 데이터가 일시적으로 전송될 수 있습니다.

## Sprint 1 보완 반영

- 리포트 상단을 `종합 제출 준비도`와 `지금 해야 할 조치 3개` 중심으로 재배치했습니다.
- 4축 카드 순서를 `문체 점검 → 출처·인용 리스크 → AI 작성 리스크 → 제출 안정성`으로 조정했습니다.
- 짧은 글 신뢰도 안내와 개인정보 포함 경고를 리포트 상태로 추가했습니다.
- 샘플 시나리오 풀을 12개로 확장했습니다.
- 자소서 개선 제안은 없는 경험을 생성하지 않고 사용자가 직접 경험·역할·결과를 입력하도록 안내합니다.

## Sprint 2 1차 반영

- `/pdf-report` 인쇄용 리포트 화면을 추가했습니다.
- 브라우저 인쇄 창에서 PDF 저장을 선택하는 방식으로 내보내기 흐름을 구현했습니다.
- `/settings`에서 원문 보관 방식, 원문 함께 보관 여부, 자동 삭제 기준을 설정할 수 있습니다.
- `/documents`에서 저장한 리포트를 다시 열거나 PDF 보기로 이동할 수 있습니다.
- 저장 리포트 삭제 전에는 브라우저 확인 창을 표시합니다.

## Sprint 2 2차 반영

- PDF 리포트에 권장 파일명, 파일명 복사, 리포트 ID/생성일, 인쇄용 footer, A4 print CSS를 추가했습니다.
- 문서함에 검색, 리스크/문서 유형/보관 상태 필터, 요약 지표를 추가했습니다.
- 저장일과 설정의 자동 삭제 기준을 바탕으로 보관 중/만료 예정/정리 대상 상태를 표시합니다.
- 만료 리포트 정리는 사용자가 버튼을 누르고 확인한 경우에만 실행됩니다.
- `/org` 기관용 데모 화면을 추가했습니다.

## 리스크 해소 반영

- Git 저장소로 추적할 수 있도록 초기화했습니다.
- `/api/pdf` PDF API를 추가했습니다.
- PDF 화면에서 일반 사용자용 `PDF로 저장`과 QA용 `PDF API 테스트`를 분리했습니다.
- 기관용 데모 화면에 권한 매트릭스와 감사 로그 예시 데이터를 추가했습니다.
- 제니 시각 QA용 공유 문서 `docs/13_JENNY_VISUAL_QA_PACKAGE_2026-05-01.md`를 추가했습니다.

## Sprint 2.2 배포 리뷰 반영

- 일반 사용자 화면에서 개발용 표현과 내부 검증용 라벨을 제거했습니다.
- 리스크 등급을 `양호`, `보완 권장`, `우선 확인`으로 정리했습니다.
- `/check` 화면 제목, 보조 문구, 점검 항목 안내를 사용자용 문구로 교체했습니다.
- 일반 내비게이션에서 `조직` 메뉴를 숨기고 `/org`는 기관용 데모 직접 URL로 유지했습니다.
- PDF와 설정 화면의 데이터 처리 안내를 PDF API 정책과 맞췄습니다.
- QA 스크린샷은 `qa-artifacts/*-sprint2-2-*.png` 파일로 갱신했습니다.

## 배포 준비 반영

- `/api/health` 헬스체크 API를 추가했습니다.
- `/api/version` 버전 정보 API를 추가했습니다.
- Docker 배포용 `Dockerfile`과 `.dockerignore`를 추가했습니다.
- Render 배포 초안 `render.yaml`을 추가했습니다.
- 환경 변수 예시 `.env.example`을 추가했습니다.
- 배포 런북 `docs/14_DEPLOYMENT_RUNBOOK_2026-05-01.md`를 추가했습니다.

## Sprint 3 설계 문서

R2 이슈는 최신 재검수 산출물 기준으로 종료했고, Sprint 3에서는 구현 확장보다 아래 설계를 먼저 확정합니다.

| 문서 | 역할 |
|---|---|
| `docs/20_ANALYSIS_LOGIC_V0_SPEC_2026-05-02.md` | 실제 분석 로직 v0 설계 |
| `docs/21_DATA_POLICY_V1_2026-05-02.md` | 데이터 정책 v1 |
| `docs/22_RETENTION_DELETE_FLOW_2026-05-02.md` | 보관/삭제 플로우 |
| `docs/23_PDF_OPERATION_UX_SPEC_2026-05-02.md` | PDF 운영 UX |
| `docs/24_EXTERNAL_DEMO_SAMPLE_SET_2026-05-02.md` | 외부 데모 샘플 문서 세트 |
| `docs/25_B2C_B2B_SCREEN_SPLIT_STRATEGY_2026-05-02.md` | 개인/B2B 화면 분리 전략 |

## 다음 단계 권장 순서

1. 실제 분석 로직 v0와 데이터 정책 v1 검토
2. 보관/삭제 플로우 승인
3. PDF 운영 UX 승인
4. 외부 데모 샘플 문서 확정
5. 개인/B2B 화면 분리 전략 확정
6. 승인 후 실제 분석 또는 저장 기능 구현 여부 결정
