# Credits

## Photography

All twelve photographs are from [Unsplash](https://unsplash.com), used under the
[Unsplash License](https://unsplash.com/license) (free for commercial use, no
attribution required — credited here anyway). Originals are in `raw/`; the versions
in `public/assets/img/` are cropped and colour-graded by `scripts/images.mjs`.

| File | Unsplash ID | Photographer | Used for |
|---|---|---|---|
| `rig_night_a.jpg` | `photo-1562237553-fd52cb2067b6` | WORKSITE Ltd. | Homepage hero |
| `rig_sil.jpg` | `photo-1562237548-fd6c68ae356a` | WORKSITE Ltd. | Services page header |
| `tool_macro.jpg` | `photo-1709613439196-1c08b60af80c` | shraga kopstein | EGA Master page header |
| `rig_desert.jpg` | `photo-1696059928249-f036c4d54338` | Yuan Chen | Well Services page header |
| `desert_dusk.jpg` | `photo-1773097259226-8d567dd1a099` | Aritra Roy | About page header |
| `tower_night.jpg` | `photo-1588011930968-eadac80e6a5a` | Maksym Kaharlytskyi | Contact page header |
| `wh_bars.jpg` | `photo-1763926025477-423847028860` | Zoshua Colah | Authorised-distribution panel |
| `pipes_dark.jpg` | `photo-1757271453507-bbee317318a8` | Simon Infanger | Strategic partners backdrop |
| `pump_sunset.jpg` | `photo-1778124691381-ee0ef169500c` | Nils Huenerfuerst | About — "the bridge" |
| `wh_dark.jpg` | `photo-1727199079123-ba845d5ab4f6` | Alex Durynin | About — process timeline |
| `hat_dark.jpg` | `photo-1582489853490-cd3a53eb4530` | Ümit Yıldırım | EGA Master — why certified tools |
| `refin_circ.jpg` | `photo-1784914179675-0e6d7260dfd0` | Julia Taubitz | Well Services — applications |

### Deliberately not used

Three otherwise-good candidates were discarded because a **competitor's brand is
legible** in them. Do not reinstate these:

| Unsplash ID | Problem |
|---|---|
| `photo-1615746360032-1ecf87f250fb` | `FORCE` and `FORCE 75510` stamped on the spanners — a rival hand-tool brand, and it sat directly beside the line "not a re-boxed equivalent, not a parallel import" |
| `photo-1615746363486-92cd8c5e0a90` | `FORCE CR-V 80243` / `FORCE CR-V 41332` on the socket set |
| `photo-1562237553-36ad661d6f2c` | `ERIELL` stencilled on the derrick mast — a rival drilling contractor |

Check any replacement photograph at full resolution for stamped markings, signage and
liveries before adding it. `scripts/images.mjs` carries the same warning in a comment.

## Type

[IBM Plex Sans, IBM Plex Sans Arabic and IBM Plex Mono](https://github.com/IBM/plex)
by IBM, under the [SIL Open Font License 1.1](https://openfontlicense.org/).
`scripts/fonts.mjs` fetches them and keeps only the latin and arabic subsets. The
files are vendored in `src/styles/fonts/` and served through the bundler, so the
build needs no network.

## Everything else

All illustration, iconography, the logo redraw, layout, code and copy in this
repository were produced for this concept. The company name, contact details, partner
names and service descriptions belong to Remal Nahya for Oil Services and are taken
from their printed brochure and their existing website.
