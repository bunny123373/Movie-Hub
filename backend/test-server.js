const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/movie-download-db')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB Connection Error:', err));

// Test routes
app.get('/api/health', (req, res) => {
  console.log('Health check called');
  res.json({ status: 'OK', message: 'Server is running' });
});

app.get('/api/test', (req, res) => {
  console.log('Test endpoint called');
  res.json({ message: 'Test working' });
});

// Simple series route
app.get('/api/movies/series', async (req, res) => {
  try {
    console.log('Series endpoint called with params:', req.query);
    res.json({ series: [], total: 0, page: 1, pages: 0 });
  } catch (error) {
    console.error('Series error:', error);
    res.status(500).json({ message: error.message });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
});