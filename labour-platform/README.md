# ⚒️ AI – Digital Labour Platform

A complete React frontend for a Digital Labour Platform that connects **workers** and **clients** with AI-powered job matching.

---

## 🚀 Quick Setup (5 Minutes)

### Step 1 – Install Node.js
Download from https://nodejs.org (choose LTS version, e.g. 18 or 20)

Verify install:
```bash
node -v    # should print v18.x.x or higher
npm -v     # should print 9.x.x or higher
```

---



### Step 3 – Replace Project Files
Delete the default `src/` folder content and replace with this project's files:

```bash
# From inside your / folder:
rm -rf src public
```

Then copy this project's `src/` and `public/` folders into `k/`.

---

### Step 4 – Install Dependencies
```bash
npm install react-router-dom axios
```

> **Note:** Tailwind CSS is NOT required — this project uses a custom CSS design system in `src/index.css` for maximum compatibility and performance.

---

### Step 5 – Start the App
```bash
npm start
```

The app will open at **http://localhost:3000**

---

## 🗂️ Project Structure

```
src/
├── App.js                    # Root component + React Router setup
├── index.js                  # Entry point
├── index.css                 # Global design system (CSS variables, utilities)
│
├── context/
│   └── AppContext.js         # Global state (user, jobs, applications, reviews)
│
├── services/
│   └── api.js                # Mock API layer + AI Match Score algorithm
│
├── routes/
│   └── ProtectedRoute.js     # Route guard (auth + role check)
│
├── components/
│   ├── Navbar.js             # Top navigation bar (responsive)
│   ├── JobCard.js            # Job listing card with match score ring
│   ├── ProfileCard.js        # Worker profile card with hire button
│   ├── NavigatorHelper.js    # Tooltip helper + StepGuide stepper
│   └── VoiceAssistant.js     # AI voice assistant (Web Speech API)
│
└── pages/
    ├── LandingPage.js         # Hero landing page
    ├── LoginPage.js           # OTP-based authentication
    ├── RoleSelectPage.js      # Worker / Client role selection
    ├── WorkerProfileSetup.js  # 4-step worker profile creation
    ├── WorkerDashboard.js     # Worker home dashboard
    ├── JobListingPage.js      # Job discovery + search + filter
    ├── ApplicationsPage.js    # Worker's applied jobs tracker
    ├── AttendancePage.js      # Photo upload attendance tracking
    ├── ClientDashboard.js     # Client home dashboard
    ├── PostJobPage.js         # 4-step job posting form
    ├── ApplicantsPage.js      # Client applicant review + hire
    ├── PaymentPage.js         # Cash / UPI / Bank payment UI
    ├── ReviewPage.js          # Star ratings & reviews
    └── NotFoundPage.js        # 404 page
```

---

## 🧭 App Flow

```
Landing Page
    ↓
Login (OTP: use 1234 for demo)
    ↓
Role Selection
    ↓
[WORKER]                        [CLIENT]
Profile Setup (4 steps)         Client Dashboard
    ↓                               ↓
Worker Dashboard               Post Job (4 steps)
    ↓                               ↓
Find Jobs (search + filter)    View Applicants (AI ranked)
    ↓                               ↓
Apply to Jobs                  Hire Worker
    ↓                               ↓
Mark Attendance (photo)        Make Payment (Cash/UPI/Bank)
    ↓                               ↓
Rate & Review               Rate & Review
```

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 OTP Auth | Phone + 4-digit OTP (demo OTP: `1234`) |
| 👥 Dual Roles | Separate flows for Workers and Clients |
| 🤖 AI Match Score | Formula: 35% Skills + 25% Experience + 20% Rating + 10% Distance + 10% Availability |
| 📊 Match Score Ring | Color-coded ring: 🟢 75%+ / 🟡 50%+ / 🔴 <50% |
| 📸 Attendance | Camera/file upload with photo preview |
| 💳 Payments | UPI, Cash, Bank Transfer options |
| ⭐ Reviews | 5-star ratings with quick tags |
| 💡 Navigator | Contextual tooltips on all form fields |
| 🎤 Voice Assistant | Web Speech API (mic input + TTS output) |
| 📱 Responsive | Mobile-first design |
| 🛡️ Route Guards | Protected routes by auth + role |

---

## 🤖 AI Match Score Formula

```javascript
MatchScore =
  0.35 × SkillMatch      // skill overlap between worker & job
+ 0.25 × Experience      // normalized 0–10 years
+ 0.20 × Rating          // normalized 0–5 stars
+ 0.10 × Distance        // closer = higher score (max 20km)
+ 0.10 × Availability    // 1 if available, 0 if busy

// Result: 0–100 percentage shown in circular badge
```

See `src/services/api.js` → `calculateMatchScore()` for implementation.

---

## 🎤 Voice Assistant Commands

Say these phrases (or type them):

| Command | Response |
|---|---|
| "find job" | Guides to job discovery page |
| "apply" | Explains application process |
| "payment" | Explains payment options |
| "attendance" | Explains photo upload process |
| "rating" | Explains rating system |
| "match" | Explains AI match score |
| "help" | Lists all commands |
| "hello" / "hi" | Greeting response |

---

## 🎨 Design System

Colors (CSS Variables in `index.css`):
- `--primary`: #e85d04 (orange – energy, work)
- `--secondary`: #1a1a2e (deep navy)
- `--accent`: #f5a623 (amber)
- `--bg`: #fdf6ee (warm cream)

Fonts:
- Display: **Baloo 2** (headings, bold statements)
- Body: **Hind** (readable for low-literacy users)

---

## 📦 Dependencies

```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.20.0",
  "axios": "^1.6.0"
}
```

No Tailwind, no UI library — pure custom CSS for full control and fast loading.

---

## 🧪 Demo Credentials

- Mobile: any 10-digit number (e.g. `9876543210`)
- OTP: **1234** (always)

After login → select Worker or Client role → explore all features!

---

## 🛠️ Extending the App

To connect a real backend:
1. Replace mock functions in `src/services/api.js` with real `axios` calls
2. Store JWT token in `localStorage` via `AppContext`
3. Add `.env` file with `REACT_APP_API_URL=https://your-api.com`

---

