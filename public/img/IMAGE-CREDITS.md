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

All Unsplash, under the Unsplash Licence (https://unsplash.com/license), which
permits commercial use without permission or attribution. Attribution is
recorded here anyway, as a matter of provenance rather than obligation.
Retrieved 2026-10-31, inspected the same day.

| File | Subject | Photographer | Source | Alt text |
|---|---|---|---|---|
| `industrial/hero-production-floor.jpg` | Automated production line, robot arms, mesh cell guarding | Simon Kadula | [unsplash.com/photos/…8gr6bObQLOI](https://unsplash.com/photos/a-factory-filled-with-lots-of-orange-machines-8gr6bObQLOI) | Industrial robots working within a manufacturing production line |
| `industrial/production-facility.jpg` | Machine shop with marked pedestrian walkway | MGR P | [unsplash.com/photos/…HNLlzPGbTBM](https://unsplash.com/photos/industrial-factory-floor-with-machinery-and-yellow-lines-HNLlzPGbTBM) | Manufacturing floor with production machinery and marked pedestrian walkways |
| `industrial/machinery-guarding.jpg` | Press line with perimeter guard rail, fencing, E-stop, floor demarcation | Homa Appliances | [unsplash.com/photos/…SaX8ZBFkLTc](https://unsplash.com/photos/a-machine-that-is-inside-of-a-building-SaX8ZBFkLTc) | Guard rails and perimeter fencing around automated production machinery |
| `industrial/welding-fabrication.jpg` **(cropped)** | Welder in helmet and gloves at a fabrication bench | See source page | [unsplash.com/photos/…X_55Pa9E8h4](https://unsplash.com/photos/a-man-in-a-welding-helmet-working-on-a-piece-of-metal-X_55Pa9E8h4) | A welder in a protective helmet and gloves working at a fabrication bench |
| `industrial/fire-hazardous-substances.jpg` | Fire protection pipework in an empty warehouse | Gilson Gomes | [unsplash.com/photos/…LvJfhkuDHDw](https://unsplash.com/photos/an-empty-warehouse-with-red-piping-on-the-ceiling-LvJfhkuDHDw) | Red fire protection pipework beneath the roof of an industrial warehouse |

### Inspection notes on the published five

- **hero-production-floor** — no people, no legible branding, mesh guarding
  visible around the cells. Clean.
- **production-facility** — marked pedestrian walkway, guarded machine
  enclosures, no people. Minor: a rusted drum with floor staining is visible
  mid-right. Realistic for a working factory and not presented as our work.
- **machinery-guarding** — the strongest match for its card: perimeter guard
  rail, mesh fencing, emergency stop on the pedestal, floor demarcation.
  Minor: a trailing cable crosses the demarcated zone.
- **welding-fabrication** — **CROPPED from the original.** The original carried
  a legible Carhartt patch on the jacket at roughly x1095–1160, y745–815 of
  the 1800×1200 source. The published file is an exact 4:3 crop of
  (454, 0)–(1446, 744), which excludes the patch entirely, and is stored at
  992×744.

  Why crop rather than accept it: at card size (475×317) the wordmark was not
  legible, but at 2× on a high-resolution display it was at the edge of
  legibility and the patch shape is recognisable to anyone who knows the
  brand. Cropping removed the question permanently at no real cost.

  What the crop keeps: welding helmet with auto-darkening lens, gauntlet
  glove, long-sleeved jacket, torch in hand — the PPE is more prominent than
  before. What it loses: the fire extinguisher and wider workshop context.

  A worn Miller mark remains on the helmet crown. It is scuffed and faded and
  resolves to a smudge at card size; verified at 1×, 2× and mobile width.

  Note the crop is 992px wide, below the 1600px minimum stated below. That
  minimum is a sourcing rule for new files; cropping necessarily costs
  resolution, and 992px still supplies better than 2× for a 475px card.
- **fire-hazardous-substances** — clean, no people, no branding. Shows fire
  protection pipework and **no hazardous substances**, so the alt text
  describes the pipework and does not claim otherwise.

## Rejected candidates — do not publish

| File | Reason |
|---|---|
| `industrial/warehouse-forklift.jpg` | "NISSAN FORKLIFT" and "UNICARRIERS" appear large, central and fully legible — the brand is effectively the subject, which reads as endorsement. Also shows no segregation, racking or pedestrian routes, so a weak match for its card. |
| `industrial/construction-inspection.jpg` | **Visible unsafe practice.** A worker in flip-flops standing on rubble, and others in the background without head protection. Portrait orientation (1800×2700) rather than landscape. Unusable on a page selling construction site inspections. |

Both files are left untracked in the working tree. They are not committed and
will never be deployed. Delete them locally whenever convenient.

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
