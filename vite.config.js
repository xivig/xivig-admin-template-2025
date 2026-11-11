import { defineConfig } from 'vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import handlebars from 'vite-plugin-handlebars';
import { xivigDevRewritePlugin, xivigFlatDistPlugin } from './tasks/build/vite-plugins.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Recursively discover all HTML entry points and enforce unique basenames for flat dist/ output
const getHtmlEntries = (baseDir) => {
  const entries = {};
  const seenBasenames = new Map();

  // 1. Add root index.html
  const rootIndex = path.join(baseDir, 'index.html');
  if (fs.existsSync(rootIndex)) {
    entries['index'] = path.resolve(rootIndex);
    seenBasenames.set('index.html', rootIndex);
  }

  // 2. Scan app/pages recursively
  const scanDir = (dir, prefix = 'pages') => {
    if (!fs.existsSync(dir)) return;
    const items = fs.readdirSync(dir, { withFileTypes: true });
    for (const item of items) {
      const fullPath = path.resolve(dir, item.name);
      if (item.isDirectory()) {
        scanDir(fullPath, path.join(prefix, item.name));
      } else if (item.name.endsWith('.html')) {
        if (seenBasenames.has(item.name)) {
          throw new Error(
            `Duplicate HTML filename "${item.name}" found at:\n- ${seenBasenames.get(item.name)}\n- ${fullPath}\nFlattened dist/ builds require unique page filenames.`
          );
        }
        seenBasenames.set(item.name, fullPath);
        const name = path.join(prefix, path.parse(item.name).name).replace(/\\/g, '/');
        entries[name] = fullPath;
      }
    }
  };

  scanDir(path.join(baseDir, 'app/pages'));
  return entries;
};

export default defineConfig({
  root: __dirname,
  base: './',
  plugins: [
    xivigDevRewritePlugin(__dirname),
    handlebars({
      partialDirectory: path.resolve(__dirname, 'app/src/partials'),
    }),
    xivigFlatDistPlugin(__dirname),
  ],
  css: {
    preprocessorOptions: {
      scss: {
        quietDeps: true,
        silenceDeprecations: [
          'import',
          'global-builtin',
          'color-functions',
          'if-function',
        ],
      },
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
    chunkSizeWarningLimit: 2000,
    rolldownOptions: {
      checks: {
        pluginTimings: false,
      },
      input: getHtmlEntries(__dirname),
      output: {
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]',
        manualChunks(id) {
          const normalizedId = id.replace(/\\/g, '/');
          if (
            normalizedId.includes('node_modules/jquery/') ||
            normalizedId.includes('app/src/scripts/core/jquery-setup.js')
          ) {
            return 'vendor-jquery';
          }
          if (normalizedId.includes('node_modules')) {
            if (normalizedId.includes('echarts') || normalizedId.includes('zrender')) {
              return 'vendor-echarts';
            }
            if (normalizedId.includes('highcharts')) {
              return 'vendor-highcharts';
            }
            if (normalizedId.includes('apexcharts')) {
              return 'vendor-apexcharts';
            }
            if (normalizedId.includes('chart.js')) {
              return 'vendor-chartjs';
            }
            if (normalizedId.includes('@fullcalendar')) {
              return 'vendor-fullcalendar';
            }
            return 'vendor-core';
          }
        },
      },
    },
  },
  resolve: {
    alias: {
      '~bootstrap': path.resolve(__dirname, 'node_modules/bootstrap'),
      '@': path.resolve(__dirname, 'app/src'),
    },
  },
  server: {
    host: true,
    port: 3000,
    open: true,
  },
  preview: {
    host: true,
    port: 4173,
  },
});
