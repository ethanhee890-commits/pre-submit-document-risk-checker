import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const port = Number(process.env.PORT || 4173);
const host = process.env.HOST || "0.0.0.0";
const startedAt = new Date();

const appVersion = {
  name: "pre-submit-document-risk-checker",
  version: "0.1.0",
  mode: process.env.NODE_ENV || "development",
  startedAt: startedAt.toISOString()
};

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".ico": "image/x-icon"
};

const AXIS_LABELS = {
  style: "문체 자연도",
  ai: "AI 작성 리스크",
  citation: "출처·인용 리스크",
  submission: "제출 안정성"
};

const LEVEL_LABELS = {
  low: "낮음",
  medium: "보통",
  high: "높음"
};

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function safeFileName(value) {
  return String(value || "document-risk-report.pdf")
    .replace(/[<>:"/\\|?*\u0000-\u001F]/g, "_")
    .slice(0, 120);
}

function readJsonBody(request) {
  return new Promise((resolve, reject) => {
    let body = "";
    request.on("data", (chunk) => {
      body += chunk;
      if (body.length > 2_000_000) {
        request.destroy();
        reject(new Error("요청 본문이 너무 큽니다."));
      }
    });
    request.on("end", () => {
      try {
        resolve(JSON.parse(body || "{}"));
      } catch (error) {
        reject(new Error("JSON 본문을 읽지 못했습니다."));
      }
    });
    request.on("error", reject);
  });
}

async function loadPlaywright() {
  try {
    return await import("playwright");
  } catch (error) {
    const bundledPath = path.resolve(path.dirname(process.execPath), "..", "node_modules", "playwright", "index.mjs");
    if (existsSync(bundledPath)) {
      return await import(pathToFileURL(bundledPath).href);
    }
    throw new Error("Playwright를 찾지 못했습니다.");
  }
}

function buildPdfHtml(report) {
  const axes = Array.isArray(report.axes) ? report.axes : [];
  const findings = Array.isArray(report.findings) ? report.findings : [];
  const checklist = Array.isArray(report.checklist) ? report.checklist : [];
  const actionItems = Array.isArray(report.actionItems) ? report.actionItems : [];

  return `<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(report.title || "문서 신뢰도 리포트")}</title>
  <style>
    @page { size: A4; margin: 14mm; }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      color: #17211d;
      font-family: "Malgun Gothic", "Apple SD Gothic Neo", Arial, sans-serif;
      line-height: 1.65;
    }
    header {
      display: flex;
      justify-content: space-between;
      gap: 18px;
      border-bottom: 2px solid #17211d;
      padding-bottom: 18px;
      margin-bottom: 18px;
    }
    h1 { margin: 10px 0 6px; font-size: 34px; line-height: 1.18; }
    h2 { margin: 0 0 12px; font-size: 20px; }
    p { margin: 0; }
    .label {
      display: inline-block;
      padding: 5px 10px;
      border-radius: 999px;
      background: #eee9df;
      font-weight: 800;
      font-size: 12px;
    }
    .status {
      align-self: flex-start;
      min-width: 110px;
      text-align: center;
      padding: 10px 12px;
      border-radius: 8px;
      background: #dceee8;
      color: #174d45;
      font-weight: 900;
    }
    .notice {
      padding: 14px;
      border-radius: 8px;
      background: #dfeaf0;
      color: #2b4558;
      margin: 16px 0;
    }
    section {
      border-top: 1px solid #ddd8cf;
      padding: 18px 0;
      break-inside: avoid;
    }
    ol, ul { margin: 0; padding-left: 22px; }
    .axis-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 10px;
    }
    .axis-card, .finding {
      border: 1px solid #ddd8cf;
      border-radius: 8px;
      padding: 13px;
      background: #fbfaf6;
      break-inside: avoid;
    }
    .axis-card strong {
      display: flex;
      justify-content: space-between;
      gap: 10px;
      color: #17211d;
    }
    .finding + .finding { margin-top: 10px; }
    .finding small { display: block; color: #63706a; margin-top: 6px; }
    footer {
      position: fixed;
      right: 0;
      bottom: 0;
      left: 0;
      display: flex;
      justify-content: space-between;
      gap: 12px;
      color: #63706a;
      font-size: 11px;
      background: white;
      padding-top: 6px;
      border-top: 1px solid #ddd8cf;
    }
  </style>
</head>
<body>
  <header>
    <div>
      <span class="label">제출 전 문서 리스크 점검기</span>
      <h1>${escapeHtml(report.title || "문서 신뢰도 리포트")}</h1>
      <p>${escapeHtml(report.documentLabel || "문서")} · ${escapeHtml(report.scenarioId || "REPORT")}</p>
    </div>
    <strong class="status">${escapeHtml(report.readinessLabel || "제출 전 검토")}</strong>
  </header>
  <div class="notice">
    <strong>작성자를 단정하지 않는 참고 지표입니다.</strong>
    <p>${escapeHtml(report.disclaimer || "이 리포트는 문서 제출 전 검토를 돕는 참고 지표입니다.")}</p>
  </div>
  <section>
    <h2>지금 해야 할 조치</h2>
    <ol>${actionItems.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ol>
  </section>
  <section>
    <h2>4축 리스크 요약</h2>
    <div class="axis-grid">
      ${axes
        .map(
          (axis) => `<article class="axis-card">
            <strong><span>${escapeHtml(axis.label || AXIS_LABELS[axis.id] || axis.id)}</span><span>${escapeHtml(LEVEL_LABELS[axis.level] || axis.level)}</span></strong>
            <p>${escapeHtml(axis.summary)}</p>
            <small>${Number(axis.evidenceCount || 0)}개 근거</small>
          </article>`
        )
        .join("")}
    </div>
  </section>
  <section>
    <h2>문장별 주요 근거</h2>
    ${findings
      .map(
        (finding) => `<article class="finding">
          <strong>${escapeHtml((finding.labels || []).join(", "))} · ${escapeHtml(LEVEL_LABELS[finding.level] || finding.level)}</strong>
          <p>${escapeHtml(finding.text)}</p>
          <small>${escapeHtml(finding.reason)}</small>
        </article>`
      )
      .join("")}
  </section>
  <section>
    <h2>제출 전 체크리스트</h2>
    <ul>${checklist.map((item) => `<li>${escapeHtml(item.label)}</li>`).join("")}</ul>
  </section>
  <footer>
    <span>이 리포트는 작성자를 단정하지 않는 참고 지표입니다.</span>
    <span>${escapeHtml(report.fileName || "document-risk-report.pdf")}</span>
  </footer>
</body>
</html>`;
}

async function createPdfBuffer(report) {
  const { chromium } = await loadPlaywright();
  const browser = await chromium.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"]
  });

  try {
    const page = await browser.newPage();
    await page.setContent(buildPdfHtml(report), { waitUntil: "load" });
    return await page.pdf({
      format: "A4",
      printBackground: true,
      displayHeaderFooter: false,
      margin: {
        top: "14mm",
        right: "14mm",
        bottom: "18mm",
        left: "14mm"
      }
    });
  } finally {
    await browser.close();
  }
}

