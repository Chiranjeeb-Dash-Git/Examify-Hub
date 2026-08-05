const db = require('../config/db');

exports.getQuizzes = async (req, res) => {
  try {
    const quizzes = await db.asyncAll(`
      SELECT q.*, c.name as categoryName,
        (SELECT COUNT(id) FROM questions WHERE quiz_id = q.id) as questionsCount,
        (SELECT COUNT(id) FROM attempts WHERE quiz_id = q.id) as attemptsCount,
        COALESCE((SELECT AVG(percentage) FROM attempts WHERE quiz_id = q.id), 0) as avgScore
      FROM quizzes q
      LEFT JOIN categories c ON q.category_id = c.id
      ORDER BY q.created_at DESC
    `);
    res.json(quizzes);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching quizzes', error: err.message });
  }
};

exports.getQuizById = async (req, res) => {
  try {
    const { id } = req.params;
    const quiz = await db.asyncGet(`
      SELECT q.*, c.name as categoryName,
        (SELECT COUNT(id) FROM questions WHERE quiz_id = q.id) as questionsCount
      FROM quizzes q
      LEFT JOIN categories c ON q.category_id = c.id
      WHERE q.id = ?
    `, [id]);

    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
    res.json(quiz);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching quiz', error: err.message });
  }
};

exports.createQuiz = async (req, res) => {
  try {
    const { title, description, categoryId, difficulty, duration, passingScore, maxAttempts, status } = req.body;
    if (!title) return res.status(400).json({ message: 'Quiz title is required.' });

    const id = `quiz-${Date.now()}`;
    await db.asyncRun(`
      INSERT INTO quizzes (id, title, description, category_id, difficulty, duration, passing_score, max_attempts, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      id,
      title,
      description || '',
      categoryId || null,
      difficulty || 'Intermediate',
      duration || 15,
      passingScore || 60,
      maxAttempts || 3,
      status || 'Published'
    ]);

    const created = await db.asyncGet('SELECT * FROM quizzes WHERE id = ?', [id]);
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ message: 'Error creating quiz', error: err.message });
  }
};

exports.updateQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, categoryId, difficulty, duration, passingScore, maxAttempts, status } = req.body;

    await db.asyncRun(`
      UPDATE quizzes
      SET title = ?, description = ?, category_id = ?, difficulty = ?, duration = ?, passing_score = ?, max_attempts = ?, status = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [title, description, categoryId, difficulty, duration, passingScore, maxAttempts, status, id]);

    const updated = await db.asyncGet('SELECT * FROM quizzes WHERE id = ?', [id]);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Error updating quiz', error: err.message });
  }
};

exports.deleteQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    await db.asyncRun('DELETE FROM quizzes WHERE id = ?', [id]);
    res.json({ message: 'Quiz deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting quiz', error: err.message });
  }
};
