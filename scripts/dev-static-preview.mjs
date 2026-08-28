import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize, resolve } from "node:path";

const root = resolve(process.cwd(), "web-dist");
const port = Number(process.env.EXPO_PORT || 8081);

const contentTypes = {
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

function resolveAsset(pathname) {
  const relative = normalize(decodeURIComponent(pathname)).replace(/^(\.\.(\/|\\|$))+/, "");
  const candidate = join(root, relative);
  if (!candidate.startsWith(root)) return join(root, "index.html");
  if (existsSync(candidate) && statSync(candidate).isFile()) return candidate;
  if (existsSync(candidate) && statSync(candidate).isDirectory()) {
    const indexFile = join(candidate, "index.html");
    if (existsSync(indexFile)) return indexFile;
  }
  return join(root, "index.html");
}

const server = createServer((request, response) => {
  try {
    if (!existsSync(root)) {
      response.writeHead(503, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("Web-Vorschau wurde noch nicht exportiert.");
      return;
    }

    const pathname = new URL(request.url || "/", "http://localhost").pathname;
    const filePath = resolveAsset(pathname);
    const contentType = contentTypes[extname(filePath)] || "application/octet-stream";
    response.writeHead(200, {
      "Cache-Control": "no-store",
      "Content-Type": contentType,
    });
    createReadStream(filePath).pipe(response);
  } catch (error) {
    console.error("[dev-preview] Fehler:", error);
    response.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Vorschau konnte nicht geladen werden.");
  }
});

server.listen(port, () => {
  console.log(`[dev-preview] Statische App-Vorschau läuft auf Port ${port}`);
});
