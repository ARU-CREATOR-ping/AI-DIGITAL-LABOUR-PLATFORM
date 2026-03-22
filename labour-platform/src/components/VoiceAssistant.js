import React, { useState, useRef, useEffect } from 'react';

const RESPONSES = {
  'find job': 'I will help you find jobs! Go to the Find Jobs page to see available work near you.',
  'apply': 'To apply for a job, tap the "Apply Now" button on any job card. Your profile will be sent to the client.',
  'payment': 'You can receive payment by Cash or UPI. Go to the Payment page after job completion.',
  'attendance': 'Mark attendance by uploading a photo on the Attendance page every day you work.',
  'profile': 'Your profile shows your skills, experience, and rating. Clients use it to decide hiring.',
  'rating': 'Your rating is based on client reviews. Higher rating means more job opportunities!',
  'match': 'Your Match Score shows how well you fit a job. Score above 75% means great match!',
  'help': 'I can help you with: finding jobs, applying, attendance, payment, ratings, and profile.',
  'hello': 'Hello! I am  Assistant. How can I help you today?',
  'hi': 'Hi there! Say "find job", "payment", or "help" to get started.',
  'status': 'Check your application status on the My Applications page.',
  'default': 'I am not sure about that. Try saying: "find job", "payment", "attendance", or "help".',
};

function getResponse(input) {
  const text = input.toLowerCase();
  for (const [key, val] of Object.entries(RESPONSES)) {
    if (text.includes(key)) return val;
  }
  return RESPONSES.default;
}

export default function VoiceAssistant() {
  const [open, setOpen] = useState(false);
  const [listening, setListening] = useState(false);
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Hello! I am your AI Assistant 🤖 Tap the mic to speak, or type below.' }
  ]);
  const [input, setInput] = useState('');
  const [supported, setSupported] = useState(true);
  const recognitionRef = useRef(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      setSupported(false);
    }
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  function speak(text) {
    if ('speechSynthesis' in window) {
      const utt = new SpeechSynthesisUtterance(text);
      utt.lang = 'en-IN';
      utt.rate = 0.9;
      window.speechSynthesis.speak(utt);
    }
  }

  function addMessage(from, text) {
    setMessages(prev => [...prev, { from, text }]);
  }

  function handleUserInput(text) {
    if (!text.trim()) return;
    addMessage('user', text);
    setTimeout(() => {
      const reply = getResponse(text);
      addMessage('bot', reply);
      speak(reply);
    }, 400);
    setInput('');
  }

  function startListening() {
    if (!supported) return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      handleUserInput(transcript);
    };
    recognition.onerror = () => setListening(false);

    recognitionRef.current = recognition;
    recognition.start();
  }

  function stopListening() {
    recognitionRef.current?.stop();
    setListening(false);
  }

  return (
    <>
      {/* FAB button */}
      <button
        className={`voice-fab ${listening ? 'listening' : ''}`}
        onClick={() => setOpen(o => !o)}
        title="AI Voice Assistant"
      >
        {open ? '✕' : '🎤'}
      </button>

      {/* Chat panel */}
      {open && (
        <div style={{
          position: 'fixed', bottom: 100, right: 28,
          width: 320, maxHeight: 480,
          background: '#fff', borderRadius: 20,
          boxShadow: '0 12px 48px rgba(0,0,0,0.18)',
          display: 'flex', flexDirection: 'column',
          zIndex: 998, overflow: 'hidden',
          border: '1px solid var(--border)',
          animation: 'fadeIn 0.3s ease',
        }}>
          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg, var(--primary), var(--accent))',
            padding: '14px 18px',
            color: '#fff',
          }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16 }}>
              🤖 AI Assistant
            </div>
            <div style={{ fontSize: 12, opacity: 0.85 }}>
              {listening ? '🔴 Listening...' : 'Ask me anything'}
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {messages.map((m, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: m.from === 'user' ? 'flex-end' : 'flex-start' }}>
                <div className={`chat-bubble ${m.from}`}>{m.text}</div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Quick suggestions */}
          <div style={{ padding: '8px 12px', display: 'flex', gap: 6, flexWrap: 'wrap', borderTop: '1px solid var(--border)', background: '#fdf6ee' }}>
            {['Find Job', 'Payment', 'Help', 'Rating'].map(q => (
              <button key={q}
                onClick={() => handleUserInput(q)}
                style={{
                  padding: '4px 10px', borderRadius: 99, fontSize: 12, border: '1px solid var(--border)',
                  background: '#fff', cursor: 'pointer', fontWeight: 600, color: 'var(--text-muted)',
                }}
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input row */}
          <div style={{ padding: 12, borderTop: '1px solid var(--border)', display: 'flex', gap: 8 }}>
            <input
              className="form-input"
              style={{ flex: 1, padding: '10px 12px', fontSize: 14 }}
              placeholder="Type your question..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleUserInput(input)}
            />
            <button
              onClick={listening ? stopListening : startListening}
              style={{
                width: 40, height: 40, borderRadius: '50%', border: 'none',
                background: listening ? 'var(--danger)' : 'var(--primary)',
                color: '#fff', cursor: 'pointer', fontSize: 18, flexShrink: 0,
              }}
              title={supported ? (listening ? 'Stop' : 'Speak') : 'Speech not supported in this browser'}
            >
              {listening ? '⏹' : '🎤'}
            </button>
          </div>
          {!supported && (
            <div style={{ padding: '4px 12px 10px', fontSize: 11, color: 'var(--text-muted)', textAlign: 'center' }}>
              Voice input not supported. Use text input.
            </div>
          )}
        </div>
      )}
    </>
  );
}
