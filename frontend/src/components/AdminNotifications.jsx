import React, { useState, useEffect } from 'react'
import { 
  Bell, 
  X, 
  AlertCircle, 
  MessageSquare, 
  Film,
  Check,
  Settings,
  ChevronDown,
  Eye,
  Reply
} from 'lucide-react'
import { storage } from '../utils/notifications'
import NotificationDetail from './NotificationDetail'
import { playNotificationSound, requestNotificationPermission, showBrowserNotification } from '../utils/notificationEffects'

const AdminNotifications = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [selectedNotification, setSelectedNotification] = useState(null)
  const [replies, setReplies] = useState([])

  useEffect(() => {
    // Load notifications from storage
    const loadedNotifications = storage.get()
    setNotifications(loadedNotifications)
    
    // Load replies from storage
    const loadedReplies = JSON.parse(localStorage.getItem('notification_replies') || '[]')
    setReplies(loadedReplies)
    
    // Fetch replies from backend when opening detail view
    const fetchRepliesForNotification = async (notificationId) => {
      try {
        const response = await fetch(`/api/admin/notifications/${notificationId}/replies`)
        const data = await response.json()
        if (data.success) {
          setReplies(data.replies || [])
        }
      } catch (error) {
        console.error('Failed to fetch replies:', error)
      }
    }
  }, [])

  // Listen for new notifications (poll for demo)
  useEffect(() => {
    const interval = setInterval(() => {
      const currentNotifications = storage.get()
      const newNotifications = currentNotifications.filter(n => 
        !notifications.some(existing => existing.id === n.id)
      )
      
      if (newNotifications.length > 0) {
        setNotifications(prev => [...newNotifications, ...prev])
        
        // Play sound for new notifications
        playNotificationSound()
        
        // Show browser notification for first new notification
        if (newNotifications[0]) {
          showBrowserNotification(
            newNotifications[0].title,
            newNotifications[0].message
          )
        }
      }
    }, 3000) // Check every 3 seconds

    return () => clearInterval(interval)
  }, [notifications])

  // Request browser notification permission on mount
  useEffect(() => {
    requestNotificationPermission()
  }, [])

  const unreadCount = notifications.filter(n => !n.read).length

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'issue_report':
        return <AlertCircle className="w-5 h-5 text-red-500" />
      case 'movie_request':
        return <Film className="w-5 h-5 text-blue-500" />
      case 'new_user':
        return <Bell className="w-5 h-5 text-green-500" />
      case 'system_alert':
        return <AlertCircle className="w-5 h-5 text-orange-500" />
      default:
        return <MessageSquare className="w-5 h-5 text-gray-500" />
    }
  }

  const getNotificationColor = (type) => {
    switch (type) {
      case 'issue_report':
        return 'border-red-200 bg-red-50 hover:bg-red-100'
      case 'movie_request':
        return 'border-blue-200 bg-blue-50 hover:bg-blue-100'
      case 'new_user':
        return 'border-green-200 bg-green-50 hover:bg-green-100'
      case 'system_alert':
        return 'border-orange-200 bg-orange-50 hover:bg-orange-100'
      default:
        return 'border-gray-200 bg-gray-50 hover:bg-gray-100'
    }
  }

  const markAsRead = (id) => {
    storage.markAsRead(id)
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    )
  }

  const deleteNotification = (id) => {
    const updated = notifications.filter(n => n.id !== id)
    setNotifications(updated)
    
    // Also remove from storage
    const allNotifications = storage.get()
    const filtered = allNotifications.filter(n => n.id !== id)
    localStorage.setItem('admin_notifications', JSON.stringify(filtered))
  }

  const openNotificationDetail = async (notification) => {
    // Mark as read
    markAsRead(notification.id)
    
    // Fetch replies for this notification
    await fetchRepliesForNotification(notification.id)
    
    // Open detail view
    setSelectedNotification(notification)
    setIsOpen(false) // Close dropdown
  }

  const closeNotificationDetail = () => {
    setSelectedNotification(null)
  }

  const handleReply = (notificationId, reply) => {
    console.log('Reply sent for notification:', notificationId, reply)
    // In a real app, you might want to update the notification to show it has been replied to
  }

  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    
    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours}h ago`
    return date.toLocaleDateString()
  }

  return (
    <div className="fixed top-16 right-4 z-50">
      {/* Bell Icon with Badge */}
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors bg-white rounded-lg shadow-md"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </button>
      </div>

      {/* Notifications Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
            <h3 className="font-semibold text-gray-900">Notifications</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No notifications yet</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                      !notification.read ? 'bg-blue-50' : 'bg-white'
                    }`}
                    onClick={() => !notification.read && markAsRead(notification.id)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${getNotificationColor(notification.type)}`}>
                        {getNotificationIcon(notification.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className={`font-medium text-sm ${!notification.read ? 'text-gray-900' : 'text-gray-600'}`}>
                            {notification.title}
                          </h4>
                          <div className="flex items-center space-x-2">
                            {!notification.read && (
                              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                            )}
                            
                            {/* Reply Indicator */}
                            {replies.some(r => r.notificationId === notification.id) && (
                              <div className="flex items-center space-x-1 text-blue-600">
                                <Reply className="w-3 h-3" />
                                <span className="text-xs">Replied</span>
                              </div>
                            )}
                            
                            {/* View Details Button */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                openNotificationDetail(notification)
                              }}
                              className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <p className={`text-sm ${!notification.read ? 'text-gray-700' : 'text-gray-500'}`}>
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {formatTime(notification.timestamp)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-between">
            <button
              onClick={() => {
                notifications.forEach(n => markAsRead(n.id))
                setIsOpen(false)
              }}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Mark All as Read
            </button>
            <button
              onClick={() => {
                if (confirm('Clear all notifications?')) {
                  storage.clear()
                  setNotifications([])
                  setIsOpen(false)
                }
              }}
              className="text-sm text-red-600 hover:text-red-800 font-medium"
            >
              Clear All
            </button>
          </div>
        </div>
      )}
      
      {/* Notification Detail Modal */}
      {selectedNotification && (
        <NotificationDetail
          notification={selectedNotification}
          onClose={closeNotificationDetail}
          onReply={handleReply}
        />
      )}
    </div>
  )
}

export default AdminNotifications