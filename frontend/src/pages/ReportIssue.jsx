import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  AlertCircle, 
  Check, 
  Send, 
  ArrowLeft,
  Bug,
  Download,
  Play,
  Wifi,
  Shield
} from 'lucide-react'
import MetaTags from '../components/MetaTags'
import { storage, createNotification, notificationTypes } from '../utils/notifications'

const FixedReportIssue = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    issueType: '',
    description: '',
    movieTitle: '',
    device: '',
    browser: '',
    steps: ''
  })
  
  const [isSubmitted, setIsSubmitted] = useState(false)

  const issueTypes = [
    { id: 'download', label: 'Download Not Working', icon: Download },
    { id: 'playback', label: 'Video Not Playing', icon: Play },
    { id: 'quality', label: 'Quality Issues', icon: Shield },
    { id: 'speed', label: 'Slow Speed', icon: Wifi },
    { id: 'bug', label: 'Website Bug', icon: Bug },
    { id: 'other', label: 'Other Issue', icon: AlertCircle }
  ]

  const devices = [
    'Desktop/Laptop (Windows)',
    'Desktop/Laptop (Mac)',
    'Desktop/Laptop (Linux)',
    'Android Phone',
    'iPhone/iPad',
    'Smart TV',
    'Other'
  ]

  const browsers = [
    'Google Chrome',
    'Mozilla Firefox',
    'Safari',
    'Microsoft Edge',
    'Opera',
    'Mobile App',
    'Other'
  ]

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      // Create notification data
      const issueTypeLabel = issueTypes.find(type => type.id === formData.issueType)?.label || 'Unknown Issue'
      
      const notification = createNotification(
        notificationTypes.ISSUE_REPORT,
        `New Issue Report: ${issueTypeLabel}`,
        `${formData.name} reported: "${issueTypeLabel}" - ${formData.description.slice(0, 100)}${formData.description.length > 100 ? '...' : ''}`,
        {
          user: {
            name: formData.name,
            email: formData.email
          },
          issue: {
            type: formData.issueType,
            title: formData.movieTitle,
            description: formData.description,
            device: formData.device,
            browser: formData.browser
          }
        }
      )
      
      // Save notification to admin storage (for demo)
      storage.save(notification)
      
      // In production, send to backend API
      // await fetch('/api/admin/notifications', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(notification)
      // })
      
      console.log('Issue report notification created:', notification)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      setIsSubmitting(false)
      setIsSubmitted(true)
    } catch (error) {
      console.error('Failed to submit issue report:', error)
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      issueType: '',
      description: '',
      movieTitle: '',
      device: '',
      browser: '',
      steps: ''
    })
    setIsSubmitted(false)
  }

  if (isSubmitted) {
    return (
      <>
        <MetaTags 
          title="Issue Reported Successfully - MovieHub"
          description="Thank you for reporting an issue. Our team will review it and get back to you soon."
        />
        
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full">
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                Issue Reported Successfully!
              </h1>
              <p className="text-gray-600 mb-8">
                Thank you for helping us improve. Our team will review your issue and get back to you within 24-48 hours.
              </p>
              <div className="space-y-3">
                <button
                  onClick={resetForm}
                  className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
                >
                  Report Another Issue
                </button>
                <Link to="/support" className="w-full bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 block text-center">
                  Back to Support
                </Link>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <MetaTags 
        title="Report Issue - MovieHub"
        description="Having trouble with downloads or playback? Report issues to our support team for quick assistance."
      />
      
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <section className="bg-gradient-to-br from-red-600 via-red-700 to-red-800 py-16">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-4">
              Report an Issue
            </h1>
            <p className="text-lg text-red-100 max-w-2xl mx-auto">
              Having trouble? Let us know what's wrong and we'll help you fix it.
            </p>
          </div>
        </section>

        {/* Form Section */}
        <section className="py-12">
          <div className="max-w-4xl mx-auto px-4">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
              <form onSubmit={handleSubmit} className="p-6 space-y-8">
                {/* Contact Information */}
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        placeholder="John Doe"
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        placeholder="john@example.com"
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Issue Type */}
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">What type of issue are you experiencing? *</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {issueTypes.map((type) => {
                      const Icon = type.icon
                      return (
                        <label
                          key={type.id}
                          className={`relative cursor-pointer rounded-xl p-4 border-2 transition-all ${
                            formData.issueType === type.id
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300 bg-white'
                          }`}
                        >
                          <input
                            type="radio"
                            name="issueType"
                            value={type.id}
                            checked={formData.issueType === type.id}
                            onChange={handleInputChange}
                            className="sr-only"
                            required
                          />
                          <div className="flex items-center space-x-3">
                            <Icon className="w-5 h-5" />
                            <span className="text-sm font-medium text-gray-900">{type.label}</span>
                          </div>
                        </label>
                      )
                    })}
                  </div>
                </div>

                {/* Issue Description */}
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Issue Description</h2>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    placeholder="Please describe what went wrong, when it happened, and what you were trying to do..."
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none resize-none"
                  />
                </div>

                {/* Technical Details */}
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Technical Details</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Device Type
                      </label>
                      <select
                        name="device"
                        value={formData.device}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                      >
                        <option value="">Select your device</option>
                        {devices.map(device => (
                          <option key={device} value={device}>{device}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Browser/App
                      </label>
                      <select
                        name="browser"
                        value={formData.browser}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                      >
                        <option value="">Select browser/app</option>
                        {browsers.map(browser => (
                          <option key={browser} value={browser}>{browser}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-200">
                  <Link
                    to="/support"
                    className="w-full sm:w-auto bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 text-center"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Support
                  </Link>
                  <button
                    type="submit"
                    className="w-full sm:w-auto bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 flex items-center justify-center"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Submit Issue
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

export default FixedReportIssue