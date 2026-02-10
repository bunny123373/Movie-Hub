const mongoose = require('mongoose');
const Movie = require('./models/Movie');

async function createTestSeries() {
  try {
    await mongoose.connect('mongodb://localhost:27017/movie-download-db');
    console.log('MongoDB connected');
    
    const testSeries = new Movie({
      title: 'Test Web Series',
      language: 'English',
      category: 'Web Series',
      genre: ['Action', 'Drama'],
      year: 2024,
      posterUrl: 'https://example.com/poster.jpg',
      description: 'A test web series for demonstration',
      totalEpisodes: 5,
      seasons: 1,
      currentSeason: 1,
      episodes: [
        {
          episodeNumber: 1,
          title: 'Pilot Episode',
          downloadLinks: [
            { quality: '720p', url: 'https://example.com/ep1.mp4' }
          ],
          duration: '45 min',
          isActive: true
        }
      ],
      isTrending: false,
      isFeatured: false,
      isActive: true
    });
    
    const savedSeries = await testSeries.save();
    console.log('Test series created:', savedSeries.title);
    
    await mongoose.connection.close();
    console.log('Connection closed');
  } catch (error) {
    console.error('Error creating test series:', error);
  }
}

createTestSeries();