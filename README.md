# Examify-Hub | Aetheris Online Assessment Platform

A web-based online quiz and assessment platform ("Aetheris") featuring student and admin portals, automated scoring, countdown timers, performance telemetry, candidate leaderboards, and administrative management.

![Examify-Hub | Online Assessment Platform](https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80)

---

## 🌟 Key Features

### 🎓 Student / Candidate Portal
- **Dashboard Briefing**: Circular accuracy gauge, quizzes passed counter, weekly activity heatmap chart, and recommended directives.
- **Quiz Discovery**: Search by title/category, filter by difficulty (Beginner, Intermediate, Advanced), category pills, and popularity sorting.
- **Active Assessment Engine**: Distraction-free quiz UI with live countdown timer, question palette navigation sidebar, MCQ option selector, and auto-submission on time expiry.
- **Detailed Result & Answer Review**: Score percentage, Pass/Fail status badge, correct/incorrect/unanswered tally, time taken, and full question explanations.
- **Attempt History Log**: Complete historical record of all previous attempts.
- **Candidate Leaderboard**: Top 3 Podium (Gold, Silver, Bronze badges) and full accuracy rankings.

### 🛡️ Admin Command Center
- **Platform Analytics**: Total student registrations, quiz attempts, avg completion rate, system anomalies, engagement trend charts, and active sessions.
- **Candidate Management**: Search candidates, view profile & attempt history modal, activate/deactivate account toggle, and delete user.
- **Quiz & Question Builder**: Create/edit quizzes, publish/unpublish toggle, MCQ option builder, correct answer selector, marks, and explanation editor.
- **Category Management**: Create, edit, and delete assessment domains.

---

## 🏗️ Architecture & Technology Stack

```
Online Assessment Platform/
├── frontend/                     # React + Vite + Tailwind CSS SPA
│   ├── src/
│   │   ├── components/           # Navbar, Footer, AdminSidebar, QuizCard
│   │   ├── context/              # AuthContext, QuizContext
│   │   ├── pages/                # Landing, Auth, Student Dashboard, Explore Quizzes, Quiz Attempt, Result, Leaderboard
│   │   ├── pages/admin/          # Admin Dashboard, User Management, Quiz Builder, Question Bank, Categories
│   │   └── services/             # API client & mock data persistence
└── backend/                      # Node.js + Express REST API
    ├── config/                   # SQLite database schema
    ├── controllers/              # Auth, Quiz, Question, Attempt, Category, Admin controllers
    ├── middleware/               # JWT verification & Admin authorization
    └── routes/                   # API endpoints (/api/auth, /api/quizzes, /api/attempts, etc.)
```

- **Frontend**: React.js, Vite, Tailwind CSS v4, Lucide React, Recharts, React Router DOM, Canvas Confetti.
- **Backend**: Node.js, Express.js, SQLite3, JSON Web Token (JWT), bcryptjs, CORS.

---

## 🏃 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm

### 1. Clone Repository
```bash
git clone https://github.com/Chiranjeeb-Dash-Git/Examify-Hub.git
cd Examify-Hub
```

### 2. Setup & Run Backend API
```bash
cd backend
npm install
npm start
```
*Backend REST API running at `http://localhost:5000/api`*

### 3. Setup & Run Frontend Web Application
```bash
cd frontend
npm install
npm run dev
```
*Frontend running at `http://localhost:5173/`*

---

## 🔑 Demo Access Credentials

| Role | Email | Password |
| :--- | :--- | :--- |
| **Demo Student** | `student@aetheris.io` | `password123` |
| **Demo Admin** | `admin@aetheris.io` | `adminpassword` |

---

## 📝 License
This project is open source and available under the [MIT License](LICENSE).
