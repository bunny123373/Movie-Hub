import React, { useState } from 'react'
import { Filter, X, ChevronDown } from 'lucide-react'

const FilterPanel = ({ filters, onFilterChange, categories }) => {
  const [isOpen, setIsOpen] = useState(false)

  const genres = ['Action', 'Comedy', 'Romance', 'Thriller', 'Horror', 'Drama', 'Sci-Fi', 'Adventure']
  const qualities = ['480p', '720p', '1080p', '4K']
  const years = Array.from({ length: 25 }, (_, i) => 2024 - i)

  const handleClearFilters = () => {
    onFilterChange({
      language: '',
      category: '',
      genre: '',
      year: '',
      quality: ''
    })
  }

  const hasActiveFilters = Object.values(filters).some(v => v !== '' && v !== undefined)

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 lg:hidden"
      >
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-gray-600" />
          <span className="font-medium text-gray-900">Filters</span>
          {hasActiveFilters && (
            <span className="badge bg-primary-100 text-primary-700">
              Active
            </span>
          )}
        </div>
        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Filter Content */}
      <div className={`${isOpen ? 'block' : 'hidden'} lg:block p-4 lg:p-6 space-y-4`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900 hidden lg:block">Filters</h3>
          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="text-sm text-primary-600 hover:text-primary-700 flex items-center space-x-1"
            >
              <X className="w-4 h-4" />
              <span>Clear all</span>
            </button>
          )}
        </div>

        {/* Category Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Category</label>
          <select
            value={filters.category || ''}
            onChange={(e) => onFilterChange({ ...filters, category: e.target.value })}
            className="input text-sm"
          >
            <option value="">All Categories</option>
            <option value="Movie">Movies</option>
            <option value="TV Series">TV Series</option>
            <option value="Dubbed">Dubbed</option>
          </select>
        </div>

        {/* Genre Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Genre</label>
          <select
            value={filters.genre || ''}
            onChange={(e) => onFilterChange({ ...filters, genre: e.target.value })}
            className="input text-sm"
          >
            <option value="">All Genres</option>
            {genres.map(genre => (
              <option key={genre} value={genre}>{genre}</option>
            ))}
          </select>
        </div>

        {/* Year Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Year</label>
          <select
            value={filters.year || ''}
            onChange={(e) => onFilterChange({ ...filters, year: e.target.value })}
            className="input text-sm"
          >
            <option value="">All Years</option>
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>

        {/* Quality Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Quality</label>
          <div className="flex flex-wrap gap-2">
            {qualities.map(quality => (
              <button
                key={quality}
                onClick={() => onFilterChange({ 
                  ...filters, 
                  quality: filters.quality === quality ? '' : quality 
                })}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  filters.quality === quality
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {quality}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default FilterPanel
