import { useEffect } from 'react';
import { useNotification } from '../context/NotificationContext';
import { useToast } from './useToast';

export const useNewMovieNotifications = (movies) => {
  const { getNewMoviesCount, updateLastVisit, notificationPreferences } = useNotification();
  const { success, info } = useToast();

  useEffect(() => {
    if (!movies || !Array.isArray(movies)) return;

    const newMoviesCount = getNewMoviesCount(movies);
    
    if (newMoviesCount > 0 && notificationPreferences.newMovies) {
      if (newMoviesCount === 1) {
        info(`🎬 New movie added! Check out what's new!`);
      } else {
        success(`🎬 ${newMoviesCount} new movies added since your last visit!`);
      }
      
      // Update last visit after showing notifications
      setTimeout(() => {
        updateLastVisit();
      }, 1000);
    }
  }, [movies, getNewMoviesCount, updateLastVisit, notificationPreferences, info, success]);
};