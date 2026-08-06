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

// Helper function to seed quiz if not exists
async function seedQuiz(id, title, description, categoryId, difficulty, duration, passingScore, maxAttempts, status) {
  const existing = await db.asyncGet('SELECT id FROM quizzes WHERE id = ?', [id]);
  if (!existing) {
    await db.asyncRun(`
      INSERT INTO quizzes (id, title, description, category_id, difficulty, duration, passing_score, max_attempts, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [id, title, description, categoryId, difficulty, duration, passingScore, maxAttempts, status]);
  }
}

// Helper function to seed question with options
async function seedQuestion(qId, quizId, text, marks, explanation, diff, options) {
  const existing = await db.asyncGet('SELECT id FROM questions WHERE id = ?', [qId]);
  if (!existing) {
    await db.asyncRun(
      `INSERT INTO questions (id, quiz_id, question_text, marks, explanation, difficulty) VALUES (?, ?, ?, ?, ?, ?)`,
      [qId, quizId, text, marks, explanation, diff]
    );
    for (let opt of options) {
      await db.asyncRun(
        `INSERT INTO options (id, question_id, option_text, is_correct) VALUES (?, ?, ?, ?)`,
        [opt.id, qId, opt.text, opt.isCorrect ? 1 : 0]
      );
    }
  }
}

// Initialize Database Tables
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

  // Seed Initial Admin & Users
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

  // Seed Categories
  await db.asyncRun(`INSERT OR IGNORE INTO categories (id, name, description) VALUES (?, ?, ?)`, [
    'cat-1', 'JavaScript', 'Core ES6+, closures, async/await, and browser runtime engines.'
  ]);
  await db.asyncRun(`INSERT OR IGNORE INTO categories (id, name, description) VALUES (?, ?, ?)`, [
    'cat-2', 'React', 'JSX, hooks, component lifecycle, virtual DOM, and state management.'
  ]);
  await db.asyncRun(`INSERT OR IGNORE INTO categories (id, name, description) VALUES (?, ?, ?)`, [
    'cat-3', 'Cyber Security', 'Cryptography, network defense, web security vulnerabilities, and protocols.'
  ]);
  await db.asyncRun(`INSERT OR IGNORE INTO categories (id, name, description) VALUES (?, ?, ?)`, [
    'cat-4', 'Python', 'Data structures, OOP, decorators, generators, and standard libraries.'
  ]);
  await db.asyncRun(`INSERT OR IGNORE INTO categories (id, name, description) VALUES (?, ?, ?)`, [
    'cat-5', 'Computer Networks', 'OSI model, TCP/IP, DNS, routing algorithms, and socket programming.'
  ]);
  await db.asyncRun(`INSERT OR IGNORE INTO categories (id, name, description) VALUES (?, ?, ?)`, [
    'cat-6', 'Database Systems', 'SQL query optimization, indexing, ACID transactions, and NoSQL.'
  ]);

  // Seed All 6 Quizzes
  await seedQuiz('quiz-js-101', 'JavaScript Fundamentals', 'Master core JavaScript concepts including data types, closures, event loop, promises, and ES6 features.', 'cat-1', 'Intermediate', 15, 60, 3, 'Published');
  await seedQuiz('quiz-react-201', 'Quantum React & State Protocols', 'Deep dive into React 19 concurrent rendering, custom hooks optimization, state boundary isolation, and Server Components.', 'cat-2', 'Advanced', 20, 70, 2, 'Published');
  await seedQuiz('quiz-sec-301', 'Cypher Fundamentals & Cryptography', 'Basic decryption methodologies, asymmetric encryption, public key infrastructure, and secure communication protocols.', 'cat-3', 'Beginner', 15, 60, 5, 'Published');
  await seedQuiz('quiz-py-101', 'Python Core & Neural Constructs', 'Analyze structural compositions of Python memory management, list comprehensions, decorators, and async generators.', 'cat-4', 'Intermediate', 30, 65, 3, 'Published');
  await seedQuiz('quiz-net-201', 'Computer Networks & Socket Protocols', 'OSI 7-layer architecture, TCP 3-way handshake, IP subnetting, DNS resolution flow, and TLS handshake.', 'cat-5', 'Intermediate', 20, 65, 3, 'Published');
  await seedQuiz('quiz-db-201', 'Database Systems & SQL Telemetry', 'Relational algebra, B-Tree indexes, transaction isolation levels, WAL logs, and query execution plans.', 'cat-6', 'Intermediate', 25, 60, 2, 'Published');

  // Seed 10 Questions for quiz-js-101
  await seedQuestion('q-js-1', 'quiz-js-101', 'Which method converts a JSON string into a JavaScript object?', 2, 'JSON.parse() parses a JSON string.', 'Easy', [
    { id: 'opt-1', text: 'JSON.stringify()', isCorrect: false },
    { id: 'opt-2', text: 'JSON.parse()', isCorrect: true },
    { id: 'opt-3', text: 'JSON.convert()', isCorrect: false },
    { id: 'opt-4', text: 'JSON.toObject()', isCorrect: false }
  ]);

  await seedQuestion('q-js-2', 'quiz-js-101', 'Which keyword declares a block-scoped constant variable?', 2, 'const creates block-scoped constants.', 'Easy', [
    { id: 'opt-5', text: 'var', isCorrect: false },
    { id: 'opt-6', text: 'let', isCorrect: false },
    { id: 'opt-7', text: 'const', isCorrect: true },
    { id: 'opt-8', text: 'static', isCorrect: false }
  ]);

  await seedQuestion('q-js-3', 'quiz-js-101', 'What is the output of `console.log(typeof typeof 1)`?', 2, 'typeof 1 is "number", typeof "number" is "string".', 'Medium', [
    { id: 'opt-9', text: '"number"', isCorrect: false },
    { id: 'opt-10', text: '"string"', isCorrect: true },
    { id: 'opt-11', text: '"undefined"', isCorrect: false },
    { id: 'opt-12', text: '"object"', isCorrect: false }
  ]);

  await seedQuestion('q-js-4', 'quiz-js-101', 'What does Promise.all() do if a promise rejects?', 2, 'Promise.all rejects immediately upon first rejection.', 'Medium', [
    { id: 'opt-13', text: 'Ignores rejection', isCorrect: false },
    { id: 'opt-14', text: 'Immediately rejects with first error', isCorrect: true },
    { id: 'opt-15', text: 'Returns null', isCorrect: false },
    { id: 'opt-16', text: 'Resolves all anyway', isCorrect: false }
  ]);

  await seedQuestion('q-js-5', 'quiz-js-101', 'Which mechanism executes async callbacks in Node/Browser?', 2, 'The Event Loop handles non-blocking async execution.', 'Hard', [
    { id: 'opt-17', text: 'Thread Pool', isCorrect: false },
    { id: 'opt-18', text: 'Garbage Collector', isCorrect: false },
    { id: 'opt-19', text: 'Event Loop', isCorrect: true },
    { id: 'opt-20', text: 'JIT Compiler', isCorrect: false }
  ]);

  await seedQuestion('q-js-6', 'quiz-js-101', 'What is a JavaScript Closure?', 2, 'Function bundled with outer scope references.', 'Medium', [
    { id: 'opt-21', text: 'A method to close window', isCorrect: false },
    { id: 'opt-22', text: 'Function retaining outer lexical scope access', isCorrect: true },
    { id: 'opt-23', text: 'Loop break statement', isCorrect: false },
    { id: 'opt-24', text: 'Private class keyword', isCorrect: false }
  ]);

  await seedQuestion('q-js-7', 'quiz-js-101', 'Which operator checks value and type equality without coercion?', 2, '=== checks strict equality.', 'Easy', [
    { id: 'opt-25', text: '==', isCorrect: false },
    { id: 'opt-26', text: '===', isCorrect: true },
    { id: 'opt-27', text: '=', isCorrect: false },
    { id: 'opt-28', text: 'equals()', isCorrect: false }
  ]);

  await seedQuestion('q-js-8', 'quiz-js-101', 'What is the purpose of Array.prototype.reduce()?', 2, 'Accumulates elements into a single value.', 'Medium', [
    { id: 'opt-29', text: 'Filters items', isCorrect: false },
    { id: 'opt-30', text: 'Accumulates array items to single output', isCorrect: true },
    { id: 'opt-31', text: 'Sorts array descending', isCorrect: false },
    { id: 'opt-32', text: 'Removes duplicates', isCorrect: false }
  ]);

  await seedQuestion('q-js-9', 'quiz-js-101', 'What is the difference between null and undefined?', 2, 'undefined means unassigned, null means explicit empty value.', 'Easy', [
    { id: 'opt-33', text: 'null means unassigned, undefined means empty', isCorrect: false },
    { id: 'opt-34', text: 'undefined means unassigned, null means explicit empty', isCorrect: true },
    { id: 'opt-35', text: 'Both are identical', isCorrect: false },
    { id: 'opt-36', text: 'null is a number', isCorrect: false }
  ]);

  await seedQuestion('q-js-10', 'quiz-js-101', 'What does the async keyword return when applied to a function?', 2, 'Async functions always return a Promise.', 'Medium', [
    { id: 'opt-37', text: 'A Callback', isCorrect: false },
    { id: 'opt-38', text: 'A Promise', isCorrect: true },
    { id: 'opt-39', text: 'An Event Listener', isCorrect: false },
    { id: 'opt-40', text: 'A Generator', isCorrect: false }
  ]);

  // Seed Questions for React quiz
  await seedQuestion('q-react-1', 'quiz-react-201', 'What hook is recommended for side effects such as data fetching and DOM subscriptions?', 2, 'useEffect handles side effects in functional components.', 'Medium', [
    { id: 'opt-r1', text: 'useState', isCorrect: false },
    { id: 'opt-r2', text: 'useEffect', isCorrect: true },
    { id: 'opt-r3', text: 'useContext', isCorrect: false },
    { id: 'opt-r4', text: 'useReducer', isCorrect: false }
  ]);

  // Seed Questions for Networks quiz
  await seedQuestion('q-net-1', 'quiz-net-201', 'Which layer of the OSI model is responsible for routing IP packets across networks?', 2, 'The Network Layer (Layer 3) handles IP packet routing.', 'Intermediate', [
    { id: 'opt-n1', text: 'Data Link Layer', isCorrect: false },
    { id: 'opt-n2', text: 'Network Layer (Layer 3)', isCorrect: true },
    { id: 'opt-n3', text: 'Transport Layer', isCorrect: false },
    { id: 'opt-n4', text: 'Session Layer', isCorrect: false }
  ]);
}

initDatabase().catch(console.error);

module.exports = db;
