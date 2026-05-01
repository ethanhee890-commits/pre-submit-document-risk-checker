# GitHub / Render 계정 연결 클릭 가이드

작성일: 2026-05-01  
대상 프로젝트: 제출 전 문서 리스크 점검기

## 목적

에던께서 계정 로그인과 권한 승인만 직접 클릭하고, 덱스가 GitHub 빈 저장소 URL을 받아 원격 저장소 연결과 Render 배포 준비를 이어가기 위한 가이드입니다.

## 앱 안에서 확인하는 위치

```text
http://localhost:4187/deploy
```

서버 포트가 달라진 경우에는 현재 실행 중인 localhost 주소 뒤에 `/deploy`를 붙이면 됩니다.

## 1. GitHub 빈 저장소 만들기

1. `/deploy` 화면에서 `GitHub 새 저장소 만들기`를 클릭합니다.
2. Repository name은 `pre-submit-document-risk-checker`를 권장합니다.
3. Public 또는 Private 중 원하는 공개 범위를 선택합니다.
4. README, .gitignore, license는 생성하지 않습니다.
5. `Create repository`를 클릭합니다.
6. 생성된 저장소의 HTTPS URL을 복사합니다.

예시:

```text
https://github.com/<owner>/pre-submit-document-risk-checker.git
```

## 2. 덱스에게 URL 전달

`/deploy` 화면의 `GitHub 빈 저장소 URL` 입력칸에 붙여넣거나, 대화창에 그대로 보내주시면 됩니다.

덱스가 실행할 명령:

```bash
git remote add origin <GitHub 빈 저장소 URL>
git branch -M main
git push -u origin main
```

이미 원격 저장소가 연결된 상태라면 덱스가 `git remote set-url origin <URL>` 방식으로 맞춰 진행합니다.

## 3. Render 계정 연결

GitHub push가 끝난 뒤 진행합니다.

1. `/deploy` 화면에서 `Render 대시보드 열기`를 클릭합니다.
2. Render에서 GitHub 계정 연결을 승인합니다.
3. New Blueprint 또는 New Web Service를 선택합니다.
4. 방금 만든 GitHub 저장소를 선택합니다.
5. Runtime은 Docker 기준으로 둡니다.
6. Health Check Path는 `/api/health`입니다.
7. 환경 변수는 기본적으로 `NODE_ENV=production`만 필요합니다.

## 프로젝트에 이미 준비된 배포 파일

| 파일 | 용도 |
|---|---|
| `Dockerfile` | Playwright 런타임 기반 Docker 실행 |
| `.dockerignore` | Docker 빌드 제외 파일 |
| `render.yaml` | Render 배포 초안 |
| `.env.example` | 환경 변수 예시 |
| `server.js` | 정적 파일 서빙, SPA fallback, `/api/health`, `/api/version`, `/api/pdf` |

## 확인 기준

- GitHub 빈 저장소 URL이 정상 형식인지 확인됩니다.
- `/deploy` 화면에서 Git 연결 명령을 복사할 수 있습니다.
- Render 배포 시 헬스체크는 `/api/health`를 사용합니다.
- 실제 GitHub/Render 권한 승인은 에던께서 직접 클릭합니다.

## 남은 작업

- 에던께서 GitHub 빈 저장소 URL을 전달하면 원격 저장소를 연결하고 push합니다.
- push 후 Render에서 저장소 연결과 배포 생성을 진행합니다.
- 배포 URL이 나오면 `/`, `/check`, `/report`, `/api/health`를 다시 검증합니다.
