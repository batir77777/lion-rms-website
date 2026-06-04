# Lion Risk Management Solutions — Website

Fast, SEO-friendly marketing site built with **Next.js 15 (App Router) + Tailwind CSS**.
No database, no backend — the contact form posts directly to **Formspree**.

## Pages

- `/` — Home (Hero, Fire Safety, Health & Safety, Digital Compliance, Why Choose Us, Final CTA)
- `/about` — About
- `/case-studies` — Case Studies
- `/contact` — Contact (Formspree form)

All editable content (services, phone, email, links) lives in **`lib/site.ts`**.

## Run locally (Windows)

```bash
cd C:\MissionControl\LionRMS-Website
npm install
npm run dev
```

Open http://localhost:3000

## Before you go live — two quick edits

1. **Connect the contact form.** Create a free form at https://formspree.io,
   copy its form ID (looks like `xyzabcde`), and paste it into `lib/site.ts`:

   ```ts
   formspreeId: "xyzabcde",
   ```

   Set the Formspree form's notification email to `admin@lionrms.uk`.

2. **Check your details** in `lib/site.ts` (phone, email, community links).

## Deploy to Vercel

### Option A — via GitHub (recommended)

1. Push this folder to a new GitHub repo:
   ```bash
   git init
   git add .
   git commit -m "Initial site"
   git branch -M main
   git remote add origin https://github.com/<you>/lionrms-website.git
   git push -u origin main
   ```
2. Go to https://vercel.com → **Add New… → Project** → import the repo.
3. Framework preset is auto-detected as **Next.js**. Leave defaults
   (Build: `next build`, Output: `.next`). No environment variables needed.
4. Click **Deploy**. You get a live `*.vercel.app` URL in ~1 minute.

### Option B — via Vercel CLI

```bash
npm i -g vercel
vercel        # first run: links/creates the project
vercel --prod # deploy to production
```

### Point lionrms.uk at Vercel

1. In the Vercel project → **Settings → Domains** → add `lionrms.uk` and
   `www.lionrms.uk`.
2. Vercel shows the DNS records to set. At your domain registrar:
   - `A` record for `@` → `76.76.21.21`
   - `CNAME` for `www` → `cname.vercel-dns.com`
   (Use whatever values Vercel displays — they take priority.)
3. Wait for DNS to verify (minutes to a couple of hours). HTTPS is automatic.

> Note: your current site is on Squarespace. Only switch the DNS once you're
> happy with this site, then cancel Squarespace separately.

## Tech notes

- TypeScript, Tailwind 3.4, no UI library — clean custom components.
- Subtle scroll-reveal animations (`components/Reveal.tsx`), respects
  `prefers-reduced-motion`.
- SEO: per-page metadata, Open Graph, `sitemap.xml`, `robots.txt`.
- Fully responsive with a mobile nav.
