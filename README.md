# 제출 전 문서 리스크 점검기

한국어 문서를 제출하기 전에 문체, AI 작성 리스크, 출처·인용, 제출 안정성을 한 번에 점검하는 mock 기반 MVP 클릭형 웹 프로토타입입니다.

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

## 서버 PDF 생성

`/api/pdf`는 로컬 서버에서 PDF를 생성합니다. 현재 Codex 번들 Node에는 Playwright가 포함되어 있어 바로 검증됩니다.
일반 로컬 환경에서 실행할 경우에는 `optionalDependencies`의 `playwright` 설치가 필요할 수 있습니다.

## Route list

| Route | 화면 |
|---|---|
| `/` | 랜딩 페이지 |
| `/check` | 문서 검사 입력 |
| `/checking` | Mock 분석 로딩 |
| `/report` | 문서 신뢰도 리포트 |
| `/pdf-report` | 인쇄용 PDF 리포트 |
| `/documents` | 브라우저 임시 문서함 |
| `/settings` | 기본 설정/보관정책 |
| `/org` | 조직 화면 초안 |
| `/deploy` | GitHub/Render 계정 연결 도우미 |

## 주요 파일

| 파일 | 역할 |
|---|---|
| `index.html` | 단일 HTML 진입점 |
| `src/app.js` | 라우팅, 상태 관리, 입력 검증, 리포트 상호작용 |
| `src/data/mockAnalysis.js` | 문서 유형별 mock 분석 데이터 |
| `src/styles.css` | 반응형 UI 스타일 |
| `server.js` | 로컬 서버와 route fallback |
| `start.ps1` | Codex 번들 Node 우선 실행 스크립트 |
| `tests/qa-smoke.js` | 필수 문구, 제한 문구, route 구현 smoke test |
| `docs/12_JENNY_REVIEW_SPRINT1_2026-05-01.md` | 제니 Sprint 1 조건부 통과 리뷰 |
| `docs/15_ACCOUNT_CONNECTION_CLICK_GUIDE_2026-05-01.md` | GitHub/Render 클릭 연결 가이드 |

## MVP 정책

- 실제 AI 모델, 외부 검사 API, 결제, 계정 기능은 연결하지 않습니다.
- 리포트 결과는 작성자를 단정하지 않는 참고 지표로 표현합니다.
- 입력 원문은 현재 브라우저에 임시 저장되는 draft 외에는 서버로 전송하지 않습니다.
- 리포트 저장과 다운로드는 mock 토스트로 처리합니다.

## Sprint 1 보완 반영

- 리포트 상단을 `종합 제출 준비도`와 `지금 해야 할 조치 3개` 중심으로 재배치했습니다.
- 4축 카드 순서를 `문체 자연도 → 출처·인용 리스크 → AI 작성 리스크 → 제출 안정성`으로 조정했습니다.
- 짧은 글 신뢰도 낮음 경고와 개인정보 포함 경고를 리포트 상태로 추가했습니다.
- mock 시나리오 풀을 12개로 확장했습니다.
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
- `/org` 조직 화면 초안을 추가했습니다.

## 리스크 해소 반영

- Git 저장소로 추적할 수 있도록 초기화했습니다.
- `/api/pdf` 서버 PDF 생성 API를 추가했습니다.
- PDF 화면에서 `서버 PDF 생성`과 `인쇄 / PDF 저장`을 모두 제공합니다.
- 조직 화면에 권한 매트릭스와 감사 로그 mock을 추가했습니다.
- 제니 시각 QA용 공유 문서 `docs/13_JENNY_VISUAL_QA_PACKAGE_2026-05-01.md`를 추가했습니다.

## 배포 준비 반영

- `/api/health` 헬스체크 API를 추가했습니다.
- `/api/version` 버전 정보 API를 추가했습니다.
- Docker 배포용 `Dockerfile`과 `.dockerignore`를 추가했습니다.
- Render 배포 초안 `render.yaml`을 추가했습니다.
- 환경 변수 예시 `.env.example`을 추가했습니다.
- 배포 런북 `docs/14_DEPLOYMENT_RUNBOOK_2026-05-01.md`를 추가했습니다.

## 계정 연결 도우미 반영

- `/deploy`에서 GitHub 새 저장소 생성 링크와 Render 대시보드 링크를 제공합니다.
- GitHub 빈 저장소 URL을 입력하면 형식을 검증하고 원격 저장소 연결 명령을 복사할 수 있습니다.
- 에던께서 GitHub/Render 권한 승인만 직접 클릭하면 덱스가 URL을 받아 push와 배포 후속 작업을 이어갈 수 있습니다.
- GitHub 원격 저장소 연결 후 `/deploy`에 Render Blueprint 직접 배포 버튼을 추가했습니다.
- 클릭 연결 가이드 `docs/15_ACCOUNT_CONNECTION_CLICK_GUIDE_2026-05-01.md`를 추가했습니다.

## 다음 단계 권장 순서

1. GitHub 원격 저장소 연결 후 Render 또는 유사 호스팅에 배포
2. 문서함 다중 선택과 일괄 내보내기
3. 조직 화면 권한 변경 이력 상세화
4. 실제 계정/서버 저장 구조 설계
