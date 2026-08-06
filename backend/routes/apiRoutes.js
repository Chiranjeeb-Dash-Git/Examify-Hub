const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const categoryController = require('../controllers/categoryController');
const quizController = require('../controllers/quizController');
const questionController = require('../controllers/questionController');
const attemptController = require('../controllers/attemptController');
const adminController = require('../controllers/adminController');

const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');

// Auth Routes
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.get('/auth/me', verifyToken, authController.me);

// Category Routes
router.get('/categories', categoryController.getCategories);
router.post('/categories', verifyAdmin, categoryController.createCategory);
router.put('/categories/:id', verifyAdmin, categoryController.updateCategory);
router.delete('/categories/:id', verifyAdmin, categoryController.deleteCategory);

// Quiz Routes
router.get('/quizzes', quizController.getQuizzes);
router.get('/quizzes/:id', quizController.getQuizById);
router.post('/quizzes', verifyAdmin, quizController.createQuiz);
router.put('/quizzes/:id', verifyAdmin, quizController.updateQuiz);
router.delete('/quizzes/:id', verifyAdmin, quizController.deleteQuiz);

// Question Routes
router.get('/quizzes/:quizId/questions', questionController.getQuestionsForQuiz);
router.post('/questions', verifyAdmin, questionController.saveQuestion);
router.delete('/questions/:id', verifyAdmin, questionController.deleteQuestion);

// Attempt Routes
router.post('/attempts/submit', attemptController.submitAttempt);
router.get('/attempts/:id', attemptController.getAttemptById);
router.get('/attempts/user/:userId', attemptController.getUserAttempts);

// Admin & Telemetry Routes
router.get('/admin/analytics', verifyAdmin, adminController.getAdminAnalytics);
router.get('/admin/users', verifyAdmin, adminController.getUsers);
router.patch('/admin/users/:userId/status', verifyAdmin, adminController.toggleUserStatus);
router.delete('/admin/users/:userId', verifyAdmin, adminController.deleteUser);

// Gemini AI Routes (Admin Question Generation & Candidate Evaluation)
router.post('/admin/ai/generate-questions', verifyAdmin, adminController.generateAiQuestions);
router.post('/ai/explain-answer', adminController.explainAnswerAi);

// Leaderboard Route
router.get('/leaderboard', adminController.getLeaderboard);

module.exports = router;
