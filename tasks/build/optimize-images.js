import fs from 'fs';
import fsp from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

const RASTER_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp']);
const STATIC_EXTS = new Set(['.svg', '.gif', '.ico']);

async function walkFiles(dir, out = []) {
    if (!fs.existsSync(dir)) return out;
    const entries = await fsp.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            await walkFiles(full, out);
        } else {
            out.push(full);
        }
    }
    return out;
}

/**
 * Optimizes raster images with Sharp directly in pure Node ESM (zero Gulp streams):
 * - Compresses .jpg/.jpeg -> optimized .jpg + .webp
 * - Compresses .png -> optimized .png + .webp
 * - Preserves .svg/.gif/.ico static vectors cleanly
 */
export async function optimizeProjectImages(srcDir, destDir, { concurrency = 8 } = {}) {
    if (!fs.existsSync(srcDir)) return { processed: 0, copied: 0 };

    const allFiles = await walkFiles(srcDir);
    let processed = 0;
    let copied = 0;
    let cursor = 0;

    async function worker() {
        while (cursor < allFiles.length) {
            const idx = cursor++;
            const srcPath = allFiles[idx];
            const relPath = path.relative(srcDir, srcPath);
            const destPath = path.join(destDir, relPath);
            const ext = path.extname(srcPath).toLowerCase();

            await fsp.mkdir(path.dirname(destPath), { recursive: true });

            if (STATIC_EXTS.has(ext)) {
                await fsp.copyFile(srcPath, destPath);
                copied++;
                continue;
            }

            if (RASTER_EXTS.has(ext)) {
                try {
                    const inputBuffer = await fsp.readFile(srcPath);
                    if (ext === '.jpg' || ext === '.jpeg') {
                        await sharp(inputBuffer).jpeg({ quality: 80, mozjpeg: true }).toFile(destPath);
                        await sharp(inputBuffer).webp({ quality: 80 }).toFile(destPath.replace(/\.[^.]+$/, '.webp'));
                    } else if (ext === '.png') {
                        await sharp(inputBuffer).png({ compressionLevel: 9 }).toFile(destPath);
                        await sharp(inputBuffer).webp({ quality: 80 }).toFile(destPath.replace(/\.[^.]+$/, '.webp'));
                    } else if (ext === '.webp') {
                        await sharp(inputBuffer).webp({ quality: 80 }).toFile(destPath);
                    }
                    processed++;
                } catch {
                    // Preserve original image if Sharp encounters an unusual codec/header
                    await fsp.copyFile(srcPath, destPath);
                    copied++;
                }
            } else {
                await fsp.copyFile(srcPath, destPath);
                copied++;
            }
        }
    }

    const workers = Array.from({ length: Math.min(concurrency, allFiles.length || 1) }, () => worker());
    await Promise.all(workers);

    console.log(`✅ Optimized ${processed} raster image(s) (+WebP) and copied ${copied} static asset(s) to ${path.relative(process.cwd(), destDir) || destDir}.`);
    return { processed, copied };
}
