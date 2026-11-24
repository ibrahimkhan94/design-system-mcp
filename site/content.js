// Page copy in one place, so it can be edited without touching layout.

export const LINKS = {
  repo: 'https://github.com/ibrahimkhan94/design-system-mcp',
  linkedin: 'https://www.linkedin.com/in/ibrahim-adil-180701144',
};

// Plain-language names for the checker's rule ids.
export const RULE_LABELS = {
  'no-raw-color': 'invented colours',
  'off-scale': 'sizes off the scale',
  'arbitrary-value': 'one-off values',
  'spacing-scale': 'spacing off the scale',
  'semantic-tokens': 'raw palette colours',
  'unknown-token': 'tokens that do not exist',
};

export const STEPS = [
  {
    title: 'Write the rules once, as data',
    text: 'Every colour, size and component gets a name and a purpose.',
    tech: '62 tokens in the W3C Design Tokens format',
    viz: 'tokens',
  },
  {
    title: 'Let the AI look them up',
    text: 'The assistant asks what it may use before it writes any UI.',
    tech: 'MCP server: get_tokens, get_component_rules',
    viz: 'lookup',
  },
  {
    title: 'Grade what it built',
    text: 'Every value that did not come from the system is flagged.',
    tech: 'check_ui returns a score and a fix per issue',
    viz: 'grade',
  },
  {
    title: 'Fix and check again',
    text: 'The screen arrives on-system, not cleaned up later by hand.',
    tech: 'The same loop can run on every pull request',
    viz: 'fix',
  },
];

export const TERMS = [
  { term: 'Design system', def: "A company's shared rulebook of colours, spacing, type and components." },
  { term: 'Design token', def: 'One named rule in that rulebook, such as action.primary, with a note on when to use it.' },
  { term: 'MCP', def: 'Model Context Protocol: an open standard that lets AI assistants call outside tools.' },
  { term: 'On-system score', def: 'The share of styling values that come from the design system. 100% means nothing was invented.' },
];

export const PRODUCT = [
  {
    icon: '◎',
    title: 'Who it is for',
    points: ['Design system owners who need to know AI output follows the system', 'Designers, PMs and engineers who build with AI', 'AI assistants that need one source of truth'],
  },
  {
    icon: '▤',
    title: 'How I would measure it',
    points: ['On-system score per product area', 'Screens that pass with no edits', 'Tool calls per AI session', 'Tokens nobody uses after 90 days'],
  },
  {
    icon: '➜',
    title: 'What I would build next',
    points: ['Measured evaluation with recorded AI runs', 'Figma sync for the same token file', 'Themes for many brands from one system', 'A check on every pull request', 'Separate token, rules and checking services'],
  },
];
