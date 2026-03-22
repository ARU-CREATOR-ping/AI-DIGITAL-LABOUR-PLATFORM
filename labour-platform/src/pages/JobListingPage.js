import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { calculateMatchScore } from '../services/api';
import JobCard from '../components/JobCard';
import NavigatorHelper from '../components/NavigatorHelper';
import VoiceAssistant from '../components/VoiceAssistant';

const CATEGORIES = ['All', 'Painting', 'Electrician', 'Plumbing', 'Carpentry', 'AC Technician', 'Masonry'];

export default function JobListingPage() {
  const { jobs, applications, applyToJob, workerProfile } = useApp();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sortBy, setSortBy] = useState('match');
  const [applying, setApplying] = useState(null);
  const [toast, setToast] = useState('');

  const appliedJobIds = applications.map(a => a.jobId);

  const scored = jobs.map(j => ({
    ...j,
    matchScore: calculateMatchScore({ job: j, worker: workerProfile }),
  }));

  const filtered = scored.filter(j => {
    const matchSearch = search === '' ||
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.location.toLowerCase().includes(search.toLowerCase()) ||
      j.skills.some(s => s.toLowerCase().includes(search.toLowerCase()));
    const matchCat = category === 'All' || j.category === category;
    return matchSearch && matchCat;
  }).sort((a, b) => {
    if (sortBy === 'match') return b.matchScore - a.matchScore;
    if (sortBy === 'pay') return b.pay - a.pay;
    if (sortBy === 'distance') return a.distance - b.distance;
    return 0;
  });

  async function handleApply(job) {
    setApplying(job.id);
    await new Promise(r => setTimeout(r, 800));
    applyToJob(job.id, workerProfile);
    setApplying(null);
    setToast(`✅ Applied to "${job.title}" successfully!`);
    setTimeout(() => setToast(''), 3000);
  }

  return (
    <div className="page-wrapper" style={{ paddingBottom: 80 }}>
      <div className="container" style={{ paddingTop: 24 }}>

        {/* Header */}
        <div style={{ marginBottom: 20 }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26, marginBottom: 4 }}>🔍 Find Jobs</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>{filtered.length} jobs available near you</p>
        </div>

        {/* Toast */}
        {toast && <div className="alert alert-success">{toast}</div>}

        {/* Search */}
        <div className="form-group">
          <NavigatorHelper tip="Search by job title, skill, or location name" step={1}>
            <input
              className="form-input"
              placeholder="🔍 Search jobs, skills, location..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </NavigatorHelper>
        </div>

        {/* Category filters */}
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 8, marginBottom: 12 }}>
          {CATEGORIES.map(c => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              style={{
                padding: '8px 16px',
                borderRadius: 99,
                border: category === c ? '2px solid var(--primary)' : '2px solid var(--border)',
                background: category === c ? 'var(--primary)' : '#fff',
                color: category === c ? '#fff' : 'var(--text-muted)',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: 13,
                whiteSpace: 'nowrap',
              }}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Sort */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 20 }}>
          <span style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600 }}>Sort by:</span>
          {[['match', '🤖 Best Match'], ['pay', '💰 Highest Pay'], ['distance', '📍 Nearest']].map(([v, l]) => (
            <button
              key={v}
              onClick={() => setSortBy(v)}
              className={`btn btn-sm ${sortBy === v ? 'btn-primary' : 'btn-outline'}`}
              style={{ fontSize: 12 }}
            >
              {l}
            </button>
          ))}
        </div>

        {/* AI match explanation */}
        <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 10, padding: '10px 14px', marginBottom: 20, fontSize: 13 }}>
          🤖 <strong>AI Match Score</strong> = Skills (35%) + Experience (25%) + Rating (20%) + Distance (10%) + Availability (10%)
        </div>

        {/* Job list */}
        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="emoji">😔</div>
            <h3>No jobs found</h3>
            <p>Try changing your search or category filter</p>
          </div>
        ) : (
          filtered.map(job => (
            <div key={job.id} style={{ position: 'relative' }}>
              {applying === job.id && (
                <div style={{
                  position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.8)',
                  borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  zIndex: 10, fontSize: 18, fontWeight: 700, color: 'var(--primary)',
                }}>
                  ⏳ Applying...
                </div>
              )}
              <JobCard
                job={job}
                matchScore={job.matchScore}
                showApply={true}
                applied={appliedJobIds.includes(job.id)}
                onApply={handleApply}
              />
            </div>
          ))
        )}
      </div>
      <VoiceAssistant />
    </div>
  );
}
