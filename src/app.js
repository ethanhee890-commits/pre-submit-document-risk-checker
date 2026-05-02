import {
  CHECK_OPTIONS,
  DOCUMENT_TYPES,
  LEVEL_META,
  createEmptyReport,
  createMockReport,
  getDocumentType,
  splitKoreanSentences
} from "./data/mockAnalysis.js";

const MIN_LENGTH = 200;
const RECOMMENDED_LENGTH = 500;
const MAX_LENGTH = 10000;
const STORAGE_KEY = "preSubmitRiskCheckerDraft";
const REPORTS_KEY = "preSubmitRiskCheckerReports";
const SETTINGS_KEY = "preSubmitRiskCheckerSettings";

const DEFAULT_SETTINGS = {
  retention: "local-only",
  storeOriginal: false,
  trainingUse: false,
  autoDeleteDays: 7
};

const state = {
  route: window.location.pathname,
  draft: loadDraft(),
  settings: loadSettings(),
  savedReports: loadSavedReports(),
  documentsFilter: {
    query: "",
    level: "all",
    type: "all",
    status: "all"
  },
  report: null,
  selectedFindingId: null,
  loadingStep: 0,
  analysisFailed: false
};

const app = document.querySelector("[id='app']");
const toastRegion = document.querySelector("[data-toast-region]");
const navToggle = document.querySelector("[data-nav-toggle]");
const navMenu = document.querySelector("[data-nav-menu]");

const loadingSteps = [
  "문장 구조 확인 중",
  "문체 점검 기준 확인 중",
  "출처·인용 리스크 확인 중",
  "제출 안정성 리포트 생성 중"
];

const AXIS_ORDER = ["style", "citation", "ai", "submission"];

const READINESS_META = {
  low: {
    label: "기본 점검 양호",
    helper: "현재 기준에서 큰 위험 신호는 낮습니다. 제출 전 마지막 확인만 권장합니다."
  },
  medium: {
    label: "보완 권장",
    helper: "몇 가지 항목을 보완하면 제출 안정성이 더 높아집니다."
  },
  high: {
    label: "우선 확인",
    helper: "제출 전 먼저 확인해야 할 조치가 있습니다."
  }
};

const ORG_MEMBERS = [
  {
    id: "M-001",
    name: "운영 관리자",
    role: "관리자",
    access: "보관정책, 멤버, 감사 로그 관리"
  },
  {
    id: "M-002",
    name: "검토 담당자",
    role: "검토자",
    access: "리포트 열람, 코멘트, PDF 내보내기"
  },
  {
    id: "M-003",
    name: "제출 담당자",
    role: "제출자",
    access: "본인 문서 점검, 본인 리포트 열람"
  }
];

const AUDIT_LOGS = [
  {
    id: "A-001",
    actor: "운영 관리자",
    action: "보관정책을 7일 기준으로 확인",
    time: "오늘 09:20"
  },
  {
    id: "A-002",
    actor: "검토 담당자",
    action: "자소서 리포트 PDF 보기",
    time: "오늘 10:15"
  },
  {
    id: "A-003",
    actor: "시스템",
    action: "정리 대상 리포트 수 계산",
    time: "오늘 10:18"
  }
];

function loadDraft() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return {
        documentType: "resume",
        body: "",
        options: [...CHECK_OPTIONS],
        error: "",
        warning: ""
      };
    }

    return {
      documentType: "resume",
      body: "",
      options: [...CHECK_OPTIONS],
      error: "",
      warning: "",
      ...JSON.parse(stored)
    };
  } catch (error) {
    return {
      documentType: "resume",
      body: "",
      options: [...CHECK_OPTIONS],
      error: "",
      warning: ""
    };
  }
}

function saveDraft() {
  const { documentType, body, options } = state.draft;
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ documentType, body, options }));
}

function loadSettings() {
  try {
    const stored = localStorage.getItem(SETTINGS_KEY);
    return stored ? { ...DEFAULT_SETTINGS, ...JSON.parse(stored) } : { ...DEFAULT_SETTINGS };
  } catch (error) {
    return { ...DEFAULT_SETTINGS };
  }
}

function saveSettings() {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(state.settings));
}

function loadSavedReports() {
  try {
    return JSON.parse(localStorage.getItem(REPORTS_KEY) || "[]");
  } catch (error) {
    return [];
  }
}

function saveSavedReports() {
  localStorage.setItem(REPORTS_KEY, JSON.stringify(state.savedReports));
}

function getReportSavedAt(report) {
  return new Date(report.savedAt || report.meta?.createdAt || Date.now());
}

function getReportExpiry(report) {
  const savedAt = getReportSavedAt(report);
  const expiry = new Date(savedAt);
  expiry.setDate(expiry.getDate() + Number(state.settings.autoDeleteDays || DEFAULT_SETTINGS.autoDeleteDays));
  return expiry;
}

function getRetentionStatus(report) {
  const expiry = getReportExpiry(report);
  const now = new Date();
  const msLeft = expiry.getTime() - now.getTime();
  const daysLeft = Math.ceil(msLeft / 86400000);

  if (msLeft <= 0) {
    return {
      key: "expired",
      label: "보관 기간 만료",
      tone: "alert",
      helper: "정리 대상"
    };
  }

  if (daysLeft <= 2) {
    return {
      key: "soon",
      label: `${daysLeft}일 후 정리 권장`,
      tone: "watch",
      helper: `만료 예정: ${formatDateTime(expiry.toISOString())}`
    };
  }

  return {
    key: "active",
    label: `${daysLeft}일 남음`,
    tone: "good",
    helper: `만료 예정: ${formatDateTime(expiry.toISOString())}`
  };
}

function getExpiredReports() {
  return state.savedReports.filter((report) => getRetentionStatus(report).key === "expired");
}

function isQaMode() {
  return new URLSearchParams(window.location.search).get("qa") === "1";
}

function getCurrentReport() {
  if (!state.report) {
    state.report = createEmptyReport();
    state.selectedFindingId = state.report.findings[0]?.id || null;
  }

  return state.report;
}

function persistCurrentReport() {
  const report = getCurrentReport();
  const savedReport = {
    ...report,
    savedAt: new Date().toISOString(),
    originalBody: state.settings.storeOriginal ? state.draft.body : ""
  };
  const existingIndex = state.savedReports.findIndex((item) => item.id === savedReport.id);

  if (existingIndex >= 0) {
    state.savedReports[existingIndex] = savedReport;
  } else {
    state.savedReports = [savedReport, ...state.savedReports].slice(0, 12);
  }

  saveSavedReports();
  return savedReport;
}

