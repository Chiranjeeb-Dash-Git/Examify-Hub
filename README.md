# <p align="center"><img src="https://readme-typing-svg.herokuapp.com?font=Orbitron&weight=900&size=34&duration=3000&pause=1000&color=22D3EE&center=true&vCenter=true&width=800&height=70&lines=EXAMIFY-HUB;AETHERIS+ASSESSMENT+OS;COMMAND+CENTER+V2.6;GEMINI+AI+POWERED" alt="Typing SVG" /></p>

<p align="center">
  <img src="https://img.shields.io/badge/Aesthetics-Liquid%20Obsidian-A855F7?style=for-the-badge&logo=visual-studio-code&logoColor=white" alt="Theme Badge" />
  <img src="https://img.shields.io/badge/AI%20Telemetry-Gemini%20Flash-F97316?style=for-the-badge&logo=google-gemini&logoColor=white" alt="AI Badge" />
  <img src="https://img.shields.io/badge/Vite-v8.2-22D3EE?style=for-the-badge&logo=vite&logoColor=white" alt="Vite Badge" />
  <img src="https://img.shields.io/badge/Backend-Express%20%26%20PostgreSQL-emerald?style=for-the-badge&logo=postgresql&logoColor=white" alt="Backend Badge" />
</p>

---

<p align="center">
  A state-of-the-art, high-performance web-based online quiz and assessment engine featuring a premium 3D Liquid Obsidian HUD UI, AI-powered question generator, live cursor telemetry, interactive typewriter profile, and candidate dashboards.
</p>

<p align="center">
  <img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80" width="100%" alt="Examify-Hub | Online Assessment Platform" />
</p>

---

## 🚀 Key Features

### 🤖 AI Co-Pilot & Telemetry
*   **Cursor-Tracking Robot:** A real-time SVG AI companion whose eyes dynamically track the administrator's mouse cursor across the screen.
*   **Gemini AI Generator:** Instant, automated MCQ creation based on topics and difficulty settings. Generates balanced distractors, correct answers, and rich explanations.
*   **Telemetry Hub:** Real-time logging, attempts, completion scores, and student participation monitoring.

### 🎓 Candidate Command Center
*   **XP Progress Engine:** Gamified student progression bar with auto-leveling directives.
*   **3D Liquid Glass Cards:** High-fidelity interactive panels styling quiz lists, metrics, and details.
*   **Active Assessment Directive:** Embedded timers with visual warning states, distraction-free screen focus, and automated lock-in submission.
*   **Candidate Standings:** Podiums featuring Gold, Silver, and Bronze rankings, paired with detailed review reports.

### 🛡️ Admin OS Panel
*   **typewriter-bio.txt:** Animated typewriter element detailing core profile data dynamically.
*   **Liquid Glass Sidebar Filters:** Instantly search, filter, and modify live questions, categories, and student accounts.
*   **Full CRUD Suite:** Management interface for categories, quizzes, and MCQ option builders.

---

## 🎨 System Demonstration (Interactive)

<details>
<summary><b>👁️ Click to expand System Telemetry details</b></summary>

### Animated Cursor-Tracking SVG Robot
```xml
<!-- Embedded SVG containing eye-tracking logic & neon glows -->
<svg ref={svgRef} viewBox="0 0 120 140" width={200} height={200}>
  <ellipse cx={50 + eyeOffset.x} cy={40 + eyeOffset.y} rx="5" ry={eyeRy} fill="#22d3ee" />
  <ellipse cx={70 + eyeOffset.x} cy={40 + eyeOffset.y} rx="5" ry={eyeRy} fill="#a855f7" />
</svg>
```

### Typewriter Animation Loop
```javascript
useEffect(() => {
  let i = 0;
  const id = setInterval(() => {
    i++;
    setTyped(fullText.slice(0, i));
    if (i >= fullText.length) clearInterval(id);
  }, 35);
  return () => clearInterval(id);
}, []);
```
</details>

---

## 🏗️ Architecture Blueprint

```
Examify-Hub/
├── frontend/                     # React + Vite + Tailwind CSS SPA
│   ├── src/
│   │   ├── components/           # CursorTrackingRobot, AdminSidebar, HudPlayerLayout
│   │   ├── context/              # AuthContext, QuizContext
│   │   ├── pages/                # Landing, Auth, Student Dashboard, ActiveQuiz
│   │   ├── pages/admin/          # AdminDashboardPage, AdminUsers, AdminQuizzes
│   │   └── services/             # LocalStorage Fallbacks & Axios Sync Services
└── backend/                      # Node.js + Express REST API
    ├── config/                   # PostgreSQL database configurations
    ├── controllers/              # Auth, Quiz, Question, Attempt controllers
    └── routes/                   # API end-points (/api/auth, /api/quizzes)
```

---

## 🏃 Launch Directives

### 1. Clone & Initialize
```bash
git clone https://github.com/Chiranjeeb-Dash-Git/Examify-Hub.git
cd Examify-Hub
```

### 1b. Environment Setup
Create a `.env` file at the project root using `.env.example` as a guide:
```bash
DATABASE_URL=postgresql://postgres:YOUR_SUPABASE_PASSWORD@db.qabpliyfxqackyxytznv.supabase.co:5432/postgres
SUPABASE_POOLER_URL=postgresql://postgres.qabpliyfxqackyxytznv:YOUR_SUPABASE_PASSWORD@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres
JWT_SECRET=replace-with-a-long-random-secret
PORT=5000
```

### 2. Ignition Backend
```bash
cd backend
npm install
npm run dev
```
*Backend Server listening at `http://localhost:5000/api`*

### 3. Ignition Frontend
```bash
cd ../frontend
npm install
npm run dev
```
*Frontend Application listening at `http://localhost:5173/`*

---

## Authentication and Admin Access

Candidate registration creates a `STUDENT` account only and opens the student portal. The login screen also includes a separate **Admin Login** button, which selects the fixed administrator email and routes an authenticated administrator directly to the control portal.

Set `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_NAME`, and `JWT_SECRET` as private deployment environment variables. Do not put administrator passwords in frontend variables or documentation.

---

## 📝 License
This project is open-source and released under the [MIT License](LICENSE).
