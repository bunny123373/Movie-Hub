import React from 'react'
import { Link } from 'react-router-dom'
import { Film, Home, Search } from 'lucide-react'

const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* 404 Illustration */}
        <div className="relative mb-8">
          <div className="w-32 h-32 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full flex items-center justify-center mx-auto">
            <Film className="w-16 h-16 text-primary-600" />
          </div>
          <div className="absolute -top-2 -right-2 w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <span className="text-2xl font-bold text-red-600">404</span>
          </div>
        </div>

        {/* Text */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Page Not Found
        </h1>
        <p className="text-gray-500 mb-8">
          Oops! The page you're looking for seems to have wandered off. 
          It might have been moved or deleted.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/"
            className="flex items-center space-x-2 px-6 py-3 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-colors w-full sm:w-auto justify-center"
          >
            <Home className="w-5 h-5" />
            <span>Go Home</span>
          </Link>
          <Link
            to="/search"
            className="flex items-center space-x-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors w-full sm:w-auto justify-center"
          >
            <Search className="w-5 h-5" />
            <span>Search Movies</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default NotFound
