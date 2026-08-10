// Repositioning PR4 — Qualifications & Professional Credibility.
//
// Adds a third qualification (Level 6 Diploma in Applied Health and Safety,
// NCRQ) and a new "professional card" credential category (CSCS
// Professionally Qualified Person) — see QUALIFICATIONS and the new
// PROFESSIONAL_CARDS in lib/site.ts.
//
// The owner set hard limits on this data before supplying the wording:
// no award date, no grade, no expiry, no registration/candidate/certificate
// number anywhere in the codebase or on the built site; no ISO 45001
// certification, auditor or certification-body claim; no implication that
// Lion RMS or Batir acts as Principal Designer or Principal Contractor. These
// tests exist so a future edit cannot reintroduce any of those, and so the
// two new pieces of wording can never drift from what was actually verified
// from the certificate and the card.

import { test, describe, before } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const outDir = path.join(repoRoot, ".next/server/app");

const read = (p) => fs.readFileSync(path.join(repoRoot, p), "utf8");

const builtPages = (dir = outDir, out = []) => {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) builtPages(full, out);
    else if (e.name.endsWith(".html")) out.push(full);
  }
  return out;
};

before(() => {
  if (!fs.existsSync(outDir)) {
    throw new Error("run `npm run build` before this suite — it asserts on built HTML");
  }
});

const NCRQ_TITLE = "Level 6 Diploma in Applied Health and Safety";
const CSCS_WORDING = "CSCS Professionally Qualified Person";

describe("the data model holds only what was verified, and nothing else", () => {
  test("QUALIFICATIONS carries the exact NCRQ title, third in the list", async () => {
    const { QUALIFICATIONS } = await import("../lib/site.ts");
    assert.equal(QUALIFICATIONS.length, 3);
    assert.deepEqual(
      QUALIFICATIONS.map((q) => q.name),
      [
        "Level 4 Diploma in Fire Risk Assessment",
        "Level 5 Diploma in Fire Engineering Design",
        NCRQ_TITLE,
      ]
    );
  });

  test("every Qualification entry has only a name — no date, grade, or other field", async () => {
    const { QUALIFICATIONS } = await import("../lib/site.ts");
    for (const q of QUALIFICATIONS) {
      assert.deepEqual(Object.keys(q), ["name"]);
    }
  });

  test("PROFESSIONAL_CARDS carries CSCS, category exactly as printed on the card", async () => {
    const { PROFESSIONAL_CARDS } = await import("../lib/site.ts");
    assert.equal(PROFESSIONAL_CARDS.length, 1);
    assert.equal(PROFESSIONAL_CARDS[0].abbr, "CSCS");
    assert.equal(PROFESSIONAL_CARDS[0].status, "Professionally Qualified Person");
  });

  test("every ProfessionalCard entry has only abbr, status and fullName — no expiry or number", async () => {
    const { PROFESSIONAL_CARDS } = await import("../lib/site.ts");
    for (const c of PROFESSIONAL_CARDS) {
      assert.deepEqual(new Set(Object.keys(c)), new Set(["abbr", "status", "fullName"]));
    }
  });

  test("MEMBERSHIPS is unchanged — same five, same order, same grades", async () => {
    const { MEMBERSHIPS } = await import("../lib/site.ts");
    assert.deepEqual(
      MEMBERSHIPS.map((m) => `${m.abbr} — ${m.grade}`),
      ["MIFireE — Member", "CMIOSH — Chartered", "MIFSM — Member", "MIIRSM — Member", "AIEMA — Associate"]
    );
  });

  test("CREDENTIALS renders the CSCS card as exactly the owner's specified wording", async () => {
    const { CREDENTIALS } = await import("../lib/site.ts");
    assert.ok(
      CREDENTIALS.includes(CSCS_WORDING),
      `CREDENTIALS does not contain the exact string "${CSCS_WORDING}"`
    );
  });
});

