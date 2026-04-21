/**
 * One-shot sweep to migrate all `ngx-google-places-autocomplete` imports from
 * the package-name specifier (which is aliased to a local empty stub via
 * tsconfig paths) to an explicit `@compat/google-places-shim` import. This
 * makes it obvious at every call site that the directive is a local no-op
 * stub pending a real Google Places integration, rather than masquerading as a
 * third-party library.
 *
 * Also drops the dead `LatLng` imports (the symbol is imported but never
 * referenced in the two files that import it).
 *
 * Transformations:
 *   'ngx-google-places-autocomplete'                      -> '@compat/google-places-shim'
 *   'ngx-google-places-autocomplete/objects/address'      -> '@compat/google-places-shim-objects/address'
 *   'ngx-google-places-autocomplete/objects/latLng'       -> (import line removed)
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
    else if (s.isFile() && /\.ts$/.test(name) && !/\.d\.ts$/.test(name))
      out.push(p);
  }
  return out;
}

const files = walk(ROOT);

let modifiedCount = 0;
let moduleRewrites = 0;
let addressRewrites = 0;
let latLngRemovals = 0;

for (const file of files) {
  const orig = fs.readFileSync(file, 'utf8');
  let src = orig;

  const beforeModule = src;
  src = src.replace(
    /(['"])ngx-google-places-autocomplete(['"])/g,
    '$1@compat/google-places-shim$2'
  );
  if (src !== beforeModule) moduleRewrites++;

  const beforeAddress = src;
  src = src.replace(
    /(['"])ngx-google-places-autocomplete\/objects\/address(['"])/g,
    '$1@compat/google-places-shim-objects/address$2'
  );
  if (src !== beforeAddress) addressRewrites++;

  const beforeLatLng = src;
  src = src.replace(
    /^[ \t]*import\s*\{[^}]*\bLatLng\b[^}]*\}\s*from\s*['"]ngx-google-places-autocomplete\/objects\/latLng['"];?[ \t]*\r?\n/gm,
    ''
  );
  if (src !== beforeLatLng) latLngRemovals++;

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
      moduleRewrites,
      addressRewrites,
      latLngRemovals,
    },
    null,
    2
  )
);
