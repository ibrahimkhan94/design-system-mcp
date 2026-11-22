import { test } from 'node:test';
import assert from 'node:assert/strict';
import { checkUi } from '../checker/check-ui.mjs';
import { loadTokens } from '../checker/load.mjs';

const tokens = loadTokens();

test('token-only code scores 100', () => {
  const r = checkUi('color: var(--ds-color-text-default); padding: var(--ds-space-4);', tokens);
  assert.equal(r.score, 100);
  assert.equal(r.offSystem, 0);
});

test('raw hex is flagged with the nearest semantic token', () => {
  const r = checkUi("style={{ color: '#3b5bdc' }}", tokens);
  assert.equal(r.violations[0].rule, 'no-raw-color');
  assert.match(r.violations[0].fix, /--ds-color-(action-primary|text-link|border-focus)/);
});

test('colour suggestions follow the CSS property', () => {
  const bg = checkUi("style={{ background: '#fff' }}", tokens);
  const fg = checkUi("style={{ color: '#fff' }}", tokens);
  assert.match(bg.violations[0].fix, /color\.surface\.default/);
  assert.match(fg.violations[0].fix, /color\.text\.on-action/);
});

test('palette tokens are flagged in favour of semantic ones', () => {
  const r = checkUi('background: var(--ds-color-palette-blue-600);', tokens);
  assert.equal(r.violations[0].rule, 'semantic-tokens');
});

test('unknown tokens are flagged', () => {
  const r = checkUi('color: var(--ds-color-brand-magic);', tokens);
  assert.equal(r.violations[0].rule, 'unknown-token');
});

test('px values on the scale pass, off-scale values fail', () => {
  const r = checkUi('padding: 16px; margin: 13px;', tokens);
  assert.equal(r.onSystem, 1);
  assert.equal(r.violations[0].rule, 'off-scale');
});

test('Tailwind palette and arbitrary classes are flagged', () => {
  const r = checkUi('<div className="bg-blue-500 p-[13px] p-4" />', tokens);
  const rules = r.violations.map((v) => v.rule).sort();
  assert.deepEqual(rules, ['arbitrary-value', 'no-raw-color']);
  assert.equal(r.onSystem, 1);
});

test('code with no style values returns a null score', () => {
  assert.equal(checkUi('const a = 1;', tokens).score, null);
});
