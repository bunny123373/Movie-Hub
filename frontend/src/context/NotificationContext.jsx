import React, { createContext, useContext, useState, useEffect } from 'react';

const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [lastVisit, setLastVisit] = useState(() => {
    const stored = localStorage.getItem('lastMovieVisit');
    return stored ? new Date(stored) : new Date(0);
  });
  
  const [notificationPreferences, setNotificationPreferences] = useState(() => {
    const stored = localStorage.getItem('notificationPreferences');
    return stored ? JSON.parse(stored) : {
      newMovies: true,
      trendingMovies: true,
      categoryMovies: true
    };
  });

  const updateLastVisit = () => {
    const now = new Date();
    setLastVisit(now);
    localStorage.setItem('lastMovieVisit', now.toISOString());
  };

  const updateNotificationPreferences = (preferences) => {
    setNotificationPreferences(preferences);
    localStorage.setItem('notificationPreferences', JSON.stringify(preferences));
  };

  const isNewMovie = (createdAt) => {
    if (!createdAt) return false;
    const movieDate = new Date(createdAt);
    return movieDate > lastVisit;
  };

  const getNewMoviesCount = (movies) => {
    if (!movies || !Array.isArray(movies)) return 0;
    return movies.filter(movie => isNewMovie(movie.createdAt)).length;
  };

  const value = {
    lastVisit,
    notificationPreferences,
    updateLastVisit,
    updateNotificationPreferences,
    isNewMovie,
    getNewMoviesCount
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};