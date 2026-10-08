// Generates the site's art-directed imagery with Google Gemini and records it in
// src/data/generatedImages.json, which the site reads to swap in each image.
// Anything not generated yet falls back to the existing artwork, so the site never breaks.
//
//   npm run images                 generate whatever is missing
//   npm run images -- --force      regenerate everything
//   npm run images -- --only=hero-about,service-web
//
// Needs GEMINI_API_KEY in .env. Model can be overridden with GEMINI_IMAGE_MODEL.
import "dotenv/config";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT_DIR = path.join(root, "public", "generated");
const MANIFEST = path.join(root, "src", "data", "generatedImages.json");

const API_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
const MODEL = process.env.GEMINI_IMAGE_MODEL || "gemini-2.5-flash-image";

// Shared art direction keeps every image in the PDC palette:
// Midnight Violet #2B061E, Smoky Rose #875053, Old Gold #D2BF55, Papaya Whip #FFEED6, Pastel Pink #FBBFCA.
const STYLE =
  "Premium editorial art direction for a creative studio. Deep midnight-violet plum shadows (#2B061E) as the dominant tone, " +
  "warm papaya-whip highlights (#FFEED6), smoky rose ambient light (#875053), a single old-gold accent (#D2BF55) " +
  "and the faintest touch of pastel pink (#FBBFCA). Warm, cinematic lighting, shallow depth of field, minimal composition " +
  "with generous negative space, subtle film grain. No blue tones. No text, no letters, no logos, no watermarks, no UI copy.";

const IMAGES = [
  // Inner-page hero backdrops (wide, abstract, sit behind headings)
  { key: "hero-services", ratio: "16:9", prompt: "Abstract sculpture of interlocking brass and glass ribbons floating in darkness, warm light trails in gold and rose, composition weighted to the right." },
  { key: "hero-about", ratio: "16:9", prompt: "A quiet, dark design studio at night: a large desk with sketches, a monitor glow in warm gold, brass desk lamp, rain-streaked window, composition weighted to the right." },
  { key: "hero-portfolio", ratio: "16:9", prompt: "A gallery wall of floating glowing screens and frames in a dark void, reflections on a glossy black floor, gold and rose rim light." },
  { key: "hero-process", ratio: "16:9", prompt: "A sequence of seven glowing brass rings receding into darkness like a path, connected by a thin warm gold light line, top-down perspective." },
  { key: "hero-contact", ratio: "16:9", prompt: "Two brass orbs connected by a soft beam of gold-and-rose light in a dark space, suggesting connection and conversation." },

  // About page
  { key: "about-studio", ratio: "4:5", prompt: "Close-up of a designer's hands sketching interface wireframes on paper beside a laptop, dark moody studio, warm gold screen glow, brass stylus." },

  // Home: video & content frames
  { key: "content-shoot", ratio: "16:9", prompt: "Behind the scenes of a professional video shoot: cinema camera on a rig, softbox light, dark set, warm gold rim light, silhouetted crew out of focus." },
  { key: "content-edit", ratio: "16:9", prompt: "Video editing suite in a dark room: colour grading panel, timeline glowing on ultrawide monitor, gold and rose ambient light." },
  { key: "content-social", ratio: "16:9", prompt: "A smartphone on a tripod filming a stylish product flat-lay on a dark surface, ring light reflection, gold and rose accents." },

  // One per service (matches the `visual` field of each service)
  { key: "service-web", ratio: "4:3", prompt: "Layered translucent website layouts floating in 3D space, brass edges, a warm gold glowing cursor, depth and parallax." },
  { key: "service-app", ratio: "4:3", prompt: "A sleek dark smartphone and tablet floating at angles, screens showing abstract glowing app cards, brass bezels." },
  { key: "service-crm", ratio: "4:3", prompt: "An abstract network of brass nodes connected by thin glowing warm gold lines converging on a central sphere, data flow." },
  { key: "service-social", ratio: "4:3", prompt: "Floating brass social reaction icons as abstract 3D shapes (hearts, speech bubbles) without logos, rose glow." },
  { key: "service-content", ratio: "4:3", prompt: "Neatly stacked translucent content cards and folders in 3D, organised grid, brass edges, soft warm gold light." },
  { key: "service-wordpress", ratio: "4:3", prompt: "Modular building blocks of a web page assembling themselves in mid-air, brass and frosted glass, warm gold light seams." },
  { key: "service-stack", ratio: "4:3", prompt: "Three stacked glowing layers representing front end, server and database, floating brass slabs with warm gold light between them." },
  { key: "service-edit", ratio: "4:3", prompt: "Film strips and a video timeline unspooling through the air, brass reels, rose and gold light leaks." },
  { key: "service-shoot", ratio: "4:3", prompt: "A cinema camera lens in extreme close-up, reflections of gold and rose lights in the glass, dark background." },
  { key: "service-handling", ratio: "4:3", prompt: "A calendar grid of glowing tiles in 3D, some lit in warm gold, a brass hand-like mechanical arm placing a tile, abstract." },
  { key: "service-search", ratio: "4:3", prompt: "A brass magnifying glass over an abstract glowing landscape of search result bars, warm gold light, dark." },
  { key: "service-ai", ratio: "4:3", prompt: "An abstract glowing neural sphere made of fine brass filaments, pulses of rose and gold light, dark void." },
  { key: "service-answer", ratio: "4:3", prompt: "A single glowing speech bubble made of glass rising above many dim ones, warm gold highlight, dark background." },
  { key: "service-ads", ratio: "4:3", prompt: "A brass megaphone emitting rings of gold and rose light waves into darkness, abstract and minimal." },
  { key: "service-reach", ratio: "4:3", prompt: "Concentric ripples of light spreading across a dark reflective surface from a single brass point, gold and rose." },
];

