# Remal Nahya — website concept (Next.js)

A bilingual (English LTR / Arabic RTL) six-page site for **Remal Nahya for Oil Services**
(رمال ناهية للخدمات النفطية), Tripoli — a speculative redesign of remalnahya.com.

Next.js 16 App Router, React 19, TypeScript, **static export**. No Node runtime in
production: `npm run build` emits plain files that any host will serve — GitHub Pages,
cPanel, S3, a VPS.

**Status:** concept. Not the client's live site.

---

## Getting started

```bash
npm install
npm run build      # grades the photography, then generates out/
npm start          # serves out/ at http://127.0.0.1:4321
```

or `npm run dev` for the usual dev server.

The build needs no network: the fonts are vendored and the photography is graded from
`raw/` by a local sharp script.

---

## Layout

```
src/
  app/[lang]/            one route tree, generateStaticParams -> en + ar
    layout.tsx           the root layout; sets <html lang dir>
    page.tsx             home
    services/ ega-master/ well-services/ about/ contact/
  content/
    types.ts             the shape of a language's copy — the contract
    en.ts  ar.ts         ALL copy, one file per language
    services.ts          the 24-item service catalogue, both languages per entry
    facts.ts             address, phones, email
  components/
    chrome/              Header, Drawer, TabBar, Footer
    sections/            Hero, Partners, Drone, Coverage, LeadTime, WellScroller,
                         ServiceCatalogue, ContactForm
    svg/                 Diagrams.tsx (wellbore, drone survey, Libya map, hero
                         overlay, logo) and Icon.tsx
    ui/                  Photo, Btn, Tick, Eyebrow, Bidi + the client primitives
  lib/                   links, images, the per-page metadata helper
  styles/                site.css (the design system), fonts.css + the woff2 files

scripts/
  images.mjs             grades raw/ with sharp -> public/assets/img + images.json
  fonts.mjs              refresh the vendored IBM Plex (needs network; not a build step)
  postbuild.mjs          writes out/index.html, the language gate
  port-content.py        one-shot port from the original Python model; kept as a record

tests/site.spec.ts       48 Playwright checks across desktop and mobile
raw/                     the twelve source photographs, ungraded
```

### Adding or changing copy

Everything is in `src/content/en.ts` and `ar.ts`, typed against `Copy` in `types.ts`.
Add a field to the interface and TypeScript will tell you which language is missing it,
which is the main reason this port was worth doing — the previous generator would
happily ship a half-translated page.

---

## Design system

Navy `#1B2A5B` (from the printed brochure) as the ground, crimson `#C8102E` as the
single accent, held to roughly 3% of any viewport.

> **The one rule that matters:** crimson on navy is **2.33:1** and fails WCAG badly.
> Crimson never appears as text, an icon or a rule on a navy ground — only as a filled
> block with white on it. On dark grounds the accent is `--crimson-500` `#E01235`, and
> only at display sizes.

Type is IBM Plex Sans + IBM Plex Sans Arabic + IBM Plex Mono — one coordinated
superfamily, so both scripts share weight and rhythm instead of being two unrelated
faces bolted together. Self-hosted through the bundler, latin and arabic subsets only
(≈460 KB total, and a browser fetches only the subset its script needs).

### Navigation

| width | what shows |
|---|---|
| ≥ 1081px | full horizontal nav in the header |
| 901–1080px | burger drawer |
| ≤ 900px | **bottom tab bar** + burger drawer |

The bar carries five destinations — Home, Services, Tools, Wells and Contact, the last
of these the conversion action, marked by a filled crimson disc rather than crimson
text. About is the one page not in the bar; the drawer still carries all six. Below
900px the top bar is hidden too, reclaiming 38px of chrome on a phone.

`--tabbar-h` is a single token driving both the bar's height and the
`padding-block-end` that keeps content clear of it, so the two cannot drift. The bar's
top rule is an inset box-shadow rather than a border, for the same reason — a border
would add to the height the padding is derived from. `env(safe-area-inset-bottom)`
handles the iPhone home indicator, on the bar and on the drawer.

### Arabic / RTL

The part most likely to break if someone edits it later:

