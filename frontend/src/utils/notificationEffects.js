// Notification sound effect (optional)
export const playNotificationSound = () => {
  try {
    // Create a simple beep sound using Web Audio API
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800; // 800Hz beep
    oscillator.type = 'sine';
    gainNode.gain.value = 0.1; // Low volume
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1); // 100ms beep
  } catch (error) {
    console.log('Audio not supported or permission denied:', error)
  }
}

// Browser notification permission
export const requestNotificationPermission = async () => {
  if ('Notification' in window) {
    const permission = await Notification.requestPermission()
    return permission === 'granted'
  }
  return false
}

// Show browser notification
export const showBrowserNotification = (title, body, icon = null) => {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, {
      body,
      icon,
      tag: 'moviehub-notification'
    })
  }
}