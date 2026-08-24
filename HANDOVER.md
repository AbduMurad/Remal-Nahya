# Remal Nahya for Oil Services — website concept

A bilingual (English LTR / Arabic RTL) six-page site, built as a speculative redesign
to replace the current Wix site at remalnahya.com.

**Concept — prepared for Remal Nahya, 2026. Not the live site.**

---

## What's in this folder

```
remal-nahya.html          the whole site in one file — open it by double-clicking.
                          Hash routing (#/en/index, #/ar/services). Everything
                          inlined: CSS, JS, fonts, images. No network needed.
                          This is the version to send/host for the pitch.

index.html                language gate → en/ or ar/
en/  ar/                  the real multi-page site — 6 pages each, proper URLs,
                          hreflang, srcset, SEO metadata
assets/img/               WebP at 3 widths + JPEG fallback, colour-graded
assets/fonts/             IBM Plex Sans / Sans Arabic / Mono, self-hosted woff2
assets/css/site.css       the full stylesheet (also inlined into each page)
assets/js/site.js         all behaviour, no dependencies
```

**Serving the multi-page version:** browsers block webfonts over `file://`, so open
it through a local server, not by double-clicking:

```bash
cd dist && python3 -m http.server 8000     # then http://localhost:8000
```

`remal-nahya.html` has no such restriction — it works straight off disk.

---

## Pages

| | English | Arabic |
|---|---|---|
| Home | `en/index.html` | `ar/index.html` |
| Services (24-item filterable catalogue) | `en/services.html` | `ar/services.html` |
| EGA Master tools | `en/ega-master.html` | `ar/ega-master.html` |
| Well services | `en/well-services.html` | `ar/well-services.html` |
| About | `en/about.html` | `ar/about.html` |
| Contact | `en/contact.html` | `ar/contact.html` |

---

## Design system

**Colour.** Navy `#1B2A5B` family (from the brochure) as ground, crimson `#C8102E`
as the single accent, held to roughly 3% of any viewport — the Hilti discipline.
That cap is the difference between "premium industrial" and "discount tool flyer".

One rule matters more than the rest: **crimson on navy is 2.33:1 and fails WCAG
badly.** Crimson never appears as text, an icon or a rule on a navy ground — only as
a filled block with white on it. On dark grounds the accent is `--crimson-500`
`#E01235` and only at display sizes. Every colour pair in the build is verified
(`work/qa.py`); all pass AA.

**Type.** IBM Plex Sans + IBM Plex Sans Arabic + IBM Plex Mono — one coordinated
superfamily, so the two scripts share weight and rhythm rather than being two fonts
bolted together. Self-hosted, latin + arabic subsets only (458 KB total, and the
browser only fetches the subset it needs).

**Motion.** Scroll reveals, one sticky pinned section, one logo ticker, count-up
stats. All of it is disabled under `prefers-reduced-motion`, and there is a 3.2s
fail-safe so nothing can stay invisible if `IntersectionObserver` misfires.

---

## Arabic / RTL

This is the part no competitor in Libya has, and the part most likely to break if
someone edits it later. What's already handled:

- The whole stylesheet is written in **logical properties** (`margin-inline-start`,
  `inset-inline-end`, `text-align: start`), so `dir="rtl"` does almost all the work.
- The handful of things logical properties don't cover are overridden explicitly:
  the hero scrim gradient, the hero backdrop (mirrored so the headline still lands on
  the dark half of the photograph), directional icons, and the ticker direction.
- **`letter-spacing: 0 !important` on everything in RTL.** Arabic is a connected
  script; tracking severs the joins.
- Arabic line-height is raised (1.82 body / 1.34 headings) and the font-size dropped
  a notch, because Plex Arabic runs large.
- `text-transform: uppercase` does nothing in Arabic, so every uppercase micro-label
  switches to a heavier weight and a size bump in RTL instead of silently losing a
  layer of hierarchy.
- **Western numerals (0–9) throughout.** Libya and the Maghreb use these, not the
  Eastern Arabic-Indic forms common in the Gulf.
- Latin runs inside Arabic prose are wrapped in `<bdi>` automatically at build time
  (`bidi_isolate()` in `build.py`), so `Rompetrol Well Services وSCA-Sichuan` and
  `15,000 psi` don't scramble at the bidi boundary. Text inside `<svg>` is forced
  `direction: ltr` for the same reason.
- No `--font-mono` on any element that can hold Arabic — Plex Mono has no Arabic
  coverage, and the fallback breaks letter-joining. RTL swaps the whole mono layer to
  Plex Sans Arabic via `--ff-mono`.

---

## Illustration

Every diagram is hand-authored SVG in `src/assets_svg.py`, not a stock graphic:

- **Wellbore cross-section** — casing strings, cement sheath, completion, perforations,
  depth scale to TD 3,240 m. Draws itself on scroll and highlights one stage at a time
  as you move through the four service steps beside it.
- **Drone gas survey** — animated VOC/H₂S/SO₂ plume over a live pipeline with a sensor
  cone and a live-readout HUD. This is the "show the invisible thing" move: a photo of
  a drone sells nothing, a visualisation of a detected leak sells the service.
- **Libya basin map** — coastline including the Gulf of Sirte, with the Sirte, Murzuq,
  Ghadames and Cyrenaica basins and the Tripoli HQ pin. *Simplified outline — worth
  replacing with a real GeoJSON trace before anything goes live.*
- **Hero annotation overlay** — dimension lines and mono call-outs (TD, pressure
  rating, basin) laid over the photograph.
- **Logo** — the droplet/derrick/gear mark redrawn as clean vector.

---

## Rebuilding

```bash
python3 work/imgs.py     # grade + encode the photography, writes work/imgs.json
python3 work/fonts.py    # fetch + subset the fonts, writes work/fonts.json
python3 src/build.py     # generate dist/
python3 work/qa.py       # links, contrast, DOM audit, page weights
python3 work/test.py     # routing, language switch, filter, form, drawer
```

All copy lives in `src/content.py` as two parallel dicts (`EN` / `AR`) plus one
`SERVICES` list. Nothing is hard-coded in the templates, so a copy change is a
one-line edit in one file and both languages rebuild together.

---

## Before this goes live — open items

1. **"60+ years" is wrong.** The printed brochure says EGA Master has more than 60
   years behind it. EGA Master was founded in **1990** (Vitoria-Gasteiz) — about 35
   years. The site now says "manufacturing since 1990" instead. Worth raising with
   the client, because a buyer who checks will find it.
2. **Photography.** Every image here is Unsplash, colour-graded to match. Three
   candidate shots were discarded because a rival brand was legible in them (`FORCE`
   on the tool sets, `ERIELL` on a derrick) — do not reinstate them. Real photographs
   of the Gergarish Main Road warehouse, actual EGA Master stock, and the team would
   beat all of it.
3. **The four departmental mailboxes** (`tools@`, `procurement@`, `wellservices@`,
   `survey@`) are proposed, not live. The page says so.
4. **The contact form is a demo** — it confirms on submit and sends nothing. Needs a
   backend or a form service.
5. **Missing, and worth adding for NOC buyers:** Remal's own ISO 9001/14001/45001
   status and HSE record, commercial registration and NOC vendor numbers in the
   footer, a scan of the EGA Master distributor certificate, a downloadable capability
   statement PDF, and two or three anonymised job references with figures.
6. **The Libya map outline** is a hand-drawn approximation. Replace with real
   geodata before launch.
7. **EGA Master's own site now claims 25,000+ references and 150+ countries** — the
   site uses the brochure's more conservative 20,000+ and 100+. Safe either way, but
   the higher numbers are available if the client wants them.
