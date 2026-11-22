import { Alert, Button, TextField } from '../components';
import SignUpCard from '../samples/after.jsx';
import report from '../build/samples-report.json';
import tokens from '../build/tokens.flat.json';
import rules from '../rules/components.json';

const REPO = 'https://github.com/ibrahimkhan94/design-system-mcp';
const [before, after] = report.samples;
const semanticColors = tokens.filter((t) => t.type === 'color' && !t.name.startsWith('color.palette'));
const spacing = tokens.filter((t) => t.name.startsWith('space.') && t.value !== '0px');
const radii = tokens.filter((t) => t.name.startsWith('radius.'));
const fontSizes = tokens.filter((t) => t.name.startsWith('font.size.'));

function Score({ label, sample, tone }) {
  return (
    <div className={`score score--${tone}`}>
      <span className="score__label">{label}</span>
      <span className="score__value">{sample.score}%</span>
      <span className="score__meta">
        {sample.onSystem} on-system values, {sample.offSystem} off-system
      </span>
    </div>
  );
}

function Code({ children }) {
  return <pre className="code"><code>{children}</code></pre>;
}

export default function App() {
  const violationsByRule = before.violations.reduce((acc, v) => ({ ...acc, [v.rule]: (acc[v.rule] ?? 0) + 1 }), {});

  return (
    <main className="page">
      <header className="hero">
        <p className="eyebrow">Design systems for AI-assisted building</p>
        <h1>Lumen: a design system that AI assistants can read</h1>
        <p className="lead">
          Most design systems are written for people: documentation pages and static libraries. When an AI assistant
          builds UI, it never sees them, so it invents colours, spacing and components. Lumen exposes its tokens and
          component rules to assistants through an MCP server, then scores the UI they produce.
        </p>
        <div className="scores">
          <Score label="Without the system" sample={before} tone="before" />
          <Score label="With the system" sample={after} tone="after" />
        </div>
        <p className="note">
          Same prompt, scored by the included checker. Prompt: “{report.prompt}”
        </p>
        <div className="actions">
          <a className="ds-button ds-button--primary" href={REPO}>View on GitHub</a>
          <a className="ds-button ds-button--secondary" href="#how">How it works</a>
        </div>
      </header>

      <section id="how" className="section">
        <h2>How it works</h2>
        <ol className="steps">
          <li>
            <h3>1. Tokens and rules as data</h3>
            <p>Colours, spacing, radius and type live in one W3C design-tokens file. Component usage rules live in JSON, not prose.</p>
          </li>
          <li>
            <h3>2. Served over MCP</h3>
            <p>
              The assistant calls <code>get_tokens</code> and <code>get_component_rules</code> before it writes UI, so it builds
              with the system instead of guessing.
            </p>
          </li>
          <li>
            <h3>3. Checked before it ships</h3>
            <p>
              <code>check_ui</code> scores the result and returns each off-system value with the token to use instead. The
              assistant fixes them and checks again.
            </p>
          </li>
        </ol>
      </section>

      <section className="section">
        <h2>Before and after</h2>
        <div className="compare">
          <div className="panel">
            <h3>Without the system: {before.score}%</h3>
            <ul className="tally">
              {Object.entries(violationsByRule).map(([rule, n]) => (
                <li key={rule}><code>{rule}</code> {n}</li>
              ))}
            </ul>
            <Code>{before.code}</Code>
            <h3 className="fixes-title">What check_ui returns</h3>
            <ul className="fixes">
              {before.violations.slice(0, 8).map((v, i) => (
                <li key={i}>
                  <span className="muted">line {v.line}</span> <code>{v.found}</code> {v.fix}
                </li>
              ))}
            </ul>
            <p className="muted">and {before.violations.length - 8} more.</p>
          </div>
          <div className="panel">
            <h3>With the system: {after.score}%</h3>
            <div className="preview"><SignUpCard /></div>
            <Code>{after.code}</Code>
          </div>
        </div>
      </section>

      <section className="section">
        <h2>Tokens</h2>
        <p className="muted">{tokens.length} tokens, generated from <code>tokens/tokens.json</code> with Style Dictionary.</p>
        <h3>Semantic colours</h3>
        <div className="swatches">
          {semanticColors.map((t) => (
            <div key={t.name} className="swatch">
              <span className="swatch__chip" style={{ background: `var(${t.cssVar})` }} />
              <code>{t.name.replace('color.', '')}</code>
              <span className="muted">{t.value}</span>
            </div>
          ))}
        </div>
        <div className="token-grid">
          <div>
            <h3>Spacing</h3>
            {spacing.map((t) => (
              <div key={t.name} className="bar-row">
                <code>{t.name}</code>
                <span className="bar" style={{ width: `calc(var(${t.cssVar}) * 4)` }} />
                <span className="muted">{t.value}</span>
              </div>
            ))}
          </div>
          <div>
            <h3>Radius</h3>
            <div className="radii">
              {radii.map((t) => (
                <div key={t.name} className="radius">
                  <span className="radius__box" style={{ borderRadius: `var(${t.cssVar})` }} />
                  <code>{t.name.replace('radius.', '')}</code>
                </div>
              ))}
            </div>
            <h3>Type</h3>
            {fontSizes.map((t) => (
              <p key={t.name} className="type-row" style={{ fontSize: `var(${t.cssVar})` }}>
                {t.name.replace('font.size.', '')} · {t.value}
              </p>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <h2>Components</h2>
        <p className="muted">
          {Object.keys(rules.components).length} components, each with props, tokens and usage rules the assistant can read.
        </p>
        <div className="component-grid">
          <div className="panel">
            <h3>Button</h3>
            <div className="row">
              <Button>Create account</Button>
              <Button variant="secondary">Cancel</Button>
              <Button variant="danger">Delete</Button>
            </div>
            <ul className="rules">{rules.components.Button.rules.map((r) => <li key={r}>{r}</li>)}</ul>
          </div>
          <div className="panel">
            <h3>TextField</h3>
            <TextField label="Email" type="email" hint="We never share it." />
            <ul className="rules">{rules.components.TextField.rules.map((r) => <li key={r}>{r}</li>)}</ul>
          </div>
          <div className="panel">
            <h3>Alert</h3>
            <div className="stack">
              <Alert tone="success">Settings saved.</Alert>
              <Alert tone="warning">Your trial ends in 3 days.</Alert>
              <Alert tone="danger">Payment failed. Update your card.</Alert>
            </div>
            <ul className="rules">{rules.components.Alert.rules.map((r) => <li key={r}>{r}</li>)}</ul>
          </div>
        </div>
      </section>

      <footer className="footer">
        <span>Built by Ibrahim Adil as a product exploration of design systems for AI-assisted workflows.</span>
        <a href={REPO}>Source on GitHub</a>
      </footer>
    </main>
  );
}
