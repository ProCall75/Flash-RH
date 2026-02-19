// Convert SVG icons to PNG using sharp (Next.js dependency)
import sharp from 'sharp';
import { readFileSync } from 'fs';

const sizes = [192, 512];

for (const size of sizes) {
    const svg = readFileSync(`public/icon-${size}.svg`);
    await sharp(svg)
        .resize(size, size)
        .png()
        .toFile(`public/icon-${size}.png`);
    console.log(`✅ icon-${size}.png generated`);
}

// Also generate a 32x32 favicon
const favicon = readFileSync('public/favicon.svg');
await sharp(favicon)
    .resize(32, 32)
    .png()
    .toFile('public/favicon.png');
console.log('✅ favicon.png generated');
