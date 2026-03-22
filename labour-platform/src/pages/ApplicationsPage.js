import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const statusConfig = {
  pending: { label: '⏳ Pending', badge: 'badge-yellow' },
  hired: { label: '✅ Hired', badge: 'badge-green' },
  rejected: { label: '❌ Rejected', badge: 'badge-gray' },
};

export default function ApplicationsPage() {
  const { applications, jobs } = useApp();
  const navigate = useNavigate();

  const enriched = applications.map(app => {
    const job = jobs.find(j => j.id === app.jobId);
    return { ...app, job };
  });

  if (enriched.length === 0) {
    return (
      <div className="page-wrapper">
        <div className="container" style={{ paddingTop: 28 }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26, marginBottom: 28 }}>📋 My Applications</h1>
          <div className="empty-state">
            <div className="emoji">📭</div>
            <h3>No Applications Yet</h3>
            <p>Go to Find Jobs and apply to your first job!</p>
            <button className="btn btn-primary" style={{ marginTop: 20 }} onClick={() => navigate('/worker/jobs')}>
              🔍 Find Jobs
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="container" style={{ paddingTop: 24, paddingBottom: 40 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26, marginBottom: 6 }}>📋 My Applications</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 24 }}>{enriched.length} application(s)</p>

        {/* Status summary */}
        <div className="grid-3" style={{ marginBottom: 24 }}>
          {Object.entries(statusConfig).map(([s, c]) => (
            <div key={s} className="stat-box">
              <div className="stat-num" style={{ fontSize: 22 }}>{enriched.filter(a => a.status === s).length}</div>
              <div className="stat-label">{c.label}</div>
            </div>
          ))}
        </div>

        {enriched.map(app => {
          const cfg = statusConfig[app.status] || statusConfig.pending;
          return (
            <div key={app.id} className="card fade-in" style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10 }}>
                <div>
                  <h3 style={{ fontSize: 18, marginBottom: 4 }}>{app.job?.title || 'Job'}</h3>
                  <div style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 6 }}>
                    📍 {app.job?.location} &nbsp;|&nbsp; 💰 ₹{app.job?.pay}/{app.job?.payType}
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                    Applied on {app.appliedAt}
                  </div>
                </div>
                <span className={`badge ${cfg.badge}`} style={{ padding: '8px 14px', fontSize: 13 }}>
                  {cfg.label}
                </span>
              </div>

              {app.status === 'hired' && (
                <>
                  <hr className="divider" />
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    <button className="btn btn-primary btn-sm" onClick={() => navigate('/worker/attendance')}>
                      📸 Mark Attendance
                    </button>
                    <button className="btn btn-outline btn-sm" onClick={() => navigate('/review')}>
                      ⭐ Leave Review
                    </button>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