const args = process.argv.slice(2);
const force = args.includes("--force");
const onlyArg = args.find((a) => a.startsWith("--only="));
const only = onlyArg ? new Set(onlyArg.slice(7).split(",").map((s) => s.trim())) : null;

const EXT = { "image/png": "png", "image/jpeg": "jpg", "image/webp": "webp" };

async function readManifest() {
  try {
    return JSON.parse(await fs.readFile(MANIFEST, "utf8"));
  } catch {
    return {};
  }
}

async function generate({ prompt, ratio }) {
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-goog-api-key": API_KEY },
    body: JSON.stringify({
      contents: [{ parts: [{ text: `${prompt} ${STYLE}` }] }],
      generationConfig: { responseModalities: ["IMAGE"], imageConfig: { aspectRatio: ratio } },
    }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${(await res.text()).slice(0, 300)}`);
  const data = await res.json();
  const parts = data?.candidates?.[0]?.content?.parts || [];
  const img = parts.find((p) => p.inlineData?.data);
  if (!img) throw new Error(`No image returned (${data?.candidates?.[0]?.finishReason || "unknown reason"})`);
  return { buffer: Buffer.from(img.inlineData.data, "base64"), ext: EXT[img.inlineData.mimeType] || "png" };
}

async function main() {
  if (!API_KEY) {
    console.error("GEMINI_API_KEY is not set. Add it to .env (get one at https://aistudio.google.com/apikey).");
    process.exit(1);
  }
  await fs.mkdir(OUT_DIR, { recursive: true });
  const manifest = await readManifest();
  const queue = IMAGES.filter((img) => (!only || only.has(img.key)) && (force || !manifest[img.key]));

  console.log(`Model: ${MODEL} · ${queue.length} image(s) to generate`);
  let ok = 0;
  for (const img of queue) {
    process.stdout.write(`  ${img.key} … `);
    try {
      const { buffer, ext } = await generate(img);
      const file = `${img.key}.${ext}`;
      await fs.writeFile(path.join(OUT_DIR, file), buffer);
      manifest[img.key] = `/generated/${file}`;
      // Write after every image so an interrupted run keeps its progress.
      await fs.writeFile(MANIFEST, `${JSON.stringify(manifest, null, 2)}\n`);
      console.log(`saved (${Math.round(buffer.length / 1024)} KB)`);
      ok += 1;
    } catch (err) {
      console.log(`failed: ${err.message}`);
    }
  }
  console.log(`Done: ${ok}/${queue.length} generated.`);
}

main();
