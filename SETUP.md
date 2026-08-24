# Getting this running

```bash
npm install
npm run build      # grades the photography, then generates out/
npm start          # http://127.0.0.1:4321
```

`npm run dev` for the usual dev server with hot reload.

The build needs no network — the fonts are vendored and the photography is graded
locally from `raw/` by sharp.

## Putting it on GitHub

The repo is already initialised with one commit. Create an empty repo on GitHub, then:

```bash
git remote add origin https://github.com/AbduMurad/<repo-name>.git
git push -u origin main
```

`.github/workflows/pages.yml` fires on that push: install → typecheck → build →
Playwright → deploy to Pages, and it only deploys if all of them pass.

Then **Settings → Pages → Source → GitHub Actions** (the workflow tries to enable this
itself; do it by hand if your account blocks that).

The site lands at `https://abdumurad.github.io/<repo-name>/`. The workflow sets
`NEXT_PUBLIC_BASE_PATH` to the repo name automatically, which is what makes the
subpath work — routes, canonical, hreflang, assets and the language gate all derive
from that one variable. Leave it empty if you point a custom domain at it.

## Running the tests

```bash
npm run typecheck
npm test
```

48 checks across desktop and mobile. If your machine can't download Playwright's
browser, point it at one you already have:

```bash
CHROMIUM_PATH=/path/to/chrome npm test
```

## Where to change things

| what | where |
|---|---|
| any wording, either language | `src/content/en.ts`, `src/content/ar.ts` |
| the service catalogue (24 entries) | `src/content/services.ts` |
| phone, email, address | `src/content/facts.ts` |
| colour, type, spacing, breakpoints | `src/styles/site.css` |
| the diagrams | `src/components/svg/Diagrams.tsx` |
| which photo goes where, and its grade | `scripts/images.mjs` (the `SPEC` table) |

Copy is typed against the `Copy` interface in `src/content/types.ts`. Add a field
there and TypeScript will tell you which language is missing it.

## Before this could go live

- The contact form is a demonstration — static export, no backend, and the page says
  so. Point it at a form endpoint, or move to a Node host and add a server action.
- The four departmental mailboxes on the contact page are proposed, not live.
- Replace the photography with Remal Nahya's own once they have it. Drop files into
  `raw/`, update the `SPEC` table, re-run `npm run assets`. Check any new frame at
  full size for a competitor's brand first — see `CREDITS.md`.
