const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Member = require('../models/Member');

module.exports = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (decoded.isExclusive && decoded.memberId) {
      // Handle exclusive member - validate member exists
      const member = await Member.findById(decoded.memberId);
      if (!member) {
        return res.status(401).json({ message: 'Member not found in database' });
      }
      req.userId = decoded.memberId;
      req.isExclusive = true;
      req.memberTier = member.tier;
      req.userType = 'member';
    } else if (decoded.userId) {
      // Handle regular user - validate user exists
      const user = await User.findById(decoded.userId);
      if (!user) {
        return res.status(401).json({ message: 'User not found in database' });
      }
      req.userId = decoded.userId;
      req.isExclusive = false;
      req.userType = 'user';
    } else {
      return res.status(401).json({ message: 'Invalid token format' });
    }
    
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    res.status(401).json({ message: 'Token verification failed' });
  }
};
