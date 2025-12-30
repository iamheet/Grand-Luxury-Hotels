const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Member = require('../models/Member');
const auth = require('../middleware/auth');

// Sync Firebase user to MongoDB
router.post('/sync-firebase-user', async (req, res) => {
  try {
    const { firebaseUid, email, name, phone } = req.body;
    
    console.log('=== FIREBASE SYNC ===');
    console.log('Firebase UID:', firebaseUid);
    console.log('Email:', email);
    console.log('Name:', name);
    console.log('Phone:', phone);
    
    if (!firebaseUid || !email) {
      return res.status(400).json({ message: 'Firebase UID and email are required' });
    }
    
    let user = await User.findOne({ email });
    
    if (!user) {
      console.log('Creating new user...');
      user = await User.create({
        name: name || email.split('@')[0],
        email,
        phone: phone || '',
        firebaseUid,
        password: await bcrypt.hash(Math.random().toString(36), 10)
      });
      console.log('User created:', user._id);
    } else if (!user.firebaseUid) {
      console.log('Updating existing user with Firebase UID...');
      user.firebaseUid = firebaseUid;
      await user.save();
      console.log('User updated:', user._id);
    } else {
      console.log('User already exists with Firebase UID:', user._id);
    }
    
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    console.log('✅ Firebase sync successful');
    
    res.json({ 
      token, 
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email,
        phone: user.phone,
        firebaseUid: user.firebaseUid
      } 
    });
  } catch (error) {
    console.error('❌ Firebase sync error:', error);
    res.status(500).json({ message: 'Failed to sync user', error: error.message });
  }
});

// Register (DISABLED - Only existing users can login)
router.post('/register', async (req, res) => {
  return res.status(403).json({ message: 'Registration is currently disabled. Contact admin.' });
});

// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    if (req.userType === 'member') {
      const member = await Member.findById(req.userId).select('-password');
      res.json({ 
        success: true, 
        user: {
          id: member._id,
          name: member.name,
          email: member.email,
          phone: member.phone,
          isExclusive: true,
          membershipTier: member.tier,
          membershipId: member.membershipId,
          points: member.points
        }
      });
    } else {
      const user = await User.findById(req.userId).select('-password');
      res.json({ 
        success: true, 
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          isExclusive: false,
          membershipTier: user.membershipTier,
          isMember: user.isMember
        }
      });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password, membershipId, isExclusive } = req.body;
    
    console.log('=== LOGIN ATTEMPT ===');
    console.log('Email:', email);
    console.log('MembershipId:', membershipId);
    console.log('IsExclusive:', isExclusive);
    console.log('Timestamp:', new Date().toISOString());
    
    if (isExclusive) {
      console.log('Exclusive login attempt for membershipId:', membershipId);
      
      if (!membershipId) {
        console.log('❌ No membershipId provided');
        return res.status(400).json({ message: 'Membership ID is required for exclusive login' });
      }
      
      const member = await Member.findOne({ membershipId });
      console.log('Member found in DB:', member ? 'YES' : 'NO');
      
      if (!member) {
        console.log('❌ Member not found for membershipId:', membershipId);
        return res.status(400).json({ message: 'Invalid membership credentials - Member not found' });
      }

      const isMatch = await bcrypt.compare(password, member.password);
      console.log('Password match for member:', isMatch);
      
      if (!isMatch) {
        console.log('❌ Invalid password for member:', membershipId);
        return res.status(400).json({ message: 'Invalid membership credentials - Wrong password' });
      }

      const token = jwt.sign({ memberId: member._id, isExclusive: true, loginTime: Date.now() }, process.env.JWT_SECRET, { expiresIn: '7d' });
      console.log('✅ Exclusive member login successful:', member.name);
      
      return res.json({ 
        token, 
        member: { 
          id: member._id, 
          name: member.name, 
          email: member.email, 
          membershipId: member.membershipId, 
          tier: member.tier, 
          points: member.points 
        }, 
        isExclusive: true 
      });
    }
    
    // Regular user login
    console.log('Regular user login attempt for email:', email);
    
    if (!email) {
      console.log('❌ No email provided');
      return res.status(400).json({ message: 'Email is required' });
    }
    
    const user = await User.findOne({ email });
    console.log('User found in DB:', user ? 'YES' : 'NO');
    
    if (!user) {
      console.log('❌ User not found for email:', email);
      return res.status(400).json({ message: 'Invalid credentials - User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password match for user:', isMatch);
    
    if (!isMatch) {
      console.log('❌ Invalid password for user:', email);
      return res.status(400).json({ message: 'Invalid credentials - Wrong password' });
    }

    const token = jwt.sign({ userId: user._id, loginTime: Date.now() }, process.env.JWT_SECRET, { expiresIn: '7d' });
    console.log('✅ Regular user login successful:', user.name);
    
    res.json({ 
      token, 
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email 
      } 
    });
    
  } catch (error) {
    console.log('❌ Login error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Logout (invalidate token)
router.post('/logout', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Logged out successfully. Please remove token from client.' 
  });
});

