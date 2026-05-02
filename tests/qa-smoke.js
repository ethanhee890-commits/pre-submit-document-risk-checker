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
  "문서 리스크 점검하기",
  "문서 신뢰도 리포트",
  "작성자를 단정하지 않는 참고 지표",
  "지금 해야 할 조치 3개",
  "종합 제출 준비도",
  "인쇄용 문서 신뢰도 리포트",
  "권장 파일명",
  "PDF로 저장",
  "개선 제안",
  "PDF API 테스트",
  "저장한 리포트를 다시 확인하세요",
  "필터 초기화",
  "보관정책과 데이터 사용 기준을 정합니다",
  "기관용 데모",
  "팀 문서 점검 현황을 한눈에 봅니다",
  "권한 매트릭스",
  "감사 로그",
  "문장별 분석",
  "제출 전 체크리스트",
  "점검할 문서를 입력해 주세요.",
  "리포트를 생성하지 못했습니다.",
  "프로토타입 데모 안내",
  "현재 결과는 실제 AI 분석이 아니라 샘플 데이터 기반으로 표시됩니다.",
  "이 문서함은 현재 브라우저 기준으로 저장됩니다. 다른 기기나 브라우저와 동기화되지 않습니다.",
  "학습 데이터 사용은 현재 제공하지 않습니다."
];

const removedPublicTerms = [
  "Mock MVP",
  "한국어 문서 신뢰도 관리 MVP",
  "선택값은 리포트의 mock 시나리오에 반영됩니다.",
  "MVP에서는 모든 항목을 mock 데이터로 함께 표시합니다.",
  "현재 MVP는 브라우저 임시 저장과 mock 리포트만 사용합니다.",
  "Mock 분석 진행 중",
  "Mock 시나리오",
  "시나리오 풀",
  "적용 mock",
  "오류 상태 확인",
  "권한 정책 저장 mock",
  "문체 자연도",
  "서버 PDF 생성"
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

for (const term of removedPublicTerms) {
  assert(!uiBundle.includes(term), `일반 UI에 제거 대상 문구가 남아 있습니다: ${term}`);
}

const suggestionTexts = [...contents.get("src/data/mockAnalysis.js").matchAll(/suggestedRewrite:\s*\n\s*"([^"]+)"/g)].map(
  (match) => match[1]
);
assert(suggestionTexts.length >= 10, "개선 제안문 샘플 수가 부족합니다.");
for (const suggestion of suggestionTexts) {
  assert(!suggestion.includes("[") && !suggestion.includes("]"), `개선 제안문에 빈칸 템플릿이 남아 있습니다: ${suggestion}`);
  assert(
    !suggestion.startsWith("이 문장") && !suggestion.startsWith("이 문단") && !suggestion.startsWith("이 문서"),
    `개선 제안문이 지시문처럼 시작합니다: ${suggestion}`
  );
  assert(!suggestion.includes("해 주세요"), `개선 제안문이 실제 대안문이 아니라 지시문입니다: ${suggestion}`);
}

assert(!contents.get("index.html").includes('href="/org"'), "일반 내비게이션에 조직 메뉴가 남아 있습니다.");
assert(contents.get("src/app.js").includes("isQaMode()"), "QA 전용 화면 분기 함수가 없습니다.");
assert(contents.get("server.js").includes("index.html"), "서버 fallback이 index.html을 가리키지 않습니다.");
assert(contents.get("src/app.js").includes('navigate("/checking")'), "검사 실행 후 로딩 route 이동이 없습니다.");
assert(contents.get("src/app.js").includes('navigate("/report"'), "리포트 route 이동이 없습니다.");
assert(contents.get("src/app.js").includes('"/pdf-report"'), "PDF 리포트 route가 없습니다.");
assert(contents.get("src/app.js").includes('"/documents"'), "문서함 route가 없습니다.");
assert(contents.get("src/app.js").includes('"/settings"'), "설정 route가 없습니다.");
assert(contents.get("src/app.js").includes('"/org"'), "조직 route가 없습니다.");
assert(contents.get("server.js").includes('"/api/pdf"'), "PDF API가 없습니다.");
assert(contents.get("server.js").includes("<h2>개선 제안</h2>"), "서버 PDF에 개선 제안 섹션이 없습니다.");
assert(contents.get("server.js").includes('"/api/health"'), "헬스체크 API가 없습니다.");
assert(contents.get("server.js").includes('"/api/version"'), "버전 API가 없습니다.");
assert(contents.get("server.js").includes('"0.0.0.0"'), "배포 환경용 host 바인딩이 없습니다.");
assert(contents.get("src/app.js").includes("data-server-pdf"), "PDF API 테스트 액션이 없습니다.");
assert(contents.get("src/app.js").includes("getRetentionStatus"), "보관 기간 상태 로직이 없습니다.");
assert(contents.get("src/app.js").includes("data-purge-expired"), "만료 리포트 정리 액션이 없습니다.");
assert(contents.get("src/app.js").includes("ORG_MEMBERS"), "기관용 권한 데모 데이터가 없습니다.");
assert(contents.get("src/app.js").includes("AUDIT_LOGS"), "감사 로그 데모 데이터가 없습니다.");
assert(contents.get("src/styles.css").includes("@media (max-width: 760px)"), "모바일 반응형 CSS가 없습니다.");
assert(contents.get("src/styles.css").includes("@media print"), "PDF/인쇄용 CSS가 없습니다.");
assert(contents.get("src/styles.css").includes("@page"), "PDF 페이지 설정 CSS가 없습니다.");
assert(contents.get("Dockerfile").includes("mcr.microsoft.com/playwright"), "Dockerfile이 Playwright 런타임을 사용하지 않습니다.");
assert(contents.get("package.json").includes('"playwright": "1.56.1"'), "Docker 이미지와 맞는 Playwright 고정 버전이 없습니다.");
assert(contents.get("render.yaml").includes("/api/health"), "Render 헬스체크 경로가 없습니다.");
assert(contents.get("render.yaml").includes("autoDeployTrigger: off"), "Render 자동 배포 설정이 명시되지 않았습니다.");
assert(contents.get("src/data/mockAnalysis.js").includes("MOCK_SCENARIO_COUNT = 12"), "mock 시나리오 풀이 8개 이상임을 확인할 수 없습니다.");
assert(contents.get("src/app.js").includes('const AXIS_ORDER = ["style", "citation", "ai", "submission"]'), "4축 카드 순서가 제니 권장 순서와 다릅니다.");

console.log("QA smoke checks passed.");
