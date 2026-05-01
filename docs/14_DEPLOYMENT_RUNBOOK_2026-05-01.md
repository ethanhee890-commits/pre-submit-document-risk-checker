# 배포 런북 - 제출 전 문서 리스크 점검기

- 작성일: 2026-05-01
- 상태: deploy-ready draft
- 대상: MVP 로컬 서버 + 서버 PDF 생성 API

## 1. 배포 방식

이 앱은 정적 SPA와 Node 서버를 함께 사용합니다.

- 정적 화면: `index.html`, `src/app.js`, `src/styles.css`
- 서버 API: `server.js`
- PDF 생성: `POST /api/pdf`
- 헬스체크: `GET /api/health`
- 버전 정보: `GET /api/version`

서버 PDF 생성에 Playwright가 필요하므로 Docker 배포를 권장합니다.

## 2. 로컬 실행

```powershell
cd D:\VibeProject\CodexProjects\pre-submit-document-risk-checker
.\start.ps1
```

확인:

```text
http://localhost:4173/api/health
http://localhost:4173/api/version
```

현재 로컬에서 4173이 사용 중이면 `start.ps1`이 4187 등 사용 가능한 포트를 선택합니다.

## 3. Docker 실행

```bash
docker build -t pre-submit-document-risk-checker .
docker run --rm -p 4173:4173 pre-submit-document-risk-checker
```

확인:

```text
http://localhost:4173
http://localhost:4173/api/health
```

## 4. Render 배포

`render.yaml`을 포함했습니다.

1. GitHub 원격 저장소에 프로젝트를 push합니다.
2. Render에서 New Web Service를 생성합니다.
3. 이 저장소를 연결합니다.
4. Environment는 Docker를 사용합니다.
5. Health Check Path는 `/api/health`입니다.
6. 배포 후 `/api/pdf`에서 PDF 생성이 되는지 확인합니다.

## 5. GitHub 원격 저장소 연결

GitHub에서 빈 저장소를 만든 뒤 아래 명령을 실행합니다.

```bash
git remote add origin https://github.com/<owner>/<repo>.git
git branch -M main
git push -u origin main
```

원격 저장소 URL과 인증 권한은 에던 계정 범위이므로 덱스가 임의로 생성하거나 연결하지 않습니다.

## 6. 배포 후 QA 체크

| 항목 | 확인 경로 |
|---|---|
| 랜딩 | `/` |
| 입력 | `/check` |
| 리포트 | `/report` |
| PDF 화면 | `/pdf-report` |
| 문서함 | `/documents` |
| 설정 | `/settings` |
| 조직 | `/org` |
| 헬스체크 | `/api/health` |
| PDF API | `/api/pdf` |

## 7. 알려진 배포 리스크

- 무료 호스팅에서는 PDF 생성 시 콜드 스타트가 길 수 있습니다.
- Playwright 브라우저 바이너리가 없는 Node 환경에서는 `/api/pdf`가 실패할 수 있습니다.
- 이 경우 Dockerfile 기반 배포 또는 브라우저 인쇄 fallback을 사용합니다.
- 현재 문서함 데이터는 브라우저 localStorage 기반이므로 서버 배포 후에도 사용자별 동기화는 제공하지 않습니다.
