# Download source documents

Committed source for the Downloads library (Phase 5A, PR 8A).

Files here are **source**, not build output. Velite copies each referenced file
into `public/static/` with a content hash at build time; that directory is
generated, emptied on every build, and gitignored. Nothing should ever be
hand-placed there.

Frontmatter must reference files **relatively**:

    fileUrl: "./files/lion-rms-example-v1-0.pdf"

`s.file({ allowNonRelativePath: false })` in `lib/content-schemas.ts` rejects any
other form. That flag is load-bearing: Velite's default lets a non-relative path
through untouched, skipping the existence check entirely and producing a clean
build with a broken download.

Naming: `lion-rms-<slug>-v<major>-<minor>.<ext>`. The version is in the filename
because a downloaded document has to identify itself a year later, in a folder,
detached from the page it came from.

**Only reviewed, final documents belong here.** An unreferenced file is not
published, but it is still in a public repository — `npm run content:audit`
reports any file no resource references.
