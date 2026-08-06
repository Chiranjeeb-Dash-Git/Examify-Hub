const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.resolve(__dirname, '../aetheris.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Failed to connect to SQLite database:', err.message);
  } else {
    console.log('Connected to Examify Hub SQLite database.');
  }
});

// Utility helpers for Async SQL queries
db.asyncRun = function (sql, params = []) {
  return new Promise((resolve, reject) => {
    this.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
};

db.asyncAll = function (sql, params = []) {
  return new Promise((resolve, reject) => {
    this.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

db.asyncGet = function (sql, params = []) {
  return new Promise((resolve, reject) => {
    this.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

// Initialize Database Tables (Matching Section 20 Specification)
async function initDatabase() {
  await db.asyncRun(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'STUDENT',
      status TEXT NOT NULL DEFAULT 'ACTIVE',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await db.asyncRun(`
    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await db.asyncRun(`
    CREATE TABLE IF NOT EXISTS quizzes (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      category_id TEXT,
      difficulty TEXT DEFAULT 'Intermediate',
      duration INTEGER DEFAULT 15,
      passing_score INTEGER DEFAULT 60,
      max_attempts INTEGER DEFAULT 3,
      status TEXT DEFAULT 'Published',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
    );
  `);

  await db.asyncRun(`
    CREATE TABLE IF NOT EXISTS questions (
      id TEXT PRIMARY KEY,
      quiz_id TEXT NOT NULL,
      question_text TEXT NOT NULL,
      marks INTEGER DEFAULT 2,
      explanation TEXT,
      difficulty TEXT DEFAULT 'Easy',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
    );
  `);

  await db.asyncRun(`
    CREATE TABLE IF NOT EXISTS options (
      id TEXT PRIMARY KEY,
      question_id TEXT NOT NULL,
      option_text TEXT NOT NULL,
      is_correct INTEGER DEFAULT 0,
      FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
    );
  `);

  await db.asyncRun(`
    CREATE TABLE IF NOT EXISTS attempts (
      id TEXT PRIMARY KEY,
      quiz_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      score INTEGER NOT NULL,
      percentage INTEGER NOT NULL,
      correct_answers INTEGER NOT NULL,
      incorrect_answers INTEGER NOT NULL,
      unanswered INTEGER NOT NULL,
      time_taken TEXT NOT NULL,
      status TEXT NOT NULL,
      started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (quiz_id) REFERENCES quizzes(id),
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
  `);

  await db.asyncRun(`
    CREATE TABLE IF NOT EXISTS answers (
      id TEXT PRIMARY KEY,
      attempt_id TEXT NOT NULL,
      question_id TEXT NOT NULL,
      selected_option_id TEXT,
      is_correct INTEGER DEFAULT 0,
      FOREIGN KEY (attempt_id) REFERENCES attempts(id) ON DELETE CASCADE,
      FOREIGN KEY (question_id) REFERENCES questions(id)
    );
  `);

  // Seed Initial Admin & Categories if empty
  const adminExists = await db.asyncGet(`SELECT id FROM users WHERE email = 'admin@aetheris.io'`);
  if (!adminExists) {
    const hashedAdminPass = await bcrypt.hash('adminpassword', 10);
    await db.asyncRun(
      `INSERT INTO users (id, name, email, password, role, status) VALUES (?, ?, ?, ?, ?, ?)`,
      ['usr-admin', 'Admin Commander', 'admin@aetheris.io', hashedAdminPass, 'ADMIN', 'ACTIVE']
    );

    const hashedStudentPass = await bcrypt.hash('password123', 10);
    await db.asyncRun(
      `INSERT INTO users (id, name, email, password, role, status) VALUES (?, ?, ?, ?, ?, ?)`,
      ['usr-1', 'Rahul Sharma', 'student@aetheris.io', hashedStudentPass, 'STUDENT', 'ACTIVE']
    );
  }

  const catExists = await db.asyncGet(`SELECT id FROM categories LIMIT 1`);
  if (!catExists) {
    await db.asyncRun(`INSERT INTO categories (id, name, description) VALUES (?, ?, ?)`, [
      'cat-1', 'JavaScript', 'Core ES6+, closures, async/await, and browser runtime engines.'
    ]);
    await db.asyncRun(`INSERT INTO categories (id, name, description) VALUES (?, ?, ?)`, [
      'cat-2', 'React', 'JSX, hooks, component lifecycle, virtual DOM, and state management.'
    ]);
    await db.asyncRun(`INSERT INTO categories (id, name, description) VALUES (?, ?, ?)`, [
      'cat-3', 'Cyber Security', 'Cryptography, network defense, web security vulnerabilities, and protocols.'
    ]);
  }

  const quizExists = await db.asyncGet(`SELECT id FROM quizzes LIMIT 1`);
  if (!quizExists) {
    await db.asyncRun(`
      INSERT INTO quizzes (id, title, description, category_id, difficulty, duration, passing_score, max_attempts, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      'quiz-js-101',
      'JavaScript Fundamentals',
      'Master core JavaScript concepts including data types, closures, event loop, promises, and ES6 features.',
      'cat-1',
      'Intermediate',
      15,
      60,
      3,
      'Published'
    ]);

    await db.asyncRun(`
      INSERT INTO questions (id, quiz_id, question_text, marks, explanation, difficulty)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [
      'q-js-1',
      'quiz-js-101',
      'Which method converts a JSON string into a JavaScript object?',
      2,
      'JSON.parse() converts a JSON string into a JavaScript object.',
      'Easy'
    ]);

    await db.asyncRun(`INSERT INTO options (id, question_id, option_text, is_correct) VALUES (?, ?, ?, ?)`, [
      'opt-1', 'q-js-1', 'JSON.stringify()', 0
    ]);
    await db.asyncRun(`INSERT INTO options (id, question_id, option_text, is_correct) VALUES (?, ?, ?, ?)`, [
      'opt-2', 'q-js-1', 'JSON.parse()', 1
    ]);
    await db.asyncRun(`INSERT INTO options (id, question_id, option_text, is_correct) VALUES (?, ?, ?, ?)`, [
      'opt-3', 'q-js-1', 'JSON.convert()', 0
    ]);
    await db.asyncRun(`INSERT INTO options (id, question_id, option_text, is_correct) VALUES (?, ?, ?, ?)`, [
      'opt-4', 'q-js-1', 'JSON.toObject()', 0
    ]);
  }
}

initDatabase().catch(console.error);

module.exports = db;
