import { useId } from 'react';
import './components.css';

export function Button({ variant = 'primary', size = 'md', fullWidth = false, className = '', ...props }) {
  const cls = ['ds-button', `ds-button--${variant}`, size === 'sm' && 'ds-button--sm', fullWidth && 'ds-button--full', className]
    .filter(Boolean)
    .join(' ');
  return <button className={cls} {...props} />;
}

export function TextField({ label, hint, error, type = 'text', ...props }) {
  const id = useId();
  return (
    <div className="ds-field">
      <label className="ds-field__label" htmlFor={id}>{label}</label>
      <input
        id={id}
        type={type}
        className="ds-field__input"
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error || hint ? `${id}-msg` : undefined}
        {...props}
      />
      {error ? (
        <span id={`${id}-msg`} className="ds-field__error">{error}</span>
      ) : hint ? (
        <span id={`${id}-msg`} className="ds-field__hint">{hint}</span>
      ) : null}
    </div>
  );
}

export function Card({ title, children }) {
  return (
    <section className="ds-card">
      {title && <h2 className="ds-card__title">{title}</h2>}
      {children}
    </section>
  );
}

export function Alert({ tone = 'success', children }) {
  return (
    <div role={tone === 'danger' ? 'alert' : 'status'} className={`ds-alert ds-alert--${tone}`}>
      {children}
    </div>
  );
}

export function Stack({ gap = '4', children }) {
  return (
    <div className="ds-stack" style={{ gap: `var(--ds-space-${gap})` }}>
      {children}
    </div>
  );
}
