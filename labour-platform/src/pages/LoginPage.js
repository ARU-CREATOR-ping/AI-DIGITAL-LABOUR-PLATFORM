import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { sendOTP, verifyOTP } from '../services/api';
import NavigatorHelper from '../components/NavigatorHelper';

export default function LoginPage() {
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState('phone'); // phone | otp
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(0);
  const { setUser, setRole } = useApp();
  const navigate = useNavigate();
  const otpRefs = [useRef(), useRef(), useRef(), useRef()];

  useEffect(() => {
    const preRole = searchParams.get('role');
    if (preRole) setRole(preRole);
  }, []);

  useEffect(() => {
    if (timer > 0) {
      const t = setTimeout(() => setTimer(t => t - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [timer]);

  async function handleSendOTP(e) {
    e.preventDefault();
    if (phone.length !== 10) { setError('Enter valid 10-digit mobile number'); return; }
    setLoading(true); setError('');
    try {
      await sendOTP(phone);
      setStep('otp');
      setTimer(30);
      setTimeout(() => otpRefs[0].current?.focus(), 100);
    } catch { setError('Failed to send OTP. Try again.'); }
    finally { setLoading(false); }
  }

  async function handleVerifyOTP(e) {
    e.preventDefault();
    const otpStr = otp.join('');
    if (otpStr.length !== 4) { setError('Enter complete 4-digit OTP'); return; }
    setLoading(true); setError('');
    try {
      const res = await verifyOTP(phone, otpStr);
      setUser({ id: res.userId, phone, token: res.token, name: 'User' });
      navigate('/role-select');
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  }

  function handleOtpChange(val, i) {
    if (!/^\d?$/.test(val)) return;
    const newOtp = [...otp];
    newOtp[i] = val;
    setOtp(newOtp);
    if (val && i < 3) otpRefs[i + 1].current?.focus();
  }

  function handleOtpKeyDown(e, i) {
    if (e.key === 'Backspace' && !otp[i] && i > 0) otpRefs[i - 1].current?.focus();
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg, var(--bg) 0%, #fff8ef 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div className="card fade-in" style={{ width: '100%', maxWidth: 400 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: 48 }}>⚒️</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: 'var(--primary)' }}></h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Digital Labour Platform</p>
        </div>

        {step === 'phone' ? (
          <form onSubmit={handleSendOTP}>
            <h2 style={{ fontSize: 20, marginBottom: 4 }}>Enter Your Mobile Number</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 20 }}>We'll send an OTP to verify your number</p>

            {error && <div className="alert alert-error">{error}</div>}

            <div className="form-group">
              <label className="form-label">📱 Mobile Number</label>
              <NavigatorHelper tip="Enter your 10-digit mobile number without +91. E.g. 9876543210" step={1}>
                <div style={{ display: 'flex', gap: 8 }}>
                  <div style={{ background: '#f3f4f6', border: '2px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '13px 12px', fontWeight: 600, fontSize: 15, color: 'var(--text-muted)', flexShrink: 0 }}>
                    🇮🇳 +91
                  </div>
                  <input
                    className="form-input"
                    type="tel"
                    placeholder="9876543210"
                    value={phone}
                    onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    maxLength={10}
                    required
                    autoFocus
                  />
                </div>
              </NavigatorHelper>
            </div>

            <button className="btn btn-primary btn-full btn-lg" type="submit" disabled={loading || phone.length !== 10}>
              {loading ? '⏳ Sending OTP...' : 'Send OTP →'}
            </button>

            <div style={{ textAlign: 'center', marginTop: 16, fontSize: 13, color: 'var(--text-muted)' }}>
              Demo OTP: <strong>1234</strong>
            </div>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP}>
            <h2 style={{ fontSize: 20, marginBottom: 4 }}>Verify OTP</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 4 }}>
              OTP sent to +91 {phone}
            </p>
            <button type="button" onClick={() => setStep('phone')} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: 13, fontWeight: 600, marginBottom: 20 }}>
              ✏️ Change number
            </button>

            {error && <div className="alert alert-error">{error}</div>}

            <div className="form-group">
              <label className="form-label">Enter 4-digit OTP</label>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={otpRefs[i]}
                    className="otp-input"
                    type="tel"
                    maxLength={1}
                    value={digit}
                    onChange={e => handleOtpChange(e.target.value, i)}
                    onKeyDown={e => handleOtpKeyDown(e, i)}
                  />
                ))}
              </div>
            </div>

            <button className="btn btn-primary btn-full btn-lg" type="submit" disabled={loading}>
              {loading ? '⏳ Verifying...' : 'Verify & Login ✓'}
            </button>

            <div style={{ textAlign: 'center', marginTop: 14 }}>
              {timer > 0
                ? <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>Resend OTP in {timer}s</span>
                : <button type="button" onClick={handleSendOTP} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontWeight: 600, fontSize: 13 }}>
                    Resend OTP
                  </button>
              }
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
