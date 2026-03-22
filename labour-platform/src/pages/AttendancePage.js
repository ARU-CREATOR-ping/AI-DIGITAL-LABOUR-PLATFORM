import React, { useState, useRef } from 'react';
import { uploadAttendancePhoto } from '../services/api';
import VoiceAssistant from '../components/VoiceAssistant';
import NavigatorHelper from '../components/NavigatorHelper';

export default function AttendancePage() {
  const [records, setRecords] = useState([]);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [note, setNote] = useState('');
  const [toast, setToast] = useState('');
  const fileRef = useRef();

  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const todayKey = new Date().toISOString().split('T')[0];
  const alreadyMarked = records.some(r => r.date === todayKey);

  function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
  }

  async function handleUpload() {
    if (!preview) return;
    setUploading(true);
    try {
      const file = fileRef.current.files[0];
      const res = await uploadAttendancePhoto(file);
      const record = {
        id: Date.now(),
        date: todayKey,
        time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        photoUrl: res.url,
        note,
        status: 'present',
      };
      setRecords(prev => [record, ...prev]);
      setPreview(null);
      setNote('');
      fileRef.current.value = '';
      setToast('✅ Attendance marked successfully!');
      setTimeout(() => setToast(''), 3000);
    } catch { setToast('❌ Upload failed. Try again.'); }
    finally { setUploading(false); }
  }

  return (
    <div className="page-wrapper" style={{ paddingBottom: 80 }}>
      <div className="container" style={{ paddingTop: 24, maxWidth: 600 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26, marginBottom: 4 }}>📸 Attendance</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 20 }}>{today}</p>

        {toast && <div className={`alert ${toast.startsWith('✅') ? 'alert-success' : 'alert-error'}`}>{toast}</div>}

        {/* Mark today */}
        <div className="card" style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: 18, marginBottom: 16 }}>📷 Mark Today's Attendance</h3>

          {alreadyMarked ? (
            <div className="alert alert-success">
              ✅ You have already marked attendance for today!
            </div>
          ) : (
            <>
              {/* Photo upload area */}
              <NavigatorHelper tip="Take a selfie or upload a photo from your current work location as proof of attendance" step={1}>
                <div
                  onClick={() => fileRef.current.click()}
                  style={{
                    border: '2px dashed var(--border)',
                    borderRadius: 12,
                    padding: preview ? 0 : '40px 20px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    background: '#fdf6ee',
                    marginBottom: 14,
                    overflow: 'hidden',
                    transition: 'border-color 0.2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
                >
                  {preview ? (
                    <img src={preview} alt="Preview" style={{ width: '100%', maxHeight: 240, objectFit: 'cover', borderRadius: 12 }} />
                  ) : (
                    <>
                      <div style={{ fontSize: 48, marginBottom: 8 }}>📷</div>
                      <p style={{ fontWeight: 600, color: 'var(--primary)', marginBottom: 4 }}>Tap to Upload Photo</p>
                      <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Take selfie or choose from gallery</p>
                    </>
                  )}
                </div>
              </NavigatorHelper>

              <input ref={fileRef} type="file" accept="image/*" capture="environment" style={{ display: 'none' }} onChange={handleFile} />

              <div className="form-group">
                <label className="form-label">Note (optional)</label>
                <NavigatorHelper tip="Add any note about today's work, e.g. 'Completed painting of bedroom'" step={2} position="bottom">
                  <input className="form-input" placeholder="e.g. Completed painting of bedroom" value={note} onChange={e => setNote(e.target.value)} />
                </NavigatorHelper>
              </div>

              {preview && (
                <div style={{ display: 'flex', gap: 10 }}>
                  <button className="btn btn-outline" onClick={() => { setPreview(null); fileRef.current.value = ''; }}>
                    ✕ Clear
                  </button>
                  <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleUpload} disabled={uploading}>
                    {uploading ? '⏳ Uploading...' : '✅ Submit Attendance'}
                  </button>
                </div>
              )}

              {!preview && (
                <button className="btn btn-outline btn-full" onClick={() => fileRef.current.click()}>
                  📷 Choose Photo
                </button>
              )}
            </>
          )}
        </div>

        {/* Attendance history */}
        <div>
          <h3 style={{ fontSize: 18, marginBottom: 14 }}>📅 Attendance History</h3>
          {records.length === 0 ? (
            <div className="empty-state" style={{ padding: '30px 20px' }}>
              <div className="emoji">📭</div>
              <p>No attendance records yet</p>
            </div>
          ) : (
            records.map(r => (
              <div key={r.id} className="card fade-in" style={{ marginBottom: 12, padding: 16 }}>
                <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                  {r.photoUrl && (
                    <img src={r.photoUrl} alt="attendance" style={{ width: 56, height: 56, borderRadius: 10, objectFit: 'cover', flexShrink: 0 }} />
                  )}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 700, fontSize: 15 }}>{r.date}</span>
                      <span className="badge badge-green">✅ Present</span>
                    </div>
                    <div style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 4 }}>🕐 {r.time}</div>
                    {r.note && <div style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 2 }}>📝 {r.note}</div>}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Work completion button */}
        {records.length > 0 && (
          <div className="card" style={{ marginTop: 20, background: 'linear-gradient(135deg, #dcfce7, #bbf7d0)', border: '1px solid #86efac' }}>
            <h3 style={{ fontSize: 16, color: '#15803d', marginBottom: 8 }}>🎉 Ready to Submit Work?</h3>
            <p style={{ fontSize: 13, color: '#166534', marginBottom: 14 }}>You have {records.length} day(s) of attendance. Submit completion to receive payment.</p>
            <button className="btn btn-success btn-full">📤 Submit Work Completion</button>
          </div>
        )}
      </div>
      <VoiceAssistant />
    </div>
  );
}
