import React, { useState } from 'react'
import { 
  X, 
  Reply, 
  Send, 
  AlertCircle, 
  Film,
  User,
  Mail,
  Clock,
  Check
} from 'lucide-react'

const NotificationDetail = ({ notification, onClose }) => {
  const [replyText, setReplyText] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [replySent, setReplySent] = useState(false)

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'issue_report':
        return <AlertCircle className="w-6 h-6 text-red-500" />
      case 'movie_request':
        return <Film className="w-6 h-6 text-blue-500" />
      case 'new_user':
        return <User className="w-6 h-6 text-green-500" />
      default:
        return <Mail className="w-6 h-6 text-gray-500" />
    }
  }

  const getNotificationColor = (type) => {
    switch (type) {
      case 'issue_report':
        return 'border-red-200 bg-red-50'
      case 'movie_request':
        return 'border-blue-200 bg-blue-50'
      case 'new_user':
        return 'border-green-200 bg-green-50'
      default:
        return 'border-gray-200 bg-gray-50'
    }
  }

  const handleReply = async (e) => {
    e.preventDefault()
    if (!replyText.trim()) return

    setIsSending(true)
    
    try {
      const reply = {
        id: Date.now().toString(),
        notificationId: notification.id,
        message: replyText.trim(),
        timestamp: new Date().toISOString(),
        adminReply: true
      }

      const replies = JSON.parse(localStorage.getItem('notification_replies') || '[]')
      replies.push(reply)
      localStorage.setItem('notification_replies', JSON.stringify(replies))

      console.log('Sending reply:', {
        to: notification.data.user?.email,
        subject: `Re: ${notification.title}`,
        message: replyText.trim()
      })

      await new Promise(resolve => setTimeout(resolve, 1500))
      
      setReplySent(true)
      setIsSending(false)
    } catch (error) {
      console.error('Failed to send reply:', error)
      setIsSending(false)
    }
  }

  const formatDateTime = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const resetReply = () => {
    setReplySent(false)
    setReplyText('')
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getNotificationColor(notification.type)}`}>
              {getNotificationIcon(notification.type)}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{notification.title}</h2>
              <p className="text-sm text-gray-500">{formatDateTime(notification.timestamp)}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Original Message */}
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Original Message</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700 leading-relaxed">{notification.message}</p>
              </div>
            </div>

            {/* User Details */}
            {notification.data.user && (
              <div>
                <h3 className="font-medium text-gray-900 mb-3">User Information</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">Name:</span>
                    <span className="text-sm text-gray-900">{notification.data.user.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">Email:</span>
                    <span className="text-sm text-gray-900">{notification.data.user.email}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Reply Section */}
            <div className="border-t border-gray-200 p-6">
              {replySent ? (
                <div className="text-center py-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Reply Sent!</h3>
                  <p className="text-gray-600">
                    Your reply has been sent to {notification.data.user?.email || 'the user'}
                  </p>
                  <button onClick={resetReply} className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                    Send Another Reply
                  </button>
                </div>
              ) : (
                <form onSubmit={handleReply} className="space-y-4">
                  <div>
                      <h3 className="font-medium text-gray-900 mb-3">Reply to User</h3>
                      <div className="flex items-start space-x-2">
                        <Reply className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
                        <textarea
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Type your reply here..."
                          rows={3}
                          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none resize-none"
                        />
                      </div>
                    </div>
                    
                      <div className="flex items-center justify-between">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 hover:text-gray-800">
                          Cancel
                        </button>
                        
                        <button
                          type="submit"
                          disabled={isSending || !replyText.trim()}
                          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                        >
                          {isSending ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              <span>Sending...</span>
                            </>
                          ) : (
                            <>
                              <Send className="w-4 h-4" />
                              <span>Send Reply</span>
                            </>
                          )}
                        </button>
                      </div>
                  </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotificationDetail