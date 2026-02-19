// Generate PWA icons for Flash RH
// Run: node scripts/generate-icons.mjs

import { writeFileSync } from 'fs';

function generateSVG(size) {
    const fontSize = Math.round(size * 0.35);
    const y = Math.round(size * 0.55);
    return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#9D1E00"/>
      <stop offset="100%" style="stop-color:#C44620"/>
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${Math.round(size * 0.15)}" fill="url(#grad)"/>
  <text x="50%" y="${y}" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="800" font-size="${fontSize}" fill="white">FT</text>
</svg>`;
}

// Write SVG files (browsers support SVG icons)
writeFileSync('public/icon-192.svg', generateSVG(192));
writeFileSync('public/icon-512.svg', generateSVG(512));

// Also write a simple favicon
writeFileSync('public/favicon.svg', generateSVG(32));

console.log('✅ Icons generated: icon-192.svg, icon-512.svg, favicon.svg');
console.log('ℹ️  For production PNG icons, convert these SVGs using:');
console.log('   npx svg2png icon-192.svg --output icon-192.png --width 192');
console.log('   npx svg2png icon-512.svg --output icon-512.png --width 512');
