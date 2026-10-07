// Generates public/og.png (1200x630) and public/apple-touch-icon.png from inline SVG.
// Run manually after changing the brand: `node scripts/og-image.mjs`
import sharp from 'sharp';

const mark = (x, y, s) => `
  <g transform="translate(${x} ${y}) scale(${s / 24})">
    <rect x="1.5" y="1.5" width="21" height="21" fill="none" stroke="#ebe8e1" stroke-width="1.5"/>
    <path d="M7.5 5.5v13" stroke="#ebe8e1" stroke-width="1.75"/>
    <path d="M17 5.5 10 12l7 6.5" fill="none" stroke="#ff5a1f" stroke-width="1.75"/>
  </g>`;

const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#09090a"/>
  <g stroke="#19191b" stroke-width="1">
    ${Array.from({ length: 13 }, (_, i) => `<line x1="${i * 100}" y1="0" x2="${i * 100}" y2="630"/>`).join('')}
    ${Array.from({ length: 7 }, (_, i) => `<line x1="0" y1="${i * 100}" x2="1200" y2="${i * 100}"/>`).join('')}
  </g>
  ${mark(80, 80, 56)}
  <text x="160" y="118" font-family="Consolas, monospace" font-size="26" letter-spacing="6" fill="#ebe8e1" font-weight="700">KHARONTE</text>
  <text x="80" y="330" font-family="Inter, Segoe UI, Arial, sans-serif" font-size="92" font-weight="600" fill="#ebe8e1">Blue Team</text>
  <text x="80" y="430" font-family="Inter, Segoe UI, Arial, sans-serif" font-size="92" font-weight="600" fill="#ebe8e1">Field Manual</text>
  <rect x="80" y="480" width="64" height="3" fill="#ff5a1f"/>
  <text x="80" y="540" font-family="Consolas, monospace" font-size="24" fill="#8d8a83">DFIR · DETECTION · MALWARE ANALYSIS</text>
</svg>`;

const icon = `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 180 180">
  <rect width="180" height="180" fill="#09090a"/>${mark(30, 30, 120)}
</svg>`;

await sharp(Buffer.from(og)).png().toFile('public/og.png');
await sharp(Buffer.from(icon)).png().toFile('public/apple-touch-icon.png');
console.log('Generated public/og.png and public/apple-touch-icon.png');
