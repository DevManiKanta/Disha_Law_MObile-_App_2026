import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const OUT_PATH = path.resolve("assets/images/splash-icon.png");

const SIZE = 1024;
const NAVY = "#0f172a";

// Simple scales-of-justice icon (stroke only) + DISHA LAW FIRM
const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${SIZE}" height="${SIZE}" fill="transparent"/>

  <!-- icon -->
  <g transform="translate(${SIZE / 2} ${SIZE / 2 - 170})" stroke="${NAVY}" stroke-width="18" fill="none" stroke-linecap="round" stroke-linejoin="round">
    <!-- top bar -->
    <path d="M -210 0 L 210 0" />
    <!-- center stem -->
    <path d="M 0 -150 L 0 220" />
    <!-- left chain + pan -->
    <path d="M -150 0 L -210 120" />
    <path d="M -150 0 L -90 120" />
    <path d="M -240 120 C -210 185 -90 185 -60 120" />
    <!-- right chain + pan -->
    <path d="M 150 0 L 90 120" />
    <path d="M 150 0 L 210 120" />
    <path d="M 60 120 C 90 185 210 185 240 120" />
    <!-- base -->
    <path d="M -150 220 L 150 220" />
  </g>

  <!-- text -->
  <g fill="${NAVY}" text-anchor="middle" font-family="System-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif">
    <text x="${SIZE / 2}" y="${SIZE / 2 + 210}" font-size="120" font-weight="800" letter-spacing="4">DISHA</text>
    <text x="${SIZE / 2}" y="${SIZE / 2 + 300}" font-size="54" font-weight="700" letter-spacing="12">LAW FIRM</text>
  </g>
</svg>`;

const svgBuffer = Buffer.from(svg);

await sharp({
  create: {
    width: SIZE,
    height: SIZE,
    channels: 4,
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  },
})
  .composite([{ input: svgBuffer }])
  .png({ compressionLevel: 9 })
  .toFile(OUT_PATH);

if (!fs.existsSync(OUT_PATH)) {
  throw new Error(`Failed to write ${OUT_PATH}`);
}

console.log(`Generated splash: ${OUT_PATH}`);

