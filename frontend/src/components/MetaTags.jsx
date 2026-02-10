import React from 'react'
import { Helmet } from 'react-helmet-async'

const MetaTags = ({ 
  title = 'MovieHub - Download Movies',
  description = 'Download your favorite movies in high quality. Telugu, Tamil, Hindi, English movies available.',
  image = '/og-image.jpg',
  url = typeof window !== 'undefined' ? window.location.href : ''
}) => {
  const siteName = 'MovieHub'
  const fullTitle = title.includes(siteName) ? title : `${title} | ${siteName}`

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="robots" content="index, follow" />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content={siteName} />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />
      
      {/* Additional */}
      <meta name="theme-color" content="#3b82f6" />
      <meta name="msapplication-TileColor" content="#3b82f6" />
    </Helmet>
  )
}

export default MetaTags
