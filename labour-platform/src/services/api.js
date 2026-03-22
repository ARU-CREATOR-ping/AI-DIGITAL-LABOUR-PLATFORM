// services/api.js  – Mock API layer (simulates backend calls)

const delay = (ms = 600) => new Promise(res => setTimeout(res, ms));

// Simulate OTP send
export async function sendOTP(phone) {
  await delay(800);
  console.log(`OTP sent to ${phone}: 1234`);
  return { success: true, message: 'OTP sent successfully' };
}

// Simulate OTP verify
export async function verifyOTP(phone, otp) {
  await delay(700);
  if (otp === '1234') {
    return { success: true, token: 'mock-jwt-token-abc123', userId: `user_${phone}` };
  }
  throw new Error('Invalid OTP. Use 1234 for demo.');
}

// Simulate get jobs
export async function fetchJobs(filters = {}) {
  await delay(500);
  return { success: true };
}

// Simulate apply to job
export async function submitApplication(jobId, workerId) {
  await delay(600);
  return { success: true, applicationId: Date.now() };
}

// Simulate upload attendance photo
export async function uploadAttendancePhoto(file) {
  await delay(1000);
  return { success: true, url: URL.createObjectURL(file), timestamp: new Date().toISOString() };
}

// Simulate payment processing
export async function processPayment(payload) {
  await delay(900);
  return { success: true, transactionId: `TXN${Date.now()}`, message: 'Payment successful' };
}

// Simulate submit review
export async function submitReviewAPI(review) {
  await delay(500);
  return { success: true };
}

// AI Match Score calculation
export function calculateMatchScore({ job, worker }) {
  const skillOverlap = job.skills.filter(s =>
    worker.skills.some(ws => ws.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(ws.toLowerCase()))
  ).length;

  const skillMatch = Math.min(skillOverlap / Math.max(job.skills.length, 1), 1);
  const experience = Math.min(worker.experience / 10, 1);          // normalize to 10 yrs max
  const rating = worker.rating / 5;                                 // normalize to 5
  const distance = Math.max(0, 1 - job.distance / 20);             // closer = better, max 20km
  const availability = worker.availability ? 1 : 0;

  const score =
    0.35 * skillMatch +
    0.25 * experience +
    0.20 * rating +
    0.10 * distance +
    0.10 * availability;

  return Math.round(score * 100);
}

// Score colour helper
export function scoreColor(score) {
  if (score >= 75) return '#16a34a';
  if (score >= 50) return '#d97706';
  return '#dc2626';
}

export default {
  sendOTP, verifyOTP, fetchJobs, submitApplication,
  uploadAttendancePhoto, processPayment, submitReviewAPI,
  calculateMatchScore, scoreColor,
};
