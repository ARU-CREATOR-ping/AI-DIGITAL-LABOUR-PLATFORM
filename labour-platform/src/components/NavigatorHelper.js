import React, { useState } from 'react';

/**
 * NavigatorHelper
 * Wraps any input/field and shows a contextual tooltip on focus.
 * Pass a `tip` string and optional `step` number.
 */
export default function NavigatorHelper({ tip, step, children, position = 'top' }) {
  const [visible, setVisible] = useState(false);

  return (
    <div style={{ position: 'relative' }}>
      <div
        onFocus={() => setVisible(true)}
        onBlur={() => setVisible(false)}
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
      >
        {children}
      </div>

      {visible && tip && (
        <div
          className="tooltip-box"
          style={{
            bottom: position === 'top' ? 'calc(100% + 10px)' : 'auto',
            top: position === 'bottom' ? 'calc(100% + 10px)' : 'auto',
            left: 0,
            position: 'absolute',
          }}
        >
          {step && (
            <span style={{
              display: 'inline-block',
              background: 'var(--primary)',
              color: '#fff',
              borderRadius: '50%',
              width: 20, height: 20,
              lineHeight: '20px',
              textAlign: 'center',
              fontSize: 11,
              marginRight: 6,
              fontWeight: 700,
            }}>
              {step}
            </span>
          )}
          💡 {tip}
        </div>
      )}
    </div>
  );
}

/**
 * StepGuide – shows a progress stepper at top of forms
 */
export function StepGuide({ steps, current }) {
  return (
    <div style={{ display: 'flex', gap: 0, marginBottom: 24, overflowX: 'auto' }}>
      {steps.map((s, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 4,
            flex: 1,
          }}>
            <div style={{
              width: 32, height: 32,
              borderRadius: '50%',
              background: i < current ? 'var(--success)' : i === current ? 'var(--primary)' : 'var(--border)',
              color: i <= current ? '#fff' : 'var(--text-muted)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 700, fontSize: 14,
              transition: 'all 0.3s',
            }}>
              {i < current ? '✓' : i + 1}
            </div>
            <span style={{ fontSize: 11, color: i === current ? 'var(--primary)' : 'var(--text-muted)', fontWeight: i === current ? 700 : 400, textAlign: 'center', whiteSpace: 'nowrap' }}>
              {s}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div style={{
              height: 2,
              flex: 1,
              background: i < current ? 'var(--success)' : 'var(--border)',
              marginBottom: 16,
              transition: 'background 0.3s',
            }} />
          )}
        </div>
      ))}
    </div>
  );
}
