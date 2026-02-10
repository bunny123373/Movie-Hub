import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  Film, 
  Check, 
  Send, 
  ArrowLeft,
  Calendar,
  Star,
  Globe,
  MessageSquare
} from 'lucide-react'
import MetaTags from '../components/MetaTags'
import { storage, createNotification, notificationTypes } from '../utils/notifications'

const RequestMovie = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    movieTitle: '',
    year: '',
    language: '',
    category: '',
    reason: '',
    additionalInfo: ''
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const languages = [
    'Telugu', 'Tamil', 'Hindi', 'English', 'Kannada', 'Malayalam', 'Dubbed'
  ]

  const categories = [
    'Movie', 'Web Series', 'Documentary', 'Short Film', 'Other'
  ]

  const reasons = [
    'Latest Release',
    'Classic Movie',
    'Popular Request',
    'Educational Purpose',
    'Family Entertainment',
    'Other'
  ]

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      // Create notification data
      const reasonLabel = reasons.find(reason => reason === formData.reason) || 'Other'
      
      const notification = createNotification(
        notificationTypes.MOVIE_REQUEST,
        `New Movie Request: ${formData.movieTitle}`,
        `${formData.name} requested "${formData.movieTitle}" (${formData.language}, ${formData.year}) - Reason: ${reasonLabel}`,
        {
          user: {
            name: formData.name,
            email: formData.email
          },
          movie: {
            title: formData.movieTitle,
            year: formData.year,
            language: formData.language,
            category: formData.category
          },
          request: {
            reason: formData.reason,
            additionalInfo: formData.additionalInfo
          }
        }
      )
      
      // Save notification to admin storage (for demo)
      storage.save(notification)
      
      // In production, send to backend API
      // await fetch('/api/admin/notifications', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(notification)
      // })
      
      console.log('Movie request notification created:', notification)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      setIsSubmitting(false)
      setIsSubmitted(true)
    } catch (error) {
      console.error('Failed to submit movie request:', error)
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      movieTitle: '',
      year: '',
      language: '',
      category: '',
      reason: '',
      additionalInfo: ''
    })
    setIsSubmitted(false)
  }

  if (isSubmitted) {
    return (
      <>
        <MetaTags 
          title="Movie Request Submitted - MovieHub"
          description="Thank you for requesting a movie. We'll review your request and try to add it to our collection."
        />
        
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full">
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                Request Submitted!
              </h1>
              <p className="text-gray-600 mb-8">
                Thank you for suggesting a movie! Our team will review your request and we'll notify you if it becomes available.
              </p>
              <div className="space-y-3">
                <button
                  onClick={resetForm}
                  className="w-full btn-primary"
                >
                  Request Another Movie
                </button>
                <Link to="/support" className="w-full btn-secondary block text-center">
                  Back to Support
                </Link>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <MetaTags 
        title="Request a Movie - MovieHub"
        description="Can't find a movie? Request it here and we'll try to add it to our collection of movies."
      />
      
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <section className="bg-gradient-to-br from-green-600 via-green-700 to-green-800 py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6">
              <MessageSquare className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              Request a Movie
            </h1>
            <p className="text-lg sm:text-xl text-green-100 max-w-2xl mx-auto">
              Can't find what you're looking for? Let us know and we'll try to add it to our collection.
            </p>
          </div>
        </section>

        {/* Request Stats */}
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Why Request from Us?
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                We value your suggestions and regularly update our collection based on user requests.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Film className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Vast Collection</h3>
                <p className="text-gray-600 text-sm">
                  We add new movies weekly based on popular requests
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Multi-Language</h3>
                <p className="text-gray-600 text-sm">
                  Support for movies in multiple languages and regions
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Quality First</h3>
                <p className="text-gray-600 text-sm">
                  All movies available in HD quality and multiple formats
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Form Section */}
        <section className="py-12 lg:py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
              <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-8">
                {/* Contact Information */}
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        placeholder="John Doe"
                        className="input w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        placeholder="john@example.com"
                        className="input w-full"
                      />
                    </div>
                  </div>
                </div>

                {/* Movie Details */}
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Movie Details</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Movie Title *
                      </label>
                      <input
                        type="text"
                        name="movieTitle"
                        value={formData.movieTitle}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter the movie name"
                        className="input w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Release Year
                      </label>
                      <input
                        type="number"
                        name="year"
                        value={formData.year}
                        onChange={handleInputChange}
                        placeholder="2023"
                        min="1900"
                        max="2030"
                        className="input w-full"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Language *
                      </label>
                      <select
                        name="language"
                        value={formData.language}
                        onChange={handleInputChange}
                        required
                        className="input w-full"
                      >
                        <option value="">Select language</option>
                        {languages.map(lang => (
                          <option key={lang} value={lang}>{lang}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category *
                      </label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        required
                        className="input w-full"
                      >
                        <option value="">Select category</option>
                        {categories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Request Reason */}
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Why are you requesting this movie? *</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {reasons.map((reason) => (
                      <label
                        key={reason}
                        className={`relative cursor-pointer rounded-xl p-4 border-2 transition-all ${
                          formData.reason === reason
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                      >
                        <input
                          type="radio"
                          name="reason"
                          value={reason}
                          checked={formData.reason === reason}
                          onChange={handleInputChange}
                          className="sr-only"
                          required
                        />
                        <span className="text-sm font-medium text-gray-900">{reason}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Additional Information */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Information
                  </label>
                  <textarea
                    name="additionalInfo"
                    value={formData.additionalInfo}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Any additional details about the movie, cast, director, or why you'd like to see it on our platform..."
                    className="input w-full resize-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Optional: Tell us more about why you want this movie
                  </p>
                </div>

                {/* Submit Button */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-200">
                  <Link
                    to="/support"
                    className="btn-secondary px-6 py-3"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Support
                  </Link>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Submit Request</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Popular Requests */}
            <div className="mt-12 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-2xl p-8 border border-primary-100">
              <div className="text-center mb-6">
                <Calendar className="w-12 h-12 text-primary-600 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-gray-900 mb-2">Recently Requested Movies</h2>
                <p className="text-gray-600 text-sm">
                  See what other users are requesting
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { title: "Pushpa 2", language: "Telugu", requests: 234 },
                  { title: "Jawan", language: "Hindi", requests: 189 },
                  { title: "Leo", language: "Tamil", requests: 156 },
                  { title: "Oppenheimer", language: "English", requests: 142 }
                ].map((movie) => (
                  <div key={movie.title} className="bg-white rounded-xl p-4 text-center">
                    <h4 className="font-semibold text-gray-900">{movie.title}</h4>
                    <p className="text-sm text-gray-600">{movie.language}</p>
                    <p className="text-xs text-primary-600 mt-1">{movie.requests} requests</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Info */}
            <div className="mt-8 text-center">
              <p className="text-gray-600 text-sm">
                Have multiple movie requests? Email us at 
                <a href="mailto:requests@moviehub.com" className="text-primary-600 hover:underline ml-1">
                  uniquestarbunny.com
                </a>
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

export default RequestMovie