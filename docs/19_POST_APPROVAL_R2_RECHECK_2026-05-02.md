# 제출 전 문서 리스크 점검기 — 승인 후 UX 카피/캐시 이슈 R2 재검수 보고

- 작성일: 2026-05-02
- 기준 배포 URL: https://pre-submit-document-risk-checker.onrender.com
- 관련 이슈 로그: `pre_submit_document_risk_checker_post_approval_ux_copy_cache_issue_log_r2_2026-05-02.md`
- 상태: 내부 데모 승인 유지, 제한적 외부 데모 전 재검수 산출물 보강

---

## 1. 반영 요약

제니 R2 이슈 로그에서 요구한 재검수 항목을 반영했습니다.

개선 제안 영역은 단순 지시문이 아니라 원문과 비교 가능한 대안문으로 유지되도록 QA 조건을 추가했습니다. 또한 PDF 리포트에도 개선 제안 섹션을 추가해 화면과 출력물의 기준을 맞췄습니다.

---

## 2. 주요 변경 파일

| 파일 | 변경 내용 |
|---|---|
| `src/data/mockAnalysis.js` | 지시문형 제안문을 실제 대안문으로 교체 |
| `src/app.js` | PDF 화면에 개선 제안 섹션 추가 |
| `server.js` | 서버 PDF 생성 결과에 개선 제안 섹션 추가, `/api/version`에 commit 필드 추가 |
| `src/styles.css` | PDF 개선 제안 섹션 스타일 및 인쇄 분리 방지 추가 |
| `tests/qa-smoke.js` | 제안문 QA 조건과 서버 PDF 개선 제안 섹션 확인 추가 |
| `index.html` | 정적 파일 버전 쿼리 적용 |

---

## 3. 재검수 산출물

| 항목 | 위치 |
|---|---|
| REPORT-SUGGESTION 캡처 | `qa-artifacts/POST-APPROVAL-R2-REPORT-SUGGESTION_2026-05-02.png` |
| PDF 개선 제안 영역 캡처 | `qa-artifacts/POST-APPROVAL-R2-PDF-SUGGESTION_2026-05-02.png` |
| PDF 파일 | `qa-artifacts/POST-APPROVAL-R2-PDF_QUALITY_2026-05-02.pdf` |
| PDF 텍스트 추출 결과 | `qa-artifacts/POST-APPROVAL-R2-PDF-EXTRACTED-TEXT_2026-05-02.txt` |
| 자동 QA 결과 | `qa-artifacts/post-approval-r2-qa-result_2026-05-02.json` |

---

## 4. 개선 제안문 QA 결과

| 기준 | 결과 |
|---|---|
| 원문과 대안문 비교 가능 | 통과 |
| 제안문이 문장 형태로 완결 | 통과 |
| `다시 정리해 주세요` 지시문 미노출 | 통과 |
| 빈칸 템플릿 미노출 | 통과 |
| 화면 REPORT-SUGGESTION 캡처 | 통과 |
| PDF 개선 제안 영역 반영 | 통과 |
| PDF 텍스트 추출에서 개선 제안 확인 | 통과 |

확인된 제안문 예시:

```text
저는 확인한 자료와 수정 이유를 다시 대조하며, 제 경험과 맞는 표현만 남겨 문장을 정리했습니다.
```

---

## 5. 캐시 대응 결과

| 항목 | 결과 |
|---|---|
| 정적 파일 버전 쿼리 | 적용 |
| `Cache-Control: no-store` | 적용 |
| `Pragma: no-cache` | 적용 |
| `Expires: 0` | 적용 |
| `/api/version` commit 필드 | 추가 |

---

## 6. 실행한 검증

| 검증 | 결과 |
|---|---|
| `node --check src/app.js` | 통과 |
| `node --check server.js` | 통과 |
| `node tests/qa-smoke.js` | 통과 |
| Playwright REPORT-SUGGESTION 확인 | 통과 |
| Playwright PDF 개선 제안 영역 확인 | 통과 |
| PDF 다운로드 및 텍스트 추출 | 통과 |
| A4 크기 확인 | 통과 |
| 금지어 검색 | 통과 |

---

## 7. 금지어 및 문제 문구 재검색 결과

사용자 화면과 PDF 추출 텍스트 기준 미검출:

```text
AI 탐지 우회
통과 보장
humanizer
bypass
AI 냄새 제거
100% 사람 글
다시 정리해 주세요
이 문단은 본인이 확인한 자료
```

---

## 8. 알려진 이슈 업데이트

- 실제 분석 로직은 아직 샘플 데이터 기반입니다.
- 제안문은 UX 검증용 예시이며, 실제 사용자 파일럿 전에는 허위 경험/허위 수치 생성을 막는 정책이 더 필요합니다.
- 브라우저 캐시는 서버 헤더와 버전 쿼리로 완화했지만, 사용자가 이미 열린 탭을 보고 있다면 새로고침이 필요할 수 있습니다.
- Render 무료 인스턴스 콜드 스타트는 남아 있습니다.

---

## 9. 제니 전달 결론

R2 이슈는 승인 철회 사안이 아니라 승인 후 발견된 UX 품질 보완으로 처리했습니다.

최신 재검수 기준에서는 개선 제안 화면과 PDF 모두에서 실제 비교 가능한 제안문이 확인되었고, 캐시 대응도 반영되었습니다. 제한적 외부 데모 전에는 이 문서와 산출물을 기준으로 한 번 더 화면 확인을 권장합니다.
