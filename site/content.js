// Page copy in one place, so it can be edited without touching layout.

export const LINKS = {
  repo: 'https://github.com/ibrahimkhan94/design-system-mcp',
  linkedin: 'https://www.linkedin.com/in/ibrahim-adil-180701144',
};

export const SUMMARY = [
  {
    label: 'The problem',
    text: 'AI assistants now draft a lot of UI, but they never read the design system. They guess colours and spacing, and every screen needs fixing by hand.',
  },
  {
    label: 'The idea',
    text: 'Turn the design system into data the assistant can look up while it builds, then grade the result automatically.',
  },
  {
    label: 'The outcome',
    text: 'A working prototype: a small design system, a connector any AI assistant can use, and a score that shows how closely a screen follows the system.',
  },
];

// Plain-language names for the checker's rule ids.
export const RULE_LABELS = {
  'no-raw-color': 'colour values not from the system',
  'off-scale': 'sizes off the scale',
  'arbitrary-value': 'one-off values',
  'spacing-scale': 'spacing steps off the scale',
  'semantic-tokens': 'raw palette colours used directly',
  'unknown-token': 'tokens that do not exist',
};

export const STEPS = [
  {
    title: 'Write the rules once, as data',
    plain: 'Every colour, spacing step and font size gets a name and a purpose, for example "action.primary: the main button colour, once per screen".',
    tech: '53 design tokens in the W3C Design Tokens format, built with Style Dictionary. Component rules in JSON.',
  },
  {
    title: 'Let the AI look them up',
    plain: 'A connector lets the assistant ask "which colours can I use?" or "how should a button behave?" before it writes anything.',
    tech: 'An MCP server with get_tokens and get_component_rules. MCP is an open standard for connecting AI assistants to tools.',
  },
  {
    title: 'Grade what it built',
    plain: 'A checker reads the generated screen and counts every value that did not come from the system, with the right replacement for each.',
    tech: 'check_ui returns an adherence score and a fix per violation.',
  },
  {
    title: 'Fix and check again',
    plain: 'The assistant applies the fixes and re-checks, so the screen arrives on-system instead of being cleaned up later by a person.',
    tech: 'The same loop can run on every pull request.',
  },
];

export const TERMS = [
  { term: 'Design system', def: "A company's shared rulebook of colours, spacing, type and components, so every product looks and works alike." },
  { term: 'Design token', def: 'One named rule in that rulebook, such as action.primary = #3B5BDB, with a note on when to use it.' },
  { term: 'MCP', def: 'Model Context Protocol: an open standard that lets AI assistants call outside tools and data.' },
  { term: 'Adherence score', def: 'The share of styling values in a screen that come from the design system. 100% means nothing was invented.' },
];

export const USERS = [
  { who: 'Design system owners', need: 'Know whether AI-built UI follows the system, without reviewing every screen by hand.' },
  { who: 'Designers, PMs and engineers', need: 'Get on-brand UI from the first prompt instead of fixing it afterwards.' },
  { who: 'AI assistants', need: 'A precise source of truth: which tokens exist, what each is for, which component to use.' },
];

export const METRICS = [
  { metric: 'Adherence score per product area', why: 'The core outcome: are assistants building on-system?' },
  { metric: 'Screens that pass with no edits', why: 'How much manual clean-up is left.' },
  { metric: 'Tool calls per session', why: 'Whether assistants actually consult the system.' },
  { metric: 'Unused tokens after 90 days', why: 'Which parts of the system nobody needs.' },
];

export const NEXT = [
  { title: 'Measured evaluation', text: 'Ten prompts, several recorded runs each, with and without the connector.' },
  { title: 'Figma sync', text: 'Designers and assistants read and write the same token file.' },
  { title: 'Themes and brands', text: 'One set of semantic tokens, many product palettes.' },
  { title: 'Check on every pull request', text: 'Adherence score reported per team in CI.' },
  { title: 'Modular services', text: 'Separate token, rules and checking services teams can adopt one at a time.' },
];