function navigate(path, { replace = false } = {}) {
  if (window.location.pathname === path && !replace) {
    render();
    return;
  }

  if (replace) {
    window.history.replaceState({}, "", path);
  } else {
    window.history.pushState({}, "", path);
  }

  state.route = path;
  closeMobileNav();
  render();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function normalizeRoute() {
  const allowed = ["/", "/check", "/checking", "/report", "/pdf-report", "/documents", "/settings", "/org"];
  if (!allowed.includes(window.location.pathname)) {
    window.history.replaceState({}, "", "/");
    state.route = "/";
  } else {
    state.route = window.location.pathname;
  }
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function levelBadge(level) {
  const meta = LEVEL_META[level] || LEVEL_META.medium;
  return `<span class="level-badge ${meta.tone}">${meta.label}</span>`;
}

function formatDateTime(value) {
  try {
    return new Intl.DateTimeFormat("ko-KR", {
      dateStyle: "medium",
      timeStyle: "short"
    }).format(new Date(value));
  } catch (error) {
    return "날짜 정보 없음";
  }
}

function toDateStamp(value) {
  const date = new Date(value);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}${month}${day}`;
}

function createPdfFileName(report) {
  const documentLabel = report.documentLabel || "문서";
  return `문서신뢰도리포트_${documentLabel}_${toDateStamp(report.meta?.createdAt || Date.now())}.pdf`;
}

function renderAxisCards(axes) {
  return axes
    .map(
      (axis) => `
        <article class="axis-card ${LEVEL_META[axis.level].tone}">
          <div class="axis-title">
            <h2>${axis.label}</h2>
            ${levelBadge(axis.level)}
          </div>
          <p>${axis.summary}</p>
          <span class="evidence-count">${axis.evidenceCount}개 근거</span>
        </article>
      `
    )
    .join("");
}

function render() {
  normalizeRoute();
  setActiveNav();

  if (state.route === "/") {
    app.innerHTML = renderLanding();
  }

  if (state.route === "/check") {
    app.innerHTML = renderCheck();
  }

  if (state.route === "/checking") {
    app.innerHTML = renderChecking();
    runLoadingSequence();
  }

  if (state.route === "/report") {
    app.innerHTML = renderReport();
  }

  if (state.route === "/pdf-report") {
    app.innerHTML = renderPdfReport();
  }

  if (state.route === "/documents") {
    state.savedReports = loadSavedReports();
    app.innerHTML = renderDocuments();
  }

  if (state.route === "/settings") {
    app.innerHTML = renderSettings();
  }

  if (state.route === "/org") {
    app.innerHTML = renderOrg();
  }

  bindRouteEvents();
  app.focus({ preventScroll: true });
}

function renderLanding() {
  const featureCards = [
    {
      title: "문체가 자연스럽게 읽히는지 확인",
      text: "반복 구조, 과도하게 정돈된 문장, 어색한 한국어 표현을 점검합니다.",
      icon: "가"
    },
    {
      title: "AI 작성 리스크 신호 확인",
      text: "작성자를 단정하지 않고, 추가 검토가 필요한 문장 패턴을 보여줍니다.",
      icon: "신"
    },
    {
      title: "근거가 필요한 문장 확인",
      text: "주장과 수치, 인용이 필요한 문장에 출처 보완을 안내합니다.",
      icon: "근"
    },
    {
      title: "제출 전 체크리스트 제공",
      text: "문서 목적, 길이, 일관성, 수정 여부를 최종 확인할 수 있습니다.",
      icon: "체"
    }
  ];

  const cases = [
    "자소서 제출 전 경험의 구체성 점검",
    "리포트 제출 전 출처·인용 보완 확인",
    "블로그 원고의 반복 표현과 흐름 검토",
    "업무문서의 다음 행동과 일정 명확화"
  ];

  return `
    <section class="hero-section">
      <div class="hero-copy">
        <p class="eyebrow">한국어 문서 신뢰도 관리</p>
        <h1>제출 전, 내 문서의 문체·출처·AI 작성 리스크를 한 번에 점검하세요</h1>
        <p class="hero-subtitle">
          결과는 작성자를 단정하지 않습니다. 문서의 문체, 근거, 출처, 작성 패턴에서 추가 검토가 필요한 부분을 알려드립니다.
        </p>
        <div class="hero-actions">
          <a class="button primary" href="/check" data-link>문서 점검 시작하기</a>
          <a class="button ghost" href="#features" data-scroll>점검 항목 보기</a>
        </div>
      </div>
      <div class="hero-visual" aria-label="문서 리스크 리포트 미리보기">
        <div class="report-preview">
          <div class="preview-topline">
            <span>문서 신뢰도 리포트</span>
            <strong>보완 권장</strong>
          </div>
          <div class="preview-bars">
            <span style="--bar: 58%"></span>
            <span style="--bar: 48%"></span>
            <span style="--bar: 72%"></span>
            <span style="--bar: 62%"></span>
          </div>
          <div class="preview-paper">
            <mark>구체적 경험 보완 필요</mark>
            <p>문장별 근거와 개선 방향을 함께 확인합니다.</p>
            <div class="preview-checks">
              <span></span><span></span><span></span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section-block compact" id="features">
      <div class="section-heading">
        <p class="eyebrow">4대 점검 항목</p>
        <h2>단일 수치보다, 제출 전 확인할 근거를 보여드립니다</h2>
      </div>
      <div class="feature-grid">
        ${featureCards
          .map(
            (card) => `
              <article class="feature-card">
                <span class="feature-icon">${card.icon}</span>
                <h3>${card.title}</h3>
                <p>${card.text}</p>
              </article>
            `
          )
          .join("")}
      </div>
    </section>

    <section class="section-block split" id="cases">
      <div class="section-heading">
        <p class="eyebrow">사용 사례</p>
        <h2>제출 맥락에 맞게 문서 유형을 선택합니다</h2>
        <p>자소서, 리포트, 블로그, 업무문서처럼 제출 목적이 다른 글을 같은 방식으로 단정하지 않습니다.</p>
      </div>
      <div class="case-list">
        ${cases.map((item) => `<div class="case-item"><span aria-hidden="true">✓</span>${item}</div>`).join("")}
      </div>
    </section>

    <section class="section-block safety" id="principles">
      <div>
        <p class="eyebrow">안전한 사용 원칙</p>
        <h2>작성자를 단정하지 않는 참고 지표로 제공합니다</h2>
        <p>
          리포트는 문체와 문서 패턴을 바탕으로 제출 전 검토가 필요한 신호를 보여줍니다.
          최종 판단이나 불이익의 단독 근거로 사용해서는 안 됩니다.
        </p>
      </div>
      <a class="button primary" href="/check" data-link>문서 점검 시작하기</a>
    </section>
  `;
}

function renderCheck() {
  const characterCount = state.draft.body.trim().length;
  const sentenceCount = splitKoreanSentences(state.draft.body).length;
  const countState = characterCount > MAX_LENGTH ? "error" : characterCount < MIN_LENGTH && characterCount > 0 ? "warning" : "normal";

  return `
    <section class="page-heading check-heading">
      <p class="eyebrow">문서 점검 시작</p>
      <h1 class="balanced-title" aria-label="점검할 문서를 붙여넣고 기준을 선택하세요">
        <span>점검할 문서를 붙여넣고</span>
        <span>기준을 선택하세요</span>
      </h1>
      <p class="split-helper">
        <span>결과는 작성 방식을 단정하지 않고,</span>
        <span>제출 전 확인이 필요한 부분을 알려드립니다.</span>
      </p>
    </section>

    <section class="check-layout">
      <form class="input-panel" data-check-form novalidate>
        <div class="field-block">
          <div class="field-title">
            <h2>문서 유형</h2>
            <p>선택한 문서 유형에 맞춰 점검 기준과 안내 문구가 달라집니다.</p>
          </div>
          <div class="document-type-grid" role="radiogroup" aria-label="문서 유형">
            ${DOCUMENT_TYPES.map((type) => renderDocumentTypeCard(type)).join("")}
          </div>
        </div>

        <div class="field-block">
          <div class="field-title inline">
            <div>
              <h2>본문 입력</h2>
              <p>최소 ${MIN_LENGTH.toLocaleString("ko-KR")}자 이상 입력하면 리포트의 신뢰도가 더 안정적입니다.</p>
            </div>
            <button class="text-button" type="button" data-fill-sample>예시 입력</button>
          </div>
          <textarea
            class="document-input"
            name="body"
            data-document-body
            maxlength="${MAX_LENGTH + 500}"
            placeholder="점검할 한국어 문서를 여기에 붙여넣어 주세요."
            aria-describedby="body-helper body-error"
          >${escapeHtml(state.draft.body)}</textarea>
          <div class="input-meta ${countState}" id="body-helper">
            <span>${characterCount.toLocaleString("ko-KR")} / ${MAX_LENGTH.toLocaleString("ko-KR")}자</span>
            <span>${sentenceCount.toLocaleString("ko-KR")}개 문장 감지</span>
            <span>${characterCount >= RECOMMENDED_LENGTH ? "권장 길이 충족" : "500자 이상 권장"}</span>
          </div>
          ${state.draft.error ? `<p class="inline-message error" id="body-error">${state.draft.error}</p>` : ""}
          ${state.draft.warning ? `<p class="inline-message warning">${state.draft.warning}</p>` : ""}
        </div>

        <div class="field-block">
          <div class="field-title">
            <h2>점검 항목</h2>
            <p>현재는 네 가지 항목을 함께 점검합니다.</p>
          </div>
          <div class="option-grid">
            ${CHECK_OPTIONS.map(
              (option) => `
                <label class="check-chip">
                  <input type="checkbox" checked disabled />
                  <span>${option}</span>
                </label>
              `
            ).join("")}
          </div>
        </div>

        <div class="form-actions check-actions">
          <button class="button primary" type="submit">문서 리스크 점검하기</button>
          ${isQaMode() ? `<button class="button secondary" type="button" data-show-error-state>오류 화면 테스트</button>` : ""}
        </div>
      </form>

      <aside class="guide-panel check-guide" aria-label="점검 전 확인사항">
        <div class="check-guide-header">
          <span class="guide-kicker">입력 전 점검</span>
          <h2>점검 전 확인사항</h2>
          <p>본문을 넣기 전에 아래 기준만 확인하면 됩니다.</p>
        </div>
        <ul class="check-guide-list">
          <li>
            <span aria-hidden="true">01</span>
            <div>
              <strong>본문을 먼저 붙여넣기</strong>
              <p>비어 있으면 점검 버튼 아래에 입력 안내가 표시됩니다.</p>
            </div>
          </li>
          <li>
            <span aria-hidden="true">02</span>
            <div>
              <strong>결과는 참고 지표로 보기</strong>
              <p>짧은 문서는 분석 신뢰도가 낮을 수 있습니다.</p>
            </div>
          </li>
          <li>
            <span aria-hidden="true">03</span>
            <div>
              <strong>원문 보관 범위 확인</strong>
              <p>입력한 문서는 현재 브라우저에 임시로만 보관됩니다.</p>
            </div>
          </li>
        </ul>
      </aside>
    </section>
  `;
}

function renderDocumentTypeCard(type) {
  const selected = state.draft.documentType === type.id;

  return `
    <label class="document-type-card ${selected ? "selected" : ""}">
      <input type="radio" name="documentType" value="${type.id}" ${selected ? "checked" : ""} />
      <strong>${type.label}</strong>
      <span>${type.description}</span>
    </label>
  `;
}

function renderChecking() {
  return `
    <section class="loading-page">
      <div class="loading-card" aria-live="polite">
        <div class="spinner" aria-hidden="true"></div>
        <p class="eyebrow">문서 점검 진행 중</p>
        <h1>문서 리스크 신호를 정리하고 있습니다</h1>
        <ol class="loading-steps">
          ${loadingSteps
            .map(
              (step, index) => `
                <li class="${index <= state.loadingStep ? "active" : ""}">
                  <span>${index + 1}</span>
                  ${step}
                </li>
              `
            )
            .join("")}
        </ol>
      </div>
    </section>
  `;
}

function renderReport() {
  if (state.analysisFailed) {
    return renderErrorState();
  }

  const report = state.report || createEmptyReport();
  const selectedFinding = report.findings.find((finding) => finding.id === state.selectedFindingId) || report.findings[0];
  const completed = report.checklist.filter((item) => item.checked).length;
  const checklistPercent = Math.round((completed / report.checklist.length) * 100);
  const documentType = getDocumentType(report.documentType);
  const orderedAxes = [...report.axes].sort((a, b) => AXIS_ORDER.indexOf(a.id) - AXIS_ORDER.indexOf(b.id));
  const readiness = READINESS_META[report.overallLevel] || READINESS_META.medium;

  return `
    <section class="report-header">
      <div>
        <p class="eyebrow">문서 신뢰도 리포트 · ${documentType.label}</p>
        <h1>${report.title}</h1>
        <p>${report.summary}</p>
      </div>
      <div class="report-actions">
        <button class="button secondary" type="button" data-save-report>리포트 저장</button>
        <button class="button secondary" type="button" data-open-pdf-report>PDF 리포트</button>
        <button class="button primary" type="button" data-recheck>다시 점검하기</button>
      </div>
    </section>

    <section class="notice-panel" aria-label="결과 안내">
      <strong>작성자를 단정하지 않는 참고 지표입니다.</strong>
      <p>${report.disclaimer}</p>
    </section>

    ${
      report.meta.isShortText
        ? `<section class="notice-panel warning-notice" aria-label="짧은 글 안내">
            <strong>짧은 문서는 분석 신뢰도가 낮을 수 있습니다.</strong>
            <p>본문 길이와 문장 수가 부족하면 결과가 불안정할 수 있으므로, 문서 목적과 근거를 보완한 뒤 다시 점검해 주세요.</p>
          </section>`
        : ""
    }

    ${
      report.privacyNotice
        ? `<section class="notice-panel privacy-notice" aria-label="개인정보 안내">
            <strong>민감정보 포함 여부를 먼저 확인해 주세요.</strong>
            <p>${report.privacyNotice}</p>
          </section>`
        : ""
    }

    <section class="action-summary" aria-label="지금 해야 할 조치">
      <div>
        <p class="eyebrow">제출 전 조치</p>
        <h2>지금 해야 할 조치 3개</h2>
        <p>결과 해석보다 먼저 확인하면 좋은 보완 항목입니다.</p>
      </div>
      <ol>
        ${report.actionItems.map((item) => `<li>${item}</li>`).join("")}
      </ol>
    </section>

    <section class="summary-grid" id="summary">
      <article class="overall-card ${LEVEL_META[report.overallLevel].tone}">
        <span class="card-label">종합 제출 준비도</span>
        <strong>${readiness.label}</strong>
        <p>${readiness.helper}</p>
        <dl>
          <div><dt>글자 수</dt><dd>${report.meta.characterCount.toLocaleString("ko-KR")}자</dd></div>
          <div><dt>문장 수</dt><dd>${report.meta.sentenceCount.toLocaleString("ko-KR")}개</dd></div>
          <div><dt>문서 유형</dt><dd>${report.documentLabel}</dd></div>
          <div><dt>점검 항목</dt><dd>${report.axes.length.toLocaleString("ko-KR")}개</dd></div>
        </dl>
      </article>
      <div class="axis-grid">
        ${renderAxisCards(orderedAxes)}
      </div>
    </section>

    <section class="report-tabs" aria-label="리포트 섹션 바로가기">
      <a href="#sentence-analysis" data-scroll>문장별 분석</a>
      <a href="#improvements" data-scroll>개선 제안</a>
      <a href="#checklist" data-scroll>체크리스트</a>
    </section>

    <section class="analysis-layout" id="sentence-analysis">
      <div class="highlight-panel">
        <div class="section-heading small">
          <p class="eyebrow">문장별 분석</p>
          <h2>추가 검토가 필요한 문장</h2>
        </div>
        <div class="finding-list">
          ${report.findings
            .map(
              (finding) => `
                <button class="finding-card ${finding.id === selectedFinding.id ? "selected" : ""}" type="button" data-select-finding="${finding.id}">
                  <span class="finding-topline">
                    ${levelBadge(finding.level)}
                    <span>${finding.labels.map((label) => `<b>${label}</b>`).join("")}</span>
                  </span>
                  <mark>${escapeHtml(finding.text)}</mark>
                </button>
              `
            )
            .join("")}
        </div>
      </div>

      <aside class="detail-panel" aria-label="선택 문장 상세">
        <div class="section-heading small">
          <p class="eyebrow">근거 패널</p>
          <h2>선택 문장 상세</h2>
        </div>
        <blockquote>${escapeHtml(selectedFinding.text)}</blockquote>
        <dl class="detail-list">
          <div>
            <dt>위험 유형</dt>
            <dd>${selectedFinding.labels.join(", ")}</dd>
          </div>
          <div>
            <dt>검토 수준</dt>
            <dd>${levelBadge(selectedFinding.level)}</dd>
          </div>
          <div>
            <dt>근거 설명</dt>
            <dd>${selectedFinding.reason}</dd>
          </div>
          <div>
            <dt>권장 조치</dt>
            <dd>${selectedFinding.recommendation}</dd>
          </div>
        </dl>
        <a class="button secondary full" href="#improvements" data-scroll>개선 제안 보기</a>
      </aside>
    </section>

    <section class="improvement-section" id="improvements">
      <div class="section-heading small">
        <p class="eyebrow">문체·명확성 개선 제안</p>
        <h2>원문과 제안문을 비교하세요</h2>
      </div>
      <div class="compare-grid">
        <article class="compare-card">
          <span class="card-label">원문</span>
          <p>${escapeHtml(selectedFinding.text)}</p>
        </article>
        <article class="compare-card suggested">
          <span class="card-label">제안문</span>
          <p>${selectedFinding.suggestedRewrite || "이 문장은 현재 별도 제안문이 없습니다. 문서 목적에 맞게 직접 검토해 주세요."}</p>
          <div class="compare-actions">
            <button class="button primary" type="button" data-copy-suggestion="${selectedFinding.id}">제안문 복사</button>
          </div>
        </article>
      </div>
    </section>

    <section class="checklist-section" id="checklist">
      <div class="section-heading small">
        <p class="eyebrow">제출 전 체크리스트</p>
        <h2>최종 확인 항목</h2>
      </div>
      <div class="progress-box">
        <div>
          <strong>${completed} / ${report.checklist.length} 완료</strong>
          <p>체크 상태는 현재 화면에서만 관리됩니다.</p>
        </div>
        <div class="progress-track" aria-label="체크리스트 완료율 ${checklistPercent}%">
          <span style="width: ${checklistPercent}%"></span>
        </div>
      </div>
      <div class="checklist-items">
        ${report.checklist
          .map(
            (item) => `
              <label class="checklist-item">
                <input type="checkbox" data-checklist-id="${item.id}" ${item.checked ? "checked" : ""} />
                <span>${item.label}</span>
              </label>
            `
          )
          .join("")}
      </div>
    </section>
  `;
}

function renderErrorState() {
  return `
    <section class="error-page">
      <div class="error-card">
        <p class="eyebrow">점검 오류</p>
        <h1>리포트를 생성하지 못했습니다.</h1>
        <p>점검 중 문제가 발생했습니다. 입력 화면으로 돌아가 다시 시도해 주세요.</p>
        <div class="hero-actions">
          <button class="button primary" type="button" data-retry-analysis>다시 시도</button>
          <button class="button secondary" type="button" data-recheck>입력 화면으로 이동</button>
        </div>
      </div>
    </section>
  `;
}

function renderPdfReport() {
  const report = getCurrentReport();
  const orderedAxes = [...report.axes].sort((a, b) => AXIS_ORDER.indexOf(a.id) - AXIS_ORDER.indexOf(b.id));
  const readiness = READINESS_META[report.overallLevel] || READINESS_META.medium;
  const generatedAt = formatDateTime(report.meta.createdAt);
  const fileName = createPdfFileName(report);
  const qaMode = isQaMode();

  return `
    <section class="pdf-toolbar">
      <div>
        <p class="eyebrow">PDF 리포트</p>
        <h1>인쇄용 문서 신뢰도 리포트</h1>
        <p>기본 저장은 현재 브라우저의 인쇄 기능으로 동작합니다. 저장 전 리포트 내용과 파일명을 확인해 주세요.</p>
        <div class="filename-box">
          <span>권장 파일명</span>
          <code>${fileName}</code>
          <button class="text-button" type="button" data-copy-pdf-name="${fileName}">파일명 복사</button>
        </div>
      </div>
      <div class="report-actions">
        <button class="button secondary" type="button" data-link-button="/report">리포트로 돌아가기</button>
        ${qaMode ? `<button class="button secondary" type="button" data-server-pdf>서버 PDF 생성 테스트</button>` : ""}
        <button class="button secondary" type="button" data-print-report>브라우저 인쇄로 저장</button>
        <button class="button primary" type="button" data-print-report>PDF로 저장</button>
      </div>
    </section>

    <article class="pdf-sheet" aria-label="인쇄용 리포트">
      <header class="pdf-header">
        <div>
          <span class="card-label">제출 전 문서 리스크 점검기</span>
          <h2>${report.title}</h2>
          <p>${report.documentLabel} · ${generatedAt}</p>
        </div>
        <strong>${readiness.label}</strong>
      </header>

      <section class="pdf-notice">
        <strong>작성자를 단정하지 않는 참고 지표입니다.</strong>
        <p>${report.disclaimer}</p>
      </section>

      <section class="pdf-section">
        <h3>지금 해야 할 조치 3개</h3>
        <ol class="pdf-action-list">
          ${report.actionItems.map((item) => `<li>${item}</li>`).join("")}
        </ol>
      </section>

      <section class="pdf-section">
        <h3>4축 리스크 요약</h3>
        <div class="pdf-axis-grid">
          ${renderAxisCards(orderedAxes)}
        </div>
      </section>

      <section class="pdf-section">
        <h3>문장별 주요 근거</h3>
        <div class="pdf-finding-list">
          ${report.findings
            .map(
              (finding) => `
                <div class="pdf-finding">
                  <div>${levelBadge(finding.level)} ${finding.labels.map((label) => `<b>${label}</b>`).join("")}</div>
                  <p>${escapeHtml(finding.text)}</p>
                  <small>${finding.reason}</small>
                </div>
              `
            )
            .join("")}
        </div>
      </section>

      <section class="pdf-section">
        <h3>제출 전 체크리스트</h3>
        <ul class="pdf-checklist">
          ${report.checklist.map((item) => `<li>${item.label}</li>`).join("")}
        </ul>
      </section>

      <footer class="pdf-footer">
        <span>이 리포트는 작성자를 단정하지 않는 참고 지표입니다.</span>
        <span>${fileName}</span>
      </footer>
    </article>
  `;
}

function renderDocuments() {
  const reports = state.savedReports;
  const expiredReports = getExpiredReports();
  const filteredReports = reports.filter((report) => {
    const query = state.documentsFilter.query.trim().toLowerCase();
    const status = getRetentionStatus(report);
    const matchesQuery =
      !query ||
      [report.title, report.summary, report.documentLabel]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query));
    const matchesLevel = state.documentsFilter.level === "all" || report.overallLevel === state.documentsFilter.level;
    const matchesType = state.documentsFilter.type === "all" || report.documentType === state.documentsFilter.type;
    const matchesStatus = state.documentsFilter.status === "all" || status.key === state.documentsFilter.status;

    return matchesQuery && matchesLevel && matchesType && matchesStatus;
  });

  return `
    <section class="page-heading">
      <p class="eyebrow">문서함</p>
      <h1>저장한 리포트를 다시 확인하세요</h1>
      <p>문서함은 현재 브라우저에만 임시 저장됩니다. 원문 저장 여부는 설정에서 선택할 수 있습니다.</p>
    </section>

    <section class="document-tools" aria-label="문서함 검색과 필터">
      <label class="search-field">
        <span>검색</span>
        <input type="search" value="${escapeHtml(state.documentsFilter.query)}" placeholder="제목, 요약, 문서 유형 검색" data-doc-query />
      </label>
      <label>
        <span>리스크</span>
        <select data-doc-level>
          ${[
            ["all", "전체"],
            ["low", LEVEL_META.low.label],
            ["medium", LEVEL_META.medium.label],
            ["high", LEVEL_META.high.label]
          ]
            .map(([value, label]) => `<option value="${value}" ${state.documentsFilter.level === value ? "selected" : ""}>${label}</option>`)
            .join("")}
        </select>
      </label>
      <label>
        <span>문서 유형</span>
        <select data-doc-type>
          <option value="all" ${state.documentsFilter.type === "all" ? "selected" : ""}>전체</option>
          ${DOCUMENT_TYPES.map(
            (type) => `<option value="${type.id}" ${state.documentsFilter.type === type.id ? "selected" : ""}>${type.label}</option>`
          ).join("")}
        </select>
      </label>
      <label>
        <span>보관 상태</span>
        <select data-doc-status>
          ${[
            ["all", "전체"],
            ["active", "보관 중"],
            ["soon", "만료 예정"],
            ["expired", "정리 대상"]
          ]
            .map(([value, label]) => `<option value="${value}" ${state.documentsFilter.status === value ? "selected" : ""}>${label}</option>`)
            .join("")}
        </select>
      </label>
      <button class="button secondary" type="button" data-reset-doc-filters>필터 초기화</button>
      <button class="button danger" type="button" data-purge-expired ${expiredReports.length ? "" : "disabled"}>만료 리포트 정리</button>
    </section>

    <section class="document-summary" aria-label="문서함 요약">
      <div><strong>${reports.length}</strong><span>전체 저장 리포트</span></div>
      <div><strong>${filteredReports.length}</strong><span>현재 표시</span></div>
      <div><strong>${expiredReports.length}</strong><span>정리 대상</span></div>
      <div><strong>${state.settings.autoDeleteDays}일</strong><span>보관 기준</span></div>
    </section>

    ${
      reports.length === 0
        ? `<section class="empty-documents">
            <span class="empty-icon" aria-hidden="true">문</span>
            <h2>저장한 리포트가 없습니다</h2>
            <p>리포트 화면에서 리포트 저장을 누르면 이곳에서 다시 확인할 수 있습니다.</p>
            <a class="button primary" href="/check" data-link>문서 점검 시작하기</a>
          </section>`
        : filteredReports.length === 0
          ? `<section class="empty-documents">
              <span class="empty-icon" aria-hidden="true">필</span>
              <h2>필터 조건에 맞는 리포트가 없습니다</h2>
              <p>검색어 또는 필터를 초기화해 다시 확인해 주세요.</p>
              <button class="button secondary" type="button" data-reset-doc-filters>필터 초기화</button>
            </section>`
          : `<section class="document-list">
            ${filteredReports
              .map(
                (report) => {
                  const status = getRetentionStatus(report);
                  return `
                  <article class="document-card">
                    <div>
                      <span class="card-label">${report.documentLabel}</span>
                      <span class="level-badge ${status.tone}">${status.label}</span>
                      <h2>${report.title}</h2>
                      <p>${report.summary}</p>
                      <small>저장일: ${formatDateTime(report.savedAt || report.meta.createdAt)} · ${report.documentLabel} · ${status.helper}</small>
                    </div>
                    <div class="document-actions">
                      <button class="button secondary" type="button" data-open-saved-report="${report.id}">리포트 보기</button>
                      <button class="button secondary" type="button" data-open-saved-pdf="${report.id}">PDF 보기</button>
                      <button class="button danger" type="button" data-delete-report="${report.id}">삭제</button>
                    </div>
                  </article>
                `;
                }
              )
              .join("")}
          </section>`
    }
  `;
}

function renderSettings() {
  return `
    <section class="page-heading">
      <p class="eyebrow">기본 설정</p>
      <h1>보관정책과 데이터 사용 기준을 정합니다</h1>
      <p>현재 설정은 이 브라우저에만 저장됩니다. 정식 서비스에서는 계정별 정책과 삭제 기능이 필요합니다.</p>
    </section>

    <section class="settings-layout">
      <form class="settings-panel" data-settings-form>
        <div class="field-block">
          <div class="field-title">
            <h2>원문 보관 방식</h2>
            <p>기본값은 리포트만 저장하고 원문은 저장하지 않는 방식입니다.</p>
          </div>
          <div class="settings-options" role="radiogroup" aria-label="원문 보관 방식">
            ${[
              ["local-only", "브라우저 임시 보관", "리포트와 설정만 현재 브라우저에 보관합니다."],
              ["no-original", "원문 미보관", "리포트 저장 시 원문 본문을 함께 저장하지 않습니다."],
              ["review-copy", "검토용 원문 보관", "사용자가 선택한 경우에만 리포트와 원문을 함께 보관합니다."]
            ]
              .map(
                ([value, label, description]) => `
                  <label class="settings-option ${state.settings.retention === value ? "selected" : ""}">
                    <input type="radio" name="retention" value="${value}" ${state.settings.retention === value ? "checked" : ""} />
                    <strong>${label}</strong>
                    <span>${description}</span>
                  </label>
                `
              )
              .join("")}
          </div>
        </div>

        <label class="settings-toggle">
          <input type="checkbox" name="storeOriginal" ${state.settings.storeOriginal ? "checked" : ""} />
          <span>
            <strong>리포트 저장 시 원문도 함께 보관</strong>
            <small>민감정보가 있을 수 있으므로 기본값은 꺼져 있습니다.</small>
          </span>
        </label>

        <label class="settings-toggle">
          <input type="checkbox" name="trainingUse" ${state.settings.trainingUse ? "checked" : ""} disabled />
          <span>
            <strong>학습 데이터 사용</strong>
            <small>현재 제공하지 않는 옵션입니다.</small>
          </span>
        </label>

        <div class="field-block">
          <div class="field-title">
            <h2>자동 삭제 기준</h2>
            <p>정식 서비스 정책 설계를 위한 표시 설정입니다.</p>
          </div>
          <input class="number-input" type="number" name="autoDeleteDays" min="1" max="30" value="${state.settings.autoDeleteDays}" />
        </div>

        <div class="form-actions">
          <button class="button primary" type="submit">설정 저장</button>
          <button class="button secondary" type="button" data-reset-settings>기본값 복원</button>
        </div>
      </form>

      <aside class="guide-panel">
        <div class="policy-note">
          <h3>데이터 정책 기준</h3>
          <p>기본 점검과 임시 저장은 현재 브라우저 기준으로 동작합니다. 서버 PDF 생성을 사용하는 경우 리포트 출력에 필요한 데이터가 PDF 생성을 위해 일시적으로 전송될 수 있습니다.</p>
        </div>
        <div class="quality-list">
          <h3>다음 구현 전 확인</h3>
          <ul>
            <li>원문 보관 기간</li>
            <li>삭제 요청 처리</li>
            <li>조직 관리자 접근 권한</li>
          </ul>
        </div>
      </aside>
    </section>
  `;
}

function renderOrg() {
  const reports = state.savedReports;
  const highCount = reports.filter((report) => report.overallLevel === "high").length;
  const citationCount = reports.reduce((sum, report) => {
    const axis = report.axes?.find((item) => item.id === "citation");
    return sum + (axis?.evidenceCount || 0);
  }, 0);
  const expiredCount = getExpiredReports().length;

  return `
    <section class="page-heading">
      <p class="eyebrow">기관용 데모</p>
      <h1>팀 문서 점검 현황을 한눈에 봅니다</h1>
      <p>기관이나 팀 단위 검토 흐름을 확인하기 위한 별도 데모입니다. 현재는 이 브라우저에 저장된 리포트를 기준으로 예시 지표를 표시합니다.</p>
    </section>

    <section class="org-metrics" aria-label="조직 요약 지표">
      <article class="metric-card">
        <span class="card-label">저장 리포트</span>
        <strong>${reports.length}</strong>
        <p>현재 브라우저 문서함 기준</p>
      </article>
      <article class="metric-card">
        <span class="card-label">우선 확인</span>
        <strong>${highCount}</strong>
        <p>종합 리포트에서 먼저 볼 항목</p>
      </article>
      <article class="metric-card">
        <span class="card-label">출처 근거</span>
        <strong>${citationCount}</strong>
        <p>출처·인용 검토 근거 합계</p>
      </article>
      <article class="metric-card">
        <span class="card-label">정리 대상</span>
        <strong>${expiredCount}</strong>
        <p>보관 기준을 지난 리포트</p>
      </article>
    </section>

    <section class="org-layout">
      <article class="org-panel">
        <div class="section-heading small">
          <p class="eyebrow">팀 문서함</p>
          <h2>최근 점검 리포트</h2>
        </div>
        ${
          reports.length
            ? `<div class="org-report-list">
                ${reports
                  .slice(0, 5)
                  .map(
                    (report) => `
                      <div>
                        <strong>${report.title}</strong>
                        <span>${report.documentLabel} · ${formatDateTime(report.savedAt || report.meta.createdAt)}</span>
                      </div>
                    `
                  )
                  .join("")}
              </div>`
            : `<p class="muted-text">아직 저장된 리포트가 없습니다. 먼저 개인 리포트를 저장하면 조직 화면의 지표가 채워집니다.</p>`
        }
      </article>

      <article class="org-panel">
        <div class="section-heading small">
          <p class="eyebrow">보관 정책</p>
          <h2>파일럿 전 필요한 권한 기준</h2>
        </div>
        <ul class="policy-bullets">
          <li>관리자와 검토자 권한 분리</li>
          <li>원문 보관 기간 조직별 선택</li>
          <li>삭제 요청과 감사 로그 제공</li>
          <li>공유 리포트의 열람 범위 제한</li>
        </ul>
      </article>
    </section>

    <section class="org-layout lower">
      <article class="org-panel">
        <div class="section-heading small">
          <p class="eyebrow">권한 매트릭스</p>
          <h2>역할별 접근 범위</h2>
        </div>
        <div class="permission-table" role="table" aria-label="역할별 접근 범위">
          <div role="row" class="permission-row head">
            <span role="columnheader">역할</span>
            <span role="columnheader">사용자</span>
            <span role="columnheader">접근 범위</span>
          </div>
          ${ORG_MEMBERS.map(
            (member) => `
              <div role="row" class="permission-row">
                <span role="cell">${member.role}</span>
                <strong role="cell">${member.name}</strong>
                <span role="cell">${member.access}</span>
              </div>
            `
          ).join("")}
        </div>
        <div class="form-actions">
          <button class="button secondary" type="button" data-org-policy-save>권한 정책 저장</button>
        </div>
      </article>

      <article class="org-panel">
        <div class="section-heading small">
          <p class="eyebrow">감사 로그</p>
          <h2>최근 보안 이벤트</h2>
        </div>
        <div class="audit-list">
          ${AUDIT_LOGS.map(
            (log) => `
              <div>
                <strong>${log.actor}</strong>
                <span>${log.action}</span>
                <small>${log.time}</small>
              </div>
            `
          ).join("")}
        </div>
      </article>
    </section>
  `;
}

function runLoadingSequence() {
  if (state.loadingTimer) {
    clearInterval(state.loadingTimer);
  }

  state.loadingStep = 0;
  let current = 0;

  state.loadingTimer = setInterval(() => {
    current += 1;
    state.loadingStep = Math.min(current, loadingSteps.length - 1);

    if (current < loadingSteps.length) {
      app.innerHTML = renderChecking();
      bindRouteEvents();
      return;
    }

    clearInterval(state.loadingTimer);
    state.loadingTimer = null;
    state.report = createMockReport({
      documentType: state.draft.documentType,
      body: state.draft.body
    });
    state.selectedFindingId = state.report.findings[0]?.id || null;
    state.analysisFailed = false;
    navigate("/report", { replace: true });
  }, 420);
}

function validateDraft() {
  const body = state.draft.body.trim();
  state.draft.error = "";
  state.draft.warning = "";

  if (!body) {
    state.draft.error = "점검할 문서를 입력해 주세요.";
    return false;
  }

  if (body.length > MAX_LENGTH) {
    state.draft.error = "한 번에 점검할 수 있는 글자 수를 초과했습니다.";
    return false;
  }

  if (body.length < MIN_LENGTH) {
    state.draft.warning = "짧은 문서는 분석 신뢰도가 낮을 수 있습니다. 결과를 참고 지표로만 활용해 주세요.";
  }

  return true;
}

function updateInputStatus(body) {
  const characterCount = body.trim().length;
  const sentenceCount = splitKoreanSentences(body).length;
  const countState = characterCount > MAX_LENGTH ? "error" : characterCount < MIN_LENGTH && characterCount > 0 ? "warning" : "normal";
  const inputMeta = document.querySelector(".input-meta");
  const bodyError = document.querySelector("#body-error");
  const warningMessage = document.querySelector(".inline-message.warning");

  if (inputMeta) {
    inputMeta.className = `input-meta ${countState}`;
    inputMeta.innerHTML = `
      <span>${characterCount.toLocaleString("ko-KR")} / ${MAX_LENGTH.toLocaleString("ko-KR")}자</span>
      <span>${sentenceCount.toLocaleString("ko-KR")}개 문장 감지</span>
      <span>${characterCount >= RECOMMENDED_LENGTH ? "권장 길이 충족" : "500자 이상 권장"}</span>
    `;
  }

  bodyError?.remove();
  warningMessage?.remove();
}

function startAnalysis() {
  if (!validateDraft()) {
    saveDraft();
    render();
    return;
  }

  saveDraft();
  state.analysisFailed = false;
  navigate("/checking");
}

function showToast(message, tone = "info") {
  const toast = document.createElement("div");
  toast.className = `toast ${tone}`;
  toast.textContent = message;
  toastRegion.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("leaving");
    setTimeout(() => toast.remove(), 240);
  }, 2800);
}

async function copyTextToClipboard(text) {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      // Fall back below for browsers that block async clipboard access.
    }
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.top = "-1000px";
  document.body.appendChild(textarea);
  textarea.select();

  try {
    return document.execCommand("copy");
  } finally {
    textarea.remove();
  }
}

async function copySuggestion(findingId) {
  const finding = state.report?.findings.find((item) => item.id === findingId);
  const text = finding?.suggestedRewrite || "";

  if (await copyTextToClipboard(text)) {
    showToast("제안문을 복사했습니다.", "success");
    return;
  }

  showToast("제안문을 복사하지 못했습니다. 직접 선택해 복사해 주세요.", "error");
}

function downloadBlob(blob, fileName) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

async function generateServerPdf() {
  const report = getCurrentReport();
  const fileName = createPdfFileName(report);
  const readiness = READINESS_META[report.overallLevel] || READINESS_META.medium;

  try {
    showToast("서버에서 PDF 생성 테스트를 진행합니다.", "info");
    const response = await fetch("/api/pdf", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        fileName,
        report: {
          ...report,
          readinessLabel: readiness.label
        }
      })
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    const blob = await response.blob();
    downloadBlob(blob, fileName);
    showToast("PDF 파일을 생성했습니다.", "success");
  } catch (error) {
    showToast("서버 PDF 생성 테스트에 실패했습니다. 브라우저 인쇄 저장을 사용해 주세요.", "error");
  }
}

function fillSample() {
  const sample = `저는 프로젝트를 진행하면서 여러 문제를 해결했고 그 과정에서 많이 성장했습니다. 최근 청년층의 디지털 학습 참여는 빠르게 증가하고 있으며 이러한 변화는 사회 전반에 중요한 시사점을 제공합니다. 하지만 실제 현장에서는 자료 접근성과 피드백 방식에 차이가 있어 학습자가 느끼는 어려움도 함께 고려해야 합니다. 저는 이 문제를 해결하기 위해 팀원들과 역할을 나누고 주간 점검표를 만들어 진행 상황을 확인했습니다. 그 결과 마감 전까지 발표 자료를 정리할 수 있었고 다음 프로젝트에서도 일정 관리 기준을 더 명확히 세울 수 있었습니다.`;
  state.draft.body = sample;
  state.draft.error = "";
  state.draft.warning = "";
  saveDraft();
  render();
}

function setActiveNav() {
  document.querySelectorAll("[data-link]").forEach((link) => {
    const href = link.getAttribute("href");
    link.classList.toggle("active", href === state.route);
  });
}

function closeMobileNav() {
  navToggle?.setAttribute("aria-expanded", "false");
  navMenu?.classList.remove("open");
}

function bindRouteEvents() {
  document.querySelectorAll("[data-link]").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      navigate(link.getAttribute("href"));
    });
  });

  document.querySelectorAll("[data-home-anchor]").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const href = link.getAttribute("href");
      const hash = href.slice(href.indexOf("#"));

      if (state.route !== "/") {
        navigate("/");
        requestAnimationFrame(() => document.querySelector(hash)?.scrollIntoView({ behavior: "smooth" }));
      } else {
        document.querySelector(hash)?.scrollIntoView({ behavior: "smooth" });
      }
      closeMobileNav();
    });
  });

  document.querySelectorAll("[data-scroll]").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const target = document.querySelector(link.getAttribute("href"));
      target?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  const form = document.querySelector("[data-check-form]");
  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    startAnalysis();
  });

  document.querySelectorAll("input[name='documentType']").forEach((input) => {
    input.addEventListener("change", (event) => {
      state.draft.documentType = event.target.value;
      saveDraft();
      render();
    });
  });

  document.querySelector("[data-document-body]")?.addEventListener("input", (event) => {
    state.draft.body = event.target.value;
    state.draft.error = "";
    state.draft.warning = "";
    saveDraft();
    updateInputStatus(state.draft.body);
  });

  document.querySelector("[data-fill-sample]")?.addEventListener("click", fillSample);

  document.querySelector("[data-show-error-state]")?.addEventListener("click", () => {
    state.analysisFailed = true;
    navigate("/report");
  });

  document.querySelectorAll("[data-select-finding]").forEach((button) => {
    button.addEventListener("click", () => {
      state.selectedFindingId = button.dataset.selectFinding;
      render();
      document.querySelector("#sentence-analysis")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  document.querySelector("[data-save-report]")?.addEventListener("click", () => {
    persistCurrentReport();
    showToast("리포트를 문서함에 저장했습니다.", "success");
  });

  document.querySelector("[data-open-pdf-report]")?.addEventListener("click", () => {
    navigate("/pdf-report");
  });

  document.querySelectorAll("[data-print-report]").forEach((button) => {
    button.addEventListener("click", () => {
      showToast("브라우저 인쇄 창에서 PDF 저장을 선택해 주세요.", "info");
      window.print();
    });
  });

  document.querySelector("[data-server-pdf]")?.addEventListener("click", () => {
    generateServerPdf();
  });

  document.querySelector("[data-copy-pdf-name]")?.addEventListener("click", async (event) => {
    if (await copyTextToClipboard(event.currentTarget.dataset.copyPdfName)) {
      showToast("권장 PDF 파일명을 복사했습니다.", "success");
      return;
    }

    showToast("파일명을 복사하지 못했습니다. 직접 선택해 복사해 주세요.", "error");
  });

  document.querySelector("[data-recheck]")?.addEventListener("click", () => {
    showToast("입력 화면으로 돌아갑니다.", "info");
    navigate("/check");
  });

  document.querySelector("[data-retry-analysis]")?.addEventListener("click", () => {
    state.analysisFailed = false;
    startAnalysis();
  });

  document.querySelectorAll("[data-copy-suggestion]").forEach((button) => {
    button.addEventListener("click", () => copySuggestion(button.dataset.copySuggestion));
  });

  document.querySelectorAll("[data-link-button]").forEach((button) => {
    button.addEventListener("click", () => navigate(button.dataset.linkButton));
  });

  document.querySelectorAll("[data-open-saved-report]").forEach((button) => {
    button.addEventListener("click", () => {
      const report = state.savedReports.find((item) => item.id === button.dataset.openSavedReport);
      if (!report) {
        showToast("저장한 리포트를 찾지 못했습니다.", "error");
        return;
      }

      state.report = report;
      state.selectedFindingId = report.findings[0]?.id || null;
      navigate("/report");
    });
  });

  document.querySelectorAll("[data-open-saved-pdf]").forEach((button) => {
    button.addEventListener("click", () => {
      const report = state.savedReports.find((item) => item.id === button.dataset.openSavedPdf);
      if (!report) {
        showToast("저장한 리포트를 찾지 못했습니다.", "error");
        return;
      }

      state.report = report;
      state.selectedFindingId = report.findings[0]?.id || null;
      navigate("/pdf-report");
    });
  });

  document.querySelectorAll("[data-delete-report]").forEach((button) => {
    button.addEventListener("click", () => {
      const confirmed = window.confirm("이 브라우저에 저장된 리포트를 삭제할까요? 삭제하면 문서함에서 복구할 수 없습니다.");
      if (!confirmed) {
        return;
      }

      state.savedReports = state.savedReports.filter((item) => item.id !== button.dataset.deleteReport);
      saveSavedReports();
      showToast("저장한 리포트를 삭제했습니다.", "success");
      render();
    });
  });

  document.querySelector("[data-doc-query]")?.addEventListener("input", (event) => {
    state.documentsFilter.query = event.target.value;
    render();
    document.querySelector("[data-doc-query]")?.focus();
  });

  document.querySelector("[data-doc-level]")?.addEventListener("change", (event) => {
    state.documentsFilter.level = event.target.value;
    render();
  });

  document.querySelector("[data-doc-type]")?.addEventListener("change", (event) => {
    state.documentsFilter.type = event.target.value;
    render();
  });

  document.querySelector("[data-doc-status]")?.addEventListener("change", (event) => {
    state.documentsFilter.status = event.target.value;
    render();
  });

  document.querySelectorAll("[data-reset-doc-filters]").forEach((button) => {
    button.addEventListener("click", () => {
      state.documentsFilter = {
        query: "",
        level: "all",
        type: "all",
        status: "all"
      };
      render();
    });
  });

  document.querySelector("[data-purge-expired]")?.addEventListener("click", () => {
    const expiredReports = getExpiredReports();
    if (!expiredReports.length) {
      showToast("정리할 만료 리포트가 없습니다.", "info");
      return;
    }

    const confirmed = window.confirm(`${expiredReports.length}개의 만료 리포트를 이 브라우저 문서함에서 삭제할까요? 삭제 후 복구할 수 없습니다.`);
    if (!confirmed) {
      return;
    }

    const expiredIds = new Set(expiredReports.map((report) => report.id));
    state.savedReports = state.savedReports.filter((report) => !expiredIds.has(report.id));
    saveSavedReports();
    showToast("만료 리포트를 정리했습니다.", "success");
    render();
  });

  document.querySelector("[data-org-policy-save]")?.addEventListener("click", () => {
    showToast("기관용 권한 정책을 저장했습니다.", "success");
  });

  document.querySelector("[data-settings-form]")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    state.settings.retention = formData.get("retention") || DEFAULT_SETTINGS.retention;
    state.settings.storeOriginal = formData.get("storeOriginal") === "on";
    state.settings.trainingUse = false;
    state.settings.autoDeleteDays = Math.max(1, Math.min(30, Number(formData.get("autoDeleteDays") || 7)));

    if (state.settings.retention === "no-original") {
      state.settings.storeOriginal = false;
    }

    saveSettings();
    showToast("설정을 저장했습니다.", "success");
    render();
  });

  document.querySelector("[data-reset-settings]")?.addEventListener("click", () => {
    state.settings = { ...DEFAULT_SETTINGS };
    saveSettings();
    showToast("기본 설정으로 복원했습니다.", "success");
    render();
  });

  document.querySelectorAll("[data-checklist-id]").forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      const item = state.report?.checklist.find((candidate) => candidate.id === checkbox.dataset.checklistId);
      if (item) {
        item.checked = checkbox.checked;
        render();
      }
    });
  });
}

navToggle?.addEventListener("click", () => {
  const expanded = navToggle.getAttribute("aria-expanded") === "true";
  navToggle.setAttribute("aria-expanded", String(!expanded));
  navMenu?.classList.toggle("open", !expanded);
});

window.addEventListener("popstate", () => {
  state.route = window.location.pathname;
  closeMobileNav();
  render();
});

render();
