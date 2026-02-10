import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  FileQuestion, 
  ChevronDown, 
  ChevronUp, 
  Search,
  Download,
  Play,
  Wifi,
  Shield,
  Smartphone,
  Monitor,
  HelpCircle
} from 'lucide-react'
import MetaTags from '../components/MetaTags'

const FixedFAQ = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedItems, setExpandedItems] = useState(new Set())

  const faqData = [
    {
      category: "Getting Started",
      icon: HelpCircle,
      questions: [
        {
          q: "Is MovieHub really free?",
          a: "Yes! MovieHub is completely free to use. You can browse, search, and download movies without any subscription or payment required."
        },
        {
          q: "Do I need to create an account?",
          a: "No account is required to browse or download movies. However, creating an account allows you to create watchlists and receive notifications about new movies."
        },
        {
          q: "What languages are available?",
          a: "We offer movies in multiple languages including Telugu, Tamil, Hindi, English, Kannada, Malayalam, and dubbed versions."
        }
      ]
    },
    {
      category: "Downloading Movies",
      icon: Download,
      id: "download",
      questions: [
        {
          q: "How do I download a movie?",
          a: "Simply click on any movie, choose your preferred quality (480p, 720p, 1080p, or 4K), and click download button. The movie will start downloading to your device."
        },
        {
          q: "What quality options are available?",
          a: "We offer multiple quality options: 480p (good for mobile and limited storage), 720p (HD quality), 1080p (Full HD), and 4K (Ultra HD for best quality)."
        }
      ]
    }
  ]

  const toggleQuestion = (index) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(index)) {
      newExpanded.delete(index)
    } else {
      newExpanded.add(index)
    }
    setExpandedItems(newExpanded)
  }

  const filteredFAQs = faqData.map(category => ({
    ...category,
    questions: category.questions.filter(
      item => 
        item.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.a.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.category.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.questions.length > 0)

  return (
    <>
      <MetaTags 
        title="FAQ - MovieHub Support"
        description="Find answers to frequently asked questions about downloading movies, playback issues, quality options, and more."
      />
      
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <section className="bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 py-16">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6">
              <FileQuestion className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-lg text-purple-100 max-w-2xl mx-auto mb-8">
              Find quick answers to common questions about downloading and watching movies.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-xl mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search for answers..."
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none"
                />
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Content */}
        <section className="py-12">
          <div className="max-w-4xl mx-auto px-4">
            {searchTerm && (
              <div className="mb-8">
                <p className="text-gray-600">
                  Found {filteredFAQs.reduce((acc, cat) => acc + cat.questions.length, 0)} results for "{searchTerm}"
                </p>
              </div>
            )}

            {filteredFAQs.length === 0 ? (
              <div className="text-center py-12">
                <FileQuestion className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
                <p className="text-gray-600 mb-6">
                  Try searching with different keywords or browse the categories below.
                </p>
                <button
                  onClick={() => setSearchTerm('')}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                >
                  Clear Search
                </button>
              </div>
            ) : (
              <div className="space-y-12">
                {filteredFAQs.map((category) => {
                  const Icon = category.icon
                  return (
                    <div key={category.category} className="scroll-mt-20">
                      <div className="flex items-center space-x-3 mb-6">
                        <Icon className="w-6 h-6 text-purple-600" />
                        <h2 className="text-2xl font-bold text-gray-900">{category.category}</h2>
                      </div>
                      
                      <div className="space-y-4">
                        {category.questions.map((item, index) => {
                          const questionIndex = `${category.category}-${index}`
                          const isExpanded = expandedItems.has(questionIndex)
                          
                          return (
                            <div key={index} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                              <button
                                onClick={() => toggleQuestion(questionIndex)}
                                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                              >
                                <h3 className="font-medium text-gray-900 pr-4">{item.q}</h3>
                                <div className="flex-shrink-0">
                                  {isExpanded ? (
                                    <ChevronUp className="w-5 h-5 text-gray-500" />
                                  ) : (
                                    <ChevronDown className="w-5 h-5 text-gray-500" />
                                  )}
                                </div>
                              </button>
                              
                              {isExpanded && (
                                <div className="px-6 pb-4 border-t border-gray-100">
                                  <p className="text-gray-700 leading-relaxed">{item.a}</p>
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </section>

        {/* Back to Support */}
        <section className="py-8 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <Link
              to="/support"
              className="inline-flex items-center bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700"
            >
              <ChevronUp className="w-4 h-4 mr-2 rotate-90" />
              Back to Support Center
            </Link>
          </div>
        </section>
      </div>
    </>
  )
}

export default FixedFAQ