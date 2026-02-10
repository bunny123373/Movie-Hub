import React, { useState } from 'react'
import { Share2, Copy, Check, MessageCircle } from 'lucide-react'

const ShareButtons = ({ movie }) => {
  const [copied, setCopied] = useState(false)
  
  const shareUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/movie/${movie._id}`
    : ''
  
  const shareText = `Check out ${movie.title} (${movie.year}) - ${movie.language} Movie`

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleWhatsAppShare = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${shareText}\n${shareUrl}`)}`
    window.open(whatsappUrl, '_blank')
  }

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: movie.title,
          text: shareText,
          url: shareUrl
        })
      } catch (err) {
        console.error('Share failed:', err)
      }
    }
  }

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm text-gray-500 mr-2">Share:</span>
      
      {/* Copy Link */}
      <button
        onClick={handleCopyLink}
        className={`p-2 rounded-lg transition-all duration-200 ${
          copied 
            ? 'bg-green-100 text-green-600' 
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
        title="Copy link"
      >
        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
      </button>

      {/* WhatsApp */}
      <button
        onClick={handleWhatsAppShare}
        className="p-2 rounded-lg bg-green-100 text-green-600 hover:bg-green-200 transition-colors"
        title="Share on WhatsApp"
      >
        <MessageCircle className="w-4 h-4" />
      </button>

      {/* Native Share (Mobile) */}
      {typeof navigator !== 'undefined' && navigator.share && (
        <button
          onClick={handleNativeShare}
          className="p-2 rounded-lg bg-primary-100 text-primary-600 hover:bg-primary-200 transition-colors"
          title="Share"
        >
          <Share2 className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}

export default ShareButtons
