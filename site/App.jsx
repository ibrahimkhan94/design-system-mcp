import { Alert, Button, TextField } from '../components';
import AfterScreen from '../samples/after.jsx';
import BeforeScreen from '../samples/before.jsx';
import report from '../build/samples-report.json';
import tokens from '../build/tokens.flat.json';
import rules from '../rules/components.json';
import { LINKS, SUMMARY, RULE_LABELS, STEPS, TERMS, USERS, METRICS, NEXT } from './content.js';

const [before, after] = report.samples;
const semanticColors = tokens.filter((t) => t.type === 'color' && !t.name.startsWith('color.palette'));
const spacing = tokens.filter((t) => t.name.startsWith('space.') && t.value !== '0px');
const fontSizes = tokens.filter((t) => t.name.startsWith('font.size.'));
const inventedColours = new Set(before.violations.filter((v) => v.found.startsWith('#')).map((v) => v.found.toLowerCase())).size;
const issueCounts = Object.entries(
  before.violations.reduce((acc, v) => ({ ...acc, [v.rule]: (acc[v.rule] ?? 0) + 1 }), {}),
).sort((a, b) => b[1] - a[1]);

const NAV = [
  ['problem', 'The problem'],
  ['how', 'How it works'],
  ['product', 'Product thinking'],
  ['under-the-hood', 'Under the hood'],
];

function SectionHead({ index, eyebrow, title, intro }) {
  return (
    <div className="section-head">
      <span className="section-head__index">{index}</span>
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
        {intro && <p className="section-head__intro">{intro}</p>}
      </div>
    </div>
  );
}

function ScoreTile({ label, sample, tone }) {
  return (
    <div className={`tile score score--${tone}`}>
      <span className="score__label">{label}</span>
      <span className="score__value">{sample.score}%</span>
      <span className="score__caption">of styling values came from the design system</span>
    </div>
  );
}

