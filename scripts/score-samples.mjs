// Scores the before/after samples with the checker and writes build/samples-report.json.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { checkUi } from '../checker/check-ui.mjs';
import { loadTokens, repoRoot } from '../checker/load.mjs';

const tokens = loadTokens();
const read = (f) => readFileSync(join(repoRoot, 'samples', f), 'utf8');

const report = {
  prompt: read('prompt.md').trim(),
  samples: ['before', 'after'].map((name) => {
    const code = read(`${name}.jsx`);
    return { name, code, ...checkUi(code, tokens) };
  }),
};

mkdirSync(join(repoRoot, 'build'), { recursive: true });
writeFileSync(join(repoRoot, 'build/samples-report.json'), JSON.stringify(report, null, 2));
for (const s of report.samples) {
  console.log(`${s.name.padEnd(6)} score ${String(s.score).padStart(3)}%  on-system ${s.onSystem}  off-system ${s.offSystem}`);
}
