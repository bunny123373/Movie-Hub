const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie');
const adminAuth = require('../middleware/adminAuth');
const { convertGoogleDriveLink } = require('../utils/googleDrive');

// GET /api/movies - Get all movies with filters
router.get('/', async (req, res) => {
  try {
    const { 
      language, 
      category, 
      genre, 
      year, 
      isTrending, 
      isFeatured,
      search,
      limit = 50,
      page = 1 
    } = req.query;

    const query = { isActive: true };

    if (language) query.language = language;
    if (category) query.category = category;
    if (genre) query.genre = { $in: [genre] };
    if (year) query.year = parseInt(year);
    if (isTrending === 'true') query.isTrending = true;
    if (isFeatured === 'true') query.isFeatured = true;
    
    console.log('Movies API - Query parameters:', req.query);
    console.log('Movies API - MongoDB query:', query);
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Optimize query with lean() for better performance
    const movies = await Movie.find(query)
      .select('title language category genre year posterUrl description fileSize downloadCount isTrending isFeatured createdAt downloadLinks customDownloadLinks')
      .lean() // Faster - returns plain JavaScript objects
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Math.min(parseInt(limit), 50)); // Reduced limit for faster loading

    const total = await Movie.countDocuments(query);

    console.log(`Movies API - Found ${movies.length} movies for query:`, query);
    console.log('Movies API - Sample movies:', movies.slice(0, 3).map(m => ({ title: m.title, language: m.language })));

    res.json({
      movies,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit))
    });
  } catch (error) {
    console.error('Error fetching movies:', error);
    console.error('Query parameters:', req.query);
    res.status(500).json({ message: error.message });
  }
});

// GET /api/movies/search-suggestions - Get search suggestions
router.get('/search-suggestions', async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.length < 2) {
      return res.json([]);
    }

    const suggestions = await Movie.find({
      isActive: true,
      $or: [
        { title: { $regex: q, $options: 'i' } }
      ]
    })
    .select('title posterUrl language year')
    .limit(8);

    res.json(suggestions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/movies/related/:id - Get related movies
router.get('/related/:id', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    const relatedMovies = await Movie.find({
      isActive: true,
      _id: { $ne: movie._id },
      $or: [
        { language: movie.language },
        { genre: { $in: movie.genre } }
      ]
    })
    .limit(8);

    res.json(relatedMovies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/movies/series - Get all series (Public)
router.get('/series', async (req, res) => {
  try {
    console.log('Fetching series with params:', req.query);
    const { language, genre, year, limit = 50, page = 1 } = req.query;

    const query = { 
      isActive: true,
      category: { $in: ['Web Series', 'TV Series'] }
    };

    if (language) query.language = language;
    if (genre) query.genre = { $in: [genre] };
    if (year) query.year = parseInt(year);

    const skip = (parseInt(page) - 1) * parseInt(limit);

    console.log('Series query:', query);
    const series = await Movie.find(query)
      .select('title language category genre year posterUrl description totalEpisodes seasons isTrending isFeatured createdAt')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Math.min(parseInt(limit), 100));

    const total = await Movie.countDocuments(query);

    console.log('Found series:', series.length);
    res.json({
      series,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit))
    });
  } catch (error) {
    console.error('Error fetching series:', error);
    res.status(500).json({ message: error.message });
  }
});

