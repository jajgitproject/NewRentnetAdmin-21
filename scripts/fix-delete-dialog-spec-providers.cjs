/**
 * Adds minimal stubs for advanceTableService + GeneralService in
 * dialogs/delete/delete.component.spec.ts files (same import paths as delete.component.ts).
 */
const fs = require('fs');
const path = require('path');

const appRoot = path.join(__dirname, '..', 'src', 'app');

function ensureNoErrorsSchemaImport(spec) {
  if (/import\s*\{[^}]*NO_ERRORS_SCHEMA[^}]*\}\s*from\s*['"]@angular\/core['"]/.test(spec)) {
    return spec;
  }
  const m = spec.match(/import\s*\{[^}]+\}\s*from\s*['"]@angular\/core\/testing['"];/);
  if (m) {
    return spec.replace(m[0], `${m[0]}\nimport { NO_ERRORS_SCHEMA } from '@angular/core';`);
  }
  return `import { NO_ERRORS_SCHEMA } from '@angular/core';\n${spec}`;
}

function findImportLine(compSrc, typeName) {
  const lines = compSrc.split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line.includes('import') || !line.includes(typeName)) {
      continue;
    }
    let block = line;
    let j = i;
    while (!block.includes(';') && j + 1 < lines.length) {
      j += 1;
      block += '\n' + lines[j];
    }
    if (new RegExp(`import\\s*\\{[^}]*\\b${typeName}\\b`).test(block)) {
      return block.trim();
    }
  }
  return null;
}

function extractFromPath(importLine) {
  const m = importLine.match(/from\s*['"]([^'"]+)['"]/);
  return m ? m[1] : null;
}

function processDeleteSpec(specPath) {
  const dir = path.dirname(specPath);
  const compPath = path.join(dir, 'delete.component.ts');
  if (!fs.existsSync(compPath)) {
    return false;
  }
  const compSrc = fs.readFileSync(compPath, 'utf8');
  const m = compSrc.match(/public\s+advanceTableService:\s*(\w+)/);
  if (!m) {
    return false;
  }
  const svcCls = m[1];
  const genMatch = compSrc.match(/public\s+_generalService:\s*(\w+)/);
  const genCls = genMatch ? genMatch[1] : 'GeneralService';

  const svcImport = findImportLine(compSrc, svcCls);
  const genImport = findImportLine(compSrc, genCls);
  if (!svcImport || !genImport) {
    console.warn('skip (imports):', path.relative(path.join(__dirname, '..'), specPath));
    return false;
  }
  const svcFrom = extractFromPath(svcImport);
  const genFrom = extractFromPath(genImport);
  if (!svcFrom || !genFrom) {
    return false;
  }

  let spec = fs.readFileSync(specPath, 'utf8');
  const orig = spec;
  const stub = `{ provide: ${svcCls}, useValue: { delete: () => of({}) } }, { provide: ${genCls}, useValue: { sendUpdate: () => {}, getUserID: () => 0, BaseURL: '' } }`;

  const needsProviders =
    !spec.includes('useValue: { delete: () => of({}) }') || !spec.includes(svcCls);
  if (needsProviders) {
    if (!spec.includes(`import { ${svcCls} }`)) {
      const injectAfter =
        spec.match(/import \{ matDialogTestProviders \} from '@testing\/mat-dialog-test-providers';/) ||
        spec.match(/from '@angular\/core\/testing';/);
      if (injectAfter) {
        const insert = `\nimport { ${svcCls} } from '${svcFrom}';\nimport { ${genCls} } from '${genFrom}';\nimport { of } from 'rxjs';`;
        spec = spec.replace(injectAfter[0], injectAfter[0] + insert);
      } else {
        spec = `import { ${svcCls} } from '${svcFrom}';\nimport { ${genCls} } from '${genFrom}';\nimport { of } from 'rxjs';\n${spec}`;
      }
    }
    spec = spec.replace(
      /providers:\s*matDialogTestProviders\(\)\s*,/,
      `providers: [...matDialogTestProviders(), ${stub}],`
    );
  }

  if (!/schemas:\s*\[\s*NO_ERRORS_SCHEMA\s*\]/.test(spec)) {
    spec = ensureNoErrorsSchemaImport(spec);
    spec = spec.replace(/(declarations:\s*\[[^\]]+\])/, '$1,\n      schemas: [NO_ERRORS_SCHEMA]');
  }

  if (spec === orig) {
    return false;
  }
  fs.writeFileSync(specPath, spec, 'utf8');
  return true;
}

function walk(dir) {
  let n = 0;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      n += walk(full);
    } else if (ent.name === 'delete.component.spec.ts' && full.includes(`${path.sep}dialogs${path.sep}delete`)) {
      if (processDeleteSpec(full)) {
        n += 1;
      }
    }
  }
  return n;
}

const n = walk(appRoot);
console.log('patched', n, 'delete.component.spec.ts files');
