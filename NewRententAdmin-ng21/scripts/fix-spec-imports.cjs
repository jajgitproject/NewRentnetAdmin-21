/**
 * Fixes copy-pasted spec files that import FormDialogComponent / DeleteComponent from
 * './form-dialog.component' or './delete.component' when those files live in a sibling folder.
 * Only rewrites when the sibling component file exists next to the spec.
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..', 'src', 'app');

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const ent of entries) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      walk(full);
      continue;
    }
    if (!ent.name.endsWith('.component.spec.ts')) {
      continue;
    }
    // Align spec with actual exported class name (many modules use *FormDialogComponent, not FormDialogComponent).
    if (ent.name === 'form-dialog.component.spec.ts') {
      const compTs = path.join(path.dirname(full), 'form-dialog.component.ts');
      if (!fs.existsSync(compTs)) {
        continue;
      }
      const tsSrc = fs.readFileSync(compTs, 'utf8');
      const m = tsSrc.match(/export\s+class\s+(\w+)/);
      if (!m) {
        continue;
      }
      const cls = m[1];
      let text = fs.readFileSync(full, 'utf8');
      const orig = text;
      text = text.replace(
        /import\s*\{\s*FormDialogComponent\s*\}\s*from\s*'\.\/form-dialog\.component';/,
        `import { ${cls} } from './form-dialog.component';`
      );
      text = text.replace(/\bFormDialogComponent\b/g, cls);
      text = text.replace(/describe\(\s*'FormDialogComponent'/g, `describe('${cls}'`);
      if (text !== orig) {
        fs.writeFileSync(full, text, 'utf8');
        console.log('fixed', path.relative(path.join(__dirname, '..'), full));
      }
      continue;
    }
    let text = fs.readFileSync(full, 'utf8');
    const orig = text;

    const base = path.basename(full, '.component.spec.ts');
    const compTs = path.join(path.dirname(full), `${base}.component.ts`);
    if (!fs.existsSync(compTs)) {
      continue;
    }
    const tsSrc = fs.readFileSync(compTs, 'utf8');
    const m = tsSrc.match(/export\s+class\s+(\w+)/);
    if (!m) {
      continue;
    }
    const cls = m[1];

    if (text.includes(`from './form-dialog.component'`)) {
      text = text.replace(
        /import\s*\{\s*FormDialogComponent\s*\}\s*from\s*'\.\/form-dialog\.component';/,
        `import { ${cls} } from './${base}.component';`
      );
      text = text.replace(/\bFormDialogComponent\b/g, cls);
      text = text.replace(/describe\(\s*'FormDialogComponent'/g, `describe('${cls}'`);
    }

    if (text.includes(`from './delete.component'`)) {
      text = text.replace(
        /import\s*\{\s*DeleteComponent\s*\}\s*from\s*'\.\/delete\.component';/,
        `import { ${cls} } from './${base}.component';`
      );
      text = text.replace(/\bDeleteComponent\b/g, cls);
      text = text.replace(/describe\(\s*'DeleteComponent'/g, `describe('${cls}'`);
    }

    if (text !== orig) {
      fs.writeFileSync(full, text, 'utf8');
      console.log('fixed', path.relative(path.join(__dirname, '..'), full));
    }
  }
}

if (!fs.existsSync(root)) {
  console.error('missing', root);
  process.exit(1);
}
walk(root);
