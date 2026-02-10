import React from 'react'
import { Link } from 'react-router-dom'
import { 
  Download, 
  Monitor, 
  Smartphone, 
  Check, 
  AlertCircle, 
  ArrowRight,
  Play,
  HardDrive,
  Wifi,
  Shield
} from 'lucide-react'
import MetaTags from '../components/MetaTags'

const HowToDownload = () => {
  const downloadSteps = [
    {
      title: "Search for Your Movie",
      description: "Browse our collection or use the search bar to find the movie you want to download.",
      icon: "🔍"
    },
    {
      title: "Choose Quality",
      description: "Select from available quality options like 480p, 720p, 1080p, or 4K based on your preference and device.",
      icon: "🎯"
    },
    {
      title: "Click Download",
      description: "Click the download button next to your chosen quality option.",
      icon: "⬇️"
    },
    {
      title: "Wait for Download",
      description: "Wait for the download to complete. Large files may take longer depending on your connection.",
      icon: "⏳"
    },
    {
      title: "Enjoy Your Movie",
      description: "Once downloaded, you can watch the movie offline on any compatible device.",
      icon: "🎬"
    }
  ]

  const deviceInstructions = [
    {
      device: "Desktop/Laptop",
      icon: Monitor,
      steps: [
        "Click on your chosen movie",
        "Select download quality",
        "Choose a save location on your computer",
        "Wait for the download to complete",
        "Open the file with VLC, Windows Media Player, or similar"
      ]
    },
    {
      device: "Mobile Phone",
      icon: Smartphone,
      steps: [
        "Visit our mobile-optimized website",
        "Tap on the movie you want",
        "Choose quality and tap download",
        "Check your downloads folder",
        "Use MX Player, VLC, or similar apps to watch"
      ]
    }
  ]

  const troubleshootingTips = [
    {
      title: "Download Not Starting",
      solutions: [
        "Disable ad blockers temporarily",
        "Check browser download permissions",
        "Try a different browser (Chrome, Firefox)",
        "Ensure you have sufficient storage space",
        "Check your internet connection"
      ],
      icon: AlertCircle
    },
    {
      title: "Slow Download Speed",
      solutions: [
        "Check your internet speed",
        "Close other applications using bandwidth",
        "Try downloading during off-peak hours",
        "Use a wired connection if possible",
        "Lower the video quality for faster download"
      ],
      icon: Wifi
    },
    {
      title: "File Not Playing",
      solutions: [
        "Install VLC Media Player (works with all formats)",
        "Update your video player",
        "Check if the file is fully downloaded",
        "Try a different video player app",
        "Ensure your device supports the file format"
      ],
      icon: Play
    }
  ]

  return (
    <>
      <MetaTags 
        title="How to Download Movies - MovieHub"
        description="Complete guide on how to download movies from MovieHub. Step-by-step instructions for desktop and mobile devices."
      />
      
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-700 py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Download className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              How to Download Movies
            </h1>
            <p className="text-lg sm:text-xl text-primary-100 max-w-2xl mx-auto">
              Easy step-by-step guide to download and enjoy your favorite movies on any device.
            </p>
          </div>
        </section>

        {/* Quick Steps */}
        <section className="py-12 lg:py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                5 Simple Steps to Download
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Follow these simple steps to download any movie from our platform.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {downloadSteps.map((step, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">{step.icon}</span>
                  </div>
                  <div className="bg-primary-600 text-white w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-3 font-semibold">
                    {index + 1}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600 text-sm">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Device Specific Instructions */}
        <section id="mobile" className="py-12 lg:py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                Device-Specific Instructions
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Detailed instructions for different devices and platforms.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {deviceInstructions.map((device) => {
                const Icon = device.icon
                return (
                  <div key={device.device} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                        <Icon className="w-6 h-6 text-primary-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900">{device.device}</h3>
                    </div>
                    
                    <div className="space-y-4">
                      {device.steps.map((step, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Check className="w-3 h-3 text-green-600" />
                          </div>
                          <p className="text-gray-700">{step}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Quality Guide */}
        <section className="py-12 lg:py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                Choose the Right Quality
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Select the best quality based on your device, storage, and internet speed.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
                <h3 className="font-bold text-gray-900 mb-2">480p</h3>
                <p className="text-sm text-gray-600 mb-4">Good quality, smaller file size</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">File Size:</span>
                    <span className="font-medium">300-500 MB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Best for:</span>
                    <span className="font-medium">Mobile, Storage</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                <h3 className="font-bold text-blue-900 mb-2">720p</h3>
                <p className="text-sm text-blue-700 mb-4">HD quality, balanced size</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-blue-600">File Size:</span>
                    <span className="font-medium">700 MB - 1.5 GB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-600">Best for:</span>
                    <span className="font-medium">Tablets, Laptops</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
                <h3 className="font-bold text-green-900 mb-2">1080p</h3>
                <p className="text-sm text-green-700 mb-4">Full HD, great quality</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-green-600">File Size:</span>
                    <span className="font-medium">1.5 - 3 GB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-600">Best for:</span>
                    <span className="font-medium">Large Screens</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
                <h3 className="font-bold text-purple-900 mb-2">4K</h3>
                <p className="text-sm text-purple-700 mb-4">Ultra HD, premium quality</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-purple-600">File Size:</span>
                    <span className="font-medium">4 - 8 GB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-600">Best for:</span>
                    <span className="font-medium">4K TVs, Storage</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Troubleshooting */}
        <section id="troubleshooting" className="py-12 lg:py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                Troubleshooting Common Issues
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Solutions to common download and playback problems.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {troubleshootingTips.map((tip) => {
                const Icon = tip.icon
                return (
                  <div key={tip.title} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center space-x-3 mb-4">
                      <Icon className="w-5 h-5 text-orange-500" />
                      <h3 className="font-semibold text-gray-900">{tip.title}</h3>
                    </div>
                    <ul className="space-y-2">
                      {tip.solutions.map((solution, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700 text-sm">{solution}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Pro Tips */}
        <section className="py-12 lg:py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-2xl p-8 border border-primary-100">
              <div className="text-center mb-8">
                <Shield className="w-12 h-12 text-primary-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Pro Tips for Better Downloads</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl p-6">
                  <HardDrive className="w-8 h-8 text-blue-600 mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-2">Storage Management</h3>
                  <p className="text-gray-600 text-sm">
                    Always check available storage before downloading large files. Keep at least 5GB free for smooth operation.
                  </p>
                </div>
                
                <div className="bg-white rounded-xl p-6">
                  <Wifi className="w-8 h-8 text-green-600 mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-2">Internet Connection</h3>
                  <p className="text-gray-600 text-sm">
                    Use a stable internet connection. Wi-Fi is recommended for large file downloads to avoid data charges.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 lg:py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              Ready to Start Downloading?
            </h2>
            <p className="text-gray-600 mb-8">
              Now that you know how to download, explore our collection of movies in various languages and qualities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/"
                className="btn-primary px-6 py-3"
              >
                Browse Movies
              </Link>
              <Link
                to="/support/faq"
                className="btn-secondary px-6 py-3"
              >
                More Help
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

export default HowToDownload