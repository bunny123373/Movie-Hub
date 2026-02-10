import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart, Download, Play, Eye, Tv, Calendar } from 'lucide-react'
import { useWatchlist } from '../contexts/WatchlistContext'

const SeriesCard = ({ series, showQuality = true }) => {
  const { toggleWatchlist, isInWatchlist } = useWatchlist()
  const [imageLoaded, setImageLoaded] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const inWatchlist = isInWatchlist(series._id)

  const handleWatchlistClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    toggleWatchlist(series)
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

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Web Series': return 'bg-indigo-100 text-indigo-700'
      case 'TV Series': return 'bg-cyan-100 text-cyan-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <Link
      to={`/series/${series._id}`}
      className="group block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="card card-hover relative overflow-hidden">
        {/* Poster Image */}
        <div className="relative aspect-[2/3] overflow-hidden bg-gray-100">
          {!imageLoaded && (
            <div className="absolute inset-0 skeleton-shimmer" />
          )}
          <img
            src={series.posterUrl}
            alt={series.title}
            className={`w-full h-full object-cover transition-transform duration-500 ${
              isHovered ? 'scale-110' : 'scale-100'
            } ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setImageLoaded(true)}
          />
          
          {/* Overlay on Hover */}
          <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}>
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <div className="flex items-center justify-between">
                <button className="flex items-center space-x-1 bg-white/20 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg hover:bg-white/30 transition-colors">
                  <Eye className="w-4 h-4" />
                  <span className="text-sm font-medium">View Episodes</span>
                </button>
              </div>
            </div>
          </div>

          {/* Watchlist Button */}
          <button
            onClick={handleWatchlistClick}
            className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-200 ${
              inWatchlist
                ? 'bg-red-500 text-white shadow-lg'
                : 'bg-white/90 text-gray-600 hover:bg-white hover:text-red-500'
            }`}
          >
            <Heart className={`w-4 h-4 ${inWatchlist ? 'fill-current' : ''}`} />
          </button>

          {/* Featured Badge */}
          {series.isFeatured && (
            <div className="absolute top-3 left-3">
              <span className="badge bg-secondary-500 text-white">
                Featured
              </span>
            </div>
          )}

          {/* Trending Badge */}
          {series.isTrending && (
            <div className="absolute top-3 left-3">
              <span className="badge bg-gradient-to-r from-orange-500 to-red-500 text-white">
                Trending
              </span>
            </div>
          )}

          {/* Series Type Badge */}
          <div className="absolute bottom-3 left-3">
            <span className={`badge text-xs ${getCategoryColor(series.category)}`}>
              <Tv className="w-3 h-3 mr-1" />
              {series.category}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Title */}
          <h3 className="font-semibold text-gray-900 line-clamp-1 group-hover:text-primary-600 transition-colors">
            {series.title}
          </h3>

          {/* Meta Info */}
          <div className="flex items-center space-x-2 mt-2">
            <span className={`badge text-xs ${getLanguageColor(series.language)}`}>
              {series.language}
            </span>
            <span className="text-xs text-gray-500">{series.year}</span>
          </div>

          {/* Series Info */}
          <div className="flex items-center justify-between mt-3 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <Tv className="w-4 h-4" />
              <span>{series.totalEpisodes || 0} Episodes</span>
            </div>
            {series.seasons > 1 && (
              <span>{series.seasons} Seasons</span>
            )}
          </div>

          {/* Genre Tags */}
          {series.genre && series.genre.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {series.genre.slice(0, 2).map((genre, index) => (
                <span
                  key={index}
                  className="badge text-xs bg-gray-100 text-gray-600"
                >
                  {genre}
                </span>
              ))}
              {series.genre.length > 2 && (
                <span className="badge text-xs bg-gray-100 text-gray-600">
                  +{series.genre.length - 2}
                </span>
              )}
            </div>
          )}

          {/* Download Count */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center space-x-1 text-sm text-gray-500">
              <Download className="w-4 h-4" />
              <span>{series.downloadCount?.toLocaleString() || 0}</span>
            </div>
            <div className="flex items-center space-x-1 text-sm text-gray-500">
              <Calendar className="w-4 h-4" />
              <span>Updated</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default SeriesCard