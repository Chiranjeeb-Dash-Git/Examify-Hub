import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { QuizProvider } from './context/QuizContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { BackgroundParticles } from './components/BackgroundParticles';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { StudentDashboard } from './pages/StudentDashboard';
import { ExploreQuizzesPage } from './pages/ExploreQuizzesPage';
import { QuizDetailPage } from './pages/QuizDetailPage';
import { ActiveQuizPage } from './pages/ActiveQuizPage';
import { ResultPage } from './pages/ResultPage';
import { AttemptHistoryPage } from './pages/AttemptHistoryPage';
import { LeaderboardPage } from './pages/LeaderboardPage';

// Admin Pages
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { AdminQuizzesPage } from './pages/admin/AdminQuizzesPage';
import { AdminQuestionsPage } from './pages/admin/AdminQuestionsPage';
import { AdminCategoriesPage } from './pages/admin/AdminCategoriesPage';
import { AdminAttemptsPage } from './pages/admin/AdminAttemptsPage';

// Protected Route Wrapper
const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user, loading, isAdmin } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (requireAdmin && !isAdmin) return <Navigate to="/dashboard" replace />;
  return children;
};

export function App() {
  return (
    <AuthProvider>
      <QuizProvider>
        <Router>
          <div className="min-h-screen text-white flex flex-col relative" style={{background:'var(--bg)'}}>
            <div className="bg-mesh" />
            <div className="grain" />
            <BackgroundParticles />
            <Navbar />
            <div className="flex-grow">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/quizzes" element={<ExploreQuizzesPage />} />
                <Route path="/quizzes/:id" element={<QuizDetailPage />} />
                <Route path="/leaderboard" element={<LeaderboardPage />} />

                {/* Student Protected Routes */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <StudentDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/quiz/:id/attempt"
                  element={
                    <ProtectedRoute>
                      <ActiveQuizPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/quiz/result/:id"
                  element={
                    <ProtectedRoute>
                      <ResultPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/history"
                  element={
                    <ProtectedRoute>
                      <AttemptHistoryPage />
                    </ProtectedRoute>
                  }
                />

                {/* Admin Protected Routes */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute requireAdmin={true}>
                      <AdminDashboardPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/leaderboard"
                  element={
                    <ProtectedRoute requireAdmin={true}>
                      <LeaderboardPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/users"
                  element={
                    <ProtectedRoute requireAdmin={true}>
                      <AdminUsersPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/quizzes"
                  element={
                    <ProtectedRoute requireAdmin={true}>
                      <AdminQuizzesPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/quizzes/new"
                  element={
                    <ProtectedRoute requireAdmin={true}>
                      <AdminQuizzesPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/quizzes/:quizId/questions"
                  element={
                    <ProtectedRoute requireAdmin={true}>
                      <AdminQuestionsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/categories"
                  element={
                    <ProtectedRoute requireAdmin={true}>
                      <AdminCategoriesPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/attempts"
                  element={
                    <ProtectedRoute requireAdmin={true}>
                      <AdminAttemptsPage />
                    </ProtectedRoute>
                  }
                />

                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
            <Footer />
          </div>
        </Router>
      </QuizProvider>
    </AuthProvider>
  );
}

export default App;
