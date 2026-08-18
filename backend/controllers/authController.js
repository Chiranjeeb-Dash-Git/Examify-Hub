const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../middleware/authMiddleware');

// Keep the permanent portal credential server-side so the admin portal remains
// reachable even when the database is unavailable. Environment variables can
// override these values in a deployment without exposing them to the frontend.
const FIXED_ADMIN_EMAIL = (process.env.ADMIN_EMAIL || 'admin@examify.io').toLowerCase();
const FIXED_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const FIXED_ADMIN_USER = {
  id: 'usr-admin',
  name: process.env.ADMIN_NAME || 'Platform Administrator',
  email: FIXED_ADMIN_EMAIL,
  role: 'ADMIN',
  status: 'ACTIVE'
};

const createAdminSession = () => ({
  user: FIXED_ADMIN_USER,
  token: jwt.sign(
    { id: FIXED_ADMIN_USER.id, email: FIXED_ADMIN_USER.email, role: FIXED_ADMIN_USER.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  )
});

const buildActivityDetails = (req, extras = {}) => ({
  ip: (req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '').toString().split(',')[0].trim(),
  userAgent: req.headers['user-agent'] || '',
  ...extras
});

const logUserActivity = async (userId, action, details = {}) => {
  await db.asyncRun(
    `INSERT INTO user_activity (id, user_id, action, details)
     VALUES ($1, $2, $3, $4::jsonb)`,
    [`act-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, userId, action, JSON.stringify(details)]
  );
};

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    const existingUser = await db.asyncGet('SELECT id FROM users WHERE email = $1', [email.toLowerCase()]);
    if (existingUser) {
      return res.status(400).json({ message: 'Email address is already registered.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = `usr-${Date.now()}`;

    await db.asyncRun(
      'INSERT INTO users (id, name, email, password, role, status) VALUES ($1, $2, $3, $4, $5, $6)',
      [userId, name, email.toLowerCase(), hashedPassword, 'STUDENT', 'ACTIVE']
    );

    await logUserActivity(userId, 'REGISTER', buildActivityDetails(req, { email: email.toLowerCase() }));

    const token = jwt.sign({ id: userId, email, role: 'STUDENT' }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      user: { id: userId, name, email: email.toLowerCase(), role: 'STUDENT', status: 'ACTIVE' },
      token
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error during registration.', error: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  // Check the permanent admin credential before touching the database. This
  // makes it work whether the seeded row exists, is deactivated, or the
  // Supabase connection is temporarily unavailable.
  if (email?.trim().toLowerCase() === FIXED_ADMIN_EMAIL && password === FIXED_ADMIN_PASSWORD) {
    return res.json({ ...createAdminSession(), mode: 'fixed-admin' });
  }

  try {
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await db.asyncGet('SELECT * FROM users WHERE email = $1', [email.toLowerCase()]);
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    if (user.status === 'DEACTIVATED') {
      return res.status(403).json({ message: 'Account is deactivated. Please contact platform administrator.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const loginDetails = buildActivityDetails(req, { email: user.email, role: user.role });
    await db.asyncRun(
      `UPDATE users
       SET login_count = COALESCE(login_count, 0) + 1,
           last_login_at = CURRENT_TIMESTAMP,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $1`,
      [user.id]
    );
    await logUserActivity(user.id, 'LOGIN', loginDetails);

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status
      },
      token
    });
  } catch (err) {
    res.status(503).json({ message: 'Authentication database is temporarily unavailable.' });
  }
};

exports.me = async (req, res) => {
  // A fixed-admin session must survive page refreshes even without a database.
  if (req.user?.id === FIXED_ADMIN_USER.id && req.user?.email === FIXED_ADMIN_USER.email && req.user?.role === 'ADMIN') {
    return res.json(FIXED_ADMIN_USER);
  }

  try {
    const user = await db.asyncGet('SELECT id, name, email, role, status, created_at, updated_at, last_login_at, login_count FROM users WHERE id = $1', [req.user.id]);
    if (!user) return res.status(404).json({ message: 'User not found.' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
};
