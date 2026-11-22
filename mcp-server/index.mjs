#!/usr/bin/env node
// MCP server that exposes the Lumen design system to AI assistants.
// Tools:
//   get_tokens           tokens with CSS variable names, values and intent
//   get_component_rules  global rules plus per-component props, tokens and usage rules
//   check_ui             adherence score and fixes for a piece of UI code
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { checkUi } from '../checker/check-ui.mjs';
import { loadTokens, loadRules } from '../checker/load.mjs';

const tokens = loadTokens();
const rules = loadRules();
const json = (data) => ({ content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] });

const server = new McpServer({ name: 'lumen-design-system', version: rules.version });

server.registerTool(
  'get_tokens',
  {
    title: 'Get design tokens',
    description:
      'Returns Lumen design tokens with their CSS variable, value and intended use. Call this before writing any UI so styling uses tokens instead of raw values. Semantic colour tokens (text, surface, action, border, feedback) are for components; palette tokens are reference only.',
    inputSchema: {
      category: z
        .enum(['color', 'space', 'radius', 'border-width', 'font'])
        .optional()
        .describe('Limit results to one token category.'),
      includePalette: z.boolean().optional().describe('Include raw palette colours. Default false.'),
    },
  },
  async ({ category, includePalette = false }) => {
    const list = tokens.filter(
      (t) =>
        (!category || t.name.startsWith(category + '.')) &&
        (includePalette || !t.name.startsWith('color.palette')),
    );
    return json({ usage: 'Reference tokens as var(<cssVar>).', tokens: list });
  },
);

server.registerTool(
  'get_component_rules',
  {
    title: 'Get component rules',
    description:
      'Returns the global design rules and, for each Lumen component, its import, props, tokens and usage rules. Use existing components before styling native elements.',
    inputSchema: {
      component: z.string().optional().describe('Component name, for example Button. Omit for all.'),
    },
  },
  async ({ component }) => {
    if (!component) return json(rules);
    const match = Object.keys(rules.components).find((c) => c.toLowerCase() === component.toLowerCase());
    if (!match) return json({ error: `Unknown component "${component}".`, available: Object.keys(rules.components) });
    return json({ global: rules.global, [match]: rules.components[match] });
  },
);

server.registerTool(
  'check_ui',
  {
    title: 'Check UI against the design system',
    description:
      'Scores UI code (JSX, CSS or HTML) for design-system adherence and lists each off-system value with a suggested token. Run it on generated UI before returning it, then fix the violations.',
    inputSchema: { code: z.string().describe('The UI code to check.') },
  },
  async ({ code }) => json(checkUi(code, tokens)),
);

await server.connect(new StdioServerTransport());
