// rename-html-to-blade.js
const fs = require('fs');
const path = require('path');

function walk(dir) {
  fs.readdirSync(dir).forEach(file => {
    const filepath = path.join(dir, file);
    const stat = fs.statSync(filepath);

    if (stat.isDirectory()) {
      walk(filepath); // recurse into subfolders
    } else if (filepath.endsWith('.html')) {
      const newPath = filepath.replace(/\.html$/, '.blade.php');
      fs.renameSync(filepath, newPath);
      console.log(`Renamed: ${filepath} → ${newPath}`);
    }
  });
}

// Run on your target folder (e.g., ./pages)
walk('./partials');
