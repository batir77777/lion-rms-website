// Hero product-demo probe: the animated showcase must AUTOPLAY on load (it is
// above the fold — no scrolling happens here), loop through all three act
// captions, climb the gauge, and expose its navigational deep-links.
//
// Usage: node scripts/check-demo.mjs [baseUrl]   (default :3002)

import puppeteer from "puppeteer-core";

const BASE = process.argv[2] || "http://localhost:3002";
const EDGE = "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";

const browser = await puppeteer.launch({
  executablePath: EDGE,
  headless: true,
  args: ["--no-sandbox", "--disable-gpu"],
  defaultViewport: { width: 1366, height: 900 },
});
const page = await browser.newPage();
await page.goto(`${BASE}/`, { waitUntil: "networkidle2", timeout: 60000 });
await new Promise((r) => setTimeout(r, 800)); // hydration only — NO scrolling

let fail = 0;

// ---- 1. Autoplay: sample captions + gauge over one full loop (~16s) ----
const captions = new Set();
let maxGauge = 0;
const t0 = Date.now();
while (Date.now() - t0 < 16000) {
  const s = await page.evaluate(() => {
    const demo = document.querySelector("[data-anim-demo]");
    const cap = demo
      ?.querySelector(".absolute.inset-x-0.bottom-3 p")
      ?.textContent?.trim();
    const gauge = demo?.textContent?.match(/(\d+)%/)?.[1];
    return { cap, gauge: gauge ? parseInt(gauge, 10) : null };
  });
  if (s.cap) captions.add(s.cap);
  if (s.gauge && s.gauge > maxGauge) maxGauge = s.gauge;
  await new Promise((r) => setTimeout(r, 400));
}

const expected = [
  "Every assessment starts on site.",
  "Findings become live actions — automatically.",
  "Compliance that stays current — reports, actions, reminders, records.",
];
for (const e of expected) {
  const ok = captions.has(e);
  console.log(`${ok ? "PASS" : "FAIL"}  hero autoplay caption: "${e.slice(0, 48)}…"`);
  if (!ok) fail++;
}
const gaugeOk = maxGauge >= 90;
console.log(`${gaugeOk ? "PASS" : "FAIL"}  gauge climbed to ${maxGauge}% (expect ≥90)`);
if (!gaugeOk) fail++;

// ---- 2. Navigational deep-links inside the demo ----
const links = await page.evaluate(() => {
  const demo = document.querySelector("[data-anim-demo]");
  return Array.from(demo?.querySelectorAll("a") ?? []).map((a) =>
    a.getAttribute("href"),
  );
});
for (const target of [
  "/services/fire-safety",
  "/services/health-safety",
  "/services/digital-compliance",
]) {
  // Each target appears at least twice: the demo zone + the caption nav row.
  const count = links.filter((h) => h === target).length;
  const ok = count >= 2;
  console.log(`${ok ? "PASS" : "FAIL"}  deep-link ${target} (zone + caption row, found ${count})`);
  if (!ok) fail++;
}

// ---- 3. Overflow guard at three widths: content right edge must never
//         exceed the stage right edge, sampled through every act ----
for (const width of [1440, 1280, 1024]) {
  await page.setViewport({ width, height: 900 });
  await page.goto(`${BASE}/`, { waitUntil: "networkidle2", timeout: 60000 });
  await new Promise((r) => setTimeout(r, 800));

  const actsSeen = new Set();
  let worst = { overflow: -Infinity, act: "", el: "" };
  const start = Date.now();
  while (Date.now() - start < 14500) {
    const s = await page.evaluate(() => {
      const stage = document.querySelector("[data-anim-demo] > div");
      if (!stage) return null;
      const sr = stage.getBoundingClientRect();
      const cap =
        stage.querySelector(".absolute.inset-x-0.bottom-3 p")?.textContent?.trim() ?? "?";
      let overflow = -Infinity;
      let elDesc = "";
      stage.querySelectorAll("*").forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.width === 0 && r.height === 0) return;
        const o = r.right - sr.right;
        if (o > overflow) {
          overflow = o;
          elDesc = `<${el.tagName.toLowerCase()}> ${(el.textContent || "").trim().slice(0, 30)}`;
        }
      });
      return { cap, overflow, elDesc };
    });
    if (s) {
      actsSeen.add(s.cap);
      if (s.overflow > worst.overflow) worst = { overflow: s.overflow, act: s.cap, el: s.elDesc };
    }
    await new Promise((r) => setTimeout(r, 250));
  }
  // Sub-pixel tolerance for scaled transforms.
  const ok = worst.overflow <= 0.5 && actsSeen.size >= 3;
  console.log(
    `${ok ? "PASS" : "FAIL"}  width ${width}px: max content overflow ${worst.overflow.toFixed(1)}px across ${actsSeen.size} act captions` +
      (ok ? "" : ` (worst during "${worst.act}" at ${worst.el})`),
  );
  if (!ok) fail++;
}

await browser.close();
console.log(fail === 0 ? "\nHERO DEMO OK" : `\n${fail} FAILURE(S)`);
process.exit(fail === 0 ? 0 : 1);
