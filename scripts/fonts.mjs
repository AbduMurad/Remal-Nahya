/**
 * Refresh the self-hosted type. NOT part of the build — the woff2 files and the
 * generated src/styles/fonts.css are committed, so `npm run build` needs no
 * network. Run this by hand when you want to pull newer IBM Plex releases.
 *
 * Fetches the Google Fonts CSS, keeps only the latin and arabic subsets we
 * actually set, downloads the woff2 files into public/assets/fonts and rewrites
 * src/styles/fonts.css.
 *
 * Self-hosting matters here for two reasons: no third-party request on a page a
 * Libyan operator opens over a slow link, and the browser fetches only the
 * subset its script needs.
 */
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const OUT = path.join(ROOT, 'src', 'styles', 'fonts');
const STYLESHEET = path.join(ROOT, 'src', 'styles', 'fonts.css');

const UA = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
    '(KHTML, like Gecko) Chrome/125.0 Safari/537.36',
};
const URL_CSS =
  'https://fonts.googleapis.com/css2?' +
  'family=IBM+Plex+Mono:wght@400;500&' +
  'family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&' +
  'family=IBM+Plex+Sans:wght@400;500;600;700&display=swap';

const KEEP = new Set(['latin', 'arabic']);

async function run() {
  await mkdir(OUT, { recursive: true });
  const css = await (await fetch(URL_CSS, { headers: UA })).text();

  // Google emits each face once per unicode subset, preceded by a /* subset */ comment
  const blocks = [...css.matchAll(/\/\*\s*([\w\-[\]]+)\s*\*\/\s*(@font-face\s*\{[^}]*\})/g)];
  const files = new Map();
  const kept = [];

  for (const [, subset, block] of blocks) {
    if (!KEEP.has(subset)) continue;
    const fam = /font-family:\s*'([^']+)'/.exec(block)[1];
    const wt = /font-weight:\s*(\d+)/.exec(block)[1];
    const url = /url\((https:\/\/fonts\.gstatic\.com[^)]+)\)/.exec(block)[1];
    const name = `${fam.toLowerCase().replace(/ /g, '')}-${wt}-${subset}.woff2`;
    if (!files.has(name)) {
      const buf = Buffer.from(await (await fetch(url, { headers: UA })).arrayBuffer());
      await writeFile(path.join(OUT, name), buf);
      files.set(name, buf);
    }
    kept.push({ name, block });
  }

  const face = (block, src) =>
    block
      .replace(/src:\s*url\([^)]+\)\s*format\('woff2'\);/, `src:url(${src}) format('woff2');`)
      .replace(/\s+/g, ' ')
      .trim();

  const header =
    '/* IBM Plex Sans / Sans Arabic / Mono — SIL Open Font License 1.1.\n' +
    '   Self-hosted: no third-party request, and the browser fetches only the\n' +
    '   subset its script needs. Regenerate with `node scripts/fonts.mjs`\n' +
    '   (needs network access to fonts.googleapis.com). */\n';
  const fileCss = kept.map(({ name, block }) => face(block, `'./fonts/${name}'`)).join('\n');

  await writeFile(STYLESHEET, header + fileCss + '\n');

  const raw = [...files.values()].reduce((a, b) => a + b.length, 0);
  console.log(`faces kept: ${kept.length}   files: ${files.size}   raw: ${Math.round(raw / 1024)} KB`);
  for (const n of [...files.keys()].sort()) {
    console.log(`   ${n.padEnd(40)} ${String(Math.round(files.get(n).length / 1024)).padStart(4)} KB`);
  }
}

run().catch((e) => { console.error(e); process.exit(1); });
