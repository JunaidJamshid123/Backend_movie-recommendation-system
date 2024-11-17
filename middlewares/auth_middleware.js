const jwt = require('jsonwebtoken');
const User = require('../models/user_model');

// Middleware to verify JWT and authenticate user
const authenticate = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const token = req.header('Authorization')?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    // Optional: Verify user exists in the database
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'Invalid token. User does not exist.' });
    }

    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token.', error: error.message });
  }
};

// Middleware for role-based authorization (e.g., admin only)
const authorize = (roles = []) => {
  if (typeof roles === 'string') {
    roles = [roles];
  }

  return (req, res, next) => {
    try {
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
      }
      next();
    } catch (error) {
      res.status(403).json({ message: 'Authorization error.', error: error.message });
    }
  };
};

module.exports = { authenticate, authorize };
