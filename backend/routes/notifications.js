const express = require('express');
const router = express.Router();

// Mock notification storage (in production, use database)
const notifications = [];

// POST /api/admin/notifications - Send notification to admin
router.post('/', async (req, res) => {
  try {
    const { type, title, message, data } = req.body;
    
    const notification = {
      id: Date.now().toString(),
      type,
      title,
      message,
      data,
      timestamp: new Date(),
      read: false
    };
    
    notifications.push(notification);
    
    // In production, you would:
    // 1. Save to database
    // 2. Send email to admin
    // 3. Send push notification if configured
    // 4. Broadcast to WebSocket clients
    
    console.log('New notification received:', notification);
    
    res.status(201).json({
      success: true,
      notification,
      message: 'Notification sent successfully'
    });
  } catch (error) {
    console.error('Error creating notification:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send notification',
      error: error.message
    });
  }
});

// GET /api/admin/notifications - Get all notifications
router.get('/', async (req, res) => {
  try {
    // Sort by most recent first
    const sortedNotifications = notifications.sort((a, b) => 
      new Date(b.timestamp) - new Date(a.timestamp)
    ).reverse();
    
    res.json({
      success: true,
      notifications: sortedNotifications,
      total: sortedNotifications.length
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notifications',
      error: error.message
    });
  }
});

// PATCH /api/admin/notifications/:id/read - Mark notification as read
router.patch('/:id/read', async (req, res) => {
  try {
    const { id } = req.params;
    
    const notification = notifications.find(n => n.id === id);
    if (notification) {
      notification.read = true;
    }
    
    console.log(`Notification ${id} marked as read`);
    
    res.json({
      success: true,
      message: 'Notification marked as read'
    });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark notification as read',
      error: error.message
    });
  }
});

// DELETE /api/admin/notifications/:id - Delete notification
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const index = notifications.findIndex(n => n.id === id);
    if (index > -1) {
      notifications.splice(index, 1);
    }
    
    console.log(`Notification ${id} deleted`);
    
    res.json({
      success: true,
      message: 'Notification deleted'
    });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete notification',
      error: error.message
    });
  }
});

// POST /api/admin/notifications/reply - Send reply to user
router.post('/reply', async (req, res) => {
  try {
    const { notificationId, message, adminReply } = req.body;
    
    const reply = {
      id: Date.now().toString(),
      notificationId,
      message,
      timestamp: new Date(),
      adminReply: true
    };
    
    // Store reply (in production, save to database)
    const replies = require('./notification-replies.json') || [];
    replies.push(reply);
    require('fs').writeFileSync('./notification-replies.json', JSON.stringify(replies, null, 2));
    
    // Find original notification to get user email
    const notification = notifications.find(n => n.id === notificationId);
    const userEmail = notification?.data?.user?.email;
    
    // Simulate sending email
    console.log('Sending reply email:', {
      to: userEmail,
      subject: `Re: ${notification?.title || 'Your Request'}`,
      message: message
    });
    
    // In production, you would use an email service like Nodemailer, SendGrid, etc.
    // const emailResult = await emailService.send({
    //   to: userEmail,
    //   subject: `Re: ${notification?.title || 'Your Request'}`,
    //   message: message
    // });
    
    res.status(201).json({
      success: true,
      reply,
      message: 'Reply sent successfully'
    });
  } catch (error) {
    console.error('Error sending reply:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send reply',
      error: error.message
    });
  }
});

// GET /api/admin/notifications/:id/replies - Get replies for a notification
router.get('/:id/replies', async (req, res) => {
  try {
    const { id } = req.params;
    
    const replies = require('./notification-replies.json') || [];
    const notificationReplies = replies.filter(r => r.notificationId === id);
    
    res.json({
      success: true,
      replies: notificationReplies,
      total: notificationReplies.length
    });
  } catch (error) {
    console.error('Error fetching replies:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch replies',
      error: error.message
    });
  }
});

module.exports = router;