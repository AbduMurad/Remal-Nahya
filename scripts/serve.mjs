/**
 * Static server for out/, mounted at NEXT_PUBLIC_BASE_PATH.
 *
 * This exists because the export is built for a subpath. `next build` writes
 * pages to out/en/… but rewrites their asset URLs to
 * <basePath>/_next/…, so serving out/ at the root gives you HTML with every
 * script and stylesheet 404ing — pages that look almost right and behave
 * completely wrong. Mounting at the basePath is what the real host does, so it
 * is what the tests should run against.
 *
 * No dependency, so CI does not fetch a server package to run the suite.
 */
import { createServer } from 'node:http';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const DIR = path.join(ROOT, 'out');
const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
const PORT = Number(process.env.PORT ?? 4321);

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
};

async function resolve(urlPath) {
  let rel = decodeURIComponent(urlPath.split('?')[0]);

  if (BASE) {
    if (rel === BASE) rel = '/';
    else if (rel.startsWith(`${BASE}/`)) rel = rel.slice(BASE.length);
    else return null;                       // outside the mount, as on the real host
  }

  // keep the resolved path inside out/
  const target = path.normalize(path.join(DIR, rel));
  if (!target.startsWith(DIR)) return null;

  try {
    const s = await stat(target);
    if (s.isDirectory()) {
      const index = path.join(target, 'index.html');
      await stat(index);
      return index;
    }
    return target;
  } catch {
    return null;
  }
}

createServer(async (req, res) => {
  const file = await resolve(req.url ?? '/');
  if (!file) {
    const notFound = path.join(DIR, '404.html');
    try {
      await stat(notFound);
      res.writeHead(404, { 'content-type': TYPES['.html'] });
      createReadStream(notFound).pipe(res);
    } catch {
      res.writeHead(404, { 'content-type': 'text/plain' });
      res.end('404');
    }
    return;
  }
  res.writeHead(200, {
    'content-type': TYPES[path.extname(file).toLowerCase()] ?? 'application/octet-stream',
    'cache-control': 'no-store',
  });
  createReadStream(file).pipe(res);
}).listen(PORT, '127.0.0.1', () => {
  console.log(`serving out/ at http://127.0.0.1:${PORT}${BASE}/`);
});
