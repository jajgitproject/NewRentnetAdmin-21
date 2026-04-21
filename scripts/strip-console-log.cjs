/**
 * Strip stray `console.log(...)` debug calls from the application sources.
 *
 * Rules:
 *   - Only `console.log` is removed. `console.error`, `console.warn`,
 *     `console.info`, `console.debug` are kept: those signal intent.
 *   - A call is only removed when the `console.log(` is the first
 *     non-whitespace token on its line (so we never break composite
 *     expressions such as `x || console.log(x)`).
 *   - The matching closing `)` is located by naive parenthesis balancing
 *     across lines. The scanner ignores chars inside single-quoted,
 *     double-quoted and back-tick strings (with simple backslash escapes)
 *     so `console.log('foo)bar')` is handled correctly.
 *   - If the preceding non-blank, non-comment line is a braceless
 *     `if/else/for/while/do`, the call is left alone to avoid leaving a
 *     dangling control statement.
 *   - `.spec.ts` files, scripts/, and the `src/app/compat/` stubs are
 *     excluded.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', 'src');
const SKIP_PATTERNS = [
  /\.spec\.ts$/,
  /[\\/]src[\\/]app[\\/]compat[\\/]/,
];

/** @param {string} dir */
function walk(dir) {
  /** @type {string[]} */
  const out = [];
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const s = fs.statSync(p);
    if (s.isDirectory()) out.push(...walk(p));
    else if (s.isFile() && /\.ts$/.test(name)) out.push(p);
  }
  return out;
}

/**
 * Starting at `src[start]`, which is the opening `(` of a call,
 * return the index of the matching `)` or -1 if unbalanced.
 * Skips contents of string / template literals with simple backslash escape.
 */
function findMatchingClose(src, start) {
  let depth = 0;
  let i = start;
  let quote = '';
  while (i < src.length) {
    const ch = src[i];
    if (quote) {
      if (ch === '\\') {
        i += 2;
        continue;
      }
      if (ch === quote) {
        quote = '';
      }
      i++;
      continue;
    }
    if (ch === "'" || ch === '"' || ch === '`') {
      quote = ch;
      i++;
      continue;
    }
    if (ch === '/') {
      // naive line-comment / block-comment skip
      if (src[i + 1] === '/') {
        while (i < src.length && src[i] !== '\n') i++;
        continue;
      }
      if (src[i + 1] === '*') {
        i += 2;
        while (i < src.length - 1 && !(src[i] === '*' && src[i + 1] === '/')) i++;
        i += 2;
        continue;
      }
    }
    if (ch === '(') depth++;
    else if (ch === ')') {
      depth--;
      if (depth === 0) return i;
    }
    i++;
  }
  return -1;
}

/**
 * Returns true if the last non-blank, non-comment line before `idx`
 * looks like a braceless control head (ends in `)` without a trailing `{`,
 * or is a bare `else`/`do`).
 */
function followsUnbracedControl(src, idx) {
  let j = idx - 1;
  // walk backwards through whitespace + comments to find last significant char
  while (j >= 0) {
    const ch = src[j];
    if (ch === ' ' || ch === '\t' || ch === '\r' || ch === '\n') {
      j--;
      continue;
    }
    // strip `//...` line comments
    // find start of current line
    let lineStart = j;
    while (lineStart > 0 && src[lineStart - 1] !== '\n') lineStart--;
    const line = src.slice(lineStart, j + 1);
    const stripped = line.replace(/\/\/.*$/, '').replace(/\/\*[\s\S]*?\*\//g, '').trimEnd();
    if (!stripped) {
      j = lineStart - 1;
      continue;
    }
    const lastCh = stripped.charAt(stripped.length - 1);
    if (lastCh === '{' || lastCh === '}' || lastCh === ';' || lastCh === ',' || lastCh === ':') {
      return false;
    }
    if (lastCh === ')') {
      return /\b(if|for|while|switch)\s*\([\s\S]*\)\s*$/.test(stripped);
    }
    if (/\belse\s*$/.test(stripped) || /\bdo\s*$/.test(stripped)) {
      return true;
    }
    return false;
  }
  return false;
}

let totalRemoved = 0;
let filesTouched = 0;
const files = walk(ROOT).filter((f) => !SKIP_PATTERNS.some((re) => re.test(f)));

for (const file of files) {
  const orig = fs.readFileSync(file, 'utf8');
  let src = orig;

  const segments = [];
  let cursor = 0;
  let removedInFile = 0;

  // Match `<bol><indent>console.log(` — the `(` character just before our scan.
  const re = /(^|\n)([ \t]*)console\.log\(/g;
  let m;
  while ((m = re.exec(src)) !== null) {
    const matchStart = m.index + m[1].length; // start of indent
    const callOpenParen = m.index + m[0].length - 1; // the `(`
    const close = findMatchingClose(src, callOpenParen);
    if (close === -1) continue;

    // include trailing `;` and the newline
    let end = close + 1;
    while (end < src.length && (src[end] === ' ' || src[end] === '\t')) end++;
    if (src[end] === ';') end++;
    while (end < src.length && (src[end] === ' ' || src[end] === '\t')) end++;
    // trailing line-comment, if any
    if (src[end] === '/' && src[end + 1] === '/') {
      while (end < src.length && src[end] !== '\n') end++;
    }
    if (src[end] === '\r') end++;
    if (src[end] === '\n') end++;

    if (followsUnbracedControl(src, matchStart)) {
      continue;
    }

    segments.push(src.slice(cursor, matchStart));
    cursor = end;
    removedInFile++;
    // keep regex lastIndex moving past the removed region
    re.lastIndex = end;
  }
  segments.push(src.slice(cursor));
  const result = segments.join('');

  if (result !== orig) {
    fs.writeFileSync(file, result, 'utf8');
    filesTouched++;
    totalRemoved += removedInFile;
  }
}

console.log(JSON.stringify({ scanned: files.length, filesTouched, totalRemoved }, null, 2));
