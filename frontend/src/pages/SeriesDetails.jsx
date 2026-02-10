import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { 
  ArrowLeft, 
  Heart, 
  Download, 
  Calendar, 
  FileText,
  Check,
  Tv,
  Clock,
  Eye,
  Grid,
  List,
  ChevronDown,
  BarChart3
} from 'lucide-react'
import { useSeriesDetails, useRelatedMovies } from '../hooks/useMovies'
import { useWatchlist } from '../contexts/WatchlistContext'
import MovieCard from '../components/MovieCard'
import MovieSkeleton from '../components/MovieSkeleton'
import ShareButtons from '../components/ShareButtons'
import EmptyState from '../components/EmptyState'
import MetaTags from '../components/MetaTags'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const SeriesDetails = () => {
  const { id } = useParams()
  const { series, loading, error } = useSeriesDetails(id)
  const { movies: relatedMovies, loading: relatedLoading } = useRelatedMovies(id)
  const { toggleWatchlist, isInWatchlist } = useWatchlist()
  const [posterLoaded, setPosterLoaded] = useState(false)
  const [episodes, setEpisodes] = useState([])
  const [episodesLoading, setEpisodesLoading] = useState(true)
  const [episodesError, setEpisodesError] = useState(null)
  const [downloadingEpisode, setDownloadingEpisode] = useState(null)
  const [renderError, setRenderError] = useState(null)
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'
  const [selectedSeason, setSelectedSeason] = useState(1)
  const [expandedEpisode, setExpandedEpisode] = useState(null)

  // Update selectedSeason when series data loads
  useEffect(() => {
    if (series && series.currentSeason) {
      setSelectedSeason(series.currentSeason)
    }
  }, [series])

  // Add early debugging
  console.log('SeriesDetails - id:', id)
  console.log('SeriesDetails - series:', series)
  console.log('SeriesDetails - loading:', loading)
  console.log('SeriesDetails - error:', error)

  const inWatchlist = isInWatchlist(id)

  useEffect(() => {
    const fetchEpisodes = async () => {
      if (!id) return
      
      try {
        setEpisodesLoading(true)
        const response = await axios.get(`${API_URL}/movies/${id}/episodes`)
        setEpisodes(response.data.episodes)
        setEpisodesError(null)
      } catch (err) {
        console.error('Failed to fetch episodes:', err)
        setEpisodesError(err.response?.data?.message || 'Failed to fetch episodes')
      } finally {
        setEpisodesLoading(false)
      }
    }

    fetchEpisodes()
  }, [id])

  const handleDownload = async (episodeNumber, link) => {
    setDownloadingEpisode(`${episodeNumber}-${link.quality}`)
    
    try {
      // Increment download count for the series
      await axios.post(`${API_URL}/movies/${id}/download`)
      
      // Trigger download
      const a = document.createElement('a')
      a.href = link.url
      a.download = `${series.title}_S${series.currentSeason || 1}E${episodeNumber}_${link.quality}.mp4`
      a.style.display = 'none'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    } catch (err) {
      console.error('Failed to increment download count:', err)
    }
    
    setTimeout(() => setDownloadingEpisode(null), 2000)
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <MovieSkeleton />
        </div>
      </div>
    )
  }

  if (error) {
    console.error('SeriesDetails - Error state:', error)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg font-medium">Error: {error}</p>
          <Link to="/" className="text-primary-600 hover:text-primary-700 mt-4 inline-block">
            ← Back to Home
          </Link>
        </div>
      </div>
    )
  }

  if (!series) {
    console.error('SeriesDetails - No series data')
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg font-medium">Series not found</p>
          <Link to="/" className="text-primary-600 hover:text-primary-700 mt-4 inline-block">
            ← Back to Home
          </Link>
        </div>
      </div>
    )
  }

  if (series.category !== 'Web Series' && series.category !== 'TV Series') {
    console.error('SeriesDetails - Not a series:', series.category)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg font-medium">This is not a series (Category: {series.category})</p>
          <Link to={`/movie/${id}`} className="text-primary-600 hover:text-primary-700 mt-4 inline-block">
            View as Movie
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <MetaTags 
        title={`${series.title} - ${series.category} | MovieHub`}
        description={series.description}
        image={series.posterUrl}
      />

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link
              to="/"
              className="flex items-center space-x-3 text-gray-700 hover:text-primary-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Home</span>
            </Link>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => toggleWatchlist(series)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  inWatchlist
                    ? 'bg-red-50 text-red-600 border border-red-200'
                    : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
                }`}
              >
                <Heart className={`w-5 h-5 ${inWatchlist ? 'fill-current' : ''}`} />
                <span>{inWatchlist ? 'In Watchlist' : 'Add to Watchlist'}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Series Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="relative h-72 lg:h-80 bg-gradient-to-br from-primary-600 to-secondary-700">
                {!posterLoaded && (
                  <div className="absolute inset-0 skeleton-shimmer" />
                )}
                <img
                  src={series.posterUrl || 'https://via.placeholder.com/400x600'}
                  alt={series.title}
                  className={`w-full h-full object-cover transition-opacity duration-500 ${
                    posterLoaded ? 'opacity-30' : 'opacity-0'
                  }`}
                  onLoad={() => setPosterLoaded(true)}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/400x600'
                    setPosterLoaded(true)
                  }}
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                  <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h1 className="text-2xl lg:text-3xl font-bold text-white mb-3">
                          {series.title || 'Untitled Series'}
                        </h1>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-white/90">
                          <span className={`badge ${getCategoryColor(series.category)}`}>
                            <Tv className="w-3 h-3 mr-1" />
                            {series.category || 'Unknown'}
                          </span>
                          <span className={`badge ${getLanguageColor(series.language)}`}>
                            {series.language || 'Unknown'}
                          </span>
                          <span className="text-white/80">{series.year || 'Unknown'}</span>
                          {series.totalEpisodes && (
                            <span className="text-white/80">
                              {series.totalEpisodes} Episodes
                            </span>
                          )}
                          {series.seasons > 1 && (
                            <span className="text-white/80">
                              {series.seasons} Seasons
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {series.isTrending && (
                        <span className="badge bg-gradient-to-r from-orange-500 to-red-500 text-white">
                          Trending
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 lg:p-8">
                {/* Description */}
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">Description</h2>
                  <p className="text-gray-600 leading-relaxed">
                    {series.description || 'No description available.'}
                  </p>
                </div>

                {/* Genre Tags */}
                {series.genre && series.genre.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Genres</h3>
                    <div className="flex flex-wrap gap-2">
                      {series.genre.map((genre, index) => (
                        <span
                          key={index}
                          className="badge bg-gray-100 text-gray-700"
                        >
                          {genre}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Enhanced Episodes Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Episodes Header */}
              <div className="bg-gradient-to-r from-primary-50 to-secondary-50 p-6 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Episodes</h2>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Tv className="w-4 h-4" />
                        <span>{episodes.length} Episodes</span>
                      </div>
                      {series.seasons > 1 && (
                        <div className="flex items-center space-x-1">
                          <BarChart3 className="w-4 h-4" />
                          <span>{series.seasons} Seasons</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* View Controls */}
                  <div className="flex items-center space-x-2">
                    {series.seasons > 1 && (
                      <div className="relative">
                        <select
                          value={selectedSeason}
                          onChange={(e) => setSelectedSeason(parseInt(e.target.value))}
                          className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm font-medium focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        >
                          {[...Array(series.seasons)].map((_, i) => (
                            <option key={i + 1} value={i + 1}>
                              Season {i + 1}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                      </div>
                    )}
                    
                    <div className="flex items-center bg-white border border-gray-300 rounded-lg">
                      <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded-l-lg transition-colors ${
                          viewMode === 'grid' 
                            ? 'bg-primary-500 text-white' 
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        <Grid className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded-r-lg transition-colors ${
                          viewMode === 'list' 
                            ? 'bg-primary-500 text-white' 
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        <List className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Episodes Content */}
              <div className="p-6">
                {episodesLoading ? (
                  <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-6' : 'space-y-4'}>
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className={`border border-gray-200 rounded-xl overflow-hidden ${
                          viewMode === 'grid' ? '' : 'flex'
                        }`}>
                          <div className={`bg-gray-200 ${
                            viewMode === 'grid' ? 'h-48' : 'w-32 h-24'
                          }`} />
                          <div className="p-4 flex-1">
                            <div className="h-5 bg-gray-200 rounded w-1/3 mb-3"></div>
                            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : episodesError ? (
                  <div className="text-center py-12">
                    <div className="text-red-500 mb-4">
                      <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to Load Episodes</h3>
                    <p className="text-gray-600 mb-4">There was an error loading the episodes. Please try again.</p>
                    <button 
                      onClick={() => window.location.reload()}
                      className="btn-primary"
                    >
                      Try Again
                    </button>
                  </div>
                ) : episodes.length === 0 ? (
                  <div className="text-center py-12">
                    <Tv className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Episodes Available</h3>
                    <p className="text-gray-600">This series doesn't have any episodes yet.</p>
                  </div>
                ) : (
                  <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-6' : 'space-y-4'}>
                    {episodes.map((episode, index) => (
                      <div 
                        key={episode._id || index}
                        className={`group border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 bg-white ${
                          viewMode === 'grid' ? '' : 'flex'
                        }`}
                      >
                        {/* Episode Thumbnail */}
                        <div className={`relative bg-gradient-to-br from-primary-100 to-secondary-100 ${
                          viewMode === 'grid' ? 'h-48' : 'w-32 h-24 flex-shrink-0'
                        }`}>
                          <img
                            src={series.posterUrl || 'https://via.placeholder.com/400x600'}
                            alt={episode.title}
                            className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity"
                            onError={(e) => {
                              e.target.style.display = 'none'
                            }}
                          />
                          
                          {/* Episode Number Overlay */}
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <div className="text-center">
                              <div className="text-white font-bold text-2xl">
                                {episode.episodeNumber}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Episode Info */}
                        <div className="p-4 flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <h3 className="font-bold text-gray-900 mb-1">
                                Episode {episode.episodeNumber}
                              </h3>
                              <h4 className="text-gray-800 text-sm mb-2 line-clamp-2">
                                {episode.title}
                              </h4>
                            </div>
                          </div>

                          {/* Episode Meta */}
                          <div className="flex items-center space-x-3 text-xs text-gray-600 mb-3">
                            {episode.duration && (
                              <div className="flex items-center space-x-1">
                                <Clock className="w-3 h-3" />
                                <span>{episode.duration}</span>
                              </div>
                            )}
                            {episode.airDate && (
                              <div className="flex items-center space-x-1">
                                <Calendar className="w-3 h-3" />
                                <span>{new Date(episode.airDate).toLocaleDateString()}</span>
                              </div>
                            )}
                          </div>

                          {/* Download Buttons */}
                          <div className="space-y-2">
                            {episode.downloadLinks && episode.downloadLinks.length > 0 && (
                              <div className="flex flex-wrap gap-2">
                                {episode.downloadLinks.slice(0, 2).map((link, linkIndex) => (
                                  <button
                                    key={linkIndex}
                                    onClick={() => handleDownload(episode.episodeNumber, link)}
                                    disabled={downloadingEpisode === `${episode.episodeNumber}-${link.quality}`}
                                    className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-white text-xs font-medium transition-all ${
                                      downloadingEpisode === `${episode.episodeNumber}-${link.quality}`
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : getQualityColor(link.quality)
                                    } hover:scale-105`}
                                  >
                                    {downloadingEpisode === `${episode.episodeNumber}-${link.quality}` ? (
                                      <>
                                        <Check className="w-3 h-3" />
                                        <span>Downloaded</span>
                                      </>
                                    ) : (
                                      <>
                                        <Download className="w-3 h-3" />
                                        <span>{link.quality}</span>
                                      </>
                                    )}
                                  </button>
                                ))}
                                
                                {episode.downloadLinks.length > 2 && (
                                  <button
                                    onClick={() => setExpandedEpisode(
                                      expandedEpisode === episode.episodeNumber ? null : episode.episodeNumber
                                    )}
                                    className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 text-xs font-medium hover:bg-gray-200 transition-colors"
                                  >
                                    <span>+{episode.downloadLinks.length - 2}</span>
                                  </button>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Expanded Download Options */}
                          {expandedEpisode === episode.episodeNumber && episode.downloadLinks && episode.downloadLinks.length > 2 && (
                            <div className="mt-3 pt-3 border-t border-gray-200">
                              <p className="text-xs text-gray-600 mb-2">All qualities:</p>
                              <div className="flex flex-wrap gap-2">
                                {episode.downloadLinks.map((link, linkIndex) => (
                                  <button
                                    key={linkIndex}
                                    onClick={() => handleDownload(episode.episodeNumber, link)}
                                    disabled={downloadingEpisode === `${episode.episodeNumber}-${link.quality}`}
                                    className={`flex items-center space-x-1 px-2 py-1 rounded text-white text-xs font-medium transition-all ${
                                      downloadingEpisode === `${episode.episodeNumber}-${link.quality}`
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : getQualityColor(link.quality)
                                    }`}
                                  >
                                    {downloadingEpisode === `${episode.episodeNumber}-${link.quality}` ? (
                                      <Check className="w-3 h-3" />
                                    ) : (
                                      <Download className="w-3 h-3" />
                                    )}
                                    <span>{link.quality}</span>
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Series Stats */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Series Info</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Type</span>
                  <span className={`badge ${getCategoryColor(series.category)}`}>
                    {series.category}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Language</span>
                  <span className={`badge ${getLanguageColor(series.language)}`}>
                    {series.language}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Year</span>
                  <span className="font-medium">{series.year}</span>
                </div>
                
                {series.totalEpisodes && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Total Episodes</span>
                    <span className="font-medium">{series.totalEpisodes}</span>
                  </div>
                )}
                
                {series.seasons > 1 && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Seasons</span>
                    <span className="font-medium">{series.seasons}</span>
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Added</span>
                  <span className="font-medium">
                    {new Date(series.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Separate MP4 Link */}
            {series.separateMp4Link && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Direct MP4 Download</h3>
                <button
                  onClick={() => {
                    const a = document.createElement('a')
                    a.href = series.separateMp4Link
                    a.download = `${series.title}_${series.separateMp4Quality || '720p'}.mp4`
                    a.style.display = 'none'
                    document.body.appendChild(a)
                    a.click()
                    document.body.removeChild(a)
                  }}
                  className={`w-full flex flex-col items-center justify-center p-4 rounded-xl text-white transition-all duration-200 hover:shadow-lg hover:scale-105 ${getQualityColor(series.separateMp4Quality || '720p')}`}
                >
                  <Download className="w-6 h-6 mb-1" />
                  <span className="font-semibold">Direct MP4</span>
                  <span className="text-xs opacity-75">{series.separateMp4Quality || '720p'} Quality</span>
                </button>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Direct MP4 file - {series.separateMp4Quality || '720p'} quality
                </p>
              </div>
            )}

            {/* Related Content */}
            {relatedMovies && relatedMovies.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Related Content</h3>
                <div className="space-y-4">
                  {relatedMovies.slice(0, 4).map((movie) => (
                    <MovieCard 
                      key={movie._id} 
                      movie={movie}
                      showQuality={false}
                      compact={true}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SeriesDetails