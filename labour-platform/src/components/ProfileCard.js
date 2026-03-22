import React from 'react';
import { scoreColor } from '../services/api';

export default function ProfileCard({ worker, matchScore, onHire, hired = false, showHire = false }) {
  const initials = worker.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="card fade-in" style={{ marginBottom: 16 }}>
      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
        {/* Avatar */}
        <div className="avatar" style={{ width: 56, height: 56, fontSize: 20, flexShrink: 0 }}>
          {initials}
        </div>

        {/* Info */}
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
            <div>
              <h3 style={{ fontSize: 17, marginBottom: 2 }}>{worker.name}</h3>
              <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>📱 {worker.phone}</div>
            </div>
            {matchScore !== undefined && (
              <div style={{ textAlign: 'center' }}>
                <div className="score-ring" style={{ background: scoreColor(matchScore), width: 52, height: 52, fontSize: 13 }}>
                  {matchScore}%
                </div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2, fontWeight: 600 }}>AI MATCH</div>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, margin: '10px 0' }}>
            {worker.skills.map(s => <span key={s} className="badge badge-orange">{s}</span>)}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'auto auto auto', gap: '4px 16px', fontSize: 13, color: 'var(--text-muted)' }}>
            <span>⭐ {worker.rating}/5</span>
            <span>🛠 {worker.experience} yrs exp</span>
            <span>✅ {worker.jobsDone} jobs</span>
            <span>📍 {worker.location}</span>
            <span>🟢 {worker.availability ? 'Available' : 'Busy'}</span>
          </div>
        </div>
      </div>

      {showHire && (
        <>
          <hr className="divider" />
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            {hired
              ? <span className="badge badge-green" style={{ padding: '8px 16px', fontSize: 14 }}>✅ Hired</span>
              : <button className="btn btn-primary" onClick={() => onHire && onHire(worker)}>
                  Hire Worker
                </button>
            }
          </div>
        </>
      )}
    </div>
  );
}
