import React, { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { Search, ArrowLeft, Filter, X } from 'lucide-react'
import { useMovies } from '../hooks/useMovies'
import MovieCard from '../components/MovieCard'
import MovieSkeleton from '../components/MovieSkeleton'
import EmptyState from '../components/EmptyState'
import FilterPanel from '../components/FilterPanel'

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  
  const [filters, setFilters] = useState({
    language: searchParams.get('language') || '',
    category: searchParams.get('category') || '',
    genre: searchParams.get('genre') || '',
    year: searchParams.get('year') || '',
    quality: searchParams.get('quality') || ''
  })
  
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  const { movies, loading, error, pagination } = useMovies({
    search: query,
    ...filters,
    limit: 24
  })

  useEffect(() => {
    setFilters({
      language: searchParams.get('language') || '',
      category: searchParams.get('category') || '',
      genre: searchParams.get('genre') || '',
      year: searchParams.get('year') || '',
      quality: searchParams.get('quality') || ''
    })
  }, [searchParams])

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
    
    // Update URL params
    const params = new URLSearchParams()
    if (query) params.set('q', query)
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value) params.set(key, value)
    })
    setSearchParams(params)
  }

  const hasActiveFilters = Object.values(filters).some(v => v !== '')

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
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Search Results
              </h1>
              <p className="text-gray-500 mt-1">
                {query ? `Showing results for "${query}"` : 'All movies'}
                {pagination && ` (${pagination.total} found)`}
              </p>
            </div>
            
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="lg:hidden flex items-center justify-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Filter className="w-5 h-5" />
              <span>Filters</span>
              {hasActiveFilters && (
                <span className="badge bg-primary-100 text-primary-700 text-xs">
                  Active
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Filters */}
        {showMobileFilters && (
          <div className="lg:hidden mb-6">
            <FilterPanel 
              filters={filters} 
              onFilterChange={handleFilterChange}
            />
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-36">
              <FilterPanel 
                filters={filters} 
                onFilterChange={handleFilterChange}
              />
            </div>
          </aside>

          {/* Results */}
          <main className="flex-1 min-w-0">
            {loading ? (
              <MovieSkeleton count={12} />
            ) : error ? (
              <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                <p className="text-red-600">{error}</p>
              </div>
            ) : movies.length === 0 ? (
              <EmptyState
                type="search"
                title="No movies found"
                description={query 
                  ? `We couldn't find any movies matching "${query}". Try different keywords or filters.`
                  : 'No movies match your selected filters.'
                }
                action={hasActiveFilters ? {
                  label: 'Clear Filters',
                  onClick: () => handleFilterChange({
                    language: '',
                    category: '',
                    genre: '',
                    year: '',
                    quality: ''
                  })
                } : null}
              />
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-6">
                  {movies.map((movie) => (
                    <MovieCard key={movie._id} movie={movie} />
                  ))}
                </div>
                
                {/* Pagination */}
                {pagination && pagination.pages > 1 && (
                  <div className="mt-8 flex justify-center">
                    <div className="flex items-center space-x-2">
                      {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                            pagination.page === page
                              ? 'bg-primary-600 text-white'
                              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}

export default SearchResults
