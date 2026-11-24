import { useEffect, useState } from 'react';
import BeforeScreen from '../samples/before.jsx';
import AfterScreen from '../samples/after.jsx';
import { prefersReducedMotion, useCountUp } from './hooks.jsx';

const PROMPT = 'Build a sign-up card with name, email and password.';
const TOOLS = ['get_tokens', 'get_component_rules', 'check_ui'];

// A looping story: prompt → off-system screen → Lumen connects → on-system screen.
const TIMELINE = [
  ['typing', 1700],
  ['thinking', 700],
  ['before', 2600],
  ['connect', 1900],
  ['after', 3400],
];

export default function LiveDemo({ beforeScore, afterScore, beforeIssues }) {
  const reduced = prefersReducedMotion();
  const [phase, setPhase] = useState(reduced ? 'after' : 'typing');
  const [typed, setTyped] = useState(reduced ? PROMPT.length : 0);

  useEffect(() => {
    if (reduced) return;
    let i = TIMELINE.findIndex(([p]) => p === phase);
    const t = setTimeout(() => {
      const next = TIMELINE[(i + 1) % TIMELINE.length][0];
      if (next === 'typing') setTyped(0);
      setPhase(next);
    }, TIMELINE[i][1]);
    return () => clearTimeout(t);
  }, [phase, reduced]);

  useEffect(() => {
    if (phase !== 'typing' || reduced) return;
    const id = setInterval(() => setTyped((n) => Math.min(PROMPT.length, n + 1)), 1400 / PROMPT.length);
    return () => clearInterval(id);
  }, [phase, reduced]);

  const connected = phase === 'connect' || phase === 'after';
  const showScreen = phase === 'before' || phase === 'connect' || phase === 'after';
  const score = useCountUp(afterScore, phase === 'after', { from: beforeScore, duration: 900 });
  const shownScore = phase === 'after' ? score : beforeScore;

  return (
    <div className="demo" aria-label="Animated demo: an AI assistant builds a sign-up card without and with Lumen">
      <div className="demo__bar">
        <span className="demo__dots" aria-hidden="true"><i /><i /><i /></span>
        <span className="demo__title">AI assistant</span>
        <span className={`toggle ${connected ? 'toggle--on' : ''}`}>
          <span className="toggle__track"><span className="toggle__thumb" /></span>
          Lumen {connected ? 'connected' : 'off'}
        </span>
      </div>

      <div className="demo__prompt">
        <span className="demo__you">You</span>
        <span>{PROMPT.slice(0, typed)}<span className="caret" aria-hidden="true" /></span>
      </div>

      <div className="demo__tools" aria-live="polite">
        {phase === 'thinking' && <span className="thinking"><i /><i /><i /></span>}
        {connected &&
          TOOLS.map((t, i) => (
            <span key={t} className="tool-chip" style={{ animationDelay: `${i * 450}ms` }}>
              <span className="tool-chip__dot" /> {t}
            </span>
          ))}
      </div>

      <div className={`demo__stage ${showScreen ? 'demo__stage--show' : ''}`}>
        <div className={`demo__layer screen--before ${phase === 'after' ? 'demo__layer--out' : ''}`}>
          <div className="demo__scale"><BeforeScreen /></div>
        </div>
        <div className={`demo__layer ${phase === 'after' ? 'demo__layer--in' : 'demo__layer--hidden'}`}>
          <div className="demo__scale"><AfterScreen /></div>
        </div>

        {!showScreen && (
          <div className="skeleton" aria-hidden="true">
            <span /><span /><span /><span className="skeleton__btn" />
          </div>
        )}

        <div className={`demo__score ${showScreen ? '' : 'demo__score--hidden'} ${phase === 'after' ? 'demo__score--good' : ''}`}>
          <span className="demo__score-value">{shownScore}%</span>
          <span className="demo__score-label">on-system</span>
        </div>

        {(phase === 'before' || phase === 'connect') && (
          <div className="demo__issues">
            {beforeIssues.slice(0, 3).map(([label, n], i) => (
              <span key={label} className="issue-chip" style={{ animationDelay: `${300 + i * 250}ms` }}>
                {n} {label}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
