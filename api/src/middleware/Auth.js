const jwt = require('jsonwebtoken');
require('dotenv').config();

const ERROR_MESSAGES = {
  TOKEN_MISSING: 'Authorization token is required.',
  TOKEN_INVALID: 'Invalid or malformed token.',
  TOKEN_EXPIRED: 'Token has expired. Please login again.',
  UNAUTHORIZED: 'Unauthorized access, please login.',
};

const Auth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ success: false, message: ERROR_MESSAGES.TOKEN_MISSING });
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: ERROR_MESSAGES.TOKEN_INVALID });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ success: false, message: ERROR_MESSAGES.TOKEN_EXPIRED });
      }
      return res.status(401).json({ success: false, message: ERROR_MESSAGES.TOKEN_INVALID });
    }

    req.user = decoded;
    next();
  });
};

module.exports = Auth;
