import React from 'react'
import { Link } from 'react-router-dom'
import { 
  HelpCircle, 
  Download, 
  AlertCircle, 
  MessageSquare, 
  FileQuestion,
  ArrowRight
} from 'lucide-react'
import MetaTags from '../components/MetaTags'

const supportCards = [
  {
    title: 'How to Download',
    description: 'Learn how to download movies from our platform with step-by-step instructions and troubleshooting tips.',
    icon: Download,
    href: '/support/how-to-download',
    color: 'blue'
  },
  {
    title: 'Report Issue',
    description: 'Having trouble? Report any issues you encounter with downloads, playback, or website functionality.',
    icon: AlertCircle,
    href: '/support/report-issue',
    color: 'red'
  },
  {
    title: 'Request Movie',
    description: "Can't find a movie you're looking for? Submit a request and we'll try to add it to our collection.",
    icon: MessageSquare,
    href: '/support/request-movie',
    color: 'green'
  },
  {
    title: 'FAQ',
    description: 'Find answers to frequently asked questions about downloads, quality, formats, and more.',
    icon: FileQuestion,
    href: '/support/faq',
    color: 'purple'
  }
]

const colorClasses = {
  blue: 'bg-blue-100 text-blue-600 hover:bg-blue-50',
  red: 'bg-red-100 text-red-600 hover:bg-red-50',
  green: 'bg-green-100 text-green-600 hover:bg-green-50',
  purple: 'bg-purple-100 text-purple-600 hover:bg-purple-50'
}

const Support = () => {
  return (
    <>
      <MetaTags 
        title="Support - MovieHub"
        description="Get help with downloading movies, reporting issues, requesting movies, and find answers to frequently asked questions."
      />
      
      <div className="min-h-screen bg-gray-50">
        {/* Header Section */}
        <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-700 py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6">
              <HelpCircle className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              Help & Support
            </h1>
            <p className="text-lg sm:text-xl text-primary-100 max-w-2xl mx-auto mb-8">
              Find answers, report issues, and get help with downloading your favorite movies.
            </p>
          </div>
        </section>

        {/* Support Cards */}
        <section className="py-12 lg:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {supportCards.map((card) => {
                const Icon = card.icon
                return (
                  <Link
                    key={card.title}
                    to={card.href}
                    className={`group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}
                  >
                    <div className={`w-12 h-12 ${colorClasses[card.color]} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {card.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">
                      {card.description}
                    </p>
                    <div className="flex items-center text-primary-600 font-medium text-sm group-hover:text-primary-700 transition-colors">
                      <span>Get Started</span>
                      <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>

        {/* Quick Help Section */}
        <section className="py-12 lg:py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                Quick Help Topics
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Common issues and questions that users frequently ask.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-3">🎬 Download Not Starting?</h3>
                <p className="text-gray-600 text-sm mb-3">
                  Check if your browser is blocking downloads and ensure you have sufficient storage space.
                </p>
                <Link 
                  to="/support/how-to-download#troubleshooting"
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                >
                  Learn More →
                </Link>
              </div>

              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-3">📱 Mobile Downloads?</h3>
                <p className="text-gray-600 text-sm mb-3">
                  Learn how to download movies on mobile devices and compatible apps for playback.
                </p>
                <Link 
                  to="/support/how-to-download#mobile"
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                >
                  View Guide →
                </Link>
              </div>

              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-3">🔧 Video Not Playing?</h3>
                <p className="text-gray-600 text-sm mb-3">
                  Find the right video player and codec support for different file formats.
                </p>
                <Link 
                  to="/support/faq#playback"
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                >
                  Get Solutions →
                </Link>
              </div>

              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-3">⚡ Slow Downloads?</h3>
                <p className="text-gray-600 text-sm mb-3">
                  Tips to improve download speed and troubleshoot connection issues.
                </p>
                <Link 
                  to="/support/faq#download-speed"
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                >
                  Speed Tips →
                </Link>
              </div>

              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-3">📁 File Formats?</h3>
                <p className="text-gray-600 text-sm mb-3">
                  Understand different video formats and which ones work best for your device.
                </p>
                <Link 
                  to="/support/faq#formats"
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                >
                  Format Guide →
                </Link>
              </div>

              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-3">🔒 Is It Safe?</h3>
                <p className="text-gray-600 text-sm mb-3">
                  Learn about our safety measures and how to stay secure while downloading.
                </p>
                <Link 
                  to="/support/faq#safety"
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                >
                  Safety Info →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-12 lg:py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              Still Need Help?
            </h2>
            <p className="text-gray-600 mb-8">
              If you can't find the answer you're looking for, don't hesitate to reach out to our support team.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/support/report-issue"
                className="btn-primary px-6 py-3"
              >
                Report an Issue
              </Link>
              <Link
                to="/support/request-movie"
                className="btn-secondary px-6 py-3"
              >
                Request a Movie
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

export default Support