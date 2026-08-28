import fs from "node:fs";
import { createServer, type IncomingHttpHeaders } from "node:http";
import { request as httpRequest } from "node:http";
import { request as httpsRequest } from "node:https";
import path from "node:path";
import { URL } from "node:url";

const PORT = Number(process.env.PORT || 3000);
const UPSTREAM_API_URL = (
  process.env.UPSTREAM_API_URL || "https://seelenapp-6tnxx849.manus.space"
).replace(/\/+$/, "");
const WEB_ROOT = path.resolve(process.cwd(), "web-dist");

const MIME_TYPES: Record<string, string> = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".mp3": "audio/mpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

const HOP_BY_HOP_HEADERS = new Set([
  "connection",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailer",
  "transfer-encoding",
  "upgrade",
]);

function proxyHeaders(headers: IncomingHttpHeaders, host: string) {
  const forwarded: Record<string, string | string[]> = {};
  for (const [name, value] of Object.entries(headers)) {
    if (value === undefined || HOP_BY_HOP_HEADERS.has(name.toLowerCase())) continue;
    forwarded[name] = value;
  }
  forwarded.host = host;
  return forwarded;
}

function resolveStaticFile(urlPath: string) {
  let decodedPath = "/";
  try {
    decodedPath = decodeURIComponent(urlPath.split("?")[0] || "/");
  } catch {
    decodedPath = "/";
  }

  const relativePath = path.normalize(decodedPath).replace(/^(\.\.(\/|\\|$))+/, "");
  const candidate = path.join(WEB_ROOT, relativePath);
  if (!candidate.startsWith(WEB_ROOT)) return path.join(WEB_ROOT, "index.html");

  if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) return candidate;
  if (fs.existsSync(candidate) && fs.statSync(candidate).isDirectory()) {
    const indexFile = path.join(candidate, "index.html");
    if (fs.existsSync(indexFile)) return indexFile;
  }

  const htmlFile = `${candidate.replace(/\/$/, "")}.html`;
  if (fs.existsSync(htmlFile)) return htmlFile;

  const segments = relativePath.split(path.sep).filter(Boolean);
  if (segments.length >= 2) {
    const parent = path.join(WEB_ROOT, ...segments.slice(0, -1));
    if (fs.existsSync(parent) && fs.statSync(parent).isDirectory()) {
      const dynamicFile = fs
        .readdirSync(parent)
        .find((file) => file.startsWith("[") && file.endsWith("].html"));
      if (dynamicFile) return path.join(parent, dynamicFile);
    }
  }

  return path.join(WEB_ROOT, "index.html");
}

const server = createServer((request, response) => {
  const requestUrl = request.url || "/";

  if (requestUrl === "/healthz") {
    response.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
    response.end(JSON.stringify({ ok: true, mode: "render-proxy" }));
    return;
  }

  if (requestUrl.startsWith("/api/")) {
    const target = new URL(requestUrl, `${UPSTREAM_API_URL}/`);
    const transport = target.protocol === "https:" ? httpsRequest : httpRequest;
    const upstreamRequest = transport(
      {
        protocol: target.protocol,
        hostname: target.hostname,
        port: target.port || undefined,
        path: `${target.pathname}${target.search}`,
        method: request.method,
        headers: proxyHeaders(request.headers, target.host),
      },
      (upstreamResponse) => {
        const headers: Record<string, string | string[]> = {};
        for (const [name, value] of Object.entries(upstreamResponse.headers)) {
          if (value === undefined || HOP_BY_HOP_HEADERS.has(name.toLowerCase())) continue;
          headers[name] = value;
        }
        response.writeHead(upstreamResponse.statusCode || 502, headers);
        upstreamResponse.pipe(response);
      },
    );

    upstreamRequest.on("error", (error) => {
      console.error(`[render-proxy] Upstream nicht erreichbar: ${error.message}`);
      if (!response.headersSent) {
        response.writeHead(502, { "Content-Type": "application/json; charset=utf-8" });
      }
      response.end(JSON.stringify({ error: "Produktions-API vorübergehend nicht erreichbar" }));
    });

    request.pipe(upstreamRequest);
    return;
  }

  if (!fs.existsSync(WEB_ROOT)) {
    response.writeHead(503, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Web-App ist noch nicht verfügbar.");
    return;
  }

  try {
    const filePath = resolveStaticFile(requestUrl);
    const contentType = MIME_TYPES[path.extname(filePath).toLowerCase()] || "application/octet-stream";
    response.writeHead(200, {
      "Cache-Control": filePath.endsWith(".html") ? "no-cache" : "public, max-age=3600",
      "Content-Type": contentType,
    });
    fs.createReadStream(filePath).pipe(response);
  } catch (error) {
    console.error("[render-proxy] Statische Datei konnte nicht geladen werden:", error);
    response.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Web-App konnte nicht geladen werden.");
  }
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`[render-proxy] Server läuft auf Port ${PORT}`);
  console.log(`[render-proxy] API-Ziel: ${UPSTREAM_API_URL}`);
});