// GET /api/movies/:id - Get single movie
router.get('/:id', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    res.json(movie);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/movies - Create new movie (Admin only)
router.post('/', adminAuth, async (req, res) => {
  try {
    console.log('Received movie data:', JSON.stringify(req.body, null, 2));
    let movieData = { ...req.body };
    
    // Ensure language doesn't conflict with MongoDB text index
    if (movieData.language) {
      delete movieData.language_override; // Remove if exists
    }
    
    // Handle series vs movie specific fields
    const isSeries = movieData.category === 'Web Series' || movieData.category === 'TV Series';
    
    if (isSeries) {
      // For series, remove movie-specific fields that aren't needed
      delete movieData.fileSize;
      
      // Convert Google Drive links for episodes
      if (movieData.episodes && movieData.episodes.length > 0) {
        movieData.episodes = movieData.episodes.map(episode => ({
          ...episode,
          downloadLinks: episode.downloadLinks.map(link => ({
            ...link,
            url: convertGoogleDriveLink(link.url)
          }))
        }));
      }
    } else {
      // For movies, remove series-specific fields
      delete movieData.episodes;
      delete movieData.totalEpisodes;
      delete movieData.seasons;
      delete movieData.currentSeason;
      
      // Convert Google Drive links for movies
      if (movieData.downloadLinks && movieData.downloadLinks.length > 0) {
        movieData.downloadLinks = movieData.downloadLinks.map(link => ({
          ...link,
          url: convertGoogleDriveLink(link.url)
        }));
      }
    }

    console.log('Final movie data before save:', JSON.stringify(movieData, null, 2));
    const movie = new Movie(movieData);
    const savedMovie = await movie.save();
    console.log('Content saved successfully:', savedMovie._id, 'Category:', savedMovie.category);
    res.status(201).json(savedMovie);
  } catch (error) {
    console.error('Error creating content:', error);
    console.error('Validation errors:', Object.keys(error.errors || {}));
    res.status(400).json({ message: error.message });
  }
});

// PUT /api/movies/:id - Update movie/series (Admin only)
router.put('/:id', adminAuth, async (req, res) => {
  try {
    let movieData = { ...req.body };
    
    // Handle series vs movie specific fields
    const isSeries = movieData.category === 'Web Series' || movieData.category === 'TV Series';
    
    if (isSeries) {
      // For series, remove movie-specific fields that aren't needed
      delete movieData.fileSize;
      
      // Convert Google Drive links for episodes if provided
      if (movieData.episodes && movieData.episodes.length > 0) {
        movieData.episodes = movieData.episodes.map(episode => ({
          ...episode,
          downloadLinks: episode.downloadLinks.map(link => ({
            ...link,
            url: convertGoogleDriveLink(link.url)
          }))
        }));
      }
    } else {
      // For movies, remove series-specific fields
      delete movieData.episodes;
      delete movieData.totalEpisodes;
      delete movieData.seasons;
      delete movieData.currentSeason;
      
      // Convert Google Drive links for movies
      if (movieData.downloadLinks && movieData.downloadLinks.length > 0) {
        movieData.downloadLinks = movieData.downloadLinks.map(link => ({
          ...link,
          url: convertGoogleDriveLink(link.url)
        }));
      }
    }

    const movie = await Movie.findByIdAndUpdate(
      req.params.id,
      movieData,
      { new: true, runValidators: true }
    );
    
    if (!movie) {
      return res.status(404).json({ message: 'Content not found' });
    }

    res.json(movie);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /api/movies/:id - Delete movie (Admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);
    
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    res.json({ message: 'Movie deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/movies/:id/download - Increment download count
router.post('/:id/download', async (req, res) => {
  try {
    const movie = await Movie.findByIdAndUpdate(
      req.params.id,
      { $inc: { downloadCount: 1 } },
      { new: true }
    );
    
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    res.json({ downloadCount: movie.downloadCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PATCH /api/movies/:id/toggle-active - Toggle movie active status (Admin only)
router.patch('/:id/toggle-active', adminAuth, async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    movie.isActive = !movie.isActive;
    await movie.save();

    res.json(movie);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PATCH /api/movies/:id/toggle-trending - Toggle trending status (Admin only)
router.patch('/:id/toggle-trending', adminAuth, async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    movie.isTrending = !movie.isTrending;
    await movie.save();

    res.json(movie);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PATCH /api/movies/:id/toggle-featured - Toggle featured status (Admin only)
router.patch('/:id/toggle-featured', adminAuth, async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    movie.isFeatured = !movie.isFeatured;
    await movie.save();

    res.json(movie);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/movies/:id/episodes - Get episodes for a series (Public)
router.get('/:id/episodes', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id).select('episodes title category');
    
    if (!movie) {
      return res.status(404).json({ message: 'Series not found' });
    }

    if (movie.category !== 'Web Series' && movie.category !== 'TV Series') {
      return res.status(400).json({ message: 'This content is not a series' });
    }

    // Only return active episodes
    const activeEpisodes = movie.episodes.filter(episode => episode.isActive);
    
    res.json({
      seriesTitle: movie.title,
      episodes: activeEpisodes.sort((a, b) => a.episodeNumber - b.episodeNumber)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/movies/:id/episodes - Add episode to series (Admin only)
router.post('/:id/episodes', adminAuth, async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    
    if (!movie) {
      return res.status(404).json({ message: 'Series not found' });
    }

    if (movie.category !== 'Web Series' && movie.category !== 'TV Series') {
      return res.status(400).json({ message: 'This content is not a series' });
    }

    const { episodeNumber, title, downloadLinks, duration, airDate } = req.body;

    // Validate
    if (!episodeNumber || !title || !downloadLinks || downloadLinks.length === 0) {
      return res.status(400).json({ message: 'Episode number, title, and at least one download link are required' });
    }

    // Convert Google Drive links
    const convertedDownloadLinks = downloadLinks.map(link => ({
      ...link,
      url: convertGoogleDriveLink(link.url)
    }));

    // Check if episode number already exists
    const existingEpisode = movie.episodes.find(ep => ep.episodeNumber === episodeNumber);
    if (existingEpisode) {
      return res.status(400).json({ message: `Episode ${episodeNumber} already exists` });
    }

    const newEpisode = {
      episodeNumber,
      title,
      downloadLinks: convertedDownloadLinks,
      duration: duration || '',
      airDate: airDate ? new Date(airDate) : undefined,
      isActive: true
    };

    movie.episodes.push(newEpisode);
    await movie.save();

    res.status(201).json(newEpisode);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PATCH /api/movies/:id/episodes/:episodeId - Update episode (Admin only)
router.patch('/:id/episodes/:episodeId', adminAuth, async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    
    if (!movie) {
      return res.status(404).json({ message: 'Series not found' });
    }

    const episode = movie.episodes.id(req.params.episodeId);
    if (!episode) {
      return res.status(404).json({ message: 'Episode not found' });
    }

    const { title, downloadLinks, duration, airDate, isActive } = req.body;

    if (title) episode.title = title;
    if (downloadLinks) {
      episode.downloadLinks = downloadLinks.map(link => ({
        ...link,
        url: convertGoogleDriveLink(link.url)
      }));
    }
    if (duration !== undefined) episode.duration = duration;
    if (airDate !== undefined) episode.airDate = airDate ? new Date(airDate) : undefined;
    if (isActive !== undefined) episode.isActive = isActive;

    await movie.save();

    res.json(episode);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE /api/movies/:id/episodes/:episodeId - Delete episode (Admin only)
router.delete('/:id/episodes/:episodeId', adminAuth, async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    
    if (!movie) {
      return res.status(404).json({ message: 'Series not found' });
    }

    movie.episodes.pull(req.params.episodeId);
    await movie.save();

    res.json({ message: 'Episode deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
