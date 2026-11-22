# Samples

Both files answer the same prompt (`prompt.md`). `npm run score` runs the checker on them and writes `build/samples-report.json`, which the demo page shows.

- `before.jsx`: the kind of code an assistant writes when it has no design system to work from.
- `after.jsx`: the same screen written with the MCP server's tools (tokens, component rules, `check_ui`).

The scores are computed by the checker, not typed in. The v0.1 samples are hand-written to show typical patterns. Replace them with recorded runs (same prompt, one assistant session without the MCP server and one with it) and keep the transcripts in `samples/runs/` so the comparison is reproducible.
