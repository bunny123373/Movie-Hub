// Notification storage utilities
export const storage = {
  // Save notification to localStorage
  save: (notification) => {
    try {
      const notifications = storage.get()
      notifications.push({
        ...notification,
        id: Date.now().toString(),
        timestamp: new Date().toISOString()
      })
      localStorage.setItem('admin_notifications', JSON.stringify(notifications.slice(-50))) // Keep last 50
    } catch (error) {
      console.error('Failed to save notification:', error)
    }
  },

  // Get all notifications from localStorage
  get: () => {
    try {
      const stored = localStorage.getItem('admin_notifications')
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.error('Failed to get notifications:', error)
      return []
    }
  },

  // Clear all notifications
  clear: () => {
    try {
      localStorage.removeItem('admin_notifications')
    } catch (error) {
      console.error('Failed to clear notifications:', error)
    }
  },

  // Mark notification as read
  markAsRead: (id) => {
    try {
      const notifications = storage.get()
      const updated = notifications.map(n => 
        n.id === id ? { ...n, read: true } : n
      )
      localStorage.setItem('admin_notifications', JSON.stringify(updated))
    } catch (error) {
      console.error('Failed to mark notification as read:', error)
    }
  }
}

// Notification types
export const notificationTypes = {
  ISSUE_REPORT: 'issue_report',
  MOVIE_REQUEST: 'movie_request',
  NEW_USER: 'new_user',
  SYSTEM_ALERT: 'system_alert'
}

// Notification helpers
export const createNotification = (type, title, message, data = {}) => ({
  type,
  title,
  message,
  data,
  read: false
})