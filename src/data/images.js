import generated from "./generatedImages.json";

// Returns the Gemini-generated image for `key` (see scripts/generate-images.mjs),
// or `fallback` when it hasn't been generated yet.
export const genImage = (key, fallback = null) => generated[key] || fallback;