describe("Person JSON-LD carries the new credentials, and nothing more than that", () => {
  test("hasCredential includes exactly one Professional Card entry, named correctly", async () => {
    const { ASSESSOR, MEMBERSHIPS, QUALIFICATIONS, PROFESSIONAL_CARDS, SITE } = await import("../lib/site.ts");
    const { buildPersonProfileSchema } = await import("../lib/content-jsonld.ts");
    const schema = buildPersonProfileSchema({
      name: ASSESSOR.name,
      role: ASSESSOR.role,
      bio: ASSESSOR.bio,
      photo: ASSESSOR.photo,
      siteName: SITE.name,
      memberships: MEMBERSHIPS,
      qualifications: QUALIFICATIONS,
      professionalCards: PROFESSIONAL_CARDS,
    });
    const cards = schema.hasCredential.filter((c) => c.credentialCategory === "Professional Card");
    assert.equal(cards.length, 1);
    assert.equal(cards[0].name, "Construction Skills Certification Scheme (CSCS) — Professionally Qualified Person");

    const quals = schema.hasCredential.filter((c) => c.credentialCategory === "Qualification");
    assert.ok(quals.some((q) => q.name === NCRQ_TITLE));
  });

  test("no hasCredential entry carries a date, grade or expiry field", async () => {
    const { ASSESSOR, MEMBERSHIPS, QUALIFICATIONS, PROFESSIONAL_CARDS, SITE } = await import("../lib/site.ts");
    const { buildPersonProfileSchema } = await import("../lib/content-jsonld.ts");
    const schema = buildPersonProfileSchema({
      name: ASSESSOR.name,
      role: ASSESSOR.role,
      bio: ASSESSOR.bio,
      photo: ASSESSOR.photo,
      siteName: SITE.name,
      memberships: MEMBERSHIPS,
      qualifications: QUALIFICATIONS,
      professionalCards: PROFESSIONAL_CARDS,
    });
    for (const c of schema.hasCredential) {
      assert.deepEqual(new Set(Object.keys(c)), new Set(["@type", "credentialCategory", "name"]));
    }
  });
});

describe("nothing withheld reaches the built site", () => {
  const WITHHELD = [
    /9 October 2018/,
    /\bMerit\b/,
    /August 2028/,
    /Academically Qualified Person/,
  ];

  test("no award date, grade, CSCS expiry, or the wrong CSCS category name appears in any built page", () => {
    for (const file of builtPages()) {
      const html = fs.readFileSync(file, "utf8");
      for (const pattern of WITHHELD) {
        assert.equal(
          pattern.test(html),
          false,
          `${path.relative(repoRoot, file)} contains withheld wording matching ${pattern}`
        );
      }
    }
  });

  test("no award date, grade, CSCS expiry, registration number or candidate number appears in source", () => {
    const sources = ["lib/site.ts", "lib/content-jsonld.ts", "components/PersonJsonLd.tsx", "app/about/page.tsx"];
    const forbidden = [
      /9 October 2018/,
      /\bMerit\b/,
      /August 2028/,
      /registrationNumber/i,
      /candidateNumber/i,
      /certificateNumber/i,
    ];
    for (const file of sources) {
      const src = read(file);
      for (const pattern of forbidden) {
        assert.equal(pattern.test(src), false, `${file} contains ${pattern}`);
      }
    }
  });
});

describe("no overclaim slipped in alongside the real credentials", () => {
  test("no page claims ISO 45001 certification, auditor status, or certification-body status", () => {
    const claims = [
      /ISO ?45001[^.]{0,80}(certifi|accredit)/i,
      /\bauditor\b/i,
      /certification body/i,
    ];
    for (const file of builtPages()) {
      const html = fs.readFileSync(file, "utf8");
      for (const pattern of claims) {
        assert.equal(
          pattern.test(html),
          false,
          `${path.relative(repoRoot, file)} contains a possible overclaim matching ${pattern}`
        );
      }
    }
  });

  test("Lion RMS is never described as Principal Designer or Principal Contractor", () => {
    // Case studies legitimately name a CLIENT's sector as "Construction ·
    // Principal Contractor" (lib/case-studies.ts) — that describes who the
    // client is, not a role Lion RMS holds, so it is excluded by requiring
    // the phrase to sit next to a first-person / self-referential frame
    // rather than banning the words outright.
    const selfClaim = /\b(Lion (Risk Management Solutions|RMS)|Batir|we|our practice)\b[^.]{0,60}\bacts? as\b[^.]{0,40}\bPrincipal (Designer|Contractor)\b/i;
    for (const file of builtPages()) {
      const html = fs.readFileSync(file, "utf8");
      assert.equal(
        selfClaim.test(html),
        false,
        `${path.relative(repoRoot, file)} appears to claim a Principal Designer/Contractor appointment`
      );
    }
  });
});
