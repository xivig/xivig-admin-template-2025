import {
  defineConfig
} from 'vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import handlebars from 'vite-plugin-handlebars';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to find all HTML files recursively
const getHtmlEntries = (baseDir) => {
  let entries = {};
  
  // 1. Add root index.html
  if (fs.existsSync(path.join(baseDir, 'index.html'))) {
    entries['index'] = path.resolve(baseDir, 'index.html');
  }

  // 2. Scan app/pages recursively
  const scanDir = (dir, prefix = 'pages') => {
    if (!fs.existsSync(dir)) return;
    const items = fs.readdirSync(dir, { withFileTypes: true });
    items.forEach(item => {
      if (item.isDirectory()) {
        scanDir(path.join(dir, item.name), path.join(prefix, item.name));
      } else if (item.name.endsWith('.html')) {
        const name = path.join(prefix, path.parse(item.name).name).replace(/\\/g, '/');
        entries[name] = path.resolve(dir, item.name);
      }
    });
  };

  scanDir(path.join(baseDir, 'app/pages'));

  return entries;
};

export default defineConfig({
  // Root is current directory
  base: '/', 
  plugins: [
    handlebars({
      partialDirectory: path.resolve(__dirname, 'app/src/partials'),
    }),
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
          'mixed-decls'
        ],
      },
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      input: getHtmlEntries(__dirname),
      output: {
        entryFileNames: `assets/[name].js`,
        chunkFileNames: `assets/[name].js`,
        assetFileNames: `assets/[name].[ext]`,
        manualChunks(id) {
          if (id.includes('node_modules/jquery/') || id.includes('app/src/scripts/core/jquery-setup.js')) {
            return 'vendor-jquery';
          }
          if (id.includes('node_modules')) {
            if (id.includes('echarts') || id.includes('zrender')) {
              return 'vendor-echarts';
            }
            if (id.includes('highcharts')) {
              return 'vendor-highcharts';
            }
            if (id.includes('apexcharts')) {
              return 'vendor-apexcharts';
            }
            if (id.includes('chart.js')) {
              return 'vendor-chartjs';
            }
            if (id.includes('@fullcalendar')) {
              return 'vendor-fullcalendar';
            }
            return 'vendor-core';
          }
        }
      }
    }
  },
  resolve: {
    alias: {
      '~bootstrap': path.resolve(__dirname, 'node_modules/bootstrap'),
      '@': path.resolve(__dirname, 'app/src'),
    }
  },
  server: {
    host: true,
    strictPort: true,
    open: true,
    port: 3000,
  },
});
