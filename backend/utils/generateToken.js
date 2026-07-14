const jwt = require('jsonwebtoken');

// Creates a signed JWT containing the user's ID and role
// This token is what the frontend will send with every request to prove "I'm logged in"
const generateToken = (userId, role) => {
  return jwt.sign(
    { id: userId, role: role }, // payload: data embedded inside the token
    process.env.JWT_SECRET,    // secret key used to sign it (from .env)
    { expiresIn: process.env.JWT_EXPIRE } // e.g. "7d" = expires in 7 days
  );
};

module.exports = generateToken;