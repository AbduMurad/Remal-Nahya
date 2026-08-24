/**
 * Grade and encode the photography so it reads as one system.
 *
 * Split-tones every frame toward navy in the shadows and a warm tint in the
 * highlights, desaturates slightly, then writes a webp ladder plus a jpeg
 * fallback and a tiny blurred placeholder. Output goes to public/assets/img,
 * and src/content/images.json records the manifest the <Photo> component reads.
 *
 * A NOTE BEFORE YOU ADD A PHOTOGRAPH: check it at full resolution for stamped
 * brand markings, signage and liveries. Three otherwise-good frames were
 * discarded from this set because a competitor's name was legible in them —
 * FORCE on tool sets, ERIELL on a derrick. See CREDITS.md.
 */
import sharp from 'sharp';
import { mkdir, writeFile, access } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const RAW = path.join(ROOT, 'raw');
const OUT = path.join(ROOT, 'public', 'assets', 'img');
const MANIFEST = path.join(ROOT, 'src', 'content', 'images.json');

const NAVY = [0x0b, 0x15, 0x33];
const WARM = [255, 226, 196];

/** slot -> [source file, aspect ratio, grade, widths to encode] */
const SPEC = {
  hero:          ['rig_night_a', [16, 9], { shadow: 0.42, highlight: 0.06, sat: 0.72, contrast: 1.06 }, [1920, 1280, 800]],

  'ph-services': ['rig_sil',     [21, 9], { shadow: 0.46, highlight: 0.10, sat: 0.62, contrast: 1.05 }, [1600, 900]],
  'ph-ega':      ['tool_macro',  [21, 9], { shadow: 0.44, highlight: 0.06, sat: 0.60, contrast: 1.10 }, [1600, 900]],
  'ph-well':     ['rig_desert',  [21, 9], { shadow: 0.50, highlight: 0.08, sat: 0.55, contrast: 1.06 }, [1600, 900]],
  'ph-about':    ['desert_dusk', [21, 9], { shadow: 0.48, highlight: 0.08, sat: 0.58, contrast: 1.05 }, [1600, 900]],
  'ph-contact':  ['tower_night', [21, 9], { shadow: 0.40, highlight: 0.06, sat: 0.70, contrast: 1.06 }, [1600, 900]],

  excl:          ['wh_bars',     [4, 3],  { shadow: 0.40, highlight: 0.08, sat: 0.60, contrast: 1.12 }, [900, 600]],
  partners:      ['pipes_dark',  [16, 9], { shadow: 0.46, highlight: 0.06, sat: 0.30, contrast: 1.14 }, [1600, 900]],
  map:           ['desert_dusk', [4, 3],  { shadow: 0.44, highlight: 0.10, sat: 0.58, contrast: 1.06 }, [1000, 640]],
  stock:         ['wh_dark',     [4, 3],  { shadow: 0.44, highlight: 0.06, sat: 0.58, contrast: 1.10 }, [900, 600]],
  hse:           ['hat_dark',    [4, 3],  { shadow: 0.42, highlight: 0.08, sat: 0.60, contrast: 1.08 }, [900, 600]],
  crew:          ['pump_sunset', [4, 3],  { shadow: 0.42, highlight: 0.12, sat: 0.66, contrast: 1.06 }, [900, 600]],
  plant:         ['refin_circ',  [16, 9], { shadow: 0.40, highlight: 0.08, sat: 0.62, contrast: 1.06 }, [1200, 800]],

  'tool-a':      ['wh_bars',     [1, 1],  { shadow: 0.40, highlight: 0.08, sat: 0.55, contrast: 1.12 }, [560]],
  'tool-b':      ['tool_macro',  [1, 1],  { shadow: 0.42, highlight: 0.08, sat: 0.52, contrast: 1.10 }, [560]],
  'tool-c':      ['pipes_dark',  [1, 1],  { shadow: 0.42, highlight: 0.06, sat: 0.55, contrast: 1.10 }, [560]],
  'tool-d':      ['wh_dark',     [1, 1],  { shadow: 0.40, highlight: 0.10, sat: 0.50, contrast: 1.10 }, [560]],
  'tool-e':      ['refin_circ',  [1, 1],  { shadow: 0.44, highlight: 0.06, sat: 0.42, contrast: 1.10 }, [560]],
  'tool-f':      ['hat_dark',    [1, 1],  { shadow: 0.44, highlight: 0.06, sat: 0.50, contrast: 1.10 }, [560]],
};

