import fs from 'fs/promises';
import gulp from 'gulp';
import { build as viteBuildApi, createServer } from 'vite';
import { verifyBuildOutput } from './tasks/utils/verify-dist.js';

/**
 * Minimal Gulp 5 compatibility layer.
 * Primary dev/build/verify workflows run natively via Vite 8 & Node ESM in package.json.
 */
export const clean = () => fs.rm('dist', { recursive: true, force: true });

export const dev = async () => {
    const server = await createServer();
    await server.listen();
    server.printUrls();
};

export const viteBuild = async () => {
    await viteBuildApi();
};

export const verify = async () => {
    verifyBuildOutput('./dist');
};

export const build = gulp.series(clean, viteBuild, verify);

export default build;
