import React from 'react'
import { Link } from 'react-router-dom'
import { Film, Heart, Github, Twitter, Mail } from 'lucide-react'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    movies: [
      { label: 'Telugu Movies', to: '/search?language=Telugu' },
      { label: 'Tamil Movies', to: '/search?language=Tamil' },
      { label: 'Hindi Movies', to: '/search?language=Hindi' },
      { label: 'English Movies', to: '/search?language=English' },
    ],
    categories: [
      { label: 'Action', to: '/search?genre=Action' },
      { label: 'Comedy', to: '/search?genre=Comedy' },
      { label: 'Romance', to: '/search?genre=Romance' },
      { label: 'Thriller', to: '/search?genre=Thriller' },
    ],
    support: [
      { label: 'How to Download', to: '#' },
      { label: 'Report Issue', to: '#' },
      { label: 'Request Movie', to: '#' },
      { label: 'FAQ', to: '#' },
    ],
  }

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
                <Film className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gradient">MovieHub</span>
            </Link>
            <p className="text-gray-500 text-sm mb-4 max-w-sm">
              Your ultimate destination for downloading high-quality movies. 
              Fast, free, and reliable movie downloads in multiple languages.
            </p>
            <div className="flex items-center space-x-4">
              <a 
                href="#" 
                className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600 hover:bg-primary-100 hover:text-primary-600 transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600 hover:bg-primary-100 hover:text-primary-600 transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600 hover:bg-primary-100 hover:text-primary-600 transition-colors"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Movies Links */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Movies</h3>
            <ul className="space-y-2">
              {footerLinks.movies.map((link) => (
                <li key={link.label}>
                  <Link 
                    to={link.to} 
                    className="text-sm text-gray-500 hover:text-primary-600 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories Links */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Genres</h3>
            <ul className="space-y-2">
              {footerLinks.categories.map((link) => (
                <li key={link.label}>
                  <Link 
                    to={link.to} 
                    className="text-sm text-gray-500 hover:text-primary-600 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Support</h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <Link 
                    to={link.to} 
                    className="text-sm text-gray-500 hover:text-primary-600 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500 text-center sm:text-left">
              {currentYear} MovieHub. All rights reserved.
            </p>
            <p className="text-sm text-gray-500 flex items-center space-x-1">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-500 fill-current" />
              <span>for movie lovers</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
