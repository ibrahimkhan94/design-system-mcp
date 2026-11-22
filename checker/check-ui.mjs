// Adherence checker: scans UI code (JSX, CSS, HTML) and reports how much of its
// styling comes from the design system. Deliberately simple and explainable:
// every style value it finds is either "on-system" or a violation with a fix.

const PALETTE_CLASS = /\b(?:bg|text|border|ring|fill|stroke|from|to|via)-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d{2,3}\b/g;
const ARBITRARY_CLASS = /\b[a-z][\w-]*-\[[^\]\s]+\]/g;
const RAW_COLOR = /#[0-9a-fA-F]{3,8}\b|\b(?:rgb|rgba|hsl|hsla)\(/g;
const PX_VALUE = /(?<![\w-])(\d+(?:\.\d+)?)px\b/g;
const CSS_VAR = /var\(\s*(--[\w-]+)/g;
const SPACING_CLASS = /\b(?:p|px|py|pt|pb|pl|pr|m|mx|my|mt|mb|ml|mr|gap|space-y|space-x)-(\d+(?:\.5)?)\b/g;

// Tailwind spacing steps that land on the 4px scale used by this system.
const ALLOWED_TW_SPACING = new Set(['0', '1', '2', '3', '4', '6', '8', '12']);

function hexToRgb(hex) {
  let h = hex.replace('#', '');
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  const n = parseInt(h.slice(0, 6), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

// Which token groups suit a CSS property, so '#fff' as a background suggests a
// surface token and '#fff' as text colour suggests a text token.
const PROPERTY_GROUPS = [
  [/background|bg/i, ['color.surface', 'color.action', 'color.feedback']],
  [/border|outline/i, ['color.border', 'color.feedback']],
  [/^color$|fill|stroke/i, ['color.text', 'color.feedback']],
];

function propertyBefore(line, index) {
  const m = line.slice(0, index).match(/([\w-]+)\s*[:=]\s*[^:=,;{}]*$/);
  return m?.[1] ?? '';
}

function nearestColorToken(hex, tokens, property) {
  const target = hexToRgb(hex);
  const ranked = tokens
    .filter((t) => t.type === 'color' && !t.name.startsWith('color.palette'))
    .map((t) => {
      const c = hexToRgb(String(t.value));
      return { t, d: Math.hypot(c[0] - target[0], c[1] - target[1], c[2] - target[2]) };
    })
    .sort((a, b) => a.d - b.d);
  if (!ranked.length) return undefined;
  const groups = PROPERTY_GROUPS.find(([re]) => re.test(property))?.[1];
  const preferred = groups && ranked.find((r) => r.d <= ranked[0].d + 40 && groups.some((g) => r.t.name.startsWith(g)));
  return (preferred ?? ranked[0]).t;
}

export function checkUi(code, tokens) {
  const knownVars = new Set(tokens.map((t) => t.cssVar));
  const allowedPx = new Set(
    tokens.filter((t) => t.type === 'dimension').map((t) => parseFloat(String(t.value))),
  );

  const violations = [];
  let compliant = 0;

  code.split('\n').forEach((line, i) => {
    const lineNo = i + 1;
    const add = (rule, found, fix) => violations.push({ line: lineNo, rule, found, fix });

    for (const m of line.matchAll(CSS_VAR)) {
      if (!m[1].startsWith('--ds-')) continue;
      if (knownVars.has(m[1])) {
        if (m[1].startsWith('--ds-color-palette-')) {
          add('semantic-tokens', m[1], 'Use a semantic colour token (text, surface, action, border, feedback) instead of a palette token.');
        } else compliant++;
      } else add('unknown-token', m[1], 'This token does not exist. Call get_tokens for valid names.');
    }

    for (const m of line.matchAll(RAW_COLOR)) {
      const found = m[0];
      if (found.startsWith('#')) {
        const near = nearestColorToken(found, tokens, propertyBefore(line, m.index));
        add('no-raw-color', found, near ? `Use var(${near.cssVar}) (${near.name}).` : 'Use a colour token.');
      } else add('no-raw-color', found + '...)', 'Use a colour token.');
    }

    for (const m of line.matchAll(PALETTE_CLASS)) {
      add('no-raw-color', m[0], 'Framework palette class. Use a colour token instead.');
    }

    for (const m of line.matchAll(ARBITRARY_CLASS)) {
      add('arbitrary-value', m[0], 'Arbitrary value bypasses the scale. Use a token step.');
    }

    // Strip arbitrary classes first so their contents are not double-counted.
    const plain = line.replace(ARBITRARY_CLASS, '');

    for (const m of plain.matchAll(PX_VALUE)) {
      const v = parseFloat(m[1]);
      if (allowedPx.has(v)) compliant++;
      else add('off-scale', m[0], `${m[0]} is not on a token scale. Nearest steps: ${nearestSteps(v, allowedPx)}.`);
    }

    for (const m of plain.matchAll(SPACING_CLASS)) {
      if (ALLOWED_TW_SPACING.has(m[1])) compliant++;
      else add('spacing-scale', m[0], 'Spacing step is off the 4px scale used by this system.');
    }
  });

  const total = compliant + violations.length;
  return {
    score: total === 0 ? null : Math.round((compliant / total) * 100),
    onSystem: compliant,
    offSystem: violations.length,
    violations,
  };
}

function nearestSteps(v, allowed) {
  return [...allowed]
    .sort((a, b) => Math.abs(a - v) - Math.abs(b - v))
    .slice(0, 2)
    .sort((a, b) => a - b)
    .map((x) => `${x}px`)
    .join(' or ');
}
