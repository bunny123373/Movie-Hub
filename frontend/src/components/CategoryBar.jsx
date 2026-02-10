import React, { useState, useEffect } from 'react'

const CategoryBar = ({ selectedCategory, onSelect }) => {
  const [categories, setCategories] = useState([])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories')
        const data = await response.json()
        // Use languages from API as categories
        const languageCategories = [
          { id: 'all', label: 'All', icon: '' },
          ...(data.languages || []).map(lang => ({ id: lang, label: lang, icon: '' }))
        ]
        setCategories(languageCategories)
      } catch (error) {
        console.error('Error fetching categories:', error)
        // Fallback to hardcoded categories
        setCategories([
          { id: 'all', label: 'All', icon: '' },
          { id: 'Telugu', label: 'Telugu', icon: '' },
          { id: 'Tamil', label: 'Tamil', icon: '' },
          { id: 'Hindi', label: 'Hindi', icon: '' },
          { id: 'English', label: 'English', icon: '' },
          { id: 'Dubbed', label: 'Dubbed', icon: '' },
        ])
      }
    }
    fetchCategories()
  }, [])
  return (
    <div className="sticky top-16 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-1 py-3 overflow-x-auto scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onSelect(category.id === 'all' ? '' : category.id)}
              className={`flex-shrink-0 px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                (category.id === 'all' && !selectedCategory) || selectedCategory === category.id
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CategoryBar