/** Crop to an aspect ratio, biasing the vertical crop upward to keep horizons high. */
async function cropTo(file, [aw, ah]) {
  const img = sharp(file, { failOn: 'none' });
  const { width: w, height: h } = await img.metadata();
  const target = aw / ah;
  if (w / h > target) {
    const nw = Math.round(h * target);
    return img.extract({ left: Math.round((w - nw) / 2), top: 0, width: nw, height: h });
  }
  const nh = Math.round(w / target);
  return img.extract({ left: 0, top: Math.round((h - nh) * 0.38), width: w, height: nh });
}

/** The split-tone. Done on raw pixels so it matches across every frame exactly. */
async function grade(pipeline, { shadow = 0.3, highlight = 0.1, sat = 0.86, contrast = 1.1 }) {
  // sharp's linear() is y = a*x + b; centre the contrast on mid grey
  const pre = pipeline
    .modulate({ saturation: sat })
    .linear(contrast, -(128 * contrast) + 128);

  const { data, info } = await pre.raw().toBuffer({ resolveWithObject: true });
  const px = info.width * info.height;
  for (let i = 0; i < px; i++) {
    const o = i * info.channels;
    const r = data[o] / 255, g = data[o + 1] / 255, b = data[o + 2] / 255;
    const lum = r * 0.2126 + g * 0.7152 + b * 0.0722;
    const sw = Math.min(Math.max(1 - lum * 1.7, 0), 1) * shadow;
    const hw = Math.min(Math.max((lum - 0.55) * 2.2, 0), 1) * highlight;
    for (let c = 0; c < 3; c++) {
      let v = data[o + c] / 255;
      v = v * (1 - sw) + (NAVY[c] / 255) * sw;
      v = v * (1 - hw) + (WARM[c] / 255) * hw;
      data[o + c] = Math.round(Math.min(Math.max(v, 0), 1) * 255);
    }
  }
  return sharp(data, { raw: { width: info.width, height: info.height, channels: info.channels } });
}

const clone = (buf, w, h, ch) => sharp(buf, { raw: { width: w, height: h, channels: ch } });

async function run() {
  // `--if-missing` lets typecheck depend on the manifest without paying for a
  // regrade it does not need. The build proper always runs the full pass.
  if (process.argv.includes('--if-missing')) {
    try {
      await access(MANIFEST);
      console.log('images: manifest present, skipping');
      return;
    } catch { /* fall through and generate */ }
  }
  await mkdir(OUT, { recursive: true });
  const manifest = {};
  let fileTotal = 0;

  for (const [name, [src, ratio, gk, widths]] of Object.entries(SPEC)) {
    const graded = await grade(await cropTo(path.join(RAW, `${src}.jpg`), ratio), gk);
    const { data, info } = await graded.raw().toBuffer({ resolveWithObject: true });
    const { width: W, height: H, channels: CH } = info;

    const srcs = [];
    for (const w of widths) {
      const buf = await clone(data, W, H, CH)
        .resize({ width: Math.min(w, W), withoutEnlargement: true })
        .webp({ quality: w > 1000 ? 78 : 80, effort: 6 })
        .toBuffer();
      const f = `${name}-${w}.webp`;
      await writeFile(path.join(OUT, f), buf);
      const m = await sharp(buf).metadata();
      srcs.push({ f, w: m.width, kb: Math.round(buf.length / 1024) });
      fileTotal += buf.length;
    }

    const jpg = await clone(data, W, H, CH)
      .resize({ width: Math.min(widths[0], W), withoutEnlargement: true })
      .jpeg({ quality: 74, progressive: true, mozjpeg: true })
      .toBuffer();
    await writeFile(path.join(OUT, `${name}.jpg`), jpg);
    fileTotal += jpg.length;

    // blurred placeholder, inlined as a background so nothing flashes white
    const lq = await clone(data, W, H, CH)
      .resize({ width: 20 }).blur(0.6).jpeg({ quality: 42 }).toBuffer();

    manifest[name] = {
      w: W, h: H, ratio: `${ratio[0]} / ${ratio[1]}`,
      jpg: `${name}.jpg`, srcs,
      lqip: `data:image/jpeg;base64,${lq.toString('base64')}`,
    };
    console.log(
      `${name.padEnd(13)} ${src.padEnd(12)} ${String(W).padStart(4)}x${String(H).padEnd(4)}` +
      ` ${String(srcs.reduce((a, s) => a + s.kb, 0)).padStart(4)} KB`);
  }

  await writeFile(MANIFEST, JSON.stringify(manifest, null, 1));
  console.log(`\nencoded ${Math.round(fileTotal / 1024)} KB across ${Object.keys(manifest).length} images`);
}

run().catch((e) => { console.error(e); process.exit(1); });
