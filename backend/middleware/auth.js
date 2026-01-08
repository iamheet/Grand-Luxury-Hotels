const jwt = require('jsonwebtoken')

const JWT_SECRET = 'luxury-grand-stay-secret-2024'

const auth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '')
  
  if (!token) {
    return res.status(401).json({ success: false, message: 'Access denied. No token provided.' })
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    req.userId = decoded.id  // Changed from decoded.userId to decoded.id
    req.userType = decoded.type
    req.isExclusive = decoded.isExclusive
    req.memberTier = decoded.memberTier
    next()
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid token.' })
  }
}

const authenticateAdmin = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '')
  
  if (!token) {
    return res.status(401).json({ success: false, message: 'Access denied. No token provided.' })
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    req.admin = decoded
    next()
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid token.' })
  }
}

module.exports = auth
module.exports.authenticateAdmin = authenticateAdmin
module.exports.JWT_SECRET = JWT_SECRET