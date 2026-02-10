import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Search, Heart, Menu, X, Film, HelpCircle } from 'lucide-react'
import { useSearchSuggestions } from '../hooks/useMovies'
import NotificationSettings from './NotificationSettings'

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const searchRef = useRef(null)
  const navigate = useNavigate()
  const location = useLocation()
  
  const { suggestions, loading } = useSearchSuggestions(searchQuery)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setShowSuggestions(false)
      setSearchQuery('')
    }
  }

  const handleSuggestionClick = (suggestion) => {
    navigate(`/movie/${suggestion._id}`)
    setShowSuggestions(false)
    setSearchQuery('')
  }

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/watchlist', label: 'Watchlist' },
    { to: '/support', label: 'Support', icon: HelpCircle },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
              <Film className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gradient hidden sm:block">MovieHub</span>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-xl mx-8" ref={searchRef}>
            <form onSubmit={handleSearch} className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setShowSuggestions(true)
                }}
                onFocus={() => setShowSuggestions(true)}
                placeholder="Search movies..."
                className="input pl-10 pr-4 w-full"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              
              {/* Search Suggestions */}
              {showSuggestions && searchQuery.length >= 2 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50">
                  {loading ? (
                    <div className="p-4 text-center text-gray-500">
                      <div className="w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    </div>
                  ) : suggestions.length > 0 ? (
                    <div className="max-h-80 overflow-y-auto">
                      {suggestions.map((suggestion) => (
                        <button
                          key={suggestion._id}
                          type="button"
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 transition-colors text-left"
                        >
                          <img
                            src={suggestion.posterUrl}
                            alt={suggestion.title}
                            className="w-10 h-14 object-cover rounded-lg"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate">{suggestion.title}</p>
                            <p className="text-sm text-gray-500">{suggestion.language} • {suggestion.year}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-gray-500">No results found</div>
                  )}
                </div>
              )}
            </form>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
                  location.pathname === link.to
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {link.to === '/watchlist' && <Heart className="w-4 h-4" />}
                {link.to === '/support' && link.icon && <link.icon className="w-4 h-4" />}
                <span>{link.label}</span>
              </Link>
            ))}
            <NotificationSettings />
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-600" />
            ) : (
              <Menu className="w-6 h-6 text-gray-600" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          {/* Mobile Search */}
          <div className="p-4" ref={searchRef}>
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setShowSuggestions(true)
                }}
                placeholder="Search movies..."
                className="input pl-10 pr-4 w-full"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </form>
            
            {/* Mobile Suggestions */}
            {showSuggestions && searchQuery.length >= 2 && suggestions.length > 0 && (
              <div className="mt-2 bg-gray-50 rounded-xl overflow-hidden">
                {suggestions.slice(0, 5).map((suggestion) => (
                  <button
                    key={suggestion._id}
                    onClick={() => {
                      handleSuggestionClick(suggestion)
                      setIsMobileMenuOpen(false)
                    }}
                    className="w-full flex items-center space-x-3 p-3 hover:bg-gray-100 transition-colors text-left"
                  >
                    <img
                      src={suggestion.posterUrl}
                      alt={suggestion.title}
                      className="w-10 h-14 object-cover rounded-lg"
                    />
                    <div>
                      <p className="font-medium text-gray-900">{suggestion.title}</p>
                      <p className="text-sm text-gray-500">{suggestion.language} • {suggestion.year}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Mobile Nav Links */}
          <div className="px-4 pb-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  location.pathname === link.to
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {link.to === '/watchlist' && <Heart className="w-5 h-5" />}
                {link.to === '/support' && link.icon && <link.icon className="w-5 h-5" />}
                <span className="font-medium">{link.label}</span>
              </Link>
            ))}
            <div className="px-4 py-3">
              <NotificationSettings />
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
