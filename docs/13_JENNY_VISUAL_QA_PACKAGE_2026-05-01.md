# 제니 시각 QA 공유 패키지

- 작성일: 2026-05-01
- 프로젝트: 제출 전 문서 리스크 점검기
- 로컬 확인 URL: `http://localhost:4187`
- 산출물 위치: `D:\VibeProject\CodexProjects\pre-submit-document-risk-checker`

## 검토 목적

제니가 로컬 URL에 직접 접근하지 못하는 상황을 고려해, 화면별 QA 스크린샷과 검토 포인트를 한 문서에 정리합니다.

## 주요 화면

| 화면 ID | Route | QA 스크린샷 |
|---|---|---|
| LAND-001 | `/` | `qa-artifacts/LAND-001_desktop_sprint1-review.png` |
| CHECK-001 | `/check` | `qa-artifacts/mobile-check.png` |
| REPORT-001 | `/report` | `qa-artifacts/REPORT-001_desktop_action-first.png` |
| ERROR-001 | `/report` | `qa-artifacts/ERROR-001_short-text-warning.png` |
| PDF-001 | `/pdf-report` | `qa-artifacts/PDF-001_pdf-report_sprint2.png` |
| PDF-002 | `/pdf-report` | `qa-artifacts/PDF-002_pdf-quality_sprint2.png` |
| DOC-001 | `/documents` | `qa-artifacts/DOC-001_documents_sprint2.png` |
| DOC-002 | `/documents` | `qa-artifacts/DOC-002_documents_filter_sprint2.png` |
| SETTINGS-001 | `/settings` | `qa-artifacts/SETTINGS-001_settings_sprint2.png` |
| ORG-001 | `/org` | `qa-artifacts/ORG-001_org-dashboard_sprint2.png` |

## 제니 검토 요청

1. 리포트 상단이 AI 판정보다 제출 전 조치 중심으로 보이는지
2. PDF 리포트가 외부 제출/공유용 산출물처럼 충분히 읽히는지
3. 문서함 필터와 보관 상태가 B2C/B2B 양쪽에 자연스러운지
4. 조직 화면의 권한 매트릭스와 감사 로그가 B2B 파일럿 전 검토용으로 적절한지
5. 여전히 회피성 또는 단정적 표현으로 오해될 문구가 있는지

## 현재 구현 메모

- 실제 AI 모델은 연결하지 않았습니다.
- 서버 PDF 생성은 로컬 `/api/pdf`에서 Playwright를 사용합니다.
- Playwright가 없는 환경에서는 PDF 화면의 브라우저 인쇄 흐름을 fallback으로 사용합니다.
- 문서함 데이터는 현재 브라우저 localStorage에만 저장됩니다.
- 만료 리포트 정리는 사용자 확인 후 실행됩니다.
