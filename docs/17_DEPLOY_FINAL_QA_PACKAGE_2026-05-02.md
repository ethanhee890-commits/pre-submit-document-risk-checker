# 배포 URL 기준 최종 QA 완료 보고

## 1. 배포 URL

https://pre-submit-document-risk-checker.onrender.com

## 2. 배포 일시

- Render 프로세스 시작 시각: 2026-05-02 13:01:16 KST
- 배포 URL QA 확인 시각: 2026-05-02 13:16:20 KST

## 3. Git commit hash 또는 변경 요약

- 배포 기능 기준 커밋: `834b64c`
- 변경 요약: 제니 R2 리뷰 기준 QA 증거 추가, PDF 관련 사용자 노출 문구 정리, 배포 URL 기준 캡처와 금지어 검사 수행

## 4. Route list

| Route | 상태 | 설명 |
|---|---|---|
| `/` | 구현 | 랜딩 |
| `/check` | 구현 | 문서 점검 입력 |
| `/check?qa=1` | 구현 | QA용 오류 화면 테스트 버튼 포함 |
| `/checking` | 구현 | 점검 로딩 |
| `/report` | 구현 | 리스크 리포트 |
| `/pdf-report` | 구현 | PDF 저장 화면 |
| `/pdf-report?qa=1` | 구현 | QA용 PDF API 테스트 버튼 포함 |
| `/documents` | 구현 | 문서함 |
| `/settings` | 구현 | 설정/데이터 정책 |
| `/org` | 구현, 숨김 | 기관용 데모 직접 URL |
| `/api/health` | 구현 | 헬스체크 |
| `/api/version` | 구현 | 버전/시작 시각 |
| `/api/pdf` | 구현 | QA용 PDF API |

## 5. 구현 화면 목록

- LAND-001 랜딩 desktop/mobile
- CHECK-001 문서 점검 입력 desktop/mobile
- CHECK-EMPTY-ERROR 빈 입력 오류
- CHECKING-001 점검 로딩
- REPORT-001 리포트 desktop/mobile
- REPORT-SENTENCE-DETAIL 문장 상세
- REPORT-SUGGESTION 개선 제안
- REPORT-CHECKLIST 제출 전 체크리스트
- PDF-001 PDF 저장 화면
- DOC-001 문서함
- SETTINGS-001 설정/데이터 정책
- ORG-001 기관용 데모 직접 URL

## 6. 미구현/제외 화면 목록

- 실제 AI 모델 분석 화면
- 계정/로그인/권한 관리 화면
- 결제/구독 화면
- 실제 DB 기반 문서 보관 화면
- 외부 인용 데이터베이스 연동 화면
- 관리자용 조직 관리 전체 플로우

## 7-17. 배포 URL 기준 QA 캡처

| 번호 | 항목 | 파일 | 배포 URL 기준 |
|---|---|---|---|
| 7 | LAND-001 desktop | `qa-artifacts/DEPLOY-LAND-001_desktop_2026-05-02.png` | `/` |
| 7 | LAND-001 mobile | `qa-artifacts/DEPLOY-LAND-001_mobile_2026-05-02.png` | `/` |
| 8 | CHECK-001 desktop | `qa-artifacts/DEPLOY-CHECK-001_desktop_2026-05-02.png` | `/check` |
| 8 | CHECK-001 mobile | `qa-artifacts/DEPLOY-CHECK-001_mobile_2026-05-02.png` | `/check` |
| 9 | CHECK-EMPTY-ERROR | `qa-artifacts/DEPLOY-CHECK-EMPTY-ERROR_2026-05-02.png` | `/check` |
| 10 | CHECKING-001 | `qa-artifacts/DEPLOY-CHECKING-001_2026-05-02.png` | `/checking` |
| 11 | REPORT-001 desktop | `qa-artifacts/DEPLOY-REPORT-001_desktop_2026-05-02.png` | `/report` |
| 11 | REPORT-001 mobile | `qa-artifacts/DEPLOY-REPORT-001_mobile_2026-05-02.png` | `/report` |
| 12 | REPORT-SENTENCE-DETAIL | `qa-artifacts/DEPLOY-REPORT-SENTENCE-DETAIL_2026-05-02.png` | `/report` |
| 13 | REPORT-SUGGESTION | `qa-artifacts/DEPLOY-REPORT-SUGGESTION_2026-05-02.png` | `/report` |
| 14 | REPORT-CHECKLIST | `qa-artifacts/DEPLOY-REPORT-CHECKLIST_2026-05-02.png` | `/report` |
| 15 | PDF-001 | `qa-artifacts/DEPLOY-PDF-001_2026-05-02.png` | `/pdf-report` |
| 16 | DOC-001 | `qa-artifacts/DEPLOY-DOC-001_2026-05-02.png` | `/documents` |
| 17 | SETTINGS-001 | `qa-artifacts/DEPLOY-SETTINGS-001_2026-05-02.png` | `/settings` |

상세 실행 로그는 `qa-artifacts/deploy-final-qa-result_2026-05-02.json`에 저장했다.

## 18. 금지어 전수 검색 결과

검사 대상 사용자 화면:

- LAND-001 desktop/mobile
- CHECK-001 desktop/mobile
- CHECK-EMPTY-ERROR
- CHECKING-001
- REPORT-001 desktop/mobile
- REPORT-SENTENCE-DETAIL
- REPORT-SUGGESTION
- REPORT-CHECKLIST
- PDF-001
- DOC-001
- SETTINGS-001

검사 문자열:

```text
Mock
mock
MVP
시나리오
적용 mock
오류 상태 확인
Mock 분석 진행 중
서버 PDF 생성
AI 탐지 우회
통과 보장
humanizer
bypass
AI 냄새 제거
100% 사람 글
```

결과: 모든 검사 대상 사용자 화면에서 미검출.

## 19. QA 통과/실패/미확인 항목

### 통과

- 배포 URL 접근: 통과
- `/`, `/check`, `/report`, `/pdf-report`, `/documents`, `/settings` 접근: 통과
- LAND desktop/mobile 캡처: 통과
- CHECK desktop/mobile 캡처: 통과
- CHECK 빈 입력 오류: 통과
- CHECKING 로딩 상태: 통과
- REPORT desktop/mobile 캡처: 통과
- 문장 상세/개선 제안/체크리스트 캡처: 통과
- PDF 화면 일반 사용자 버튼 구조: 통과
- 문서함 저장 리포트 표시: 통과
- 설정 데이터 정책 표시: 통과
- 금지어 전수 검색: 통과
- 모바일 CHECK 가로 스크롤 없음: 통과
- 모바일 REPORT 가로 스크롤 없음: 통과
- 일반 내비게이션에서 기관용 메뉴 숨김: 통과

### 실패

- 없음

### 미확인

- 실제 서버 PDF 파일 다운로드 품질은 이번 요청 범위에서는 재검증하지 않았다.
- Render 무료 인스턴스 콜드 스타트 시간은 환경 상태에 따라 달라질 수 있다.
- 실제 계정/DB/AI 모델 연동은 구현 범위 밖이다.

## 20. 알려진 이슈

- 실제 AI 분석이 아니라 샘플 데이터 기반 리스크 참고 지표다.
- 브라우저 localStorage 기반이라 다른 브라우저나 기기 간 문서함 동기화는 없다.
- PDF 기본 저장은 브라우저 인쇄 기능에 의존한다.
- Render 무료 인스턴스는 비활성 상태 뒤 첫 접속이 느릴 수 있다.

