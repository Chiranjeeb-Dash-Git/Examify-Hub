const db = require('../config/db');

exports.submitAttempt = async (req, res) => {
  try {
    const { attemptId: providedAttemptId, quizId, userId, userAnswers, timeTaken } = req.body;
    if (!quizId || !userId || !userAnswers) {
      return res.status(400).json({ message: 'quizId, userId, and userAnswers are required.' });
    }
    if (req.user.id !== userId) {
      return res.status(403).json({ message: 'You can only submit attempts for your own account.' });
    }

    const quiz = await db.asyncGet('SELECT * FROM quizzes WHERE id = $1', [quizId]);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found.' });

    const questions = await db.asyncAll('SELECT * FROM questions WHERE quiz_id = $1', [quizId]);
    const user = await db.asyncGet('SELECT name FROM users WHERE id = $1', [userId]);

    let correctCount = 0;
    let incorrectCount = 0;
    let unansweredCount = 0;
    let totalMarks = 0;
    let obtainedMarks = 0;

    const attemptId = providedAttemptId || `att-${Date.now()}`;
    const answersToInsert = [];

    for (let q of questions) {
      totalMarks += q.marks || 2;
      const selectedOptId = userAnswers[q.id];

      if (!selectedOptId) {
        unansweredCount++;
        answersToInsert.push({ questionId: q.id, selectedOptId: null, isCorrect: false });
      } else {
        const correctOpt = await db.asyncGet('SELECT id FROM options WHERE question_id = $1 AND is_correct = true', [q.id]);
        const isCorrect = correctOpt && correctOpt.id === selectedOptId;

        if (isCorrect) {
          correctCount++;
          obtainedMarks += q.marks || 2;
          answersToInsert.push({ questionId: q.id, selectedOptId, isCorrect: true });
        } else {
          incorrectCount++;
          answersToInsert.push({ questionId: q.id, selectedOptId, isCorrect: false });
        }
      }
    }

    const percentage = totalMarks > 0 ? Math.round((obtainedMarks / totalMarks) * 100) : 0;
    const isPassed = percentage >= (quiz.passing_score || 60);
    const status = isPassed ? 'PASSED' : 'FAILED';

    await db.asyncRun(`
      INSERT INTO attempts (
        id, quiz_id, user_id, score, percentage, correct_answers, incorrect_answers, unanswered, time_taken, status, completed_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, CURRENT_TIMESTAMP)
    `, [
      attemptId,
      quizId,
      userId,
      obtainedMarks,
      percentage,
      correctCount,
      incorrectCount,
      unansweredCount,
      timeTaken || '00:00',
      status
    ]);

    for (let ans of answersToInsert) {
      const ansId = `ans-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
      await db.asyncRun(`
        INSERT INTO answers (id, attempt_id, question_id, selected_option_id, is_correct)
        VALUES ($1, $2, $3, $4, $5)
      `, [ansId, attemptId, ans.questionId, ans.selectedOptId, ans.isCorrect]);
    }

    res.status(201).json({
      id: attemptId,
      quizId,
      quizTitle: quiz.title,
      userId,
      userName: user ? user.name : 'Student',
      score: obtainedMarks,
      maxScore: totalMarks,
      percentage,
      correctAnswers: correctCount,
      incorrectAnswers: incorrectCount,
      unanswered: unansweredCount,
      timeTaken: timeTaken || '00:00',
      status,
      answers: answersToInsert
    });
  } catch (err) {
    res.status(500).json({ message: 'Error submitting attempt', error: err.message });
  }
};

exports.getAllAttempts = async (req, res) => {
  try {
    const attempts = await db.asyncAll(`
      SELECT
        a.*,
        q.title AS "quizTitle",
        u.name AS "userName",
        u.email AS "userEmail"
      FROM attempts a
      JOIN quizzes q ON a.quiz_id = q.id
      JOIN users u ON a.user_id = u.id
      ORDER BY a.completed_at DESC
    `);
    res.json(attempts);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching attempts', error: err.message });
  }
};

exports.getAttemptById = async (req, res) => {
  try {
    const { id } = req.params;
    const attempt = await db.asyncGet(`
      SELECT a.*, q.title AS "quizTitle"
      FROM attempts a
      JOIN quizzes q ON a.quiz_id = q.id
      WHERE a.id = $1
    `, [id]);

    if (!attempt) return res.status(404).json({ message: 'Attempt record not found' });
    if (req.user.role !== 'ADMIN' && req.user.id !== attempt.user_id) {
      return res.status(403).json({ message: 'You do not have permission to view this attempt.' });
    }

    const answers = await db.asyncAll(`
      SELECT question_id AS "questionId", selected_option_id AS "selectedOptionId", is_correct AS "isCorrect"
      FROM answers WHERE attempt_id = $1
    `, [id]);

    attempt.answers = answers.map(a => ({ ...a, isCorrect: !!a.isCorrect || !!a.iscorrect }));
    res.json(attempt);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching attempt', error: err.message });
  }
};

exports.getUserAttempts = async (req, res) => {
  try {
    const { userId } = req.params;
    if (req.user.role !== 'ADMIN' && req.user.id !== userId) {
      return res.status(403).json({ message: 'You do not have permission to view these attempts.' });
    }
    const attempts = await db.asyncAll(`
      SELECT a.*, q.title AS "quizTitle"
      FROM attempts a
      JOIN quizzes q ON a.quiz_id = q.id
      WHERE a.user_id = $1
      ORDER BY a.completed_at DESC
    `, [userId]);
    res.json(attempts);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching user attempts', error: err.message });
  }
};
