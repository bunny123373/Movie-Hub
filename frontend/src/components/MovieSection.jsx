import React from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, Flame, Sparkles, TrendingUp, Film } from 'lucide-react'
import MovieCard from './MovieCard'
import MovieSkeleton from './MovieSkeleton'

const sectionIcons = {
  trending: Flame,
  latest: Sparkles,
  popular: TrendingUp,
  default: Film
}

const sectionTitles = {
  trending: 'Trending Movies',
  latest: 'Latest Movies',
  popular: 'Popular Downloads',
  telugu: 'Telugu Movies',
  tamil: 'Tamil Movies',
  hindi: 'Hindi Movies',
  english: 'English Movies',
  dubbed: 'Dubbed Movies'
}

const MovieSection = ({ 
  type = 'default', 
  title, 
  movies = [], 
  loading = false, 
  error = null,
  showViewAll = true,
  viewAllLink = '/',
  emptyMessage = 'No movies found'
}) => {
  const Icon = sectionIcons[type] || sectionIcons.default
  const displayTitle = title || sectionTitles[type] || 'Movies'

  if (loading) {
    return (
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2 mb-6">
            <Icon className="w-6 h-6 text-primary-600" />
            <h2 className="text-xl font-bold text-gray-900">{displayTitle}</h2>
          </div>
          <MovieSkeleton count={6} />
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2 mb-6">
            <Icon className="w-6 h-6 text-primary-600" />
            <h2 className="text-xl font-bold text-gray-900">{displayTitle}</h2>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </section>
    )
  }

  if (movies.length === 0) {
    return (
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2 mb-6">
            <Icon className="w-6 h-6 text-primary-600" />
            <h2 className="text-xl font-bold text-gray-900">{displayTitle}</h2>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-12 text-center">
            <Film className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">{emptyMessage}</p>
          </div>
        </div>
      </section>
    )
  }

  return (
<section className="py-8 smooth-scroll">
        <div className="container-responsive">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <div className={`p-2 rounded-lg ${
              type === 'trending' ? 'bg-orange-100' :
              type === 'latest' ? 'bg-blue-100' :
              type === 'popular' ? 'bg-green-100' :
              'bg-primary-100'
            }`}>
              <Icon className={`w-5 h-5 ${
                type === 'trending' ? 'text-orange-600' :
                type === 'latest' ? 'text-blue-600' :
                type === 'popular' ? 'text-green-600' :
                'text-primary-600'
              }`} />
            </div>
            <h2 className="text-xl font-bold text-gray-900">{displayTitle}</h2>
          </div>
          
          {showViewAll && (
            <Link
              to={viewAllLink}
              className="flex items-center space-x-1 text-primary-600 hover:text-primary-700 font-medium text-sm group"
            >
              <span>View All</span>
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          )}
        </div>

        {/* Movies Grid */}
        <div className="grid grid-responsive">
          {movies.map((movie) => (
            <MovieCard key={movie._id} movie={movie} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default MovieSection
