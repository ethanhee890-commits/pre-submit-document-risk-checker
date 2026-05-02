# 제니 배포 리뷰 반영 보고 — Sprint 2.2

- 작성일: 2026-05-02
- 대상 URL: https://pre-submit-document-risk-checker.onrender.com
- 상태: 코드 반영 완료, Render 최신 커밋 수동 배포 필요

## 1. 반영 요약

제니 배포 리뷰에서 지적된 사용자 화면의 개발용 표현, 리스크 등급 언어, PDF/데이터 정책 문구, 개인 MVP와 기관용 데모 분리를 반영했다.

## 2. Route list

| Route | 용도 |
|---|---|
| `/` | 랜딩 페이지 |
| `/check` | 문서 점검 입력 |
| `/check?qa=1` | QA용 오류 화면 테스트 버튼 포함 입력 화면 |
| `/checking` | 문서 점검 로딩 |
| `/report` | 리스크 리포트 |
| `/pdf-report` | 인쇄용 PDF 리포트 |
| `/pdf-report?qa=1` | QA용 PDF API 테스트 버튼 포함 PDF 화면 |
| `/documents` | 브라우저 임시 문서함 |
| `/settings` | 기본 설정과 데이터 정책 |
| `/org` | 기관용 데모, 일반 내비게이션에서는 숨김 |
| `/api/health` | Render 헬스체크 |
| `/api/version` | 배포 버전 확인 |
| `/api/pdf` | QA용 PDF API |

## 3. 구현 화면

- 랜딩 페이지
- 문서 점검 입력 화면
- 문서 점검 로딩 화면
- 문서 리스크 리포트
- 문장별 분석과 개선 제안
- 제출 전 체크리스트
- 인쇄용 PDF 리포트
- 문서함
- 설정/데이터 정책
- 기관용 데모 직접 URL
- Empty / loading / error / success 상태
- 데스크톱/모바일 반응형

## 4. 새 QA 스크린샷

| 화면 | 파일 |
|---|---|
| LAND-001 | `qa-artifacts/land-001-sprint2-2-desktop.png` |
| CHECK-001 desktop | `qa-artifacts/check-001-sprint2-2-desktop.png` |
| CHECK-001 mobile | `qa-artifacts/check-001-sprint2-2-mobile.png` |
| REPORT-001 | `qa-artifacts/report-001-sprint2-2-desktop.png` |
| PDF-001 | `qa-artifacts/pdf-001-sprint2-2-desktop.png` |
| SETTINGS-001 | `qa-artifacts/settings-001-sprint2-2-desktop.png` |

## 5. 제거/정리 항목

- 상단 브랜드의 개발 단계 표기 제거
- `/check`의 내부 설명 문구를 사용자용 점검 문구로 교체
- 일반 UI에서 오류 테스트 버튼 숨김
- 리포트 요약의 시나리오 ID와 시나리오 풀 노출 제거
- 개선 제안의 미구현 적용 버튼 제거
- 일반 내비게이션에서 조직 메뉴 숨김
- `/org`는 기관용 데모 직접 URL로 라벨링
- 리스크 등급을 `양호`, `보완 권장`, `우선 확인`으로 변경
- 기존 문체 라벨을 `문체 점검`으로 변경
- PDF 기본 버튼을 `PDF로 저장`으로 정리하고 PDF API 테스트는 QA 모드로 분리

## 6. 데이터/PDF 정책

설정 화면에는 아래 취지를 반영했다.

```text
기본 점검과 임시 저장은 현재 브라우저 기준으로 동작합니다.
PDF 파일을 서버에서 만드는 기능을 사용하는 경우 리포트 출력에 필요한 데이터가 일시적으로 전송될 수 있습니다.
```

## 7. QA 결과

| 항목 | 결과 |
|---|---|
| `node --check src/app.js` | 통과 |
| `node --check server.js` | 통과 |
| `node tests/qa-smoke.js` | 통과 |
| LAND/CHECK/REPORT/PDF/SETTINGS 브라우저 렌더 | 통과 |
| CHECK 모바일 가로 스크롤 | 없음 |
| 일반 내비게이션 조직 메뉴 숨김 | 통과 |
| 일반 CHECK 오류 테스트 버튼 숨김 | 통과 |
| 일반 PDF 서버 PDF 테스트 버튼 숨김 | 통과 |
| QA 모드 버튼 노출 | 통과 |
| 제거 대상 사용자 화면 문구 검색 | 미검출 |

## 8. Git diff 요약

- `index.html`: 브랜드 보조 문구와 내비게이션 정리
- `src/app.js`: 사용자 문구, QA 모드 분기, 리포트/PDF/문서함/설정/기관용 데모 UI 정리
- `src/data/mockAnalysis.js`: 4축 라벨과 리스크 등급 라벨 정리
- `server.js`: PDF 출력 라벨과 로그 문구 정리
- `README.md`: 현재 구현 기준과 route list 갱신
- `tests/qa-smoke.js`: Sprint 2.2 문구 정책 검증 추가
- `qa-artifacts/*-sprint2-2-*.png`: 최신 QA 스크린샷 추가

## 9. 알려진 이슈

- 실제 AI 모델, 계정, 결제, DB 저장은 아직 연결하지 않았다.
- Render 무료 인스턴스는 비활성 상태 후 첫 요청이 느릴 수 있다.
- Render 설정이 수동 배포 기준이므로 GitHub push 후 Render에서 최신 커밋을 다시 배포해야 한다.
