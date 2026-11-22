import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

export function loadTokens() {
  try {
    return JSON.parse(readFileSync(join(root, 'build/tokens.flat.json'), 'utf8'));
  } catch {
    throw new Error('build/tokens.flat.json not found. Run `npm run tokens` first.');
  }
}

export function loadRules() {
  return JSON.parse(readFileSync(join(root, 'rules/components.json'), 'utf8'));
}

export const repoRoot = root;
