const db = require('../config/db');
const geminiService = require('../services/geminiService');

exports.getAdminAnalytics = async (req, res) => {
  try {
    const totalStudents = await db.asyncGet(`SELECT COUNT(id)::int as count FROM users WHERE role = 'STUDENT'`);
    const totalQuizzes = await db.asyncGet(`SELECT COUNT(id)::int as count FROM quizzes`);
    const publishedQuizzes = await db.asyncGet(`SELECT COUNT(id)::int as count FROM quizzes WHERE status = 'Published'`);
    const draftQuizzes = await db.asyncGet(`SELECT COUNT(id)::int as count FROM quizzes WHERE status = 'Draft'`);
    const totalQuestions = await db.asyncGet(`SELECT COUNT(id)::int as count FROM questions`);
    const totalAttempts = await db.asyncGet(`SELECT COUNT(id)::int as count FROM attempts`);
    const avgScoreRow = await db.asyncGet(`SELECT ROUND(COALESCE(AVG(percentage), 0))::int as avg FROM attempts`);
    const totalPassed = await db.asyncGet(`SELECT COUNT(id)::int as count FROM attempts WHERE status = 'PASSED'`);
    const totalFailed = await db.asyncGet(`SELECT COUNT(id)::int as count FROM attempts WHERE status = 'FAILED'`);

    res.json({
      totalStudents: totalStudents.count,
      totalQuizzes: totalQuizzes.count,
      publishedQuizzes: publishedQuizzes.count,
      draftQuizzes: draftQuizzes.count,
      totalQuestions: totalQuestions.count,
      totalAttempts: totalAttempts.count,
      avgScore: Math.round(avgScoreRow.avg || 0),
      totalPassed: totalPassed.count,
      totalFailed: totalFailed.count
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching admin analytics', error: err.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await db.asyncAll(`
      SELECT
        u.id,
        u.name,
        u.email,
        u.role,
        u.status,
        u.created_at AS "createdAt",
        u.updated_at AS "updatedAt",
        u.last_login_at AS "lastLoginAt",
        COALESCE(u.login_count, 0)::int AS "loginCount",
        COALESCE((SELECT COUNT(*) FROM attempts WHERE user_id = u.id), 0)::int AS "quizzesAttempted",
        COALESCE((SELECT AVG(percentage) FROM attempts WHERE user_id = u.id), 0)::int AS "averageScore",
        COALESCE((SELECT MAX(percentage) FROM attempts WHERE user_id = u.id), 0)::int AS "highestScore",
        (
          SELECT ua.action
          FROM user_activity ua
          WHERE ua.user_id = u.id
          ORDER BY ua.created_at DESC
          LIMIT 1
        ) AS "lastActivityType",
        (
          SELECT ua.created_at
          FROM user_activity ua
          WHERE ua.user_id = u.id
          ORDER BY ua.created_at DESC
          LIMIT 1
        ) AS "lastActivityAt"
      FROM users u
      ORDER BY u.created_at DESC
    `);
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users', error: err.message });
  }
};

exports.getRecentActivity = async (req, res) => {
  try {
    const activity = await db.asyncAll(`
      SELECT
        ua.id,
        ua.user_id AS "userId",
        u.name AS "userName",
        u.email AS "userEmail",
        u.role AS "userRole",
        ua.action,
        ua.details,
        ua.created_at AS "createdAt"
      FROM user_activity ua
      JOIN users u ON u.id = ua.user_id
      ORDER BY ua.created_at DESC
      LIMIT 30
    `);
    res.json(activity);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching recent activity', error: err.message });
  }
};

exports.toggleUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await db.asyncGet('SELECT status FROM users WHERE id = $1', [userId]);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const newStatus = user.status === 'ACTIVE' ? 'DEACTIVATED' : 'ACTIVE';
    await db.asyncRun('UPDATE users SET status = $1 WHERE id = $2', [newStatus, userId]);

    res.json({ message: `User status updated to ${newStatus}`, status: newStatus });
  } catch (err) {
    res.status(500).json({ message: 'Error updating user status', error: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    await db.asyncRun('DELETE FROM users WHERE id = $1', [userId]);
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting user', error: err.message });
  }
};

exports.getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await db.asyncAll(`
      SELECT u.id, u.name, u.email,
        COUNT(a.id)::int AS "quizzesAttempted",
        COALESCE(AVG(a.percentage), 0)::int AS "averageScore",
        COALESCE(MAX(a.percentage), 0)::int AS "highestScore"
      FROM users u
      LEFT JOIN attempts a ON u.id = a.user_id
      WHERE u.role = 'STUDENT'
      GROUP BY u.id
      ORDER BY "averageScore" DESC, "highestScore" DESC
    `);

    const ranked = leaderboard.map((item, index) => ({
      rank: index + 1,
      ...item,
      averageScore: Math.round(item.averageScore),
      highestScore: Math.round(item.highestScore),
      avatar: `https://images.unsplash.com/photo-${1534528741775 + (index * 100)}?auto=format&fit=crop&w=250&q=80`
    }));

    res.json(ranked);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching leaderboard', error: err.message });
  }
};

/**
 * Gemini AI Question Generator Endpoint (Admin only)
 */
exports.generateAiQuestions = async (req, res) => {
  try {
    const { topic, difficulty, count } = req.body;
    if (!topic) return res.status(400).json({ message: 'Topic is required for Gemini AI question generation.' });

    const questions = await geminiService.generateQuestionsWithAi({
      topic,
      difficulty: difficulty || 'Intermediate',
      count: count || 3
    });

    res.json({ success: true, questions });
  } catch (err) {
    res.status(500).json({ message: 'Gemini AI generation failed', error: err.message });
  }
};

/**
 * Gemini AI Answer Explanation Endpoint (Candidates & Evaluation)
 */
exports.explainAnswerAi = async (req, res) => {
  try {
    const { questionText, selectedOption, correctOption, explanation } = req.body;
    const aiInsight = await geminiService.explainAnswerWithAi({
      questionText,
      selectedOption,
      correctOption,
      explanation
    });
    res.json(aiInsight);
  } catch (err) {
    res.status(500).json({ message: 'AI explanation failed', error: err.message });
  }
};

/**
 * PDF Question Paper Scanner & AI Digitizer Endpoint
 */
exports.parsePdfQuestionPaper = async (req, res) => {
  try {
    const { paperText } = req.body;
    if (!paperText) {
      return res.status(400).json({ message: 'Question paper text is required for digitizing.' });
    }
    const result = await geminiService.parsePdfQuestionPaper(paperText);
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ message: 'PDF parsing failed', error: err.message });
  }
};
