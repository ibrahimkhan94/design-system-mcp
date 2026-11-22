import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

test('MCP server lists its tools and answers calls', async () => {
  const client = new Client({ name: 'test', version: '0.0.0' });
  await client.connect(new StdioClientTransport({ command: 'node', args: ['mcp-server/index.mjs'] }));
  try {
    const { tools } = await client.listTools();
    assert.deepEqual(tools.map((t) => t.name).sort(), ['check_ui', 'get_component_rules', 'get_tokens']);

    const tok = JSON.parse((await client.callTool({ name: 'get_tokens', arguments: { category: 'space' } })).content[0].text);
    assert.ok(tok.tokens.every((t) => t.name.startsWith('space.')));

    const btn = JSON.parse((await client.callTool({ name: 'get_component_rules', arguments: { component: 'button' } })).content[0].text);
    assert.ok(btn.Button.rules.length > 0);

    const chk = JSON.parse((await client.callTool({ name: 'check_ui', arguments: { code: 'color: #ff0000; padding: var(--ds-space-4);' } })).content[0].text);
    assert.equal(chk.score, 50);
  } finally {
    await client.close();
  }
});
