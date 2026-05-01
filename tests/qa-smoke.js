import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const files = [
  "index.html",
  "src/app.js",
  "src/styles.css",
  "src/data/mockAnalysis.js",
  "server.js",
  "package.json",
  "Dockerfile",
  "render.yaml",
  "docs/14_DEPLOYMENT_RUNBOOK_2026-05-01.md"
];

const requiredUiTexts = [
  "제출 전, 내 문서의 문체·출처·AI 작성 리스크를 한 번에 점검하세요",
  "리스크 점검하기",
  "문서 신뢰도 리포트",
  "작성자를 단정하지 않는 참고 지표",
  "지금 해야 할 조치 3개",
  "종합 제출 준비도",
  "인쇄용 문서 신뢰도 리포트",
  "권장 파일명",
  "서버 PDF 생성",
  "저장한 리포트를 다시 확인하세요",
  "필터 초기화",
  "보관정책과 데이터 사용 기준을 정합니다",
  "팀 문서 점검 현황을 한눈에 봅니다",
  "권한 매트릭스",
  "감사 로그",
  "문장별 분석",
  "제출 전 체크리스트",
  "검사할 문서를 입력해 주세요.",
  "리포트를 생성하지 못했습니다."
];

const restrictedTerms = [
  "AI 탐지 우회",
  "탐지기 통과",
  "통과 보장",
  "Turnitin 회피",
  "100% 사람 글",
  "AI 냄새 제거",
  "undetectable",
  "bypass",
  "humanizer",
  "detector proof",
  "AI 점수 낮추기"
];

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

const contents = new Map();

for (const file of files) {
  const content = await readFile(path.join(root, file), "utf8");
  contents.set(file, content);
  assert(content.length > 0, `${file} 파일이 비어 있습니다.`);
}

const uiBundle = [
  contents.get("index.html"),
  contents.get("src/app.js"),
  contents.get("src/data/mockAnalysis.js")
].join("\n");

for (const text of requiredUiTexts) {
  assert(uiBundle.includes(text), `필수 UI 문구가 없습니다: ${text}`);
}

for (const term of restrictedTerms) {
  assert(!uiBundle.includes(term), `UI 소스에 제한 문구가 포함되어 있습니다: ${term}`);
}

assert(contents.get("server.js").includes("index.html"), "서버 fallback이 index.html을 가리키지 않습니다.");
assert(contents.get("src/app.js").includes('navigate("/checking")'), "검사 실행 후 로딩 route 이동이 없습니다.");
assert(contents.get("src/app.js").includes('navigate("/report"'), "리포트 route 이동이 없습니다.");
assert(contents.get("src/app.js").includes('"/pdf-report"'), "PDF 리포트 route가 없습니다.");
assert(contents.get("src/app.js").includes('"/documents"'), "문서함 route가 없습니다.");
assert(contents.get("src/app.js").includes('"/settings"'), "설정 route가 없습니다.");
assert(contents.get("src/app.js").includes('"/org"'), "조직 route가 없습니다.");
assert(contents.get("server.js").includes('"/api/pdf"'), "서버 PDF 생성 API가 없습니다.");
assert(contents.get("server.js").includes('"/api/health"'), "헬스체크 API가 없습니다.");
assert(contents.get("server.js").includes('"/api/version"'), "버전 API가 없습니다.");
assert(contents.get("server.js").includes('"0.0.0.0"'), "배포 환경용 host 바인딩이 없습니다.");
assert(contents.get("src/app.js").includes("data-server-pdf"), "서버 PDF 생성 버튼이 없습니다.");
assert(contents.get("src/app.js").includes("getRetentionStatus"), "보관 기간 상태 로직이 없습니다.");
assert(contents.get("src/app.js").includes("data-purge-expired"), "만료 리포트 정리 액션이 없습니다.");
assert(contents.get("src/app.js").includes("ORG_MEMBERS"), "조직 권한 mock 데이터가 없습니다.");
assert(contents.get("src/app.js").includes("AUDIT_LOGS"), "감사 로그 mock 데이터가 없습니다.");
assert(contents.get("src/styles.css").includes("@media (max-width: 760px)"), "모바일 반응형 CSS가 없습니다.");
assert(contents.get("src/styles.css").includes("@media print"), "PDF/인쇄용 CSS가 없습니다.");
assert(contents.get("src/styles.css").includes("@page"), "PDF 페이지 설정 CSS가 없습니다.");
assert(contents.get("Dockerfile").includes("mcr.microsoft.com/playwright"), "Dockerfile이 Playwright 런타임을 사용하지 않습니다.");
assert(contents.get("render.yaml").includes("/api/health"), "Render 헬스체크 경로가 없습니다.");
assert(contents.get("render.yaml").includes("autoDeployTrigger: off"), "Render 자동 배포 설정이 명시되지 않았습니다.");
assert(contents.get("src/data/mockAnalysis.js").includes("MOCK_SCENARIO_COUNT = 12"), "mock 시나리오 풀이 8개 이상임을 확인할 수 없습니다.");
assert(contents.get("src/app.js").includes('const AXIS_ORDER = ["style", "citation", "ai", "submission"]'), "4축 카드 순서가 제니 권장 순서와 다릅니다.");

console.log("QA smoke checks passed.");