- The stylesheet is written entirely in **logical properties**, so `dir="rtl"` does
  almost all the work. The exceptions are overridden explicitly: the hero scrim
  gradient, the hero backdrop (mirrored, so the Arabic headline still lands on the
  dark half of the photograph, with the overlay's text un-mirrored so it still reads),
  directional icons, and the ticker.
- **`letter-spacing: 0 !important` in RTL.** Arabic is a connected script; tracking
  severs the joins. A test asserts no element ever has non-zero tracking in Arabic.
- Arabic line-height goes up (1.82 body / 1.34 headings) and font-size down a notch —
  Plex Arabic runs large.
- `text-transform: uppercase` does nothing in Arabic, so every uppercase micro-label
  switches to a heavier weight and a size bump in RTL rather than silently losing a
  layer of hierarchy.
- **Western numerals (0–9)** throughout — Libya and the Maghreb use these, not the
  Eastern Arabic-Indic forms common in the Gulf. A test asserts `٠-٩` never appears.
- Latin runs inside Arabic prose go through `<Bidi>`, which wraps them in `<bdi>`.
  Without it `Rompetrol Well Services وSCA-Sichuan` and `15,000 psi` scramble at the
  bidi boundary.
- **Never put `--font-mono` on anything translatable.** IBM Plex Mono has no Arabic
  coverage and the system fallback destroys letter-joining. RTL swaps the whole mono
  layer to Plex Sans Arabic through `--ff-mono`.

### Illustration

Every diagram is hand-authored SVG in `src/components/svg/Diagrams.tsx`:

- **Wellbore cross-section** — casing strings, cement sheath, completion, perforations,
  depth scale to TD 3,240 m. Draws itself on scroll and highlights one stage at a time
  as you move through the four service steps beside it.
- **Drone gas survey** — animated VOC/H₂S/SO₂ plume over a live pipeline, sensor cone,
  live-readout HUD. A photo of a drone sells nothing; a visualisation of a detected
  leak sells the service.
- **Libya basin map** — coastline including the Gulf of Sirte, with the Sirte, Murzuq,
  Ghadames and Cyrenaica basins and the Tripoli pin.
- **Hero annotation overlay** — dimension lines and mono call-outs over the photograph.

---

## Performance notes

First load is **≈218 KB gzipped** (HTML + JS + CSS), against ~60 KB for the plain
static build this was ported from. That difference is the React runtime, and it is the
honest cost of the component model. Two things keep it from being worse:

- **Prefetch is off on every internal `Link`.** App Router prefetches in-viewport links
  by default; across twelve static pages carrying large inline SVG that meant ~2.5 MB
  of route payloads pulled down before anyone clicked anything. Wrong trade for the
  connections this site is opened over.
- **Photography is graded and encoded at build time** into a webp ladder with a jpeg
  fallback, and every image carries an inline blurred placeholder so nothing flashes
  white while the real file arrives.

If the JS budget ever becomes the binding constraint, the client components are
`Reveal`, `Counter`, `ChromeEffects`, `Drawer`, `WellScroller`, `ServiceCatalogue` and
`ContactForm` — everything else is server-rendered.

---

## Testing

```bash
npm run typecheck
npm test              # 48 Playwright checks, desktop + mobile
```

Covers all twelve pages (status, lang/dir, single h1, description length, reciprocal
hreflang, image alts, horizontal overflow, console errors), internal link integrity,
the language switch landing on the matching page, the two RTL rules above, the
catalogue filter and search, the contact form, the wellbore stage highlighting, and the
bottom bar (fixed, flush, five tabs, one current, one CTA, every target ≥44×44, body
padding clears the bar, the footer is never covered).

`CHROMIUM_PATH` points Playwright at an existing Chromium if the environment cannot
download one.

---

## Deployment

`.github/workflows/pages.yml` runs on every push to `main`: install, typecheck, build,
Playwright, then deploy to GitHub Pages — **only if all of them pass**. Pull requests
run everything except the deploy.

`NEXT_PUBLIC_BASE_PATH` handles serving from a subpath (`user.github.io/REPO`); the
workflow sets it to the repo name. Leave it empty for a custom domain or a user root
site. Everything derives from it — routes, canonical, hreflang, `public/` assets and
the language gate — so there is one thing to change.

**One-time setup:** Settings → Pages → Source → GitHub Actions. The workflow enables
Pages itself on the first run; if your account blocks that, set it by hand and re-run.

---

## Open items

The contact form is a **demonstration** — this is a static export with no backend, and
the page says so rather than implying a message was sent. To make it real, either point
it at a form endpoint (Formspree and similar keep the static export intact) or move to
a Node host and add a server action.

The four departmental mailboxes on the contact page are **proposed**, not live; the
page says that too.

See `CREDITS.md` for photography attribution — including three frames that were
deliberately discarded because a competitor's brand was legible in them.
