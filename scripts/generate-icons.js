import sharp from 'sharp';
import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const iconsDir = join(__dirname, '..', 'public', 'icons', 'app');

// Ensure directory exists
mkdirSync(iconsDir, { recursive: true });

// SVG content for the icon
const svg192 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#667eea"/>
      <stop offset="100%" style="stop-color:#764ba2"/>
    </linearGradient>
  </defs>
  <rect width="192" height="192" rx="32" fill="url(#bg)"/>
  <circle cx="96" cy="80" r="35" fill="#FFD93D" opacity="0.9"/>
  <ellipse cx="96" cy="130" rx="50" ry="20" fill="#fff" opacity="0.3"/>
  <path d="M60 100 Q75 85 90 100 Q105 115 120 100" stroke="#fff" stroke-width="8" fill="none" opacity="0.6"/>
</svg>`;

const svg512 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#667eea"/>
      <stop offset="100%" style="stop-color:#764ba2"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="85" fill="url(#bg)"/>
  <circle cx="256" cy="210" r="95" fill="#FFD93D" opacity="0.9"/>
  <ellipse cx="256" cy="350" rx="135" ry="55" fill="#fff" opacity="0.3"/>
  <path d="M160 265 Q200 225 240 265 Q280 305 320 265 Q360 225 400 265" stroke="#fff" stroke-width="22" fill="none" opacity="0.6"/>
</svg>`;

async function generateIcons() {
  console.log('Generating PNG icons...');

  // Generate 192x192 PNG
  await sharp(Buffer.from(svg192))
    .resize(192, 192)
    .png()
    .toFile(join(iconsDir, 'icon-192.png'));
  console.log('Created icon-192.png');

  // Generate 512x512 PNG
  await sharp(Buffer.from(svg512))
    .resize(512, 512)
    .png()
    .toFile(join(iconsDir, 'icon-512.png'));
  console.log('Created icon-512.png');

  console.log('Done!');
}

generateIcons().catch(console.error);