export default function App() {
  return (
    <>
      <nav className="topbar" aria-label="Sections">
        <div className="topbar__inner">
          <a href="#overview" className="brand">
            <span className="brand__mark" aria-hidden="true" />
            Lumen
          </a>
          <div className="topbar__links">
            {NAV.map(([id, label]) => (
              <a key={id} href={`#${id}`}>{label}</a>
            ))}
          </div>
          <a className="ds-button ds-button--secondary ds-button--sm" href={LINKS.repo}>GitHub</a>
        </div>
      </nav>

      <main className="page">
        <header id="overview" className="hero">
          <p className="byline">
            A product exploration by <strong>Ibrahim Adil</strong>, Product Manager ·{' '}
            <a href={LINKS.linkedin}>LinkedIn</a>
          </p>
          <h1>Lumen: a design system that AI assistants can read</h1>
          <p className="lead">
            A working prototype that turns a design system into something AI assistants can look up while they build
            UI, and measures how closely they follow it.
          </p>

          <div className="summary">
            {SUMMARY.map((s, i) => (
              <div key={s.label} className="tile summary__item">
                <span className="pill">{i + 1}</span>
                <h3>{s.label}</h3>
                <p>{s.text}</p>
              </div>
            ))}
          </div>

          <div className="score-row">
            <ScoreTile label="AI without the design system" sample={before} tone="before" />
            <span className="score-row__arrow" aria-hidden="true">→</span>
            <ScoreTile label="AI with Lumen" sample={after} tone="after" />
          </div>
          <p className="disclaimer">
            <span className="badge">Illustrative samples</span> Both screens answer the same request and are scored by the
            included checker. The samples are hand-written examples of typical output; recorded AI runs are the next step.
          </p>
        </header>

        <section id="problem" className="section">
          <SectionHead
            index="01"
            eyebrow="The problem"
            title="Same request, two very different screens"
            intro={`Request: “${report.prompt}”`}
          />
          <div className="compare">
            <article className="tile compare__card compare__card--before">
              <header className="compare__head">
                <h3>Without the design system</h3>
                <span className="chip chip--danger">{before.offSystem} issues</span>
              </header>
              <div className="screen screen--before"><BeforeScreen /></div>
              <ul className="issues">
                {issueCounts.map(([rule, n]) => (
                  <li key={rule}>
                    <span>
                      <strong>{n}</strong> {RULE_LABELS[rule] ?? rule}
                      {rule === 'no-raw-color' && `, in ${inventedColours} different shades picked by eye`}
                    </span>
                  </li>
                ))}
                <li><span>Placeholders used instead of labels</span></li>
              </ul>
            </article>

            <article className="tile compare__card compare__card--after">
              <header className="compare__head">
                <h3>With Lumen</h3>
                <span className="chip chip--success">0 issues</span>
              </header>
              <div className="screen"><AfterScreen /></div>
              <ul className="issues issues--good">
                <li><span>Every colour and size comes from a named token</span></li>
                <li><span>Built from existing components, not restyled HTML</span></li>
                <li><span>Visible labels and an error message under the field</span></li>
              </ul>
            </article>
          </div>
        </section>

        <section id="how" className="section">
          <SectionHead
            index="02"
            eyebrow="How it works"
            title="Four steps from rulebook to on-brand screen"
            intro="Each step in plain words, with the technical detail underneath."
          />
          <ol className="steps">
            {STEPS.map((s, i) => (
              <li key={s.title} className="tile step">
                <span className="step__num">{i + 1}</span>
                <h3>{s.title}</h3>
                <p>{s.plain}</p>
                <p className="step__tech"><span>Under the hood</span>{s.tech}</p>
              </li>
            ))}
          </ol>

          <div className="tile terms">
            <h3>Key terms</h3>
            <dl>
              {TERMS.map((t) => (
                <div key={t.term}>
                  <dt>{t.term}</dt>
                  <dd>{t.def}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section id="product" className="section">
          <SectionHead index="03" eyebrow="Product thinking" title="Who it serves, how to measure it, what comes next" />
          <div className="product-grid">
            <div className="tile">
              <h3>Who it is for</h3>
              <ul className="list">
                {USERS.map((u) => (
                  <li key={u.who}><strong>{u.who}</strong><span>{u.need}</span></li>
                ))}
              </ul>
            </div>
            <div className="tile">
              <h3>How I would measure success</h3>
              <ul className="list">
                {METRICS.map((m) => (
                  <li key={m.metric}><strong>{m.metric}</strong><span>{m.why}</span></li>
                ))}
              </ul>
            </div>
          </div>

          <div className="tile roadmap">
            <h3>What I would build next</h3>
            <ol className="roadmap__list">
              {NEXT.map((n, i) => (
                <li key={n.title}>
                  <span className="roadmap__num">0{i + 1}</span>
                  <strong>{n.title}</strong>
                  <span>{n.text}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="under-the-hood" className="section">
          <SectionHead
            index="04"
            eyebrow="Under the hood"
            title="The system itself"
            intro={`${tokens.length} tokens, ${Object.keys(rules.components).length} components and the code behind the comparison.`}
          />

          <div className="tile">
            <h3>Colour tokens, named by purpose</h3>
            <div className="swatches">
              {semanticColors.map((t) => (
                <div key={t.name} className="swatch">
                  <span className="swatch__chip" style={{ background: `var(${t.cssVar})` }} />
                  <code>{t.name.replace('color.', '')}</code>
                  <span className="muted">{t.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="product-grid">
            <div className="tile">
              <h3>Spacing scale</h3>
              {spacing.map((t) => (
                <div key={t.name} className="bar-row">
                  <code>{t.name}</code>
                  <span className="bar" style={{ width: `calc(var(${t.cssVar}) * 4)` }} />
                  <span className="muted">{t.value}</span>
                </div>
              ))}
            </div>
            <div className="tile">
              <h3>Type scale</h3>
              {fontSizes.map((t) => (
                <p key={t.name} className="type-row" style={{ fontSize: `var(${t.cssVar})` }}>
                  {t.name.replace('font.size.', '')} · {t.value}
                </p>
              ))}
            </div>
          </div>

          <div className="component-grid">
            <div className="tile">
              <h3>Button</h3>
              <div className="row">
                <Button>Create account</Button>
                <Button variant="secondary">Cancel</Button>
                <Button variant="danger">Delete</Button>
              </div>
              <ul className="rules">{rules.components.Button.rules.map((r) => <li key={r}>{r}</li>)}</ul>
            </div>
            <div className="tile">
              <h3>TextField</h3>
              <TextField label="Email" type="email" hint="We never share it." />
              <ul className="rules">{rules.components.TextField.rules.map((r) => <li key={r}>{r}</li>)}</ul>
            </div>
            <div className="tile">
              <h3>Alert</h3>
              <div className="stack">
                <Alert tone="success">Settings saved.</Alert>
                <Alert tone="danger">Payment failed. Update your card.</Alert>
              </div>
              <ul className="rules">{rules.components.Alert.rules.map((r) => <li key={r}>{r}</li>)}</ul>
            </div>
          </div>

          <details className="tile code-toggle">
            <summary>Show the code and the checker's fixes</summary>
            <div className="compare">
              <div>
                <h3>Without the design system · {before.score}%</h3>
                <pre className="code"><code>{before.code}</code></pre>
                <ul className="fixes">
                  {before.violations.slice(0, 8).map((v, i) => (
                    <li key={i}><span className="muted">line {v.line}</span> <code>{v.found}</code> {v.fix}</li>
                  ))}
                </ul>
                <p className="muted">and {before.violations.length - 8} more.</p>
              </div>
              <div>
                <h3>With Lumen · {after.score}%</h3>
                <pre className="code"><code>{after.code}</code></pre>
              </div>
            </div>
          </details>
        </section>

        <footer className="footer">
          <div>
            <strong>Ibrahim Adil</strong>, Product Manager · Munich
            <p className="muted">Built as a product exploration of design systems for AI-assisted building.</p>
          </div>
          <div className="footer__links">
            <a href={LINKS.linkedin}>LinkedIn</a>
            <a href={LINKS.repo}>Source on GitHub</a>
          </div>
        </footer>
      </main>
    </>
  );
}
