import { useState } from 'react';
import { Alert, Button, TextField } from '../components';
import report from '../build/samples-report.json';
import tokens from '../build/tokens.flat.json';
import rules from '../rules/components.json';
import { LINKS, RULE_LABELS, STEPS, TERMS, PRODUCT } from './content.js';
import { Reveal, useCountUp, useInView } from './hooks.jsx';
import LiveDemo from './LiveDemo.jsx';
import Compare from './Compare.jsx';
import { Pipeline, TokensViz, LookupViz, GradeViz, FixViz } from './Visuals.jsx';

const [before, after] = report.samples;
const issues = Object.entries(
  before.violations.reduce((acc, v) => ({ ...acc, [v.rule]: (acc[v.rule] ?? 0) + 1 }), {}),
)
  .sort((a, b) => b[1] - a[1])
  .map(([rule, n]) => [RULE_LABELS[rule] ?? rule, n]);
const VIZ = { tokens: TokensViz, lookup: LookupViz, grade: GradeViz, fix: FixViz };
const semanticColors = tokens.filter((t) => t.type === 'color' && !t.name.startsWith('color.palette') && !t.name.startsWith('color.decor'));
const toolCount = 3;

function Stat({ value, suffix = '', label, run, from = 0 }) {
  const n = useCountUp(value, run, { from });
  return (
    <div className="stat">
      <span className="stat__value">{n}{suffix}</span>
      <span className="stat__label">{label}</span>
    </div>
  );
}

function Stats() {
  const [ref, inView] = useInView();
  return (
    <div ref={ref} className="stats">
      <div className="stat stat--wide">
        <span className="stat__value">
          <span className="stat__bad">{before.score}%</span>
          <span className="stat__arrow">→</span>
          <span className="stat__good">{useCountUp(after.score, inView, { from: before.score })}%</span>
        </span>
        <span className="stat__label">on-system score, same prompt <em>(illustrative)</em></span>
      </div>
      <Stat value={tokens.length} label="design tokens" run={inView} />
      <Stat value={Object.keys(rules.components).length} label="components with rules" run={inView} />
      <Stat value={toolCount} label="MCP tools" run={inView} />
    </div>
  );
}

