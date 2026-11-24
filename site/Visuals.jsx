// Small looping illustrations for the step cards and the pipeline.

export function Pipeline() {
  const nodes = [
    { label: 'Tokens & rules', sub: 'tokens.json', icon: '◆' },
    { label: 'MCP server', sub: 'get_tokens · get_rules', icon: '⇄' },
    { label: 'AI assistant', sub: 'builds the UI', icon: '✦' },
    { label: 'check_ui', sub: 'scores and fixes', icon: '✓', loop: true },
    { label: 'On-system UI', sub: 'ready to ship', icon: '▣', done: true },
  ];
  return (
    <div className="pipeline">
      {nodes.map((n, i) => (
        <div key={n.label} className="pipeline__item">
          <div className={`pipeline__node ${n.done ? 'pipeline__node--done' : ''}`}>
            <span className="pipeline__icon" aria-hidden="true">{n.icon}</span>
            <strong>{n.label}</strong>
            <span>{n.sub}</span>
            {n.loop && <span className="pipeline__loop">↺ fix &amp; re-check</span>}
          </div>
          {i < nodes.length - 1 && (
            <div className="pipeline__link" aria-hidden="true">
              <span className="pipeline__pulse" style={{ animationDelay: `${i * 0.6}s` }} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export function TokensViz() {
  const rows = [
    ['action.primary', 'var(--ds-color-action-primary)', 'buttons'],
    ['text.muted', 'var(--ds-color-text-muted)', 'hints'],
    ['space.4', null, '16px'],
    ['radius.lg', null, 'cards'],
  ];
  return (
    <div className="viz viz--tokens">
      {rows.map(([name, swatch, use], i) => (
        <div key={name} className="token-row" style={{ animationDelay: `${i * 0.5}s` }}>
          {swatch ? <span className="token-row__swatch" style={{ background: swatch }} /> : <span className="token-row__swatch token-row__swatch--dim">{name.startsWith('space') ? '↔' : '◜'}</span>}
          <code>{name}</code>
          <span>{use}</span>
        </div>
      ))}
    </div>
  );
}

export function LookupViz() {
  return (
    <div className="viz viz--lookup">
      <div className="bubble bubble--ask">Which colours can I use?</div>
      <div className="bubble bubble--call"><code>get_tokens("color")</code></div>
      <div className="bubble bubble--answer">
        <span className="mini-swatch" style={{ background: 'var(--ds-color-action-primary)' }} /> action.primary
        <span className="mini-swatch" style={{ background: 'var(--ds-color-action-danger)' }} /> action.danger
      </div>
    </div>
  );
}

export function GradeViz() {
  return (
    <div className="viz viz--grade">
      <span className="scanline" aria-hidden="true" />
      <code className="code-line">background: <span className="flag">'#fff'</span>;</code>
      <code className="code-line">padding: <span className="flag">'13px'</span>;</code>
      <code className="code-line">gap: var(--ds-space-4);</code>
      <code className="code-line">color: <span className="flag">'#1a73e8'</span>;</code>
      <div className="viz__result">3 off-system values found</div>
    </div>
  );
}

export function FixViz() {
  return (
    <div className="viz viz--fix">
      <div className="fix-row">
        <code className="fix-old">'#1a73e8'</code>
        <span aria-hidden="true">→</span>
        <code className="fix-new">text.link</code>
      </div>
      <div className="fix-row" style={{ '--d': '0.4s' }}>
        <code className="fix-old">'13px'</code>
        <span aria-hidden="true">→</span>
        <code className="fix-new">space.3</code>
      </div>
      <div className="viz__result viz__result--good">✓ 100% on-system</div>
    </div>
  );
}
