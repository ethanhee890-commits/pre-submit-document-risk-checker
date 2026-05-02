# 제니 배포 URL 재리뷰 v2 반영 보고

- 작성일: 2026-05-02
- 기준 URL: https://pre-submit-document-risk-checker.onrender.com
- 상태: R2 QA 캡처 완료, 최신 커밋 배포 필요

## 1. 반영 요약

제니 v2 리뷰에서 요청한 리포트, PDF, 설정, 문서함, 모바일 화면 확인을 브라우저 상호작용으로 재검증했다. 일반 사용자 화면에서는 내부 검증용 표현과 금지 표현이 검출되지 않았다.

## 2. 추가 문구 정리

- QA 모드 버튼 문구를 `PDF API 테스트`로 정리했다.
- 설정의 데이터 정책 문구에서 PDF 관련 표현을 사용자 언어로 완화했다.
- 일반 PDF 화면에서는 API 테스트 버튼이 노출되지 않는다.

## 3. R2 QA 캡처

| 요청 항목 | 파일 |
|---|---|
| LAND-001 desktop | `qa-artifacts/LAND-001_r2_desktop.png` |
| LAND-001 mobile | `qa-artifacts/LAND-001_r2_mobile.png` |
| CHECK-001 desktop | `qa-artifacts/CHECK-001_r2_desktop.png` |
| CHECK-001 mobile | `qa-artifacts/CHECK-001_r2_mobile.png` |
| CHECK-EMPTY-ERROR | `qa-artifacts/CHECK-EMPTY-ERROR_r2.png` |
| CHECKING-001 | `qa-artifacts/CHECKING-001_r2.png` |
| REPORT-001 desktop | `qa-artifacts/REPORT-001_r2_desktop.png` |
| REPORT-001 mobile | `qa-artifacts/REPORT-001_r2_mobile.png` |
| REPORT-SENTENCE-DETAIL | `qa-artifacts/REPORT-SENTENCE-DETAIL_r2.png` |
| REPORT-SUGGESTION | `qa-artifacts/REPORT-SUGGESTION_r2.png` |
| REPORT-CHECKLIST | `qa-artifacts/REPORT-CHECKLIST_r2.png` |
| PDF-001 | `qa-artifacts/PDF-001_r2.png` |
| SETTINGS-001 | `qa-artifacts/SETTINGS-001_r2.png` |
| DOC-001 | `qa-artifacts/DOC-001_r2.png` |

브라우저 QA 실행 결과는 `qa-artifacts/r2-browser-qa-result.json`에 저장했다.

## 4. 문자열 점검 결과

다음 문자열을 일반 사용자 화면 기준으로 확인했다.

```text
Mock
mock
MVP
시나리오
적용 mock
오류 상태 확인
서버 PDF 생성
AI 탐지 우회
통과 보장
humanizer
bypass
AI 냄새 제거
100% 사람 글
```

결과:

- LAND desktop/mobile: 미검출
- CHECK desktop/mobile: 미검출
- CHECK empty error: 미검출
- CHECKING: 미검출
- REPORT desktop/mobile: 미검출
- REPORT sentence/detail/suggestion/checklist: 미검출
- PDF normal: 미검출
- SETTINGS: 미검출
- DOC: 미검출

내부 코드에는 샘플 데이터 생성 함수명과 파일명에 개발용 단어가 남아 있지만, 일반 사용자 화면에는 렌더링하지 않는다.

## 5. QA 결과

| 항목 | 결과 |
|---|---|
| `node --check src/app.js` | 통과 |
| `node --check server.js` | 통과 |
| `node tests/qa-smoke.js` | 통과 |
| 모바일 CHECK 가로 스크롤 | 없음 |
| 모바일 REPORT 가로 스크롤 | 없음 |
| 일반 PDF 화면의 API 테스트 버튼 숨김 | 통과 |
| QA 모드의 PDF API 테스트 버튼 노출 | 통과 |
| 일반 내비게이션의 기관용 메뉴 숨김 | 통과 |

## 6. 다음 단계

최신 커밋을 GitHub에 push한 뒤 Render Deploy Hook으로 공개 URL 배포를 갱신한다. 배포 후 공개 URL에서 동일한 문자열 검사를 다시 수행한다.

