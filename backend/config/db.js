const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const connectionString =
  process.env.SUPABASE_POOLER_URL ||
  process.env.SUPABASE_DATABASE_URL ||
  process.env.DATABASE_URL ||
  null;

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@examify.io';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const ADMIN_NAME = process.env.ADMIN_NAME || 'Admin Commander';
const DEMO_STUDENT_EMAIL = process.env.DEMO_STUDENT_EMAIL || 'student@aetheris.io';
const DEMO_STUDENT_PASSWORD = process.env.DEMO_STUDENT_PASSWORD || 'password123';
const DEMO_STUDENT_NAME = process.env.DEMO_STUDENT_NAME || 'Rahul Sharma';

const hasDatabaseUrl = !!connectionString;
const shouldBootstrap = process.env.RUN_DB_BOOTSTRAP === 'true';
const pool = hasDatabaseUrl
  ? new Pool({
      connectionString,
      ssl: { rejectUnauthorized: false },
      max: 5,
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 10_000,
    })
  : null;

if (pool) {
  pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
  });
  console.log('Connected to Supabase PostgreSQL database.');
} else {
  console.warn('No Supabase/Postgres connection string is set. Backend API will run in fallback mode until a database connection is configured.');
}

// Utility helpers for Async SQL queries mapped to pg syntax
const db = {};

// For queries that don't return rows (INSERT/UPDATE/DELETE without RETURNING)
db.asyncRun = async function (sql, params = []) {
  try {
    if (!pool) {
      throw new Error('No database connection string is configured.');
    }
    const res = await pool.query(sql, params);
    return res;
  } catch (err) {
    throw err;
  }
};

// For queries returning multiple rows
db.asyncAll = async function (sql, params = []) {
  try {
    if (!pool) {
      throw new Error('No database connection string is configured.');
    }
    const res = await pool.query(sql, params);
    return res.rows;
  } catch (err) {
    throw err;
  }
};

// For queries returning a single row
db.asyncGet = async function (sql, params = []) {
  try {
    if (!pool) {
      throw new Error('No database connection string is configured.');
    }
    const res = await pool.query(sql, params);
    return res.rows[0];
  } catch (err) {
    throw err;
  }
};

// Helper function to seed quiz if not exists
async function seedQuiz(id, title, description, categoryId, difficulty, duration, passingScore, maxAttempts, status) {
  const existing = await db.asyncGet('SELECT id FROM quizzes WHERE id = $1', [id]);
  if (!existing) {
    await db.asyncRun(`
      INSERT INTO quizzes (id, title, description, category_id, difficulty, duration, passing_score, max_attempts, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      ON CONFLICT (id) DO NOTHING
    `, [id, title, description, categoryId, difficulty, duration, passingScore, maxAttempts, status]);
  }
}

