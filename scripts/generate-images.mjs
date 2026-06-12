// Generate bespoke AI section images for the LRMS site via OpenAI gpt-image-1.
// Reads OPENAI_API_KEY from C:\MissionControl\.env.local (never logged).
// Saves landscape JPEGs to public/img/services/.
//
// Usage:
//   node scripts/generate-images.mjs            # generate all 6
//   node scripts/generate-images.mjs fire-2     # regenerate one by id

import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

// Key lookup: Mission Control keystore first (keys.local.json), then .env.local.
function findKey(name) {
  try {
    const store = JSON.parse(
      readFileSync("C:/MissionControl/keys.local.json", "utf8"),
    );
    if (store[name]?.trim()) return store[name].trim();
  } catch {
    /* no keystore */
  }
  try {
    const env = readFileSync("C:/MissionControl/.env.local", "utf8");
    const m = env.match(new RegExp(`^${name}=(.+)$`, "m"));
    if (m?.[1]?.trim()) return m[1].trim();
  } catch {
    /* no env file */
  }
  return null;
}

const KEY = findKey("OPENAI_API_KEY");
if (!KEY) {
  console.error("OPENAI_API_KEY not found in keystore or .env.local");
  process.exit(1);
}

const OUT_DIR = path.resolve("public/img/services");
mkdirSync(OUT_DIR, { recursive: true });

// Shared style block — keeps every section image visually consistent.
const STYLE =
  "Premium cinematic photorealistic 3D render, high-end corporate brand imagery. " +
  "Colour palette: deep charcoal and near-black architecture with warm ember-orange accent lighting " +
  "(amber glow strips, warm practical lights), cool steel-grey mid-tones. Moody, sophisticated, modern. " +
  "Shallow depth of field, soft volumetric light, crisp PBR materials, subtle film grain. " +
  "Subject seen in three-quarter or side profile, face softly lit and natural. " +
  "Composition leaves breathing room, wide landscape framing. " +
  "Absolutely no text, no signage lettering, no logos, no watermarks, no UI overlays.";

