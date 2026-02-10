const adminAuth = (req, res, next) => {
  const adminKey = req.headers['x-admin-key'];
  
  if (!adminKey || adminKey !== process.env.ADMIN_KEY) {
    return res.status(401).json({ message: 'Unauthorized: Invalid admin key' });
  }
  
  next();
};

module.exports = adminAuth;
