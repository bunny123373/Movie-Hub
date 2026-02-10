const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Basic routes
app.get('/api/health', (req, res) => {
  console.log('Health check called');
  res.json({ status: 'OK', message: 'Server is running' });
});

app.get('/api/movies/series', (req, res) => {
  console.log('Series endpoint called');
  res.json({ 
    series: [
      {
        _id: 'test123',
        title: 'Test Series',
        language: 'English',
        category: 'Web Series',
        genre: ['Action'],
        year: 2024,
        posterUrl: 'https://via.placeholder.com/300x450',
        description: 'Test series description',
        totalEpisodes: 5,
        seasons: 1,
        isTrending: false,
        isFeatured: false,
        createdAt: new Date()
      }
    ], 
    total: 1, 
    page: 1, 
    pages: 1 
  });
});

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Minimal server running on port ${PORT}`);
});