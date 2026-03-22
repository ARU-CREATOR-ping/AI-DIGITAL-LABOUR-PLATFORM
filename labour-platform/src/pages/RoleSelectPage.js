import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function RoleSelectPage() {
  const { setRole } = useApp();
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);

  function handleContinue() {
    if (!selected) return;
    setRole(selected);
    if (selected === 'worker') navigate('/worker/profile-setup');
    else navigate('/client/dashboard');
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg, var(--bg) 0%, #fff8ef 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ width: '100%', maxWidth: 480 }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>👤</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28 }}>Who are you?</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 15, marginTop: 6 }}>
            Select your role to continue
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 28 }}>
          {[
            {
              id: 'worker',
              emoji: '👷',
              title: 'Worker ',
              desc: 'Find jobs, apply for work, track attendance and get paid',
              color: '#fff5ee',
              border: 'var(--primary)',
            },
            {
              id: 'client',
              emoji: '🏢',
              title: 'Client ',
              desc: 'Post jobs, hire workers, manage payments and reviews',
              color: '#eef5ff',
              border: '#2563eb',
            },
          ].map(r => (
            <div
              key={r.id}
              onClick={() => setSelected(r.id)}
              className="card"
              style={{
                cursor: 'pointer',
                border: selected === r.id ? `3px solid ${r.border}` : '2px solid var(--border)',
                background: selected === r.id ? r.color : '#fff',
                transition: 'all 0.2s',
                transform: selected === r.id ? 'scale(1.02)' : 'scale(1)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ fontSize: 48 }}>{r.emoji}</div>
                <div>
                  <h3 style={{ fontSize: 20, marginBottom: 4 }}>{r.title}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>{r.desc}</p>
                </div>
                <div style={{ marginLeft: 'auto' }}>
                  {selected === r.id
                    ? <span style={{ fontSize: 24 }}>✅</span>
                    : <span style={{ width: 24, height: 24, borderRadius: '50%', border: '2px solid var(--border)', display: 'inline-block' }} />
                  }
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          className="btn btn-primary btn-full btn-lg"
          onClick={handleContinue}
          disabled={!selected}
        >
          Continue as {selected ? (selected === 'worker' ? 'Worker' : 'Client') : '...'} →
        </button>
      </div>
    </div>
  );
}
