import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { calculateMatchScore } from '../services/api';
import JobCard from '../components/JobCard';
import VoiceAssistant from '../components/VoiceAssistant';

export default function WorkerDashboard() {
  const { jobs, applications, workerProfile } = useApp();
  const navigate = useNavigate();

  const appliedJobIds = applications.map(a => a.jobId);
  const recentJobs = jobs.slice(0, 3).map(j => ({
    ...j,
    matchScore: calculateMatchScore({ job: j, worker: workerProfile }),
  }));
  const hiredJobs = applications.filter(a => a.status === 'hired');

  return (
    <div className="page-wrapper" style={{ paddingBottom: 80 }}>
      <div className="container" style={{ paddingTop: 28 }}>

        {/* Welcome banner */}
        <div style={{
          background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
          borderRadius: 20,
          padding: '28px 24px',
          color: '#fff',
          marginBottom: 28,
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', right: -20, top: -20, fontSize: 100, opacity: 0.15 }}>⚒️</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div className="avatar" style={{ width: 52, height: 52, fontSize: 20, background: 'rgba(255,255,255,0.25)' }}>
              {workerProfile.name[0]}
            </div>
            <div>
              <div style={{ fontSize: 13, opacity: 0.85 }}>Namaste 🙏</div>
              <h2 style={{ color: '#fff', fontSize: 22 }}>{workerProfile.name}</h2>
              <div style={{ fontSize: 13, opacity: 0.85 }}>📍 {workerProfile.location}</div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid-3" style={{ marginBottom: 28 }}>
          <div className="stat-box">
            <div className="stat-num">{applications.length}</div>
            <div className="stat-label">Applied Jobs</div>
          </div>
          <div className="stat-box">
            <div className="stat-num">{hiredJobs.length}</div>
            <div className="stat-label">Hired</div>
          </div>
          <div className="stat-box">
            <div className="stat-num">{workerProfile.rating}⭐</div>
            <div className="stat-label">Your Rating</div>
          </div>
        </div>

        {/* Worker profile highlights */}
        <div className="card" style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h3 style={{ fontSize: 16 }}>Your Skills</h3>
            <span className="badge badge-green">🟢 Available</span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
            {workerProfile.skills.map(s => <span key={s} className="badge badge-orange">{s}</span>)}
          </div>
          <div style={{ display: 'flex', gap: 20, fontSize: 14, color: 'var(--text-muted)' }}>
            <span>🛠 {workerProfile.experience} yrs experience</span>
            <span>✅ {workerProfile.jobsDone} jobs done</span>
          </div>
        </div>

        {/* Quick actions */}
        <div className="grid-2" style={{ marginBottom: 28 }}>
          <button className="btn btn-primary btn-lg btn-full" onClick={() => navigate('/worker/jobs')}>
            🔍 Find Jobs
          </button>
          <button className="btn btn-secondary btn-lg btn-full" onClick={() => navigate('/worker/applications')}>
            📋 My Applications
          </button>
          <button className="btn btn-outline btn-lg btn-full" onClick={() => navigate('/worker/attendance')}>
            📸 Mark Attendance
          </button>
          <button className="btn btn-outline btn-lg btn-full" onClick={() => navigate('/review')}>
            ⭐ Reviews
          </button>
        </div>

        {/* Recent job recommendations */}
        <div className="section-header">
          <h2 className="section-title">🎯 Recommended Jobs</h2>
          <button className="btn btn-outline btn-sm" onClick={() => navigate('/worker/jobs')}>See All</button>
        </div>

        {recentJobs.map(job => (
          <JobCard
            key={job.id}
            job={job}
            matchScore={job.matchScore}
            showApply={true}
            applied={appliedJobIds.includes(job.id)}
            onApply={() => navigate('/worker/jobs')}
          />
        ))}

      </div>
      <VoiceAssistant />
    </div>
  );
}
