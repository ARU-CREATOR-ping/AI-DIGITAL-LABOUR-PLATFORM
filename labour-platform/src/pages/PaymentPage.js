import React, { useState } from 'react';
import { processPayment } from '../services/api';
import NavigatorHelper from '../components/NavigatorHelper';
import VoiceAssistant from '../components/VoiceAssistant';

const MOCK_WORKERS = [
  { id: 'w1', name: 'Raju Mistri', job: 'House Painting', days: 3, rate: 800 },
  { id: 'w2', name: 'Suresh Kumar', job: 'Plumbing Repair', days: 1, rate: 600 },
];

export default function PaymentPage() {
  const [selectedWorker, setSelectedWorker] = useState(MOCK_WORKERS[0]);
  const [method, setMethod] = useState('upi');
  const [upiId, setUpiId] = useState('');
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState('');

  const total = selectedWorker.days * selectedWorker.rate;
  const platformFee = Math.round(total * 0.02);
  const grandTotal = total + platformFee;

  async function handlePay() {
    if (method === 'upi' && !upiId.includes('@')) {
      setError('Enter a valid UPI ID (e.g. name@upi)');
      return;
    }
    setError('');
    setProcessing(true);
    try {
      const res = await processPayment({ workerId: selectedWorker.id, amount: grandTotal, method, upiId });
      setSuccess(res);
    } catch { setError('Payment failed. Try again.'); }
    finally { setProcessing(false); }
  }

  if (success) {
    return (
      <div className="page-wrapper">
        <div className="container" style={{ paddingTop: 60, maxWidth: 480, textAlign: 'center' }}>
          <div style={{ fontSize: 80, marginBottom: 12 }}>✅</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: 'var(--success)', marginBottom: 8 }}>Payment Successful!</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: 6 }}>₹{grandTotal} paid to <strong>{selectedWorker.name}</strong></p>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 24 }}>Transaction ID: <code>{success.transactionId}</code></p>
          <div style={{ background: '#dcfce7', borderRadius: 12, padding: '16px 20px', marginBottom: 24, fontSize: 14, color: '#166534', textAlign: 'left' }}>
            <div>👷 Worker: {selectedWorker.name}</div>
            <div>💼 Job: {selectedWorker.job}</div>
            <div>📅 Days: {selectedWorker.days}</div>
            <div>💰 Amount: ₹{total}</div>
            <div>🏦 Platform Fee: ₹{platformFee}</div>
            <div style={{ fontWeight: 700, marginTop: 6 }}>Total Paid: ₹{grandTotal}</div>
          </div>
          <button className="btn btn-primary btn-lg btn-full" onClick={() => setSuccess(null)}>
            Make Another Payment
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper" style={{ paddingBottom: 80 }}>
      <div className="container" style={{ paddingTop: 24, maxWidth: 560 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26, marginBottom: 4 }}>💳 Payment</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 24 }}>Pay workers safely and instantly</p>

        {error && <div className="alert alert-error">{error}</div>}

        {/* Worker select */}
        <div className="card" style={{ marginBottom: 16 }}>
          <h3 style={{ fontSize: 16, marginBottom: 14 }}>👷 Select Worker</h3>
          {MOCK_WORKERS.map(w => (
            <div
              key={w.id}
              onClick={() => setSelectedWorker(w)}
              style={{
                border: selectedWorker.id === w.id ? '2px solid var(--primary)' : '2px solid var(--border)',
                borderRadius: 10,
                padding: '12px 14px',
                marginBottom: 10,
                cursor: 'pointer',
                background: selectedWorker.id === w.id ? '#fff0e8' : '#fff',
                transition: 'all 0.15s',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 700 }}>{w.name}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>💼 {w.job} · {w.days} day(s) · ₹{w.rate}/day</div>
                </div>
                <div style={{ fontWeight: 800, color: 'var(--primary)', fontSize: 16 }}>₹{w.days * w.rate}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Payment method */}
        <div className="card" style={{ marginBottom: 16 }}>
          <h3 style={{ fontSize: 16, marginBottom: 14 }}>💳 Payment Method</h3>
          <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
            {[
              ['upi', '📱 UPI'],
              ['cash', '💵 Cash'],
              ['bank', '🏦 Bank Transfer'],
            ].map(([v, l]) => (
              <button key={v} type="button"
                onClick={() => setMethod(v)}
                style={{
                  flex: 1, padding: '14px 10px', borderRadius: 10,
                  border: method === v ? '2px solid var(--primary)' : '2px solid var(--border)',
                  background: method === v ? '#fff0e8' : '#fff',
                  cursor: 'pointer', fontWeight: 700, fontSize: 14,
                  transition: 'all 0.15s',
                }}
              >{l}</button>
            ))}
          </div>

          {method === 'upi' && (
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">UPI ID</label>
              <NavigatorHelper tip="Enter your worker's UPI ID, e.g. rajumistri@ybl or 9876543210@paytm" step={1} position="bottom">
                <input
                  className="form-input"
                  placeholder="e.g. worker@ybl or 9876543210@paytm"
                  value={upiId}
                  onChange={e => setUpiId(e.target.value)}
                />
              </NavigatorHelper>
            </div>
          )}

          {method === 'cash' && (
            <div className="alert alert-info">
              💵 Cash payment will be recorded in the system. Please pay the worker in person and confirm.
            </div>
          )}

          {method === 'bank' && (
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Account Number</label>
              <input className="form-input" placeholder="Enter bank account number" />
            </div>
          )}
        </div>

        {/* Bill summary */}
        <div className="card" style={{ marginBottom: 20, background: 'linear-gradient(135deg, #fff0e8, #fff8f2)' }}>
          <h3 style={{ fontSize: 16, marginBottom: 14 }}>🧾 Bill Summary</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Work ({selectedWorker.days} day × ₹{selectedWorker.rate})</span>
              <strong>₹{total}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
              <span>Platform Fee (2%)</span>
              <span>₹{platformFee}</span>
            </div>
            <hr className="divider" style={{ margin: '6px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 18, fontWeight: 800, color: 'var(--primary)' }}>
              <span>Total</span>
              <span>₹{grandTotal}</span>
            </div>
          </div>
        </div>

        <button
          className="btn btn-primary btn-lg btn-full"
          onClick={handlePay}
          disabled={processing}
        >
          {processing
            ? '⏳ Processing...'
            : method === 'upi'
            ? `📱 Pay ₹${grandTotal} via UPI`
            : method === 'cash'
            ? `💵 Confirm Cash Payment ₹${grandTotal}`
            : `🏦 Transfer ₹${grandTotal}`
          }
        </button>

        <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-muted)', marginTop: 12 }}>
          🔒 Secure payment. Your data is safe.
        </p>
      </div>
      <VoiceAssistant />
    </div>
  );
}
