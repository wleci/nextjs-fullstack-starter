import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');
const distDir = path.join(rootDir, '.next/standalone');

// Copy public folder
const publicSrc = path.join(rootDir, 'public');
const publicDest = path.join(distDir, 'public');

console.log('\n📦 Preparing production build...\n');

if (fs.existsSync(publicSrc)) {
    copyDir(publicSrc, publicDest);
    console.log('  ✓ public/');
}

// Copy .next/static
const staticSrc = path.join(rootDir, '.next/static');
const staticDest = path.join(distDir, '.next/static');

if (fs.existsSync(staticSrc)) {
    copyDir(staticSrc, staticDest);
    console.log('  ✓ .next/static/');
}

console.log('\n✨ Production build ready!\n');
console.log('  Run: npm run start:prod\n');

function copyDir(src, dest) {
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }

    const files = fs.readdirSync(src);

    files.forEach(file => {
        const srcFile = path.join(src, file);
        const destFile = path.join(dest, file);
        const stat = fs.statSync(srcFile);

        if (stat.isDirectory()) {
            copyDir(srcFile, destFile);
        } else {
            fs.copyFileSync(srcFile, destFile);
        }
    });
}
