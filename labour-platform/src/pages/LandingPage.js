import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 60%, #0f3460 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      {/* Hero */}
      <div style={{ textAlign: 'center', maxWidth: 480, marginBottom: 48 }}>
        <div style={{ fontSize: 72, marginBottom: 16 }}>⚒️</div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 42, fontWeight: 800, color: '#fff', marginBottom: 8 }}>
          A<span style={{ color: 'var(--primary)' }}>I</span>
        </h1>
        <p style={{ color: '#a0aec0', fontSize: 18, marginBottom: 8 }}>
          Digital Labour Platform
        </p>
        <p style={{ color: '#718096', fontSize: 15, lineHeight: 1.7 }}>
          Connecting skilled workers with clients across India. Find work or hire workers instantly.
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: 32, marginBottom: 48, flexWrap: 'wrap', justifyContent: 'center' }}>
        {[
          { num: '50,000+', label: 'Workers' },
          { num: '12,000+', label: 'Clients' },
          { num: '95%', label: 'Success Rate' },
        ].map(s => (
          <div key={s.label} style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, color: 'var(--primary)' }}>{s.num}</div>
            <div style={{ color: '#718096', fontSize: 13 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, width: '100%', maxWidth: 340 }}>
        <button className="btn btn-primary btn-lg btn-full" onClick={() => navigate('/login')}>
          🚀 Get Started
        </button>
        <div style={{ display: 'flex', gap: 12 }}>
          <button
            className="btn btn-full"
            style={{ background: '#ffffff15', color: '#fff', border: '1px solid #ffffff25', flex: 1 }}
            onClick={() => navigate('/login?role=worker')}
          >
            👷 I'm a Worker
          </button>
          <button
            className="btn btn-full"
            style={{ background: '#ffffff15', color: '#fff', border: '1px solid #ffffff25', flex: 1 }}
            onClick={() => navigate('/login?role=client')}
          >
            🏢 I'm a Client
          </button>
        </div>
      </div>

      {/* Features */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 16, marginTop: 48, width: '100%', maxWidth: 600 }}>
        {[
          { emoji: '🤖', label: 'AI Match Score' },
          { emoji: '📸', label: 'Attendance Tracking' },
          { emoji: '💳', label: 'Easy Payments' },
          { emoji: '⭐', label: 'Ratings & Reviews' },
        ].map(f => (
          <div key={f.label} style={{
            background: '#ffffff10',
            border: '1px solid #ffffff18',
            borderRadius: 12,
            padding: '16px 12px',
            textAlign: 'center',
            backdropFilter: 'blur(6px)',
          }}>
            <div style={{ fontSize: 28, marginBottom: 6 }}>{f.emoji}</div>
            <div style={{ color: '#e2e8f0', fontSize: 13, fontWeight: 600 }}>{f.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
