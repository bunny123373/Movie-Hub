import React, { useState } from 'react';
import { useNotification } from '../context/NotificationContext';

const NotificationSettings = () => {
  const { notificationPreferences, updateNotificationPreferences } = useNotification();
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = (key) => {
    const newPreferences = {
      ...notificationPreferences,
      [key]: !notificationPreferences[key]
    };
    updateNotificationPreferences(newPreferences);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-lg transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" 
          />
        </svg>
        <span>Notifications</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Notification Preferences</h3>
            
            <div className="space-y-3">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm text-gray-700">New Movies</span>
                <button
                  onClick={() => handleToggle('newMovies')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    notificationPreferences.newMovies ? 'bg-primary-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      notificationPreferences.newMovies ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm text-gray-700">Trending Movies</span>
                <button
                  onClick={() => handleToggle('trendingMovies')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    notificationPreferences.trendingMovies ? 'bg-primary-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      notificationPreferences.trendingMovies ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm text-gray-700">Category Movies</span>
                <button
                  onClick={() => handleToggle('categoryMovies')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    notificationPreferences.categoryMovies ? 'bg-primary-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      notificationPreferences.categoryMovies ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </label>
            </div>
          </div>
        </div>
      )}

      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default NotificationSettings;