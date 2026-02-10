const mongoose = require('mongoose');
const Movie = require('./models/Movie');

async function testConnection() {
  try {
    await mongoose.connect('mongodb://localhost:27017/movie-download-db');
    console.log('MongoDB connected successfully');
    
    // Test basic query
    const count = await Movie.countDocuments();
    console.log(`Total movies in database: ${count}`);
    
    // Test series query
    const seriesCount = await Movie.countDocuments({ 
      category: { $in: ['Web Series', 'TV Series'] },
      isActive: true 
    });
    console.log(`Total series in database: ${seriesCount}`);
    
    // Get all series if any
    const series = await Movie.find({ 
      category: { $in: ['Web Series', 'TV Series'] },
      isActive: true 
    }).limit(5);
    
    console.log('Sample series:', series.map(s => ({ title: s.title, category: s.category })));
    
    await mongoose.connection.close();
    console.log('Connection closed');
  } catch (error) {
    console.error('Database connection error:', error);
  }
}

testConnection();