const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie');

// GET /api/categories - Get all categories and filters data
router.get('/', async (req, res) => {
  try {
    const languages = await Movie.distinct('language', { isActive: true });
    const categories = await Movie.distinct('category', { isActive: true });
    const genres = await Movie.distinct('genre', { isActive: true });
    const years = await Movie.distinct('year', { isActive: true });

    res.json({
      languages: languages.sort(),
      categories: categories.sort(),
      genres: genres.sort(),
      years: years.sort((a, b) => b - a)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/categories/stats - Get dashboard stats
router.get('/stats', async (req, res) => {
  try {
    const totalMovies = await Movie.countDocuments({ isActive: true });
    const trendingMovies = await Movie.countDocuments({ isActive: true, isTrending: true });
    const featuredMovies = await Movie.countDocuments({ isActive: true, isFeatured: true });
    
    const downloadStats = await Movie.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: null, totalDownloads: { $sum: '$downloadCount' } } }
    ]);

    const totalDownloads = downloadStats.length > 0 ? downloadStats[0].totalDownloads : 0;

    res.json({
      totalMovies,
      trendingMovies,
      featuredMovies,
      totalDownloads
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
