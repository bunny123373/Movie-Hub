import React, { createContext, useContext, useState } from 'react';

const NotificationEventContext = createContext();

export const useNotificationEvent = () => {
  const context = useContext(NotificationEventContext);
  if (!context) {
    throw new Error('useNotificationEvent must be used within a NotificationEventProvider');
  }
  return context;
};

export const NotificationEventProvider = ({ children }) => {
  const [listeners, setListeners] = useState([]);

  const subscribe = (callback) => {
    const id = Date.now() + Math.random();
    setListeners(prev => [...prev, { id, callback }]);
    return () => {
      setListeners(prev => prev.filter(listener => listener.id !== id));
    };
  };

  const notifyMovieUploaded = (movie) => {
    listeners.forEach(listener => {
      try {
        listener.callback(movie);
      } catch (error) {
        console.error('Error in notification listener:', error);
      }
    });
  };

  const value = {
    subscribe,
    notifyMovieUploaded
  };

  return (
    <NotificationEventContext.Provider value={value}>
      {children}
    </NotificationEventContext.Provider>
  );
};