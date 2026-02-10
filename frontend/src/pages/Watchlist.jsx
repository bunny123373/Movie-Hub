import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Heart, Trash2 } from 'lucide-react'
import { useWatchlist } from '../contexts/WatchlistContext'
import MovieCard from '../components/MovieCard'
import EmptyState from '../components/EmptyState'

const Watchlist = () => {
  const { watchlist, clearWatchlist } = useWatchlist()

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Home</span>
          </Link>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-red-100 rounded-xl">
                <Heart className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  My Watchlist
                </h1>
                <p className="text-gray-500 mt-1">
                  {watchlist.length} {watchlist.length === 1 ? 'movie' : 'movies'} saved
                </p>
              </div>
            </div>
            
            {watchlist.length > 0 && (
              <button
                onClick={clearWatchlist}
                className="flex items-center justify-center space-x-2 px-4 py-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
              >
                <Trash2 className="w-5 h-5" />
                <span>Clear All</span>
              </button>
            )}
          </div>
        </div>

        {/* Watchlist Content */}
        {watchlist.length === 0 ? (
          <EmptyState
            type="watchlist"
            title="Your watchlist is empty"
            description="Save movies you want to watch later by clicking the heart icon on any movie card."
            action={{
              label: 'Browse Movies',
              onClick: () => window.location.href = '/'
            }}
          />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 lg:gap-6">
            {watchlist.map((movie) => (
              <MovieCard key={movie._id} movie={movie} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Watchlist
