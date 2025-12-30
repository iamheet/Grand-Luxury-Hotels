const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Member = require('../models/Member');
const auth = require('../middleware/auth');

// Get all members (for admin)
router.get('/', async (req, res) => {
  try {
    const members = await Member.find().select('-password').sort({ createdAt: -1 });
    res.json({
      success: true,
      count: members.length,
      members
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get member profile (authenticated)
router.get('/profile', auth, async (req, res) => {
  try {
    if (req.userType !== 'member') {
      return res.status(403).json({ message: 'Access denied. Exclusive members only.' });
    }
    
    const member = await Member.findById(req.userId).select('-password');
    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }
    
    res.json({
      success: true,
      member: {
        id: member._id,
        name: member.name,
        email: member.email,
        phone: member.phone,
        tier: member.tier,
        membershipId: member.membershipId,
        points: member.points,
        createdAt: member.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Register new member (admin only - can be enabled/disabled)
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, tier, membershipId } = req.body;

    // Check if member already exists
    const existingMember = await Member.findOne({ $or: [{ email }, { membershipId }] });
    if (existingMember) {
      return res.status(400).json({ message: 'Member already exists with this email or membership ID' });
    }

    // Generate membershipId if not provided
    const finalMembershipId = membershipId || `GS${Date.now()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`;

    const hashedPassword = await bcrypt.hash(password, 10);
    const member = new Member({ 
      name, 
      email, 
      password: hashedPassword, 
      phone, 
      tier: tier || 'Bronze',
      membershipId: finalMembershipId,
      points: 0 
    });
    
    await member.save();
    
    res.status(201).json({ 
      success: true,
      message: 'Exclusive member registered successfully', 
      member: {
        id: member._id,
        name: member.name,
        email: member.email,
        membershipId: finalMembershipId,
        tier: member.tier
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update member profile
router.put('/profile', auth, async (req, res) => {
  try {
    if (req.userType !== 'member') {
      return res.status(403).json({ message: 'Access denied. Exclusive members only.' });
    }
    
    const { name, email, phone } = req.body;
    
    const member = await Member.findByIdAndUpdate(
      req.userId,
      { name, email, phone },
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }
    
    res.json({
      success: true,
      message: 'Profile updated successfully',
      member
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add points to member (admin function)
router.post('/:id/points', async (req, res) => {
  try {
    const { points } = req.body;
    const memberId = req.params.id;
    
    const member = await Member.findByIdAndUpdate(
      memberId,
      { $inc: { points: points } },
      { new: true }
    ).select('-password');
    
    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }
    
    res.json({
      success: true,
      message: `${points} points added successfully`,
      member
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Upgrade member tier (admin function)
router.put('/:id/tier', async (req, res) => {
  try {
    const { tier } = req.body;
    const memberId = req.params.id;
    
    const validTiers = ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond'];
    if (!validTiers.includes(tier)) {
      return res.status(400).json({ message: 'Invalid tier. Must be: ' + validTiers.join(', ') });
    }
    
    const member = await Member.findByIdAndUpdate(
      memberId,
      { tier },
      { new: true }
    ).select('-password');
    
    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }
    
    res.json({
      success: true,
      message: `Member tier updated to ${tier}`,
      member
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete member (admin function)
router.delete('/:id', async (req, res) => {
  try {
    const member = await Member.findByIdAndDelete(req.params.id);
    
    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }
    
    res.json({
      success: true,
      message: 'Member deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