function UnderTheHood() {
  const [tab, setTab] = useState('tokens');
  const tabs = [['tokens', 'Tokens'], ['components', 'Components'], ['code', 'Code']];
  return (
    <div className="hood">
      <div className="tabs" role="tablist">
        {tabs.map(([id, label]) => (
          <button key={id} role="tab" aria-selected={tab === id} className={`tab ${tab === id ? 'tab--on' : ''}`} onClick={() => setTab(id)}>
            {label}
          </button>
        ))}
      </div>
      <div className="hood__panel" role="tabpanel">
        {tab === 'tokens' && (
          <div className="swatches">
            {semanticColors.map((t) => (
              <div key={t.name} className="swatch">
                <span className="swatch__chip" style={{ background: `var(${t.cssVar})` }} />
                <code>{t.name.replace('color.', '')}</code>
                <span className="muted">{t.value}</span>
              </div>
            ))}
          </div>
        )}
        {tab === 'components' && (
          <div className="component-grid">
            <div className="mini-card">
              <h4>Button</h4>
              <div className="row">
                <Button>Create account</Button>
                <Button variant="secondary">Cancel</Button>
              </div>
              <p className="muted">{rules.components.Button.rules[0]}</p>
            </div>
            <div className="mini-card">
              <h4>TextField</h4>
              <TextField label="Email" type="email" hint="We never share it." />
              <p className="muted">{rules.components.TextField.rules[0]}</p>
            </div>
            <div className="mini-card">
              <h4>Alert</h4>
              <Alert tone="danger">Payment failed. Update your card.</Alert>
              <p className="muted">{rules.components.Alert.rules[0]}</p>
            </div>
          </div>
        )}
        {tab === 'code' && (
          <div className="code-grid">
            <div>
              <h4>Without Lumen · {before.score}%</h4>
              <pre className="code"><code>{before.code}</code></pre>
            </div>
            <div>
              <h4>With Lumen · {after.score}%</h4>
              <pre className="code"><code>{after.code}</code></pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <>
      <div className="hero-bg" aria-hidden="true" />
      <nav className="topbar" aria-label="Main">
        <a href="#top" className="brand">
          <span className="brand__mark" aria-hidden="true" />
          Lumen
        </a>
        <div className="topbar__links">
          <a href="#problem">Problem</a>
          <a href="#how">How it works</a>
          <a href="#product">Product</a>
          <a href="#hood">Under the hood</a>
        </div>
        <a className="topbar__cta" href={LINKS.repo}>GitHub ↗</a>
      </nav>

      <header id="top" className="hero">
        <div className="hero__copy">
          <p className="hero__byline">
            A product exploration by <strong>Ibrahim Adil</strong>, Product Manager · <a href={LINKS.linkedin}>LinkedIn</a>
          </p>
          <h1>Design systems that AI can read.</h1>
          <p className="hero__lead">
            Lumen gives AI assistants your design rules while they build, and scores how closely they follow them.
          </p>
          <div className="hero__actions">
            <a className="btn btn--light" href="#how">See how it works</a>
            <a className="btn btn--ghost" href={LINKS.repo}>View the code</a>
          </div>
        </div>
        <div className="hero__demo">
          <LiveDemo beforeScore={before.score} afterScore={after.score} beforeIssues={issues} />
        </div>
      </header>

      <main className="page">
        <Reveal><Stats /></Reveal>

        <section id="problem" className="section">
          <Reveal className="section__head">
            <p className="eyebrow">The problem</p>
            <h2>AI builds fast. It doesn't know your rules.</h2>
            <p className="section__lead">Same request, with and without the design system.</p>
          </Reveal>
          <div className="problem">
            <Reveal className="problem__visual"><Compare beforeScore={before.score} afterScore={after.score} /></Reveal>
            <div className="problem__cards">
              {issues.slice(0, 3).map(([label, n], i) => (
                <Reveal key={label} className="issue-card" delay={i * 120}>
                  <span className="issue-card__n">{n}</span>
                  <span>{label}</span>
                </Reveal>
              ))}
              <Reveal className="issue-card issue-card--good" delay={400}>
                <span className="issue-card__n">0</span>
                <span>issues with Lumen</span>
              </Reveal>
            </div>
          </div>
          <p className="footnote">Illustrative, hand-written samples scored by the included checker. Recorded AI runs are the next step.</p>
        </section>

        <section id="how" className="section">
          <Reveal className="section__head">
            <p className="eyebrow">How it works</p>
            <h2>From rulebook to on-brand screen, automatically.</h2>
          </Reveal>
          <Reveal><Pipeline /></Reveal>
          <div className="steps">
            {STEPS.map((s, i) => {
              const Viz = VIZ[s.viz];
              return (
                <Reveal key={s.title} className="step" delay={i * 100}>
                  <Viz />
                  <div className="step__body">
                    <span className="step__num">{i + 1}</span>
                    <h3>{s.title}</h3>
                    <p>{s.text}</p>
                    <p className="step__tech">{s.tech}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
          <details className="terms">
            <summary>New to these terms?</summary>
            <dl>
              {TERMS.map((t) => (
                <div key={t.term}><dt>{t.term}</dt><dd>{t.def}</dd></div>
              ))}
            </dl>
          </details>
        </section>

        <section id="product" className="section">
          <Reveal className="section__head">
            <p className="eyebrow">Product thinking</p>
            <h2>Who it serves, how to measure it, what's next.</h2>
          </Reveal>
          <div className="product">
            {PRODUCT.map((p, i) => (
              <Reveal key={p.title} className="product-card" delay={i * 120}>
                <span className="product-card__icon" aria-hidden="true">{p.icon}</span>
                <h3>{p.title}</h3>
                <ul>{p.points.map((pt) => <li key={pt}>{pt}</li>)}</ul>
              </Reveal>
            ))}
          </div>
        </section>

        <section id="hood" className="section">
          <Reveal className="section__head">
            <p className="eyebrow">Under the hood</p>
            <h2>The system itself.</h2>
          </Reveal>
          <Reveal><UnderTheHood /></Reveal>
        </section>
      </main>

      <footer className="footer">
        <div className="footer__inner">
          <div>
            <p className="footer__title">Built by Ibrahim Adil</p>
            <p>Product Manager in Munich, exploring design systems for AI-assisted building.</p>
          </div>
          <div className="footer__links">
            <a className="btn btn--light" href={LINKS.linkedin}>LinkedIn</a>
            <a className="btn btn--ghost" href={LINKS.repo}>GitHub</a>
          </div>
        </div>
      </footer>
    </>
  );
}
