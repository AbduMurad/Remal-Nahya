/**
 * Static export can't express a redirect, so the language gate at / is written
 * here: a meta-refresh to /en/ with visible links for anyone it doesn't fire for.
 */
import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Remal Nahya for Oil Services</title>
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta http-equiv="refresh" content="0; url=${BASE}/en/">
<link rel="canonical" href="${BASE}/en/">
<link rel="alternate" hreflang="en" href="${BASE}/en/">
<link rel="alternate" hreflang="ar" href="${BASE}/ar/">
<link rel="alternate" hreflang="x-default" href="${BASE}/en/">
<style>
  body{margin:0;min-height:100svh;display:grid;place-items:center;background:#0B1533;
       color:#fff;font-family:system-ui,-apple-system,sans-serif;text-align:center}
  a{color:#fff;border:1px solid rgba(255,255,255,.3);border-radius:4px;
    padding:.8em 1.6em;text-decoration:none;margin:0 .3rem;display:inline-block}
  a:hover{background:rgba(255,255,255,.1)}
</style>
</head>
<body>
  <div>
    <p style="letter-spacing:.2em;font-size:.8rem;color:#7C8DB5">REMAL NAHYA FOR OIL SERVICES</p>
    <p><a href="${BASE}/en/">English</a><a href="${BASE}/ar/" lang="ar">العربية</a></p>
  </div>
</body>
</html>
`;

await writeFile(path.join(ROOT, 'out', 'index.html'), html);
console.log('postbuild: wrote out/index.html (language gate)');
