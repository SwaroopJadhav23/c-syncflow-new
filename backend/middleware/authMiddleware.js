const jwt = require('jsonwebtoken');
const User = require('../models/user');

function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];
  const token = authHeader && authHeader.split(' ')[0] === 'Bearer' ? authHeader.split(' ')[1] : (req.headers['x-access-token'] || req.query.token);
  if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

  jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret', (err, decoded) => {
    if (err) return res.status(401).json({ msg: 'Token is not valid' });
    req.user = decoded; // { id, role }
    next();
  });
}

function requireAdmin(req, res, next) {
  if (!req.user) return res.status(401).json({ msg: 'Not authenticated' });
  if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Admin access required' });
  next();
}

module.exports = { verifyToken, requireAdmin };


