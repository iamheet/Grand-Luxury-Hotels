const express = require('express');
const bcrypt = require('bcryptjs');
const SubAdmin = require('../models/SubAdmin');
const { authenticateAdmin } = require('../middleware/auth');

const router = express.Router();

// Get all sub-admins (only super admin)
router.get('/', authenticateAdmin, async (req, res) => {
  try {
    const subAdmins = await SubAdmin.find().select('-password');
    res.json({ success: true, subAdmins });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create new sub-admin (only super admin)
router.post('/', authenticateAdmin, async (req, res) => {
  try {
    const { name, username, password, email, phone, permissions } = req.body;

    const existingSubAdmin = await SubAdmin.findOne({ $or: [{ username }, { email }] });
    if (existingSubAdmin) {
      return res.status(400).json({ success: false, message: 'Username or email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const subAdmin = new SubAdmin({
      name,
      username,
      password: hashedPassword,
      email,
      phone,
      permissions: permissions || {
        viewUsers: true,
        viewBookings: true,
        viewRevenue: false,
        manageHotels: false
      }
    });

    await subAdmin.save();
    res.status(201).json({ success: true, message: 'Sub-admin created successfully', subAdmin: { ...subAdmin.toObject(), password: undefined } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update sub-admin (only super admin)
router.put('/:id', authenticateAdmin, async (req, res) => {
  try {
    const { name, email, phone, permissions, isActive } = req.body;
    const subAdmin = await SubAdmin.findByIdAndUpdate(
      req.params.id,
      { name, email, phone, permissions, isActive },
      { new: true }
    ).select('-password');

    if (!subAdmin) {
      return res.status(404).json({ success: false, message: 'Sub-admin not found' });
    }

    res.json({ success: true, message: 'Sub-admin updated successfully', subAdmin });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete sub-admin (only super admin)
router.delete('/:id', authenticateAdmin, async (req, res) => {
  try {
    const subAdmin = await SubAdmin.findByIdAndDelete(req.params.id);
    if (!subAdmin) {
      return res.status(404).json({ success: false, message: 'Sub-admin not found' });
    }

    res.json({ success: true, message: 'Sub-admin deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
