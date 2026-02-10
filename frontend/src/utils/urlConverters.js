/**
 * Convert Google Drive URLs to direct download URLs
 * Google Drive share URLs: https://drive.google.com/file/d/FILEID/view?usp=sharing
 * Direct download URLs: https://drive.google.com/uc?export=download&id=FILEID
 */
export const convertGoogleDriveUrl = (url) => {
  if (!url || typeof url !== 'string') {
    return url
  }

  // Check if it's a Google Drive URL
  const driveRegex = /https:\/\/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/
  const match = url.match(driveRegex)
  
  if (match) {
    const fileId = match[1]
    // Convert to direct download URL
    return `https://drive.google.com/uc?export=download&id=${fileId}`
  }

  // Return original URL if it's not a Google Drive URL
  return url
}

/**
 * Convert Pixeldrain URLs to direct download URLs
 * Pixeldrain share URLs: https://pixeldrain.com/u/filename
 * Direct download URLs: https://pixeldrain.com/api/file/filename
 */
export const convertPixeldrainUrl = (url) => {
  if (!url || typeof url !== 'string') {
    return url
  }

  // Check if it's a Pixeldrain URL
  const pixeldrainRegex = /https:\/\/pixeldrain\.com\/u\/([^\/\s]+)/
  const match = url.match(pixeldrainRegex)
  
  if (match) {
    const fileId = match[1]
    // Convert to direct download API URL
    return `https://pixeldrain.com/api/file/${fileId}`
  }

  // Return original URL if it's not a Pixeldrain URL
  return url
}

/**
 * Convert URLs - Only Google Drive to direct download, others unchanged
 */
export const convertUrls = (urls) => {
  if (!Array.isArray(urls)) {
    return urls
  }
  
  return urls.map(url => {
    // Only convert Google Drive URLs
    return convertGoogleDriveUrl(url)
  })
}

/**
 * Check if a URL is a Google Drive URL
 */
export const isGoogleDriveUrl = (url) => {
  if (!url || typeof url !== 'string') {
    return false
  }
  return /https:\/\/drive\.google\.com\/file\/d\//.test(url)
}

/**
 * Check if a URL is a Pixeldrain URL
 */
export const isPixeldrainUrl = (url) => {
  if (!url || typeof url !== 'string') {
    return false
  }
  return /https:\/\/pixeldrain\.com\/u\//.test(url)
}



/**
 * Check if a URL is a direct MP4 video link
 */
export const isDirectVideoUrl = (url) => {
  if (!url || typeof url !== 'string') {
    return false
  }
  
  // Check for common video file extensions
  const videoExtensions = ['.mp4', '.avi', '.mkv', '.mov', '.wmv', '.flv', '.webm', '.m4v']
  const urlLower = url.toLowerCase()
  
  return videoExtensions.some(ext => urlLower.includes(ext))
}

/**
 * Check if a URL is from common video hosting platforms
 */
export const isVideoHostingUrl = (url) => {
  if (!url || typeof url !== 'string') {
    return false
  }
  
  const videoHostings = [
    'streamable.com',
    'vimeo.com',
    'dailymotion.com',
    'twitch.tv',
    'youtube.com/watch',
    'youtu.be'
  ]
  
  return videoHostings.some(hosting => url.toLowerCase().includes(hosting))
}

/**
 * Get video type from URL
 */
export const getVideoType = (url) => {
  if (!url || typeof url !== 'string') {
    return null
  }
  
  const urlLower = url.toLowerCase()
  
  if (isDirectVideoUrl(url)) {
    return 'Direct Video'
  }
  
  if (isVideoHostingUrl(url)) {
    return 'Video Hosting'
  }
  
  if (isGoogleDriveUrl(url)) {
    return 'Google Drive'
  }
  
  if (isPixeldrainUrl(url)) {
    return 'Pixeldrain'
  }
  
  return 'File Hosting'
}

/**
 * Enhanced URL converter that handles multiple URL types
 */
export const convertAllUrls = (urls) => {
  if (!Array.isArray(urls)) {
    return urls
  }
  
  return urls.map(url => {
    // First convert Pixeldrain URLs
    let convertedUrl = convertPixeldrainUrl(url)
    
    // Add any other URL conversions here if needed
    // For now, just return the converted URL
    return convertedUrl
  })
}