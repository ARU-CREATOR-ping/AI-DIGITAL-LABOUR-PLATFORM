import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { calculateMatchScore } from '../services/api';
import ProfileCard from '../components/ProfileCard';

const MOCK_APPLICANTS = [
  { id: 'w1', name: 'Raju Mistri', phone: '9876543210', skills: ['Painting', 'Wall Finishing'], experience: 5, rating: 4.3, location: 'Sector 62, Noida', availability: true, jobsDone: 42 },
  { id: 'w2', name: 'Suresh Kumar', phone: '9812345678', skills: ['Plumbing', 'Pipe Fitting', 'Electrician'], experience: 8, rating: 4.7, location: 'Indirapuram', availability: true, jobsDone: 87 },
  { id: 'w3', name: 'Manoj Sharma', phone: '9900112233', skills: ['Carpentry', 'Wood Work'], experience: 3, rating: 3.9, location: 'Vasundhara', availability: true, jobsDone: 25 },
  { id: 'w4', name: 'Dinesh Yadav', phone: '9988776655', skills: ['AC Repair', 'Electrician'], experience: 6, rating: 4.5, location: 'Raj Nagar', availability: false, jobsDone: 53 },
  { id: 'w5', name: 'Ramesh Bhai', phone: '9776655443', skills: ['Painting', 'Tiling', 'Masonry'], experience: 10, rating: 4.9, location: 'Noida Sector 18', availability: true, jobsDone: 120 },
];

export default function ApplicantsPage() {
  const { jobs, applications, hireWorker } = useApp();
  const [selectedJobId, setSelectedJobId] = useState(jobs[0]?.id || null);
  const [hiredMap, setHiredMap] = useState({});
  const [toast, setToast] = useState('');
  const [sortBy, setSortBy] = useState('match');

  const selectedJob = jobs.find(j => j.id === selectedJobId);

  // Merge real applicants (from context) + mock for demo
  const realApplicants = applications
    .filter(a => a.jobId === selectedJobId)
    .map(a => a.workerData);

  const allApplicants = [...new Map([...MOCK_APPLICANTS, ...realApplicants].map(w => [w.id || w.name, w])).values()];

  const scored = allApplicants.map(w => ({
    ...w,
    matchScore: selectedJob ? calculateMatchScore({ job: selectedJob, worker: w }) : 0,
  })).sort((a, b) => {
    if (sortBy === 'match') return b.matchScore - a.matchScore;
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'experience') return b.experience - a.experience;
    return 0;
  });

  function handleHire(worker) {
    setHiredMap(prev => ({ ...prev, [worker.id || worker.name]: true }));
    const app = applications.find(a => a.jobId === selectedJobId && a.workerData?.name === worker.name);
    if (app) hireWorker(selectedJobId, app.id);
    setToast(`✅ ${worker.name} has been hired!`);
    setTimeout(() => setToast(''), 3000);
  }

  return (
    <div className="page-wrapper" style={{ paddingBottom: 40 }}>
      <div className="container" style={{ paddingTop: 24 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26, marginBottom: 4 }}>👥 Applicants</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 20 }}>Review and hire the best workers using AI match scores</p>

        {toast && <div className="alert alert-success">{toast}</div>}

        {/* Job selector */}
        <div className="form-group">
          <label className="form-label">Select Job</label>
          <select className="form-select" value={selectedJobId || ''} onChange={e => setSelectedJobId(Number(e.target.value))}>
            {jobs.map(j => (
              <option key={j.id} value={j.id}>{j.title} – {j.location}</option>
            ))}
          </select>
        </div>

        {/* Selected job summary */}
        {selectedJob && (
          <div style={{ background: '#fff0e8', border: '1px solid var(--primary)', borderRadius: 12, padding: '14px 16px', marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, fontSize: 14 }}>
              <strong>{selectedJob.title}</strong>
              <span>👥 {scored.length} applicant(s)</span>
              <span>💰 ₹{selectedJob.pay}/{selectedJob.payType}</span>
              <span>📍 {selectedJob.location}</span>
            </div>
          </div>
        )}

        {/* AI match explanation */}
        <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 10, padding: '10px 14px', marginBottom: 16, fontSize: 13 }}>
          🤖 <strong>AI Match Score</strong> ranks workers by: Skills (35%) + Experience (25%) + Rating (20%) + Distance (10%) + Availability (10%)
        </div>

        {/* Sort controls */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 20, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600 }}>Sort:</span>
          {[['match', '🤖 Best Match'], ['rating', '⭐ Rating'], ['experience', '🛠 Experience']].map(([v, l]) => (
            <button key={v} onClick={() => setSortBy(v)}
              className={`btn btn-sm ${sortBy === v ? 'btn-primary' : 'btn-outline'}`}
              style={{ fontSize: 12 }}
            >{l}</button>
          ))}
        </div>

        {/* Applicant list */}
        {scored.length === 0 ? (
          <div className="empty-state">
            <div className="emoji">👤</div>
            <h3>No Applicants Yet</h3>
            <p>Workers will apply to your job soon</p>
          </div>
        ) : (
          scored.map(worker => (
            <ProfileCard
              key={worker.id || worker.name}
              worker={worker}
              matchScore={worker.matchScore}
              showHire={true}
              hired={!!hiredMap[worker.id || worker.name]}
              onHire={handleHire}
            />
          ))
        )}
      </div>
    </div>
  );
}
