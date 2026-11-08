import fs from 'fs/promises';

/**
 * Rewritten export task for GitHub Docs generation.
 * This version uses modern Node fs to:
 * 1. Wipe the old docs folder to prevent stale files.
 * 2. Recursively copy the entire dist folder, natively including hidden files (like .nojekyll).
 */
export async function exportAssets() {
  const sourcePath = 'dist';
  const destinationPath = 'docs';

  console.log(`🚀 Starting export from '${sourcePath}' to '${destinationPath}'...`);

  try {
    // 1. Clean the destination folder first
    await fs.rm(destinationPath, { recursive: true, force: true });
    
    // 2. Copy all files, including dotfiles
    await fs.cp(sourcePath, destinationPath, { recursive: true });
    
    console.log('✅ Export to docs folder complete.');
  } catch (error) {
    console.error(`❌ Export failed:`, error);
    throw error; // Let the build process know it failed
  }
}
