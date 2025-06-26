const jwt = require('jsonwebtoken');
const JWT_SECRET = 'gizli-anahtar';

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) return res.status(401).json({ error: '❌ Token yok' });

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: '❌ Token geçersiz' });
  }
}

module.exports = authMiddleware;
