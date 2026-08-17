const app = require('../backend/server');

module.exports = (req, res) => {
  // If running on Vercel Serverless, set default DATABASE_PATH to writeable /tmp directory
  if (process.env.VERCEL && !process.env.DATABASE_PATH) {
    process.env.DATABASE_PATH = '/tmp/aetheris.db';
  }
  return app(req, res);
};
