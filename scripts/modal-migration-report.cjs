const fs = require('fs');
const path = require('path');

const appRoot = path.join(__dirname, '..', 'src', 'app');
const outDir = path.join(__dirname, '..', 'docs');
const outPath = path.join(outDir, 'modal-migration-report.json');

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full, out);
      continue;
    }
    if (!entry.name.endsWith('.html')) {
      continue;
    }
    const text = fs.readFileSync(full, 'utf8');
    if (!text.includes('data-toggle="modal"')) {
      continue;
    }
    const rel = path.relative(path.join(__dirname, '..'), full).replace(/\\/g, '/');
    out.push({
      file: rel,
      modalTriggerCount: (text.match(/data-toggle="modal"/g) || []).length,
      hasExampleModalCenter: text.includes('id="exampleModalCenter"'),
      hasDataDismiss: text.includes('data-dismiss="modal"'),
    });
  }
  return out;
}

const files = walk(appRoot).sort((a, b) => a.file.localeCompare(b.file));
const report = {
  generatedAt: new Date().toISOString(),
  totalFilesWithBootstrapModalTriggers: files.length,
  files,
};

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}
fs.writeFileSync(outPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
console.log(`Wrote ${outPath}`);
console.log(`Files with modal triggers: ${files.length}`);
