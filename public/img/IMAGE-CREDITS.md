# Image credits and licences

Every photograph published on this site must have a row here before it ships.
A file with no row is not licensed as far as this repository is concerned, and
should not be referenced from any page.

## Rules

1. **Free licence only** unless the owner has approved a paid licence.
2. **Store locally.** Download the file into `public/img/` rather than
   hotlinking a third party, so the page does not break when a remote URL
   changes and nothing leaks a referrer.
3. **Captions describe the hazard, never a project.** A stock photograph of a
   factory implies nothing untrue; a caption saying we worked there does.
4. **No client premises** without written permission from that client, and
   the caption must say so.
5. **Platform screenshots use demonstration data only** — never a client's
   records, names, sites or logos.

## Published images

| File | Subject | Source | Licence | Added | Alt text |
|---|---|---|---|---|---|
| _(none yet)_ | | | | | |

## Image plan — seven cards, six photographs

Card 7 (Digital compliance records) **deliberately has no photograph**. The
only honest image there is a screenshot of the platform, and no screenshot may
be invented. It keeps the branded placeholder until a genuine screenshot with
demonstration data is supplied.

### Awaiting download — referenced by `lib/site.ts`, currently commented out

Until each file exists its path stays commented out, so the card shows the
branded placeholder and the hero stays text-only. Nothing breaks, and no
unlicensed image can reach a page.

| # | File | Subject needed |
|---|---|---|
| H | `industrial/hero-production-floor.jpg` | A production floor in an industrial manufacturing facility — wide, people optional, no visible branding |
| 1 | `industrial/production-facility.jpg` | Machinery on a factory production floor |
| 2 | `industrial/machinery-guarding.jpg` | Guarding or interlocks fitted to work equipment |
| 3 | `industrial/warehouse-forklift.jpg` | A forklift operating in a warehouse aisle |
| 4 | `industrial/welding-fabrication.jpg` | A welder at a fabrication bench, wearing correct PPE |
| 5 | `industrial/construction-inspection.jpg` | A site inspection in progress, hi-vis and hard hats |
| 6 | `industrial/fire-hazardous-substances.jpg` | Drums or containers in an industrial storage area |

### Technical requirements

- **Local files only.** Download into `public/img/industrial/`; do not
  reference a remote URL. Local files are optimised by next/image at build
  time and served as AVIF or WebP at the right size for the device.
- **At least 1600px wide**, landscape. Cards crop to 4:3 and the hero to 5:4,
  so avoid anything where the subject sits at the extreme edge.
- **Under about 1MB each** before optimisation. next/image will resize, but a
  20MB original slows every build for no benefit.

### Selection notes

- Choose images where **anyone shown is wearing appropriate PPE**. A photograph
  of unsafe practice on a safety consultancy's page undermines the page.
- Avoid anything depicting an accident, injury or distress.
- Avoid visible company names, logos or number plates.
- Prefer landscape, at least 1600px wide, so the 4:3 crop stays sharp.
