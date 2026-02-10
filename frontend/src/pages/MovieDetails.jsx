import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { 
  ArrowLeft, 
  Heart, 
  Download, 
  Calendar, 
  FileText,
  Check
} from 'lucide-react'
import { useMovie, useRelatedMovies, incrementDownloadCount } from '../hooks/useMovies'
import { useWatchlist } from '../contexts/WatchlistContext'
import MovieCard from '../components/MovieCard'
import MovieSkeleton from '../components/MovieSkeleton'
import ShareButtons from '../components/ShareButtons'
import EmptyState from '../components/EmptyState'
import MetaTags from '../components/MetaTags'

const MovieDetails = () => {
  const { id } = useParams()
  const { movie, loading, error } = useMovie(id)
  const { movies: relatedMovies, loading: relatedLoading } = useRelatedMovies(id)
  const { toggleWatchlist, isInWatchlist } = useWatchlist()
  const [posterLoaded, setPosterLoaded] = useState(false)
  const [downloadingQuality, setDownloadingQuality] = useState(null)

  const inWatchlist = isInWatchlist(id)

  const handleDownload = async (link) => {
    setDownloadingQuality(link.quality)
    
    // Increment download count
    await incrementDownloadCount(id)
    
    // Trigger direct download
    const a = document.createElement('a')
    a.href = link.url
    a.download = `${movie.title}_${link.quality}.mp4`
    a.style.display = 'none'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    
    setTimeout(() => setDownloadingQuality(null), 2000)
  }

  const getQualityColor = (quality) => {
    switch (quality) {
      case '480p': return 'bg-yellow-500 hover:bg-yellow-600'
      case '720p': return 'bg-green-500 hover:bg-green-600'
      case '1080p': return 'bg-blue-500 hover:bg-blue-600'
      case '4K': return 'bg-purple-500 hover:bg-purple-600'
      default: return 'bg-gray-500 hover:bg-gray-600'
    }
  }

  const getQualityBadgeColor = (quality) => {
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-32 mb-8" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <div className="aspect-[2/3] bg-gray-200 rounded-2xl" />
              </div>
              <div className="lg:col-span-2 space-y-4">
                <div className="h-10 bg-gray-200 rounded w-3/4" />
                <div className="h-6 bg-gray-200 rounded w-1/2" />
                <div className="h-32 bg-gray-200 rounded" />
                <div className="flex gap-4">
                  <div className="h-12 bg-gray-200 rounded w-32" />
                  <div className="h-12 bg-gray-200 rounded w-32" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <EmptyState
            type="movies"
            title="Movie Not Found"
            description="The movie you're looking for doesn't exist or has been removed."
            action={{
              label: 'Go Back Home',
              onClick: () => window.location.href = '/'
            }}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <MetaTags 
        title={`${movie.title} (${movie.year}) - ${movie.language} Movie`}
        description={movie.description}
        image={movie.posterUrl}
      />
      
      {/* Back Button */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Home</span>
          </Link>
        </div>
      </div>

      {/* Movie Details */}
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Poster */}
            <div className="lg:col-span-1">
              <div className="relative aspect-[2/3] rounded-2xl overflow-hidden shadow-xl bg-gray-100">
                {!posterLoaded && (
                  <div className="absolute inset-0 skeleton-shimmer" />
                )}
                <img
                  src={movie.posterUrl}
                  alt={movie.title}
                  className={`w-full h-full object-cover transition-opacity duration-300 ${
                    posterLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
                  onLoad={() => setPosterLoaded(true)}
                />
                
                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {movie.isTrending && (
                    <span className="badge bg-gradient-to-r from-orange-500 to-red-500 text-white">
                      Trending
                    </span>
                  )}
                  {movie.isFeatured && (
                    <span className="badge bg-secondary-500 text-white">
                      Featured
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Title & Actions */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                    {movie.title}
                  </h1>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`badge ${getLanguageColor(movie.language)}`}>
                      {movie.language}
                    </span>
                    <span className="badge bg-gray-100 text-gray-700">
                      {movie.category}
                    </span>
                    {movie.genre?.map((g, i) => (
                      <span key={i} className="badge bg-primary-50 text-primary-700">
                        {g}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => toggleWatchlist(movie)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                      inWatchlist
                        ? 'bg-red-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${inWatchlist ? 'fill-current' : ''}`} />
                    <span>{inWatchlist ? 'Saved' : 'Save'}</span>
                  </button>
                </div>
              </div>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>{movie.year}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <FileText className="w-4 h-4" />
                  <span>{movie.fileSize}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Download className="w-4 h-4" />
                  <span>{movie.downloadCount?.toLocaleString() || 0} downloads</span>
                </div>
              </div>

              {/* Description */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">About</h3>
                <p className="text-gray-600 leading-relaxed">
                  {movie.description}
                </p>
              </div>

              {/* Download Buttons */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Download Options</h3>
                <div className="space-y-4">
                  {/* Regular Download Links */}
                  {movie.downloadLinks && movie.downloadLinks.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-3">Quality Downloads</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {movie.downloadLinks.map((link, index) => (
                          <button
                            key={index}
                            onClick={() => handleDownload(link)}
                            disabled={downloadingQuality === link.quality}
                            className={`flex flex-col items-center justify-center p-4 rounded-xl text-white transition-all duration-200 ${getQualityColor(link.quality)} ${
                              downloadingQuality === link.quality ? 'opacity-75 cursor-wait' : 'hover:shadow-lg hover:scale-105'
                            }`}
                          >
                            {downloadingQuality === link.quality ? (
                              <>
                                <Check className="w-6 h-6 mb-1" />
                                <span className="font-semibold">{link.quality}</span>
                                <span className="text-xs opacity-75">Starting...</span>
                              </>
                            ) : (
                              <>
                                <Download className="w-6 h-6 mb-1" />
                                <span className="font-semibold">{link.quality}</span>
                                <span className="text-xs opacity-75">Click to Download</span>
                              </>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Custom Download Links */}
                  {movie.customDownloadLinks && movie.customDownloadLinks.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-3">Custom Downloads</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {movie.customDownloadLinks.map((link, index) => (
                          <button
                            key={index}
                            onClick={() => {
                              const a = document.createElement('a')
                              a.href = link.url
                              a.target = '_blank'
                              a.rel = 'noopener noreferrer'
                              document.body.appendChild(a)
                              a.click()
                              document.body.removeChild(a)
                            }}
                            className={`flex flex-col items-center justify-center p-4 rounded-xl text-white transition-all duration-200 ${getQualityColor(link.quality)} hover:shadow-lg hover:scale-105`}
                          >
                            <Download className="w-6 h-6 mb-1" />
                            <span className="font-semibold">{link.quality}</span>
                            <span className="text-xs opacity-75">Custom Link</span>
                          </button>
                        ))}
                      </div>
                      <p className="text-xs text-gray-500 mt-2 text-center">
                        Custom download links
                      </p>
                    </div>
                  )}

                  {/* Separate MP4 Link */}
                  {movie.separateMp4Link && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-3">Direct MP4 Download</h4>
                      <button
                        onClick={() => {
                          const a = document.createElement('a')
                          a.href = movie.separateMp4Link
                          a.download = `${movie.title}_${movie.separateMp4Quality || '720p'}.mp4`
                          a.style.display = 'none'
                          document.body.appendChild(a)
                          a.click()
                          document.body.removeChild(a)
                        }}
                        className={`w-full flex flex-col items-center justify-center p-4 rounded-xl text-white transition-all duration-200 hover:shadow-lg hover:scale-105 ${getQualityColor(movie.separateMp4Quality || '720p')}`}
                      >
                        <Download className="w-6 h-6 mb-1" />
                        <span className="font-semibold">Direct MP4</span>
                        <span className="text-xs opacity-75">{movie.separateMp4Quality || '720p'} Quality</span>
                      </button>
                      <p className="text-xs text-gray-500 mt-2 text-center">
                        Direct MP4 file - {movie.separateMp4Quality || '720p'} quality
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Share */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <ShareButtons movie={movie} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Movies */}
      {relatedMovies.length > 0 && (
        <div className="py-8 border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Movies</h2>
            {relatedLoading ? (
              <MovieSkeleton count={6} />
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 lg:gap-6">
                {relatedMovies.map((relatedMovie) => (
                  <MovieCard key={relatedMovie._id} movie={relatedMovie} />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default MovieDetails
