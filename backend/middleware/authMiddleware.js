const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'aetheris-secret-key-2026';

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Access denied. Authorization token missing.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user && req.user.role === 'ADMIN') {
      next();
    } else {
      res.status(403).json({ message: 'Forbidden. Admin privileges required.' });
    }
  });
};

module.exports = {
  verifyToken,
  verifyAdmin,
  JWT_SECRET
};
