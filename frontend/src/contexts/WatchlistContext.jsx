import React, { createContext, useContext, useState, useEffect } from 'react'

const WatchlistContext = createContext()

export const useWatchlist = () => {
  const context = useContext(WatchlistContext)
  if (!context) {
    throw new Error('useWatchlist must be used within WatchlistProvider')
  }
  return context
}

export const WatchlistProvider = ({ children }) => {
  const [watchlist, setWatchlist] = useState([])

  useEffect(() => {
    const saved = localStorage.getItem('movieWatchlist')
    if (saved) {
      try {
        setWatchlist(JSON.parse(saved))
      } catch (e) {
        console.error('Error parsing watchlist:', e)
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('movieWatchlist', JSON.stringify(watchlist))
  }, [watchlist])

  const addToWatchlist = (movie) => {
    setWatchlist(prev => {
      if (prev.some(item => item._id === movie._id)) {
        return prev
      }
      return [...prev, movie]
    })
  }

  const removeFromWatchlist = (movieId) => {
    setWatchlist(prev => prev.filter(item => item._id !== movieId))
  }

  const isInWatchlist = (movieId) => {
    return watchlist.some(item => item._id === movieId)
  }

  const toggleWatchlist = (movie) => {
    if (isInWatchlist(movie._id)) {
      removeFromWatchlist(movie._id)
      return false
    } else {
      addToWatchlist(movie)
      return true
    }
  }

  const clearWatchlist = () => {
    setWatchlist([])
  }

  return (
    <WatchlistContext.Provider value={{
      watchlist,
      addToWatchlist,
      removeFromWatchlist,
      isInWatchlist,
      toggleWatchlist,
      clearWatchlist
    }}>
      {children}
    </WatchlistContext.Provider>
  )
}
