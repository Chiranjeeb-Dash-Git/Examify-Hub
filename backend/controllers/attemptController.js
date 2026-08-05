const db = require('../config/db');

exports.submitAttempt = async (req, res) => {
  try {
    const { quizId, userId, userAnswers, timeTaken } = req.body;
    if (!quizId || !userId || !userAnswers) {
      return res.status(400).json({ message: 'quizId, userId, and userAnswers are required.' });
    }

    const quiz = await db.asyncGet('SELECT * FROM quizzes WHERE id = ?', [quizId]);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found.' });

    const questions = await db.asyncAll('SELECT * FROM questions WHERE quiz_id = ?', [quizId]);
    const user = await db.asyncGet('SELECT name FROM users WHERE id = ?', [userId]);

    let correctCount = 0;
    let incorrectCount = 0;
    let unansweredCount = 0;
    let totalMarks = 0;
    let obtainedMarks = 0;

    const attemptId = `att-${Date.now()}`;
    const answersToInsert = [];

    for (let q of questions) {
      totalMarks += q.marks || 2;
      const selectedOptId = userAnswers[q.id];

      if (!selectedOptId) {
        unansweredCount++;
        answersToInsert.push({ questionId: q.id, selectedOptId: null, isCorrect: 0 });
      } else {
        const correctOpt = await db.asyncGet('SELECT id FROM options WHERE question_id = ? AND is_correct = 1', [q.id]);
        const isCorrect = correctOpt && correctOpt.id === selectedOptId;

        if (isCorrect) {
          correctCount++;
          obtainedMarks += q.marks || 2;
          answersToInsert.push({ questionId: q.id, selectedOptId, isCorrect: 1 });
        } else {
          incorrectCount++;
          answersToInsert.push({ questionId: q.id, selectedOptId, isCorrect: 0 });
        }
      }
    }

    const percentage = totalMarks > 0 ? Math.round((obtainedMarks / totalMarks) * 100) : 0;
    const isPassed = percentage >= (quiz.passing_score || 60);
    const status = isPassed ? 'PASSED' : 'FAILED';

    await db.asyncRun(`
      INSERT INTO attempts (
        id, quiz_id, user_id, score, percentage, correct_answers, incorrect_answers, unanswered, time_taken, status, completed_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
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
        VALUES (?, ?, ?, ?, ?)
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

exports.getAttemptById = async (req, res) => {
  try {
    const { id } = req.params;
    const attempt = await db.asyncGet(`
      SELECT a.*, q.title as quizTitle
      FROM attempts a
      JOIN quizzes q ON a.quiz_id = q.id
      WHERE a.id = ?
    `, [id]);

    if (!attempt) return res.status(404).json({ message: 'Attempt record not found' });

    const answers = await db.asyncAll(`
      SELECT question_id as questionId, selected_option_id as selectedOptionId, is_correct as isCorrect
      FROM answers WHERE attempt_id = ?
    `, [id]);

    attempt.answers = answers.map(a => ({ ...a, isCorrect: !!a.isCorrect }));
    res.json(attempt);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching attempt', error: err.message });
  }
};

exports.getUserAttempts = async (req, res) => {
  try {
    const { userId } = req.params;
    const attempts = await db.asyncAll(`
      SELECT a.*, q.title as quizTitle
      FROM attempts a
      JOIN quizzes q ON a.quiz_id = q.id
      WHERE a.user_id = ?
      ORDER BY a.completed_at DESC
    `, [userId]);
    res.json(attempts);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching user attempts', error: err.message });
  }
};
