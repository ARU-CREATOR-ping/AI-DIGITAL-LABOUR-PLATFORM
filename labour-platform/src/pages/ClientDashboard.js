import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function ClientDashboard() {
  const { jobs, applications, user } = useApp();
  const navigate = useNavigate();

  const myJobs = jobs.filter(j => j.clientId === 'client1' || true).slice(0, 10); // show all for demo
  const totalApplicants = myJobs.reduce((sum, j) => sum + (j.applicants?.length || 0), 0);
  const openJobs = myJobs.filter(j => j.status === 'open').length;
  const assignedJobs = myJobs.filter(j => j.status === 'assigned').length;

  return (
    <div className="page-wrapper" style={{ paddingBottom: 40 }}>
      <div className="container" style={{ paddingTop: 24 }}>

        {/* Welcome banner */}
        <div style={{
          background: 'linear-gradient(135deg, var(--secondary) 0%, #2d3a6b 100%)',
          borderRadius: 20,
          padding: '28px 24px',
          color: '#fff',
          marginBottom: 28,
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', right: -10, top: -10, fontSize: 100, opacity: 0.1 }}>🏢</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div className="avatar" style={{ width: 52, height: 52, fontSize: 20, background: 'rgba(255,255,255,0.2)' }}>
              C
            </div>
            <div>
              <div style={{ fontSize: 13, opacity: 0.8 }}>Welcome back</div>
              <h2 style={{ color: '#fff', fontSize: 22 }}>Client Dashboard</h2>
              <div style={{ fontSize: 13, opacity: 0.8 }}>Manage your jobs and workers</div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid-3" style={{ marginBottom: 28 }}>
          <div className="stat-box">
            <div className="stat-num">{openJobs}</div>
            <div className="stat-label">Open Jobs</div>
          </div>
          <div className="stat-box">
            <div className="stat-num">{totalApplicants}</div>
            <div className="stat-label">Applicants</div>
          </div>
          <div className="stat-box">
            <div className="stat-num">{assignedJobs}</div>
            <div className="stat-label">Assigned</div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="grid-2" style={{ marginBottom: 28 }}>
          <button className="btn btn-primary btn-lg btn-full" onClick={() => navigate('/client/post-job')}>
            ➕ Post New Job
          </button>
          <button className="btn btn-secondary btn-lg btn-full" onClick={() => navigate('/client/applicants')}>
            👥 View Applicants
          </button>
          <button className="btn btn-outline btn-lg btn-full" onClick={() => navigate('/client/payment')}>
            💳 Make Payment
          </button>
          <button className="btn btn-outline btn-lg btn-full" onClick={() => navigate('/review')}>
            ⭐ Reviews
          </button>
        </div>

        {/* My Jobs list */}
        <div className="section-header">
          <h2 className="section-title">📋 My Posted Jobs</h2>
          <button className="btn btn-outline btn-sm" onClick={() => navigate('/client/post-job')}>+ New Job</button>
        </div>

        {myJobs.length === 0 ? (
          <div className="empty-state">
            <div className="emoji">📭</div>
            <h3>No Jobs Posted Yet</h3>
            <p>Post your first job to find skilled workers</p>
            <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => navigate('/client/post-job')}>
              ➕ Post a Job
            </button>
          </div>
        ) : (
          myJobs.map(job => (
            <div key={job.id} className="card fade-in" style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10 }}>
                <div>
                  <h3 style={{ fontSize: 17, marginBottom: 4 }}>{job.title}</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
                    {job.skills.map(s => <span key={s} className="badge badge-orange">{s}</span>)}
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                    📍 {job.location} &nbsp;|&nbsp; 💰 ₹{job.pay}/{job.payType} &nbsp;|&nbsp; ⏱ {job.duration}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span className={`badge ${job.status === 'open' ? 'badge-green' : 'badge-blue'}`} style={{ display: 'block', marginBottom: 6 }}>
                    {job.status === 'open' ? '🟢 Open' : '🔵 Assigned'}
                  </span>
                  <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                    👥 {job.applicants?.length || 0} applied
                  </span>
                </div>
              </div>
              <hr className="divider" />
              <button className="btn btn-outline btn-sm" onClick={() => navigate('/client/applicants')}>
                👥 View Applicants
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
