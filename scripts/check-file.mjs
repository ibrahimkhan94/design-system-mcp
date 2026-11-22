// Usage: npm run check -- path/to/Component.jsx
import { readFileSync } from 'node:fs';
import { checkUi } from '../checker/check-ui.mjs';
import { loadTokens } from '../checker/load.mjs';

const file = process.argv[2];
if (!file) {
  console.error('Usage: npm run check -- <file>');
  process.exit(1);
}
const r = checkUi(readFileSync(file, 'utf8'), loadTokens());
console.log(`Adherence: ${r.score ?? 'n/a'}% (${r.onSystem} on-system, ${r.offSystem} off-system)`);
for (const v of r.violations) console.log(`  line ${v.line}  ${v.rule}  ${v.found}  ->  ${v.fix}`);
process.exit(r.offSystem > 0 ? 1 : 0);
