# Remal Nahya — website concept

A bilingual (English LTR / Arabic RTL) six-page site for **Remal Nahya for Oil Services**
(رمال ناهية للخدمات النفطية), Tripoli — a speculative redesign of remalnahya.com.

**Live demo:** https://abdumurad.github.io/Remal-Nahya/
**Status:** concept, prepared 2026. Not the client's live site.

---

## Quick look

The site is live at **https://abdumurad.github.io/Remal-Nahya/** — CI rebuilds and
redeploys it on every push to `main`.

`dist/` is generated, not committed. To build it locally:

```bash
pip install pillow numpy
python3 tools/imgs.py && python3 tools/fonts.py && python3 src/build.py
cd dist && python3 -m http.server 8000     # http://localhost:8000
```

Serve it rather than opening the files directly — browsers refuse to load webfonts
over `file://`.

`dist/remal-nahya.html` is the whole site in one self-contained file: all CSS, JS,
fonts and images inlined, hash-routed (`#/en/index`, `#/ar/services`), no server and
no network. That one *does* open by double-clicking, and it's the version to email or
hand over on a stick. Every CI run attaches the current build of it under
**Actions → the run → Artifacts → `remal-nahya-standalone`**.

---

## Layout

```
src/
  build.py         generator — emits dist/ from the content model
  content.py       ALL copy, EN + AR, plus the 24-item service catalogue
  assets_svg.py    every diagram and icon, hand-authored SVG
  site.css         the design system
  site.js          behaviour: reveals, counters, sticky wellbore, filter, drawer

tools/
  imgs.py          colour-grades raw/ photography → dist/assets/img + imgs.json
  fonts.py         fetches + subsets IBM Plex → dist/assets/fonts + fonts.json
  qa.py            link integrity, WCAG contrast, per-page DOM audit, weights
  test.py          routing, language switch, catalogue filter, form, mobile drawer
  shot.py          full-page screenshots at any viewport

raw/               the twelve source photographs, ungraded
dist/              the built site — generated, gitignored
HANDOVER.md        client-facing notes and the open-items list
CREDITS.md         photography attribution
```

## Building

```bash
pip install pillow numpy playwright
python3 tools/imgs.py      # grade + encode photography          (needs raw/)
python3 tools/fonts.py     # fetch + subset webfonts             (needs network)
python3 src/build.py       # generate dist/
python3 tools/qa.py        # 0 broken refs, 0 contrast fails, 0 DOM issues
python3 tools/test.py      # interaction tests
```

`qa.py`, `test.py` and `shot.py` want a local server on `127.0.0.1:8901` serving
`dist/` (override with `QA_BASE` / `SHOT_BASE`), and a Chromium — set `CHROMIUM_PATH`
if Playwright's bundled one isn't found automatically.

All copy is two parallel dicts in `src/content.py`. Nothing is hard-coded in the
templates, so a wording change is one edit and both languages rebuild together.

---

## Design system

Navy `#1B2A5B` (from the printed brochure) as the ground, crimson `#C8102E` as the
single accent, held to roughly 3% of any viewport.

> **The one rule that matters:** crimson on navy is **2.33:1** and fails WCAG badly.
> Crimson never appears as text, an icon or a rule on a navy ground — only as a filled
> block with white on it. On dark grounds the accent is `--crimson-500` `#E01235`, and
> only at display sizes. `tools/qa.py` checks every pair in the palette.

Type is IBM Plex Sans + IBM Plex Sans Arabic + IBM Plex Mono — one coordinated
superfamily, so both scripts share weight and rhythm instead of being two unrelated
faces bolted together. Self-hosted; latin and arabic subsets only (458 KB, and the
browser fetches only the subset it needs).

Motion: scroll reveals, one sticky pinned section, one logo ticker, count-up stats.
All of it collapses under `prefers-reduced-motion`, and a 3.2s fail-safe guarantees
nothing stays invisible if `IntersectionObserver` misfires.

### Arabic / RTL

The part most likely to break if someone edits it later:

- The stylesheet is written entirely in **logical properties**, so `dir="rtl"` does
  almost all the work. The exceptions are overridden explicitly: the hero scrim
  gradient, the hero backdrop (mirrored, so the Arabic headline still lands on the
  dark half of the photograph), directional icons, and the ticker.
- **`letter-spacing: 0 !important` in RTL.** Arabic is a connected script; tracking
  severs the joins.
- Arabic line-height goes up (1.82 body / 1.34 headings) and font-size down a notch —
  Plex Arabic runs large.
- `text-transform: uppercase` does nothing in Arabic, so every uppercase micro-label
  switches to a heavier weight and a size bump in RTL rather than silently losing a
  layer of hierarchy.
- **Western numerals (0–9)** throughout. Libya and the Maghreb use these, not the
  Eastern Arabic-Indic forms common in the Gulf.
- Latin runs inside Arabic prose are wrapped in `<bdi>` at build time
  (`bidi_isolate()` in `build.py`), or `Rompetrol Well Services وSCA-Sichuan` and
  `15,000 psi` scramble at the bidi boundary. `<svg>` text is forced `direction: ltr`
  for the same reason.
- **Never put `--font-mono` on anything translatable.** IBM Plex Mono has no Arabic
  coverage and the system fallback destroys letter-joining. RTL swaps the entire mono
  layer to Plex Sans Arabic through `--ff-mono`.

### Illustration

Every diagram is hand-authored SVG in `src/assets_svg.py`:

- **Wellbore cross-section** — casing strings, cement sheath, completion,
  perforations, depth scale to TD 3,240 m. Draws itself on scroll and highlights one
  stage at a time as you move through the four service steps beside it.
- **Drone gas survey** — animated VOC/H₂S/SO₂ plume over a live pipeline, sensor cone,
  live-readout HUD. A photo of a drone sells nothing; a visualisation of a detected
  leak sells the service.
- **Libya basin map** — coastline including the Gulf of Sirte, with the Sirte, Murzuq,
  Ghadames and Cyrenaica basins and the Tripoli pin.
- **Hero annotation overlay** — dimension lines and mono call-outs over the photograph.
- **Logo** — the droplet / derrick / gear mark redrawn as clean vector.

---

## Deployment

`.github/workflows/pages.yml` runs on every push to `main`:

1. installs Pillow, NumPy, Playwright and Chromium
2. grades the photography, subsets the webfonts, generates `dist/`
3. runs `tools/qa.py` — link integrity, WCAG contrast, per-page DOM audit
4. runs `tools/test.py` — routing, language switch, catalogue filter, form, drawer
5. deploys to GitHub Pages, **only if 3 and 4 both pass**

Pull requests run steps 1–4 and skip the deploy, so a broken build never reaches the
live URL. Both scripts exit non-zero on failure, which is what gates the deploy.

The workflow enables Pages itself on the first run (`configure-pages` with
`enablement: true`). If your account blocks that, set it by hand once:
**Settings → Pages → Source → GitHub Actions**, then re-run the workflow.

Because the whole site is generated from `src/content.py`, fixing a typo is a one-line
edit and a push — the rebuild, the audit and the deploy all happen on their own.

---

See **HANDOVER.md** for the client-facing notes, including the open items that need
resolving before any of this could go live.
