const jwt = require('jsonwebtoken');

// Middleware to validate the token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token is missing or invalid.' });
  }

  jwt.verify(token, process.env.APP_JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token is invalid or expired.' });
    }

    req.user = user;
    next();
  });
};

const authenticateAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    return res.status(403).json({ message: 'Admin access required.' });
  }
};

module.exports = { authenticateToken, authenticateAdmin };
