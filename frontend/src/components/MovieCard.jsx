import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart, Download, Play, Eye } from 'lucide-react'
import { useWatchlist } from '../contexts/WatchlistContext'

const MovieCard = ({ movie, showQuality = true, compact = false }) => {
  const { toggleWatchlist, isInWatchlist } = useWatchlist()
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)

  const inWatchlist = isInWatchlist(movie._id)

  const handleWatchlistClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    toggleWatchlist(movie)
  }

  const getQualityColor = (quality) => {
    switch (quality) {
      case '480p': return 'bg-yellow-100 text-yellow-700'
      case '720p': return 'bg-green-100 text-green-700'
      case '1080p': return 'bg-blue-100 text-blue-700'
      case '4K': return 'bg-purple-100 text-purple-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getLanguageColor = (language) => {
    switch (language) {
      case 'Telugu': return 'bg-orange-100 text-orange-700'
      case 'Tamil': return 'bg-red-100 text-red-700'
      case 'Hindi': return 'bg-green-100 text-green-700'
      case 'English': return 'bg-blue-100 text-blue-700'
      case 'Dubbed': return 'bg-purple-100 text-purple-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  if (compact) {
    return (
      <Link
        to={`/movie/${movie._id}`}
        className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg transition-colors"
      >
        <div className="w-12 h-16 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
          <img
            src={movie.posterUrl}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-gray-900 line-clamp-1">
            {movie.title}
          </h4>
          <div className="flex items-center space-x-2 mt-1">
            <span className={`badge text-xs ${getLanguageColor(movie.language)}`}>
              {movie.language}
            </span>
            <span className="text-xs text-gray-500">{movie.year}</span>
          </div>
        </div>
      </Link>
    )
  }

  const isSeries = movie.category === 'Web Series' || movie.category === 'TV Series'
  const detailPath = isSeries ? `/series/${movie._id}` : `/movie/${movie._id}`

  if (compact) {
    return (
      <Link
        to={detailPath}
        className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg transition-colors"
      >
        <div className="w-12 h-16 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
          <img
            src={movie.posterUrl}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-gray-900 line-clamp-1">
            {movie.title}
          </h4>
          <div className="flex items-center space-x-2 mt-1">
            <span className={`badge text-xs ${getLanguageColor(movie.language)}`}>
              {movie.language}
            </span>
            <span className="text-xs text-gray-500">{movie.year}</span>
            {isSeries && (
              <span className="badge text-xs bg-indigo-100 text-indigo-700">
                {movie.totalEpisodes || 0} Ep
              </span>
            )}
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link
      to={detailPath}
      className="group block mobile-optimized"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="card card-hover relative overflow-hidden">
        {/* Poster Image */}
        <div className="relative aspect-[2/3] overflow-hidden bg-gray-100">
          {imageLoading && !imageError && (
            <div className="absolute inset-0 skeleton-shimmer" />
          )}
          {imageError && (
            <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
              <div className="text-center">
                <div className="w-12 h-12 bg-gray-300 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="text-xs text-gray-500">No Image</span>
              </div>
            </div>
          )}
          <img
            src={movie.posterUrl}
            alt={movie.title}
            loading="lazy"
            className={`w-full h-full object-cover gpu-accelerated fast-transition ${
              isHovered ? 'scale-110' : 'scale-100'
            } ${imageError ? 'opacity-0' : imageLoaded ? 'opacity-100' : 'opacity-75'}`}
            onLoad={() => {
              setImageLoaded(true)
              setImageLoading(false)
            }}
            onError={() => {
              setImageError(true)
              setImageLoading(false)
            }}
          />
          
          {/* Overlay on Hover */}
          <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}>
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <div className="flex items-center justify-between">
                <button className="flex items-center space-x-1 bg-white/20 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg hover:bg-white/30 transition-colors touch-target">
                  <Eye className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {isSeries ? 'View Episodes' : 'View Details'}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Watchlist Button */}
          <button
            onClick={handleWatchlistClick}
            className={`absolute top-3 right-3 p-2 rounded-full fast-transition touch-target gpu-accelerated ${
              inWatchlist
                ? 'bg-red-500 text-white shadow-lg'
                : 'bg-white/90 text-gray-600 hover:bg-white hover:text-red-500'
            }`}
          >
            <Heart className={`w-4 h-4 ${inWatchlist ? 'fill-current' : ''}`} />
          </button>

          {/* Featured Badge */}
          {movie.isFeatured && (
            <div className="absolute top-3 left-3">
              <span className="badge bg-secondary-500 text-white">
                Featured
              </span>
            </div>
          )}

          {/* Trending Badge */}
          {movie.isTrending && (
            <div className="absolute top-3 left-3">
              <span className="badge bg-gradient-to-r from-orange-500 to-red-500 text-white">
                Trending
              </span>
            </div>
          )}

          {/* Series Type Badge */}
          {isSeries && (
            <div className="absolute bottom-3 left-3">
              <span className="badge text-xs bg-indigo-600 text-white">
                {movie.category}
              </span>
            </div>
          )}

          
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Title */}
          <h3 className="font-semibold text-gray-900 line-clamp-1 group-hover:text-primary-600 transition-colors">
            {movie.title}
          </h3>

          {/* Meta Info */}
          <div className="flex items-center space-x-2 mt-2">
            <span className={`badge text-xs ${getLanguageColor(movie.language)}`}>
              {movie.language}
            </span>
            <span className="text-xs text-gray-500">{movie.year}</span>
            {isSeries && movie.totalEpisodes && (
              <span className="badge text-xs bg-indigo-100 text-indigo-700">
                {movie.totalEpisodes} Episodes
              </span>
            )}
          </div>

          {/* Quality Tags (only for movies) */}
          {showQuality && !isSeries && movie.downloadLinks && movie.downloadLinks.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {movie.downloadLinks.slice(0, 3).map((link, index) => (
                <span
                  key={index}
                  className={`badge text-xs ${getQualityColor(link.quality)}`}
                >
                  {link.quality}
                </span>
              ))}
              {movie.downloadLinks.length > 3 && (
                <span className="badge text-xs bg-gray-100 text-gray-600">
                  +{movie.downloadLinks.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Series Info (for series) */}
          {isSeries && (
            <div className="text-sm text-gray-600 mt-3">
              {movie.seasons > 1 && (
                <span>{movie.seasons} Seasons • </span>
              )}
              <span>{movie.totalEpisodes || 0} Episodes</span>
            </div>
          )}

          {/* Download Count */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center space-x-1 text-sm text-gray-500">
              <Download className="w-4 h-4" />
              <span>{movie.downloadCount?.toLocaleString() || 0}</span>
            </div>
            {!isSeries && (
              <div className="text-sm text-gray-500">{movie.fileSize}</div>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}

export default MovieCard
