const db = require('../config/db');

exports.getQuestionsForQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;
    const questions = await db.asyncAll(
      'SELECT * FROM questions WHERE quiz_id = ? ORDER BY created_at ASC',
      [quizId]
    );

    for (let q of questions) {
      const options = await db.asyncAll(
        'SELECT id, option_text as text, is_correct as isCorrect FROM options WHERE question_id = ?',
        [q.id]
      );
      q.options = options.map(o => ({ ...o, isCorrect: !!o.isCorrect }));
    }

    res.json(questions);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching questions', error: err.message });
  }
};

exports.saveQuestion = async (req, res) => {
  try {
    const { id, quizId, questionText, marks, explanation, difficulty, options } = req.body;
    if (!quizId || !questionText || !options || options.length === 0) {
      return res.status(400).json({ message: 'quizId, questionText, and options are required.' });
    }

    let qId = id;
    if (qId) {
      // Update existing
      await db.asyncRun(
        'UPDATE questions SET question_text = ?, marks = ?, explanation = ?, difficulty = ? WHERE id = ?',
        [questionText, marks || 2, explanation || '', difficulty || 'Easy', qId]
      );
      await db.asyncRun('DELETE FROM options WHERE question_id = ?', [qId]);
    } else {
      qId = `q-${Date.now()}`;
      await db.asyncRun(
        'INSERT INTO questions (id, quiz_id, question_text, marks, explanation, difficulty) VALUES (?, ?, ?, ?, ?, ?)',
        [qId, quizId, questionText, marks || 2, explanation || '', difficulty || 'Easy']
      );
    }

    // Insert options
    for (let opt of options) {
      const optId = opt.id || `opt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
      await db.asyncRun(
        'INSERT INTO options (id, question_id, option_text, is_correct) VALUES (?, ?, ?, ?)',
        [optId, qId, opt.text || opt.option_text, opt.isCorrect ? 1 : 0]
      );
    }

    res.status(201).json({ id: qId, quizId, questionText, marks, explanation, difficulty, options });
  } catch (err) {
    res.status(500).json({ message: 'Error saving question', error: err.message });
  }
};

exports.deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    await db.asyncRun('DELETE FROM questions WHERE id = ?', [id]);
    res.json({ message: 'Question deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting question', error: err.message });
  }
};
