/**
 * One-shot sweep to remove the dead `MaterialFileInputModule` shim usage from all
 * feature modules. The shim (src/app/compat/material-file-input-shim.ts) only
 * exports empty stub classes, and the single HTML consumer
 * (currency/dialogs/form-dialog/form-dialog.component.html) has its
 * `<ngx-mat-file-input>` element inside an HTML comment block. Every import is
 * therefore dead weight.
 *
 * Deletes:
 *   - the `import { MaterialFileInputModule } from '@compat/material-file-input-shim';`
 *     line from every *.module.ts file.
 *   - every standalone reference to the `MaterialFileInputModule` identifier
 *     inside module imports arrays.
 *
 * Safe to re-run (idempotent).
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', 'src');

/** @param {string} dir */
function walk(dir) {
  /** @type {string[]} */
  const out = [];
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const s = fs.statSync(p);
    if (s.isDirectory()) out.push(...walk(p));
    else if (s.isFile() && /\.(module|component)\.ts$/.test(name)) out.push(p);
  }
  return out;
}

const files = walk(ROOT);

let modifiedCount = 0;
let importLinesRemoved = 0;
let identifiersRemoved = 0;

for (const file of files) {
  const orig = fs.readFileSync(file, 'utf8');
  let src = orig;

  const beforeImport = src;
  src = src.replace(
    /^[ \t]*import\s*\{\s*MaterialFileInputModule\s*\}\s*from\s*['"]@compat\/material-file-input-shim['"];?[ \t]*\r?\n/gm,
    ''
  );
  if (src !== beforeImport) importLinesRemoved++;

  const beforeIdent = src;
  src = src.replace(/^[ \t]*MaterialFileInputModule[ \t]*,[ \t]*\r?\n/gm, '');
  src = src.replace(/,\s*MaterialFileInputModule(?=\s*[,\]])/g, '');
  src = src.replace(/MaterialFileInputModule\s*,\s*/g, '');
  src = src.replace(/\bMaterialFileInputModule\b/g, '');
  if (src !== beforeIdent) identifiersRemoved++;

  if (src !== orig) {
    fs.writeFileSync(file, src, 'utf8');
    modifiedCount++;
  }
}

console.log(
  JSON.stringify(
    {
      scanned: files.length,
      modified: modifiedCount,
      importLinesRemoved,
      identifiersRemoved,
    },
    null,
    2
  )
);