// Forgot Password - Send reset email
router.post('/forgot-password', async (req, res) => {
  try {
    const { email, membershipId, isExclusive } = req.body;
    
    console.log('=== FORGOT PASSWORD REQUEST ===');
    console.log('Email:', email);
    console.log('MembershipId:', membershipId);
    console.log('IsExclusive:', isExclusive);
    console.log('Timestamp:', new Date().toISOString());
    
    if (isExclusive) {
      // Handle exclusive member password reset
      if (!membershipId) {
        return res.status(400).json({ message: 'Membership ID is required for exclusive members' });
      }
      
      const member = await Member.findOne({ membershipId });
      if (!member) {
        console.log('❌ Member not found for membershipId:', membershipId);
        return res.json({ 
          success: true, 
          message: 'If a member with that ID exists, we have sent a password reset link.' 
        });
      }
      
      // Generate reset token for member
      const resetToken = jwt.sign(
        { memberId: member._id, type: 'password-reset', isExclusive: true }, 
        process.env.JWT_SECRET, 
        { expiresIn: '1h' }
      );
      
      member.resetToken = resetToken;
      member.resetTokenExpiry = new Date(Date.now() + 3600000);
      await member.save();
      
      console.log('✅ Reset token generated for member:', member.name);
      
      const resetLink = `http://localhost:5000/reset-password.html?token=${resetToken}`;
      console.log('🔗 Reset link:', resetLink);
      
      return res.json({ 
        success: true, 
        message: 'Password reset link sent for exclusive member.',
        resetLink: resetLink 
      });
    }
    
    // Handle regular user password reset
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
    
    const user = await User.findOne({ email });
    if (!user) {
      console.log('❌ User not found for email:', email);
      return res.json({ 
        success: true, 
        message: 'If an account with that email exists, we have sent a password reset link.' 
      });
    }
    
    const resetToken = jwt.sign(
      { userId: user._id, type: 'password-reset' }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1h' }
    );
    
    user.resetToken = resetToken;
    user.resetTokenExpiry = new Date(Date.now() + 3600000);
    await user.save();
    
    console.log('✅ Reset token generated for user:', user.name);
    
    const resetLink = `http://localhost:5000/reset-password.html?token=${resetToken}`;
    console.log('🔗 Reset link:', resetLink);
    
    res.json({ 
      success: true, 
      message: 'Password reset link sent to your email.',
      resetLink: resetLink 
    });
    
  } catch (error) {
    console.log('❌ Forgot password error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Reset Password - Update password with token
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    
    console.log('=== RESET PASSWORD REQUEST ===');
    console.log('Token provided:', token ? 'YES' : 'NO');
    console.log('Timestamp:', new Date().toISOString());
    
    if (!token || !newPassword) {
      return res.status(400).json({ message: 'Token and new password are required' });
    }
    
    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }
    
    // Verify reset token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      console.log('❌ Invalid or expired token');
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }
    
    if (decoded.type !== 'password-reset') {
      console.log('❌ Invalid token type');
      return res.status(400).json({ message: 'Invalid reset token' });
    }
    
    // Handle exclusive member password reset
    if (decoded.isExclusive && decoded.memberId) {
      const member = await Member.findById(decoded.memberId);
      if (!member || member.resetToken !== token) {
        console.log('❌ Member not found or token mismatch');
        return res.status(400).json({ message: 'Invalid reset token' });
      }
      
      if (member.resetTokenExpiry < new Date()) {
        console.log('❌ Token expired for member');
        return res.status(400).json({ message: 'Reset token has expired' });
      }
      
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      
      member.password = hashedPassword;
      member.resetToken = undefined;
      member.resetTokenExpiry = undefined;
      await member.save();
      
      console.log('✅ Password reset successful for member:', member.name);
      
      return res.json({ 
        success: true, 
        message: 'Password reset successfully. You can now login with your new password.' 
      });
    }
    
    // Handle regular user password reset
    const user = await User.findById(decoded.userId);
    if (!user || user.resetToken !== token) {
      console.log('❌ User not found or token mismatch');
      return res.status(400).json({ message: 'Invalid reset token' });
    }
    
    if (user.resetTokenExpiry < new Date()) {
      console.log('❌ Token expired');
      return res.status(400).json({ message: 'Reset token has expired' });
    }
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();
    
    console.log('✅ Password reset successful for user:', user.name);
    
    res.json({ 
      success: true, 
      message: 'Password reset successfully. You can now login with your new password.' 
    });
    
  } catch (error) {
    console.log('❌ Reset password error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;