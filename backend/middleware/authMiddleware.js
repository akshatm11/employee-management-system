const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Checks if the request has a valid JWT token
// If valid, attaches the logged-in user's info to req.user for later use
const protect = async (req, res, next) => {
  let token;

  // We expect the token in the header like: "Authorization: Bearer <token>"
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // Verify the token using our secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find the user and attach to req (excluding password)
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ success: false, message: 'User not found' });
      }

      next(); // token is valid, move on to the actual route logic
    } catch (error) {
      return res.status(401).json({ success: false, message: 'Not authorized, invalid token' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
  }
};

// Checks if the logged-in user's role is one of the allowed roles
// Usage: authorize('admin', 'hr')
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role '${req.user.role}' is not authorized to perform this action`,
      });
    }
    next();
  };
};

module.exports = { protect, authorize };