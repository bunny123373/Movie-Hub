import React, { useEffect } from 'react';
import { useNotificationEvent } from '../context/NotificationEventContext';
import { useToast } from '../hooks/useToast';

const RealTimeNotifications = () => {
  const { subscribe } = useNotificationEvent();
  const { success } = useToast();

  useEffect(() => {
    const unsubscribe = subscribe((movie) => {
      if (movie) {
        success(`🎬 New movie "${movie.title}" has been uploaded!`);
      }
    });

    return unsubscribe;
  }, [subscribe, success]);

  // This component doesn't render anything, it just handles notifications
  return null;
};

export default RealTimeNotifications;