// Helper function to seed question with options
async function seedQuestion(qId, quizId, text, marks, explanation, diff, options) {
  const existing = await db.asyncGet('SELECT id FROM questions WHERE id = $1', [qId]);
  if (!existing) {
    await db.asyncRun(
      `INSERT INTO questions (id, quiz_id, question_text, marks, explanation, difficulty) VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (id) DO NOTHING`,
      [qId, quizId, text, marks, explanation, diff]
    );
    for (let opt of options) {
      await db.asyncRun(
        `INSERT INTO options (id, question_id, option_text, is_correct) VALUES ($1, $2, $3, $4) ON CONFLICT (id) DO NOTHING`,
        [opt.id, qId, opt.text, opt.isCorrect]
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
      login_count INTEGER NOT NULL DEFAULT 0,
      last_login_at TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await db.asyncRun(`ALTER TABLE users ADD COLUMN IF NOT EXISTS login_count INTEGER NOT NULL DEFAULT 0;`);
  await db.asyncRun(`ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMP;`);
  await db.asyncRun(`ALTER TABLE users ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;`);

  await db.asyncRun(`
    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
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
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
    );
  `);

  await db.asyncRun(`
    CREATE TABLE IF NOT EXISTS options (
      id TEXT PRIMARY KEY,
      question_id TEXT NOT NULL,
      option_text TEXT NOT NULL,
      is_correct BOOLEAN DEFAULT false,
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
      started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (quiz_id) REFERENCES quizzes(id),
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
  `);

  await db.asyncRun(`
    CREATE TABLE IF NOT EXISTS user_activity (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      action TEXT NOT NULL,
      details JSONB,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  await db.asyncRun(`CREATE INDEX IF NOT EXISTS idx_user_activity_user_created ON user_activity(user_id, created_at DESC);`);
  await db.asyncRun(`CREATE INDEX IF NOT EXISTS idx_user_activity_created_at ON user_activity(created_at DESC);`);

  await db.asyncRun(`
    CREATE TABLE IF NOT EXISTS answers (
      id TEXT PRIMARY KEY,
      attempt_id TEXT NOT NULL,
      question_id TEXT NOT NULL,
      selected_option_id TEXT,
      is_correct BOOLEAN DEFAULT false,
      FOREIGN KEY (attempt_id) REFERENCES attempts(id) ON DELETE CASCADE,
      FOREIGN KEY (question_id) REFERENCES questions(id)
    );
  `);

  // Seed Initial Admin & Users
  const hashedAdminPass = await bcrypt.hash(ADMIN_PASSWORD, 10);
  await db.asyncRun(
    `INSERT INTO users (id, name, email, password, role, status, login_count, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, 0, CURRENT_TIMESTAMP)
     ON CONFLICT (id) DO UPDATE SET
       name = EXCLUDED.name,
       password = EXCLUDED.password,
       role = EXCLUDED.role,
       status = EXCLUDED.status,
       updated_at = CURRENT_TIMESTAMP`,
    ['usr-admin', ADMIN_NAME, ADMIN_EMAIL, hashedAdminPass, 'ADMIN', 'ACTIVE']
  );

  const hashedStudentPass = await bcrypt.hash(DEMO_STUDENT_PASSWORD, 10);
  await db.asyncRun(
    `INSERT INTO users (id, name, email, password, role, status, login_count, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, 0, CURRENT_TIMESTAMP)
     ON CONFLICT (id) DO UPDATE SET
       name = EXCLUDED.name,
       password = EXCLUDED.password,
       role = EXCLUDED.role,
       status = EXCLUDED.status,
       updated_at = CURRENT_TIMESTAMP`,
    ['usr-1', DEMO_STUDENT_NAME, DEMO_STUDENT_EMAIL, hashedStudentPass, 'STUDENT', 'ACTIVE']
  );

  // Seed Categories
  await db.asyncRun(`INSERT INTO categories (id, name, description) VALUES ($1, $2, $3) ON CONFLICT (id) DO NOTHING`, [
    'cat-1', 'JavaScript', 'Core ES6+, closures, async/await, and browser runtime engines.'
  ]);
  await db.asyncRun(`INSERT INTO categories (id, name, description) VALUES ($1, $2, $3) ON CONFLICT (id) DO NOTHING`, [
    'cat-2', 'React', 'JSX, hooks, component lifecycle, virtual DOM, and state management.'
  ]);
  await db.asyncRun(`INSERT INTO categories (id, name, description) VALUES ($1, $2, $3) ON CONFLICT (id) DO NOTHING`, [
    'cat-3', 'Cyber Security', 'Cryptography, network defense, web security vulnerabilities, and protocols.'
  ]);
  await db.asyncRun(`INSERT INTO categories (id, name, description) VALUES ($1, $2, $3) ON CONFLICT (id) DO NOTHING`, [
    'cat-4', 'Python', 'Data structures, OOP, decorators, generators, and standard libraries.'
  ]);
  await db.asyncRun(`INSERT INTO categories (id, name, description) VALUES ($1, $2, $3) ON CONFLICT (id) DO NOTHING`, [
    'cat-5', 'Computer Networks', 'OSI model, TCP/IP, DNS, routing algorithms, and socket programming.'
  ]);
  await db.asyncRun(`INSERT INTO categories (id, name, description) VALUES ($1, $2, $3) ON CONFLICT (id) DO NOTHING`, [
    'cat-6', 'Database Systems', 'SQL query optimization, indexing, ACID transactions, and NoSQL.'
  ]);
  await db.asyncRun(`INSERT INTO categories (id, name, description) VALUES ($1, $2, $3) ON CONFLICT (id) DO NOTHING`, [
    'cat-7', 'Next.js', 'App Router, React Server Components, SSG, SSR, ISR, and API route handlers.'
  ]);

  // Seed All 7 Quizzes
  await seedQuiz('quiz-js-101', 'JavaScript Fundamentals', 'Master core JavaScript concepts including data types, closures, event loop, promises, and ES6 features.', 'cat-1', 'Intermediate', 15, 60, 3, 'Published');
  await seedQuiz('quiz-react-201', 'Quantum React & State Protocols', 'Deep dive into React 19 concurrent rendering, custom hooks optimization, state boundary isolation, and Server Components.', 'cat-2', 'Advanced', 20, 70, 2, 'Published');
  await seedQuiz('quiz-sec-301', 'Cypher Fundamentals & Cryptography', 'Basic decryption methodologies, asymmetric encryption, public key infrastructure, and secure communication protocols.', 'cat-3', 'Beginner', 15, 60, 5, 'Published');
  await seedQuiz('quiz-py-101', 'Python Core & Neural Constructs', 'Analyze structural compositions of Python memory management, list comprehensions, decorators, and async generators.', 'cat-4', 'Intermediate', 30, 65, 3, 'Published');
  await seedQuiz('quiz-net-201', 'Computer Networks & Socket Protocols', 'OSI 7-layer architecture, TCP 3-way handshake, IP subnetting, DNS resolution flow, and TLS handshake.', 'cat-5', 'Intermediate', 20, 65, 3, 'Published');
  await seedQuiz('quiz-db-201', 'Database Systems & SQL Telemetry', 'Relational algebra, B-Tree indexes, transaction isolation levels, WAL logs, and query execution plans.', 'cat-6', 'Intermediate', 25, 60, 2, 'Published');
  await seedQuiz('quiz-next-301', 'Next.js App Router & SSR Protocols', 'Master Next.js App Router, React Server Components, server actions, dynamic routing, and caching strategies.', 'cat-7', 'Intermediate', 20, 60, 3, 'Published');

  // Seed Questions for Next.js quiz
  await seedQuestion('q-next-1', 'quiz-next-301', 'In Next.js App Router, which file convention defines a UI unique to a route segment?', 2, 'page.js defines UI unique to a route segment in the App Router.', 'Easy', [
    { id: 'opt-nx1', text: 'index.js', isCorrect: false },
    { id: 'opt-nx2', text: 'page.js', isCorrect: true },
    { id: 'opt-nx3', text: 'route.js', isCorrect: false },
    { id: 'opt-nx4', text: 'layout.js', isCorrect: false }
  ]);

  await seedQuestion('q-next-2', 'quiz-next-301', 'Which directive must be declared at the top of a file to create a Client Component in Next.js App Router?', 2, '"use client" marks a component for client-side execution and interactivity.', 'Easy', [
    { id: 'opt-nx5', text: '"use client"', isCorrect: true },
    { id: 'opt-nx6', text: '"use server"', isCorrect: false },
    { id: 'opt-nx7', text: '"use react"', isCorrect: false },
    { id: 'opt-nx8', text: '"use browser"', isCorrect: false }
  ]);

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

db.initDatabase = initDatabase;

if (pool && shouldBootstrap) {
  initDatabase().catch(console.error);
}

module.exports = db;