function resolveRequestPath(urlPath) {
  const decoded = decodeURIComponent(urlPath.split("?")[0]);
  const normalized = decoded === "/" ? "/index.html" : decoded;
  const filePath = path.join(__dirname, normalized);

  if (!filePath.startsWith(__dirname)) {
    return path.join(__dirname, "index.html");
  }

  return existsSync(filePath) ? filePath : path.join(__dirname, "index.html");
}

const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url || "/", `http://localhost:${port}`);

    if (request.method === "GET" && url.pathname === "/api/health") {
      response.writeHead(200, {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "no-store"
      });
      response.end(
        JSON.stringify({
          ok: true,
          service: appVersion.name,
          uptimeSeconds: Math.round((Date.now() - startedAt.getTime()) / 1000),
          timestamp: new Date().toISOString()
        })
      );
      return;
    }

    if (request.method === "GET" && url.pathname === "/api/version") {
      response.writeHead(200, {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "no-store"
      });
      response.end(JSON.stringify(appVersion));
      return;
    }

    if (request.method === "POST" && url.pathname === "/api/pdf") {
      let payload;
      let fileName;
      let buffer;

      try {
        payload = await readJsonBody(request);
        fileName = safeFileName(payload.fileName || "document-risk-report.pdf");
        buffer = await createPdfBuffer({ ...payload.report, fileName });
      } catch (error) {
        console.error("PDF generation failed:", error);
        response.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
        response.end("PDF 생성에 실패했습니다. 브라우저 인쇄 저장을 사용해 주세요.");
        return;
      }

      response.writeHead(200, {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(fileName)}`,
        "Content-Length": buffer.length
      });
      response.end(buffer);
      return;
    }

    const filePath = resolveRequestPath(request.url || "/");
    const ext = path.extname(filePath);
    const contents = await readFile(filePath);

    response.writeHead(200, {
      "Content-Type": mimeTypes[ext] || "application/octet-stream"
    });
    response.end(contents);
  } catch (error) {
    response.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("서버에서 파일을 읽지 못했습니다.");
  }
});

server.listen(port, host, () => {
  console.log(`문서 리스크 점검기 MVP: http://${host}:${port}`);
});
