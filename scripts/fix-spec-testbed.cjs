/**
 * 1) Non-standalone components were incorrectly listed under TestBed `imports:` alone.
 *    Rewrites `imports: [Cls]` -> `declarations: [Cls]` + `schemas: [NO_ERRORS_SCHEMA]`
 *    when createComponent(Cls) and the component file is not `standalone: true`.
 * 2) Injects matDialogTestProviders() when the component uses MatDialogRef or MAT_DIALOG_DATA.
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..', 'src', 'app');

function ensureNoErrorsSchemaImport(text) {
  if (/import\s*\{[^}]*NO_ERRORS_SCHEMA[^}]*\}\s*from\s*['"]@angular\/core['"]/.test(text)) {
    return text;
  }
  const m = text.match(/import\s*\{[^}]+\}\s*from\s*['"]@angular\/core\/testing['"];/);
  if (m) {
    return text.replace(m[0], `${m[0]}\nimport { NO_ERRORS_SCHEMA } from '@angular/core';`);
  }
  const m2 = text.match(/import\s*\{[^}]+\}\s*from\s*['"]@angular\/core['"];/);
  if (m2) {
    return text.replace(m2[0], `${m2[0]}\nimport { NO_ERRORS_SCHEMA } from '@angular/core';`);
  }
  return `import { NO_ERRORS_SCHEMA } from '@angular/core';\n${text}`;
}

function ensureMatDialogHelpersImport(text) {
  if (/matDialogTestProviders/.test(text)) {
    return text;
  }
  const patterns = [
    /import\s*\{[^}]+\}\s*from\s*['"]@angular\/core\/testing['"];/,
    /import\s*\{[^}]+\}\s*from\s*['"]@angular\/core\/testing['"]/,
  ];
  for (const re of patterns) {
    const m = text.match(re);
    if (m) {
      return text.replace(m[0], `${m[0]}\nimport { matDialogTestProviders } from '@testing/mat-dialog-test-providers';`);
    }
  }
  return `import { matDialogTestProviders } from '@testing/mat-dialog-test-providers';\n${text}`;
}

function injectMatDialogProviders(text) {
  if (/matDialogTestProviders\s*\(\s*\)/.test(text)) {
    return text;
  }
  let t = ensureMatDialogHelpersImport(text);
  // Only touch uncommented lines (avoid matching TestBed inside // comments).
  if (/^(\s*)providers:\s*\[/m.test(t)) {
    t = t.replace(/^(\s*)providers:\s*\[/gm, '$1providers: [...matDialogTestProviders(), ');
    return t;
  }
  t = t.replace(
    /^(\s*)TestBed\.configureTestingModule\(\{\s*/gm,
    (m, indent) =>
      `${indent}TestBed.configureTestingModule({\n${indent}      providers: matDialogTestProviders(),\n${indent}      `
  );
  return t;
}

function processFile(full) {
  if (!full.endsWith('.component.spec.ts')) {
    return false;
  }
  const dir = path.dirname(full);
  const base = path.basename(full, '.component.spec.ts');
  const compTs = path.join(dir, `${base}.component.ts`);
  if (!fs.existsSync(compTs)) {
    return false;
  }
  const compSrc = fs.readFileSync(compTs, 'utf8');
  const standaloneTrue = /\bstandalone\s*:\s*true\b/.test(compSrc);
  const needsDialog =
    /\bMatDialogRef\b/.test(compSrc) ||
    /\bMAT_DIALOG_DATA\b/.test(compSrc) ||
    /@Inject\s*\(\s*MAT_DIALOG_DATA\s*\)/.test(compSrc);

  let text = fs.readFileSync(full, 'utf8');
  const orig = text;

  const cc = text.match(/createComponent\(\s*(\w+)\s*\)/);
  const primaryCls = cc ? cc[1] : null;

  if (primaryCls && !standaloneTrue) {
    const re = new RegExp(`imports:\\s*\\[\\s*${primaryCls}\\s*\\]`);
    if (re.test(text)) {
      text = text.replace(
        re,
        `declarations: [${primaryCls}],\n      schemas: [NO_ERRORS_SCHEMA]`
      );
      text = ensureNoErrorsSchemaImport(text);
    }
  }

  if (needsDialog && !/\bmatDialogTestProviders\s*\(\s*\)/.test(text)) {
    text = injectMatDialogProviders(text);
  }

  if (text !== orig) {
    fs.writeFileSync(full, text, 'utf8');
    return true;
  }
  return false;
}

function walk(dir) {
  let n = 0;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      n += walk(full);
    } else if (processFile(full)) {
      n += 1;
    }
  }
  return n;
}

if (!fs.existsSync(root)) {
  console.error('missing', root);
  process.exit(1);
}
const changed = walk(root);
console.log('updated', changed, 'spec files');
