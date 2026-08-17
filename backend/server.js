const express = require('express');
const cors = require('cors');
require('dotenv').config();

const db = require('./config/db');
const apiRoutes = require('./routes/apiRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'Examify Hub REST API', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api', apiRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(` Examify Hub REST API Server running on port ${PORT}`);
    console.log(` Health Check: http://localhost:${PORT}/health`);
    console.log(`====================================================`);
  });
}

module.exports = app;
