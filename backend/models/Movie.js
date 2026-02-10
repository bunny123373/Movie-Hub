const mongoose = require('mongoose');

const downloadLinkSchema = new mongoose.Schema({
  quality: {
    type: String,
    required: true,
    enum: ['480p', '720p', '1080p', '4K']
  },
  url: {
    type: String,
    required: false
  }
});

const episodeSchema = new mongoose.Schema({
  episodeNumber: {
    type: Number,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  downloadLinks: [downloadLinkSchema],
  duration: {
    type: String, // e.g., "45 min"
    required: false
  },
  airDate: {
    type: Date,
    required: false
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  language: {
    type: String,
    required: true,
    enum: ['Telugu', 'Tamil', 'Hindi', 'English', 'Kannada', 'Malayalam', 'Dubbed']
  },
  category: {
    type: String,
    required: true,
    enum: ['Movie', 'TV Series', 'Dubbed']
  },
  genre: [{
    type: String,
    enum: ['Action', 'Comedy', 'Romance', 'Thriller', 'Horror', 'Drama', 'Sci-Fi', 'Adventure', 'Crime']
  }],
  year: {
    type: Number,
    required: true
  },
  posterUrl: {
    type: String,
    required: true
  },
  downloadLinks: [downloadLinkSchema],
  customDownloadLinks: [downloadLinkSchema],
  separateMp4Link: {
    type: String,
    required: false
  },
  separateMp4Quality: {
    type: String,
    enum: ['480p', '720p', '1080p', '4K'],
    required: false
  },
  description: {
    type: String,
    required: true
  },
  // Series-specific fields
  totalEpisodes: {
    type: Number,
    required: false
  },
  seasons: {
    type: Number,
    required: false,
    default: 1
  },
  episodes: [episodeSchema],
  // For series, this indicates the current season
  currentSeason: {
    type: Number,
    required: false,
    default: 1
  },
  fileSize: {
    type: String,
    required: function() {
      return this.category === 'Movie'; // Only required for movies
    },
    validate: {
      validator: function(v) {
        // If category is Movie, fileSize is required
        if (this.category === 'Movie') {
          return v && v.trim().length > 0;
        }
        // For series, fileSize can be empty or undefined
        return true;
      },
      message: 'File size is required for movies'
    }
  },
  isTrending: {
    type: Boolean,
    default: false
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  downloadCount: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Pre-save middleware to clean up fileSize for series
movieSchema.pre('save', function(next) {
  // Remove fileSize for series to avoid any validation issues
  if (this.category !== 'Movie') {
    this.fileSize = undefined;
  }
  
  next();
});

// Pre-findOneAndUpdate middleware for update operations
movieSchema.pre('findOneAndUpdate', function(next) {
  const update = this.getUpdate();
  
  // Handle series updates - remove fileSize completely
  if (update.category === 'Web Series' || update.category === 'TV Series') {
    if (update.$set) {
      delete update.$set.fileSize;
    } else {
      update.fileSize = undefined;
    }
  }
  
  next();
});

// Create indexes for better query performance
movieSchema.index({ language: 1 });
movieSchema.index({ category: 1 });
movieSchema.index({ genre: 1 });
movieSchema.index({ year: 1 });
movieSchema.index({ isTrending: 1 });
movieSchema.index({ isActive: 1 });

module.exports = mongoose.model('Movie', movieSchema);
