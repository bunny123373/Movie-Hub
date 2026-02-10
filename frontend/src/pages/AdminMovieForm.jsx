import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Plus, X, Upload, Film, Check } from 'lucide-react'
import { useMovie, createMovie, updateMovie } from '../hooks/useMovies'
import { useNotificationEvent } from '../context/NotificationEventContext'
import { convertGoogleDriveUrl, isGoogleDriveUrl, isPixeldrainUrl, isDirectVideoUrl, isVideoHostingUrl, getVideoType } from '../utils/urlConverters'

const AdminMovieForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditMode = Boolean(id)
  const { notifyMovieUploaded } = useNotificationEvent()
  
  const { movie, loading: movieLoading } = useMovie(id)
  const adminKey = localStorage.getItem('adminKey') || ''

  const [formData, setFormData] = useState({
    title: '',
    language: 'Telugu',
    category: 'Movie',
    genre: [],
    year: new Date().getFullYear(),
    posterUrl: '',
    downloadLinks: [{ quality: '720p', url: '' }],
    customDownloadLinks: [{ quality: '720p', url: '' }], // Array for custom download links with quality
    separateMp4Link: { quality: '720p', url: '' }, // Separate direct MP4 link with quality
    description: '',
    fileSize: '',
    isTrending: false,
    isFeatured: false,
    isActive: true,
    // Series-specific fields
    totalEpisodes: '',
    seasons: 1,
    currentSeason: 1,
    episodes: []
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const languages = ['Telugu', 'Tamil', 'Hindi', 'English', 'Dubbed']
  const categories = ['Movie', 'TV Series', 'Dubbed']
  const genres = ['Action', 'Comedy', 'Romance', 'Thriller', 'Horror', 'Drama', 'Sci-Fi', 'Adventure']
  const qualities = ['480p', '720p', '1080p', '4K']

  useEffect(() => {
    if (movie && isEditMode) {
      setFormData({
        title: movie.title || '',
        language: movie.language || 'Telugu',
        category: movie.category || 'Movie',
        genre: movie.genre || [],
        year: movie.year || new Date().getFullYear(),
        posterUrl: movie.posterUrl || '',
        downloadLinks: movie.downloadLinks?.length > 0 
          ? movie.downloadLinks 
          : [{ quality: '720p', url: '' }],
        customDownloadLinks: movie.customDownloadLinks?.length > 0 
          ? movie.customDownloadLinks 
          : [{ quality: '720p', url: '' }],
        separateMp4Link: movie.separateMp4Link 
          ? { quality: movie.separateMp4Quality || '720p', url: movie.separateMp4Link }
          : { quality: '720p', url: '' },
        description: movie.description || '',
        fileSize: movie.fileSize || '',
        isTrending: movie.isTrending || false,
        isFeatured: movie.isFeatured || false,
        isActive: movie.isActive !== false,
        // Series-specific fields
        totalEpisodes: movie.totalEpisodes || '',
        seasons: movie.seasons || 1,
        currentSeason: movie.currentSeason || 1,
        episodes: movie.episodes || []
      })
    }
  }, [movie, isEditMode])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (name === 'year' ? parseInt(value) || new Date().getFullYear() : value)
    }))
  }

  const handleGenreChange = (genre) => {
    setFormData(prev => ({
      ...prev,
      genre: prev.genre.includes(genre)
        ? prev.genre.filter(g => g !== genre)
        : [...prev.genre, genre]
    }))
  }

  const handleDownloadLinkChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      downloadLinks: prev.downloadLinks.map((link, i) => 
        i === index ? { ...link, [field]: value } : link
      )
    }))
  }

  const addDownloadLink = () => {
    setFormData(prev => ({
      ...prev,
      downloadLinks: [...prev.downloadLinks, { quality: '720p', url: '' }]
    }))
  }

  const handleCustomDownloadLinkChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      customDownloadLinks: prev.customDownloadLinks.map((link, i) => 
        i === index ? { ...link, [field]: value } : link
      )
    }))
  }

  const addCustomDownloadLink = () => {
    setFormData(prev => ({
      ...prev,
      customDownloadLinks: [...prev.customDownloadLinks, { quality: '720p', url: '' }]
    }))
  }

  const removeCustomDownloadLink = (index) => {
    setFormData(prev => ({
      ...prev,
      customDownloadLinks: prev.customDownloadLinks.filter((_, i) => i !== index)
    }))
  }

  const removeDownloadLink = (index) => {
    setFormData(prev => ({
      ...prev,
      downloadLinks: prev.downloadLinks.filter((_, i) => i !== index)
    }))
  }

  // Episode management functions
  const addEpisode = () => {
    const newEpisodeNumber = formData.episodes.length + 1
    setFormData(prev => ({
      ...prev,
      episodes: [...prev.episodes, {
        episodeNumber: newEpisodeNumber,
        title: '',
        downloadLinks: [{ quality: '720p', url: '' }],
        duration: '',
        airDate: '',
        isActive: true
      }]
    }))
  }

  const removeEpisode = (index) => {
    setFormData(prev => ({
      ...prev,
      episodes: prev.episodes.filter((_, i) => i !== index)
    }))
  }

  const handleEpisodeChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      episodes: prev.episodes.map((episode, i) => 
        i === index ? { ...episode, [field]: value } : episode
      )
    }))
  }

  const handleEpisodeDownloadLinkChange = (episodeIndex, linkIndex, field, value) => {
    setFormData(prev => ({
      ...prev,
      episodes: prev.episodes.map((episode, i) => 
        i === episodeIndex 
          ? {
              ...episode,
              downloadLinks: episode.downloadLinks.map((link, j) => 
                j === linkIndex ? { ...link, [field]: value } : link
              )
            }
          : episode
      )
    }))
  }

  const addEpisodeDownloadLink = (episodeIndex) => {
    setFormData(prev => ({
      ...prev,
      episodes: prev.episodes.map((episode, i) => 
        i === episodeIndex 
          ? {
              ...episode,
              downloadLinks: [...episode.downloadLinks, { quality: '720p', url: '' }]
            }
          : episode
      )
    }))
  }

  const removeEpisodeDownloadLink = (episodeIndex, linkIndex) => {
    setFormData(prev => ({
      ...prev,
      episodes: prev.episodes.map((episode, i) => 
        i === episodeIndex 
          ? {
              ...episode,
              downloadLinks: episode.downloadLinks.filter((_, j) => j !== linkIndex)
            }
          : episode
      )
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      // Validate
      if (!formData.title.trim()) throw new Error('Title is required')
      if (!formData.posterUrl.trim()) throw new Error('Poster URL is required')
      if (!formData.description.trim()) throw new Error('Description is required')
      
      // For movies, file size is required
      if (formData.category === 'Movie' && !formData.fileSize.trim()) {
        throw new Error('File size is required for movies')
      }
      
      if (!formData.genre || formData.genre.length === 0) throw new Error('At least one genre is required')
      
      // For series, validate episodes
      if ((formData.category === 'Web Series' || formData.category === 'TV Series')) {
        if (!formData.totalEpisodes || formData.totalEpisodes <= 0) {
          throw new Error('Total episodes is required for series')
        }
        if (formData.episodes.length === 0) {
          throw new Error('At least one episode is required for series')
        }
        
        // Validate each episode
        for (let i = 0; i < formData.episodes.length; i++) {
          const episode = formData.episodes[i]
          if (!episode.title.trim()) {
            throw new Error(`Episode ${episode.episodeNumber} title is required`)
          }
          const validEpisodeLinks = episode.downloadLinks.filter(link => link.url.trim())
          if (validEpisodeLinks.length === 0) {
            throw new Error(`At least one download link for episode ${episode.episodeNumber} must have a URL`)
          }
        }
      } else {
        // For movies, validate that at least one download link has a URL
        const validLinks = formData.downloadLinks.filter(link => link.url.trim())
        const hasSeparateMp4 = formData.separateMp4Link.url.trim()
        if (validLinks.length === 0 && !hasSeparateMp4) {
          throw new Error('At least one download link must have a URL (you can leave others empty)')
        }
      }

      // Prepare data for submission
      const submissionData = {
        ...formData
      }
      
      // Only include relevant fields based on category
      if (formData.category === 'Movie') {
        // Convert Google Drive URLs to direct download URLs
        submissionData.downloadLinks = formData.downloadLinks
          .filter(link => link.url.trim())
          .map(link => ({
            ...link,
            url: convertGoogleDriveUrl(link.url)
          }))
        
        // Handle separate MP4 link
        if (formData.separateMp4Link.url.trim()) {
          submissionData.separateMp4Link = convertGoogleDriveUrl(formData.separateMp4Link.url)
          submissionData.separateMp4Quality = formData.separateMp4Link.quality
        } else {
          delete submissionData.separateMp4Link
          delete submissionData.separateMp4Quality
        }
        
        delete submissionData.episodes
        delete submissionData.totalEpisodes
        delete submissionData.seasons
        delete submissionData.currentSeason
      } else {
        // For series, clean up episode data and remove movie-specific fields
        submissionData.episodes = formData.episodes.map(episode => ({
          ...episode,
          downloadLinks: episode.downloadLinks
            .filter(link => link.url.trim())
            .map(link => ({
              ...link,
              url: convertGoogleDriveUrl(link.url)
            }))
        }))
        delete submissionData.downloadLinks // Remove movie-level download links for series
        delete submissionData.fileSize // Remove fileSize for series
        
        // Handle separate MP4 link for series
        if (formData.separateMp4Link.url.trim()) {
          submissionData.separateMp4Link = convertGoogleDriveUrl(formData.separateMp4Link.url)
          submissionData.separateMp4Quality = formData.separateMp4Link.quality
        } else {
          delete submissionData.separateMp4Link
          delete submissionData.separateMp4Quality
        }
      }
      
      // Handle custom download links with Pixeldrain conversion
      submissionData.customDownloadLinks = formData.customDownloadLinks
        .filter(link => link.url.trim())
        .map(link => ({
          ...link,
          url: convertPixeldrainUrl(link.url)
        }))
      if (submissionData.customDownloadLinks.length === 0) {
        delete submissionData.customDownloadLinks
      }

      if (isEditMode) {
        await updateMovie(id, submissionData, adminKey)
        setSuccess('Movie updated successfully!')
      } else {
        const newMovie = await createMovie(submissionData, adminKey)
        setSuccess('Movie created successfully!')
        // Trigger notification for new movie upload
        if (newMovie) {
          notifyMovieUploaded(newMovie)
        }
        // Reset form after creation
        if (!isEditMode) {
          setFormData({
            title: '',
            language: 'Telugu',
            category: 'Movie',
            genre: [],
            year: new Date().getFullYear(),
            posterUrl: '',
            downloadLinks: [{ quality: '720p', url: '' }],
            customDownloadLinks: [{ quality: '720p', url: '' }],
            description: '',
            fileSize: '',
            isTrending: false,
            isFeatured: false,
            isActive: true,
            totalEpisodes: '',
            seasons: 1,
            currentSeason: 1,
            episodes: []
          })
        }
      }
      
      setTimeout(() => {
        if (!isEditMode) {
          navigate('/admin')
        }
      }, 1500)
    } catch (err) {
       const errorMessage = err.response?.data?.message || err.message || 'Failed to save movie'
       setError(errorMessage)
     } finally {
       setLoading(false)
     }
  }

  if (isEditMode && movieLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link
                to="/admin"
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <h1 className="text-xl font-bold text-gray-900">
                {isEditMode ? 'Edit Movie' : 'Add New Movie'}
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Form */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center space-x-2">
            <Check className="w-5 h-5 text-green-600" />
            <p className="text-green-600">{success}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Title */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Movie Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter movie title"
                  className="input"
                  required
                />
              </div>

              {/* Language */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Language *
                </label>
                <select
                  name="language"
                  value={formData.language}
                  onChange={handleChange}
                  className="input"
                  required
                >
                  {languages.map(lang => (
                    <option key={lang} value={lang}>{lang}</option>
                  ))}
                </select>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="input"
                  required
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Year */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Release Year *
                </label>
                <input
                  type="number"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  min="1900"
                  max={new Date().getFullYear() + 1}
                  className="input"
                  required
                />
              </div>

              {/* File Size (only for movies) */}
              {formData.category === 'Movie' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    File Size *
                  </label>
                  <input
                    type="text"
                    name="fileSize"
                    value={formData.fileSize}
                    onChange={handleChange}
                    placeholder="e.g., 1.2 GB"
                    className="input"
                    required={formData.category === 'Movie'}
                  />
                </div>
              )}

              {/* Poster URL */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Poster Image URL *
                </label>
                <input
                  type="url"
                  name="posterUrl"
                  value={formData.posterUrl}
                  onChange={handleChange}
                  placeholder="https://example.com/poster.jpg"
                  className="input"
                  required
                />
                {formData.posterUrl && (
                  <div className="mt-3">
                    <img
                      src={formData.posterUrl}
                      alt="Preview"
                      className="w-32 h-48 object-cover rounded-lg"
                      onError={(e) => e.target.style.display = 'none'}
                    />
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Enter movie description..."
                  className="input resize-none"
                  required
                />
              </div>
            </div>
          </div>

          {/* Series Information (only show for Web Series/TV Series) */}
          {(formData.category === 'Web Series' || formData.category === 'TV Series') && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Series Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Total Episodes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total Episodes *
                  </label>
                  <input
                    type="number"
                    name="totalEpisodes"
                    value={formData.totalEpisodes}
                    onChange={handleChange}
                    min="1"
                    placeholder="e.g., 10"
                    className="input"
                    required={(formData.category === 'Web Series' || formData.category === 'TV Series')}
                  />
                </div>

                {/* Seasons */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Seasons
                  </label>
                  <input
                    type="number"
                    name="seasons"
                    value={formData.seasons}
                    onChange={handleChange}
                    min="1"
                    placeholder="e.g., 2"
                    className="input"
                  />
                </div>

                {/* Current Season */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Season
                  </label>
                  <input
                    type="number"
                    name="currentSeason"
                    value={formData.currentSeason}
                    onChange={handleChange}
                    min="1"
                    placeholder="e.g., 1"
                    className="input"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Episodes (only show for Web Series/TV Series) */}
          {(formData.category === 'Web Series' || formData.category === 'TV Series') && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Episodes *</h2>
                <button
                  type="button"
                  onClick={addEpisode}
                  className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-medium"
                >
                  <Plus className="w-5 h-5" />
                  <span>Add Episode</span>
                </button>
              </div>
              
              {formData.episodes.length === 0 ? (
                <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                  <Film className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 mb-4">No episodes added yet</p>
                  <button
                    type="button"
                    onClick={addEpisode}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    Add First Episode
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {formData.episodes.map((episode, episodeIndex) => (
                    <div key={episodeIndex} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-medium text-gray-900">
                          Episode {episode.episodeNumber}
                        </h3>
                        {formData.episodes.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeEpisode(episodeIndex)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        {/* Episode Title */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Episode Title *
                          </label>
                          <input
                            type="text"
                            value={episode.title}
                            onChange={(e) => handleEpisodeChange(episodeIndex, 'title', e.target.value)}
                            placeholder="Enter episode title"
                            className="input"
                            required
                          />
                        </div>

                        {/* Duration */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Duration
                          </label>
                          <input
                            type="text"
                            value={episode.duration}
                            onChange={(e) => handleEpisodeChange(episodeIndex, 'duration', e.target.value)}
                            placeholder="e.g., 45 min"
                            className="input"
                          />
                        </div>
                      </div>

                      {/* Episode Download Links */}
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <label className="block text-sm font-medium text-gray-700">
                            Download Links *
                          </label>
                          <button
                            type="button"
                            onClick={() => addEpisodeDownloadLink(episodeIndex)}
                            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                          >
                            Add Link
                          </button>
                        </div>
                        
                        <div className="space-y-3">
                          {episode.downloadLinks.map((link, linkIndex) => (
                            <div key={linkIndex} className="flex items-start space-x-3">
                              <div className="w-24 flex-shrink-0">
                                <select
                                  value={link.quality}
                                  onChange={(e) => handleEpisodeDownloadLinkChange(episodeIndex, linkIndex, 'quality', e.target.value)}
                                  className="input text-sm"
                                >
                                  {qualities.map(q => (
                                    <option key={q} value={q}>{q}</option>
                                  ))}
                                </select>
                              </div>
                              <div className="flex-1">
                                <input
                                  type="url"
                                  value={link.url}
                                  onChange={(e) => handleEpisodeDownloadLinkChange(episodeIndex, linkIndex, 'url', e.target.value)}
placeholder="Google Drive, direct MP4, Pixeldrain, or any download link"
                                  className="input text-sm"
                                  required
                                />
                                {getVideoType(link.url) && (
                                  <div className={`mt-1 flex items-center space-x-2 text-xs ${
                                    getVideoType(link.url) === 'Direct Video' ? 'text-blue-600' :
                                    getVideoType(link.url) === 'Video Hosting' ? 'text-purple-600' :
                                    getVideoType(link.url) === 'Pixeldrain' ? 'text-green-600' :
                                    'text-gray-600'
                                  }`}>
                                    {getVideoType(link.url) === 'Direct Video' && (
                                      <>
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span>Direct MP4 video</span>
                                      </>
                                    )}
                                    {getVideoType(link.url) === 'Video Hosting' && (
                                      <>
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                        </svg>
                                        <span>Video hosting</span>
                                      </>
                                    )}
                                    {getVideoType(link.url) === 'Pixeldrain' && (
                                      <>
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span>Pixeldrain</span>
                                      </>
                                    )}
                                  </div>
                                )}
                              </div>
                              {episode.downloadLinks.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => removeEpisodeDownloadLink(episodeIndex, linkIndex)}
                                  className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Genre */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Genre</h2>
            <div className="flex flex-wrap gap-2">
              {genres.map(genre => (
                <button
                  key={genre}
                  type="button"
                  onClick={() => handleGenreChange(genre)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    formData.genre.includes(genre)
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>

          {/* Download Links (only show for Movies) */}
          {formData.category === 'Movie' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Download Links *</h2>
                <button
                  type="button"
                  onClick={addDownloadLink}
                  className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-medium"
                >
                  <Plus className="w-5 h-5" />
                  <span>Add Link</span>
                </button>
              </div>
              
              <div className="space-y-4">
                {formData.downloadLinks.map((link, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="w-32 flex-shrink-0">
                      <select
                        value={link.quality}
                        onChange={(e) => handleDownloadLinkChange(index, 'quality', e.target.value)}
                        className="input"
                      >
                        {qualities.map(q => (
                          <option key={q} value={q}>{q}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex-1">
                      <input
                        type="url"
                        value={link.url}
                        onChange={(e) => handleDownloadLinkChange(index, 'url', e.target.value)}
                        placeholder="Direct MP4, Google Drive, Pixeldrain, or any download link"
                        className="input"
                      />
                      {getVideoType(link.url) && (
                        <div className={`mt-2 flex items-center space-x-2 text-xs ${
                          getVideoType(link.url) === 'Direct Video' ? 'text-blue-600' :
                          getVideoType(link.url) === 'Video Hosting' ? 'text-purple-600' :
                          getVideoType(link.url) === 'Google Drive' ? 'text-green-600' :
                          getVideoType(link.url) === 'Pixeldrain' ? 'text-green-600' :
                          'text-gray-600'
                        }`}>
                          {getVideoType(link.url) === 'Direct Video' && (
                            <>
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span>Direct MP4 video link detected</span>
                            </>
                          )}
                          {getVideoType(link.url) === 'Video Hosting' && (
                            <>
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                              <span>Video hosting platform detected</span>
                            </>
                          )}
                          {getVideoType(link.url) === 'Google Drive' && (
                            <>
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M7.71 3.52L1.15 15.07c-.43.75-.13 1.66.5 2.31l1.9 3.32c.37.64.98 1.07 1.11 1.71.74l5.14-2.93c.64-.37 1.07-1.07 1.11-1.71l2.43-5.14c.43-.75.13-1.66-.5-2.31l-1.9-3.32c-.37-.64-.98-1.07-1.71-1.11z"/>
                                <path d="M12 3v6l2-2M6 12l2-2M3 20.5a1.5 1.5 0 103 0 1.5 1.5 0 003 0z"/>
                              </svg>
                              <span>Google Drive link - will convert to direct download</span>
                            </>
                          )}
                          {getVideoType(link.url) === 'Google Drive' && (
                            <>
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M7.71 3.52L1.15 15.07c-.43.75-.13 1.66.5 2.31l1.9 3.32c.37.64.98 1.07 1.11 1.71.74l5.14-2.93c.64-.37 1.07-1.07 1.11-1.71l2.43-5.14c.43-.75.13-1.66-.5-2.31l-1.9-3.32c-.37-.64-.98-1.07-1.71-1.11z"/>
                                <path d="M12 3v6l2-2M6 12l2-2M3 20.5a1.5 1.5 0 103 0 1.5 1.5 0 003 0z"/>
                              </svg>
                              <span>Google Drive link - will convert to direct download</span>
                            </>
                          )}
                          {getVideoType(link.url) === 'Pixeldrain' && (
                            <>
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span>Pixeldrain URL - will convert to direct download</span>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                    {formData.downloadLinks.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeDownloadLink(index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Custom Download Links (for any download link with quality) */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Custom Download Links</h2>
                <p className="text-sm text-gray-600 mt-1">Add direct MP4, Google Drive, Pixeldrain, or any download links with quality labels (optional)</p>
              </div>
              <button
                type="button"
                onClick={addCustomDownloadLink}
                className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-medium"
              >
                <Plus className="w-5 h-5" />
                <span>Add Link</span>
              </button>
            </div>
            
            <div className="space-y-4">
              {formData.customDownloadLinks.map((link, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="w-32 flex-shrink-0">
                    <select
                      value={link.quality}
                      onChange={(e) => handleCustomDownloadLinkChange(index, 'quality', e.target.value)}
                      className="input"
                    >
                      {qualities.map(q => (
                        <option key={q} value={q}>{q}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex-1">
                    <input
                      type="url"
                      value={link.url}
                      onChange={(e) => handleCustomDownloadLinkChange(index, 'url', e.target.value)}
                      placeholder="Direct MP4, Google Drive, Pixeldrain, or any download link"
                      className="input"
                    />
                    {getVideoType(link.url) && (
                      <div className={`mt-2 flex items-center space-x-2 text-xs ${
                        getVideoType(link.url) === 'Direct Video' ? 'text-blue-600' :
                        getVideoType(link.url) === 'Video Hosting' ? 'text-purple-600' :
                        getVideoType(link.url) === 'Google Drive' ? 'text-green-600' :
                        getVideoType(link.url) === 'Pixeldrain' ? 'text-green-600' :
                        'text-gray-600'
                      }`}>
                        {getVideoType(link.url) === 'Direct Video' && (
                          <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>Direct MP4 video link detected</span>
                          </>
                        )}
                        {getVideoType(link.url) === 'Video Hosting' && (
                          <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            <span>Video hosting platform detected</span>
                          </>
                        )}
                        {getVideoType(link.url) === 'Pixeldrain' && (
                          <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>Pixeldrain URL - will convert to direct download</span>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                  {formData.customDownloadLinks.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeCustomDownloadLink(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Separate MP4 Link */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Separate MP4 Link</h2>
              <p className="text-sm text-gray-600 mt-1">Add a direct MP4 download link (optional)</p>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="w-32 flex-shrink-0">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quality
                  </label>
                  <select
                    value={formData.separateMp4Link.quality}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      separateMp4Link: {
                        ...prev.separateMp4Link,
                        quality: e.target.value
                      }
                    }))}
                    className="input"
                  >
                    {qualities.map(q => (
                      <option key={q} value={q}>{q}</option>
                    ))}
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Direct MP4 Link
                  </label>
                  <input
                    type="url"
                    value={formData.separateMp4Link.url}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      separateMp4Link: {
                        ...prev.separateMp4Link,
                        url: e.target.value
                      }
                    }))}
                    placeholder="https://example.com/video.mp4"
                    className="input w-full"
                  />
                  {formData.separateMp4Link.url && getVideoType(formData.separateMp4Link.url) && (
                  <div className={`mt-2 flex items-center space-x-2 text-xs ${
                    getVideoType(formData.separateMp4Link.url) === 'Direct Video' ? 'text-blue-600' :
                    getVideoType(formData.separateMp4Link.url) === 'Video Hosting' ? 'text-purple-600' :
                    getVideoType(formData.separateMp4Link.url) === 'Google Drive' ? 'text-green-600' :
                    getVideoType(formData.separateMp4Link.url) === 'Pixeldrain' ? 'text-green-600' :
                    'text-gray-600'
                  }`}>
                    {getVideoType(formData.separateMp4Link.url) === 'Direct Video' && (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Direct MP4 video detected</span>
                      </>
                    )}
                    {getVideoType(formData.separateMp4Link.url) === 'Google Drive' && (
                      <>
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M7.71 3.52L1.15 15.07c-.43.75-.13 1.66.5 2.31l1.9 3.32c.37.64.98 1.07 1.11 1.71.74l5.14-2.93c.64-.37 1.07-1.07 1.11-1.71l2.43-5.14c.43-.75.13-1.66-.5-2.31l-1.9-3.32c-.37-.64-.98-1.07-1.71-1.11z"/>
                          <path d="M12 3v6l2-2M6 12l2-2M3 20.5a1.5 1.5 0 103 0 1.5 1.5 0 003 0z"/>
                        </svg>
                        <span>Google Drive link - will be converted to direct download</span>
                      </>
                    )}
                    {getVideoType(formData.separateMp4Link.url) === 'Pixeldrain' && (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <span>Pixeldrain link - will be converted to direct download</span>
                      </>
                    )}
                    {getVideoType(formData.separateMp4Link.url) === 'Video Hosting' && (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Video hosting platform detected</span>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Settings */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Settings</h2>
            
            <div className="space-y-4">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="isTrending"
                  checked={formData.isTrending}
                  onChange={handleChange}
                  className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                />
                <span className="text-gray-700">Mark as Trending</span>
              </label>

              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="isFeatured"
                  checked={formData.isFeatured}
                  onChange={handleChange}
                  className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                />
                <span className="text-gray-700">Mark as Featured</span>
              </label>

              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                />
                <span className="text-gray-700">Active (visible to users)</span>
              </label>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center justify-end space-x-4">
            <Link
              to="/admin"
              className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary px-8 py-3 disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Saving...</span>
                </span>
              ) : (
                <span>{isEditMode ? 'Update Movie' : 'Create Movie'}</span>
              )}
            </button>
          </div>
          </div>
        </form>
      </main>
    </div>
  )
}

export default AdminMovieForm