const JOBS = [
  {
    id: "fire-1",
    prompt:
      "A professional fire risk assessor in smart dark consultancy attire holding a tablet, inspecting a modern fire door " +
      "and its self-closer in a sleek commercial corridor. He examines the intumescent seal along the door edge. " +
      "A soft green emergency-exit glow in the background, ember-orange accent light tracing the corridor ceiling. " +
      STYLE,
  },
  {
    id: "fire-2",
    prompt:
      "A professional fire risk assessor in smart dark attire reviewing a wall-mounted fire alarm control panel in a " +
      "modern commercial building lobby at dusk, tablet in one hand, the panel's small indicator lights glowing amber " +
      "and red against dark charcoal walls. Warm ember downlights, glass and dark steel architecture. " +
      STYLE,
  },
  {
    id: "fire-3",
    prompt:
      "A professional fire risk assessor with a tablet assessing a modern emergency escape stairwell in a commercial " +
      "building — dark charcoal concrete and steel stair flights, a soft green exit glow above the door, warm " +
      "ember-orange wall washers grazing the wall. The assessor looks up the stair flight, mid-assessment. " +
      STYLE,
  },
  {
    id: "hs-1",
    prompt:
      "A health and safety consultant in a smart dark jacket and subtle hi-vis vest carrying out a workplace audit with " +
      "a tablet in a modern dark warehouse aisle — tall racking fading into shadow, warm ember-orange strip lighting " +
      "along the racks, cool grey concrete floor. The consultant reviews the racking, engaged and professional. " +
      STYLE,
  },
  {
    id: "hs-2",
    prompt:
      "A health and safety consultant with a tablet carrying out a risk assessment walk-through of a modern dark-toned " +
      "office floor in the evening — charcoal desks, warm amber task lights, floor-to-ceiling windows with a dusk city " +
      "glow. The consultant pauses by a workstation, noting observations on the tablet. " +
      STYLE,
  },
  {
    id: "hs-3",
    prompt:
      "A health and safety consultant wearing a white safety helmet and subtle hi-vis over smart dark attire, using a " +
      "tablet during an inspection of a modern interior fit-out site — exposed dark steelwork, ember-orange temporary " +
      "site lighting strings, charcoal shadows, clean and orderly site. Consultancy oversight, not manual work. " +
      STYLE,
  },
  {
    id: "fire-4",
    prompt:
      "Premium ultra-realistic 3D architectural render of a modern commercial building focused on fire safety and " +
      "compliance. Feature fire doors, protected corridors, emergency escape routes, emergency lighting, fire alarm " +
      "interfaces, compartmentation details and high-end commercial interiors. Dark charcoal and black colour palette " +
      "with subtle orange accent lighting. Clean, modern, professional and authoritative. Cinematic lighting, " +
      "realistic materials, luxury corporate aesthetic, architectural visualisation quality. No people, no text, " +
      "no logos, no vehicles. Wide landscape composition, website hero image quality.",
  },
  {
    id: "hs-4",
    prompt:
      "Premium ultra-realistic 3D architectural render of a modern workplace focused on health, safety and compliance. " +
      "Feature organised warehouse aisles, compliant walkways, safety barriers, designated pedestrian routes, safe " +
      "storage systems, modern office and industrial environments, and visible safety-focused design. Dark charcoal " +
      "and black colour palette with subtle orange accent lighting. Clean, modern, professional and trustworthy. " +
      "Cinematic lighting, realistic materials, luxury corporate aesthetic, architectural visualisation quality. " +
      "No people, no text, no logos, no vehicles. Wide landscape composition, website hero image quality.",
  },
  {
    id: "fire-5",
    prompt:
      "Premium modern commercial corridor with clearly visible emergency exit signage (green pictogram-only running-man " +
      "signs, no lettering), fire doors with steel closers and panic hardware, recessed emergency lighting, and a clean " +
      "protected escape route receding into the distance. Dark charcoal and black colour palette with subtle warm " +
      "orange accent lighting along walls and floor. Clean, realistic, high-end architectural visualisation, cinematic " +
      "lighting, realistic PBR materials, luxury corporate aesthetic. No people, no readable text or lettering " +
      "anywhere, no logos, no watermarks. Wide landscape composition.",
  },
  {
    id: "hs-5",
    prompt:
      "Premium modern office environment with a sleek desk and computer workstation, an organised compliance-focused " +
      "workspace — tidy monitor, ergonomic chair, neat shelving and subtle safety-conscious design details. Clean, " +
      "organised, professional setting representing workplace risk assessments and audits. Dark charcoal and black " +
      "colour palette with subtle warm orange accent lighting (desk lamp glow, LED strips), soft dusk window light. " +
      "High-end architectural visualisation, cinematic lighting, realistic materials, luxury corporate aesthetic. " +
      "No people, no readable text on any screen or surface (screens dark or showing abstract dim glow), no logos, " +
      "no watermarks. Wide landscape composition.",
  },
];

const only = process.argv[2];
const queue = only ? JOBS.filter((j) => j.id === only) : JOBS;
if (queue.length === 0) {
  console.error(`unknown id "${only}" — valid: ${JOBS.map((j) => j.id).join(", ")}`);
  process.exit(1);
}

for (const job of queue) {
  process.stdout.write(`generating ${job.id} … `);
  const res = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-image-1",
      prompt: job.prompt,
      size: "1536x1024",
      quality: "high",
      output_format: "jpeg",
      output_compression: 88,
      n: 1,
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    console.error(`FAILED (${res.status}): ${err.slice(0, 300)}`);
    process.exitCode = 1;
    continue;
  }
  const json = await res.json();
  const b64 = json.data?.[0]?.b64_json;
  if (!b64) {
    console.error("FAILED: no image data in response");
    process.exitCode = 1;
    continue;
  }
  const file = path.join(OUT_DIR, `${job.id}.jpg`);
  writeFileSync(file, Buffer.from(b64, "base64"));
  console.log(`saved ${file} (${Math.round(Buffer.from(b64, "base64").length / 1024)} KB)`);
}
