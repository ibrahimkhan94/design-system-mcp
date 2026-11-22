# Lumen: a design system AI assistants can read

Lumen is a small, machine-readable design system. Its tokens and component rules are data, an MCP server serves them to AI assistants, and a checker scores the UI those assistants produce.

**Live demo:** _add the Vercel link here after the first deploy_

| Same prompt | Adherence score |
| --- | --- |
| Assistant without the design system | **29%** (27 off-system values) |
| Assistant with Lumen over MCP | **100%** (0 off-system values) |

Scores come from the included checker (`npm run score`). The v0.1 samples are hand-written examples of typical output; see [Limits](#limits).

---

## The problem

Design systems are mostly written for people: documentation sites, Figma libraries, component packages. More and more UI is now drafted by AI assistants, and they never read the docs site. They invent colours, pick spacing by feel and restyle native elements instead of using the components a team already maintains. Every screen built that way adds design debt that someone has to find and fix by hand.

The design system needs a second audience: machines.

## Who it is for

| User | Need |
| --- | --- |
| Design system owners | Know whether AI-generated UI follows the system, without reviewing every screen by hand. |
| Designers, PMs and engineers building with AI | Get on-brand UI from the first prompt instead of fixing it afterwards. |
| AI assistants | A precise, queryable source of truth: which tokens exist, what each is for, which component to use. |

## What it does

1. **Tokens as data.** Colour, spacing, radius, border and type live in one [W3C Design Tokens](https://tr.designtokens.org/format/) file (`tokens/tokens.json`). Style Dictionary turns it into CSS variables and a flat JSON list. Colour is split into a raw palette and semantic tokens (`text`, `surface`, `action`, `border`, `feedback`), and only semantic tokens are meant for components.
2. **Rules as data.** `rules/components.json` holds global rules and, for each component, its props, the tokens it uses and its usage rules ("at most one primary button per view"). Prose guidelines become something an assistant can query.
3. **Served over MCP.** `mcp-server/` exposes three tools:
   - `get_tokens`: tokens with CSS variable, value and intended use, filterable by category.
   - `get_component_rules`: global rules plus one or all components.
   - `check_ui`: scores a piece of UI code and returns each off-system value with the token to use instead.
4. **Checked before it ships.** The checker finds raw colours, framework palette classes (`bg-blue-500`), arbitrary values (`p-[13px]`), off-scale pixel values, unknown tokens and palette tokens used where a semantic token belongs. Colour suggestions depend on the CSS property, so `#fff` as a background suggests `color.surface.default` and as text suggests `color.text.on-action`.

## How I would measure success

| Metric | Why it matters |
| --- | --- |
| Adherence score of AI-generated UI, per product area | The core outcome: are assistants building on-system? |
| Share of generated screens that pass `check_ui` with no edits | Measures how much manual clean-up remains. |
| Time from prompt to an on-system screen | The value builders feel. |
| Tool calls per session (`get_tokens`, `get_component_rules`) | Shows whether assistants actually consult the system. |
| Tokens and rules with no lookups over 90 days | Finds parts of the system nobody uses. |

## Try it

Requires Node 20 or later.

```bash
npm install
npm test          # checker and MCP server tests
npm run dev       # demo page at http://localhost:5173
npm run check -- samples/before.jsx   # score any file
```

### Use it from Claude Desktop (or any MCP client)

Run `npm install && npm run tokens` once, then add this to your MCP client config with your absolute path:

```json
{
  "mcpServers": {
    "lumen": {
      "command": "node",
      "args": ["/absolute/path/to/design-system-mcp/mcp-server/index.mjs"]
    }
  }
}
```

Then ask: *"Using the Lumen tools, build a sign-up card in React, run check_ui on it and fix any violations."*

## Repo layout

```
tokens/tokens.json        source of truth (W3C DTCG format)
rules/components.json     global and per-component rules
scripts/build-tokens.mjs  Style Dictionary build to build/tokens.css and build/tokens.flat.json
components/               React components that use only tokens
checker/                  adherence checker
mcp-server/               MCP server (stdio)
samples/                  same prompt, without and with the system
site/                     demo page (Vite + React), deployed on Vercel
tests/                    node:test suites
```

## Design decisions

- **W3C Design Tokens format.** It is the emerging standard, tools like Style Dictionary and Figma variables can read it, and an assistant gets one predictable shape.
- **Semantic tokens over palette tokens.** `color.action.primary` tells an assistant what a colour is for. `blue-600` only says what it looks like, which is how off-system UI starts.
- **MCP rather than a long system prompt.** The assistant asks for what it needs, when it needs it, from any MCP client. The system stays one source of truth instead of being pasted into prompts that drift.
- **A simple, explainable checker.** Pattern rules are easy to trust and debug, and each violation comes with a fix. A score nobody can explain will not change behaviour.

## Limits

- The v0.1 before and after samples are hand-written to show typical patterns. The next step is recorded runs: the same prompt in one assistant session without the MCP server and one with it, with transcripts stored in `samples/runs/`.
- The checker uses patterns, not a full parser. It does not judge layout, hierarchy or accessibility, and it counts layout widths such as `400px` as off-scale.
- Five components and one theme, by design. It is a working prototype of the idea, not a full system.

## What I would build next

1. **Recorded evaluation set.** Ten prompts, several runs each, with and without the server, so the score difference is measured rather than illustrated.
2. **Figma variables sync.** Read and write the same token file from Figma so designers and assistants share one source.
3. **Theming and multiple brands.** Semantic tokens resolving to different palettes per product, which is where machine-readable systems pay off at scale.
4. **CI check.** Run `check_ui` on pull requests and report the adherence score per product area.
5. **Split into small services.** Separate token, rules and checking services with versioned APIs, so product teams can adopt one piece without the whole platform.

---

Built by Ibrahim Adil as a product exploration of design systems for AI-assisted building. MIT licensed.
