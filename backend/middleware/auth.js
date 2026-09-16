const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const database = require('../models/database');

const jwtSecret = process.env.JWT_SECRET || 'academic-verifier-development-secret';

async function requireAuth(req, res, next) {
  const authorization = req.headers.authorization || '';
  const token = authorization.startsWith('Bearer ') ? authorization.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'Authentication required.' });
  try {
    const payload = jwt.verify(token, jwtSecret);
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const session = await database.get('SELECT id FROM sessions WHERE token_hash = ? AND expires_at > ?', [tokenHash, new Date().toISOString()]);
    if (!session) return res.status(401).json({ message: 'Session expired. Please sign in again.' });
    req.user = payload;
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid authentication token.' });
  }
}

module.exports = { requireAuth };
