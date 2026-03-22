import React from 'react';
import { useNavigate } from 'react-router-dom';
import { scoreColor } from '../services/api';

export default function JobCard({ job, matchScore, showApply = false, onApply, applied = false }) {
  const navigate = useNavigate();

  const urgencyStyle = job.urgency === 'urgent'
    ? { background: '#fee2e2', color: '#b91c1c' }
    : { background: '#fef9c3', color: '#854d0e' };

  return (
    <div className="card fade-in" style={{ marginBottom: 16, transition: 'transform 0.2s', cursor: 'pointer' }}
      onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
      onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
        {/* Left info */}
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 6 }}>
            <h3 style={{ fontSize: 18, margin: 0 }}>{job.title}</h3>
            <span className="badge" style={urgencyStyle}>
              {job.urgency === 'urgent' ? '🔴 Urgent' : '🟡 Normal'}
            </span>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
            {job.skills.map(s => (
              <span key={s} className="badge badge-orange">{s}</span>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'auto auto', gap: '4px 20px', fontSize: 14, color: 'var(--text-muted)' }}>
            <span>📍 {job.location}</span>
            <span>📏 {job.distance} km away</span>
            <span>💰 ₹{job.pay}/{job.payType}</span>
            <span>⏱ {job.duration}</span>
            <span>👤 {job.clientName}</span>
            <span>⭐ {job.clientRating}</span>
          </div>

          <p style={{ marginTop: 10, fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.5 }}>
            {job.description}
          </p>
        </div>

        {/* Match score circle */}
        {matchScore !== undefined && (
          <div style={{ textAlign: 'center', flexShrink: 0 }}>
            <div className="score-ring" style={{ background: scoreColor(matchScore) }}>
              {matchScore}%
            </div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4, fontWeight: 600 }}>MATCH</div>
          </div>
        )}
      </div>

      {/* Footer */}
      <hr className="divider" style={{ margin: '14px 0' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Posted: {job.postedAt}</span>
        <div style={{ display: 'flex', gap: 8 }}>
          <span className="badge badge-gray">{job.applicants?.length || 0} applied</span>
          {showApply && (
            applied
              ? <span className="badge badge-green">✅ Applied</span>
              : <button className="btn btn-primary btn-sm" onClick={() => onApply && onApply(job)}>
                  Apply Now
                </button>
          )}
        </div>
      </div>
    </div>
  );
}
