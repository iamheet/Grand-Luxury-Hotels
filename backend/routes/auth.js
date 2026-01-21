const express = require('express')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const Hotel = require('../models/Hotel')
const User = require('../models/User')
const Member = require('../models/Member')
const SubAdmin = require('../models/SubAdmin')
const { JWT_SECRET } = require('../middleware/auth')

const router = express.Router()

// Login endpoint - handles admin, user, and member login
router.post('/login', async (req, res) => {
  try {
    console.log('🔑 Login request received:', req.body)
    const { username, password, email, membershipId, isExclusive } = req.body

    // Admin login (existing logic)
    if (username && password && !email && !membershipId) {
      // Super Admin credentials
      if (username === 'admin' && password === 'luxury2024') {
        const token = jwt.sign(
          { id: 'super-admin', type: 'super', username: 'admin' },
          JWT_SECRET,
          { expiresIn: '1h' }
        )
        
        return res.json({
          success: true,
          token,
          admin: { type: 'super', username: 'admin' }
        })
      }

      // Sub-admin credentials - check database
      const subAdmin = await SubAdmin.findOne({ username, isActive: true })
      if (subAdmin && await bcrypt.compare(password, subAdmin.password)) {
        const token = jwt.sign(
          { id: subAdmin._id, type: 'subadmin', username: subAdmin.username },
          JWT_SECRET,
          { expiresIn: '1h' }
        )
        
        return res.json({
          success: true,
          token,
          admin: { 
            type: 'subadmin', 
            username: subAdmin.username,
            name: subAdmin.name,
            permissions: subAdmin.permissions
          },
          subAdminData: subAdmin
        })
      }

      // Hotel admin credentials - check database
      const hotel = await Hotel.findOne({ email: username, password })
      if (hotel) {
        const token = jwt.sign(
          { id: hotel._id, type: 'hotel', hotel: hotel.name, location: hotel.location },
          JWT_SECRET,
          { expiresIn: '1h' }
        )
        
        return res.json({
          success: true,
          token,
          admin: { type: 'hotel', hotel: hotel.name, location: hotel.location },
          hotelData: hotel
        })
      }
    }

    // Exclusive Member login
    if (isExclusive && membershipId && password) {
      console.log('🔍 Member login attempt:', { membershipId, password, isExclusive });
      
      const member = await Member.findOne({ membershipId }).maxTimeMS(5000)
      console.log('👤 Found member:', member ? `${member.name} (${member.membershipId})` : 'None');
      
      if (member) {
        const passwordMatch = await bcrypt.compare(password, member.password);
        console.log('🔐 Password match:', passwordMatch);
        
        if (passwordMatch) {
          const token = jwt.sign(
            { id: member._id, type: 'member', membershipId: member.membershipId },
            JWT_SECRET,
            { expiresIn: '1h' }
          )
          
          return res.json({
            success: true,
            token,
            isExclusive: true,
            member: {
              id: member._id,
              name: member.name,
              email: member.email,
              membershipId: member.membershipId,
              tier: member.tier,
              points: member.points
            }
          })
        }
      }
    }

    // Regular User login
    if (email && password && !isExclusive) {
      const user = await User.findOne({ email })
      if (user && await bcrypt.compare(password, user.password)) {
        const token = jwt.sign(
          { id: user._id, type: 'user', email: user.email },
          JWT_SECRET,
          { expiresIn: '1h' }
        )
        
        return res.json({
          success: true,
          token,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            isMember: user.isMember,
            membershipTier: user.membershipTier,
            points: user.points
          }
        })
      }
    }

    res.status(401).json({ success: false, message: 'Invalid credentials' })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// Check if user exists with caching
router.post('/check-user', async (req, res) => {
  try {
    const { email } = req.body
    const existingUser = await User.findOne({ email })
    
    // Set cache headers for better performance
    res.set({
      'Cache-Control': 'public, max-age=60', // Cache for 1 minute
      'ETag': `"${Buffer.from(email).toString('base64')}"`
    })
    
    if (existingUser) {
      return res.status(200).json({
        success: true,
        exists: true,
        message: 'User exists'
      })
    }
    
    res.status(200).json({
      success: true,
      exists: false,
      message: 'User does not exist'
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// Register new user
router.post('/register', async (req, res) => {
  try {
    console.log('📝 Registration request received:', req.body)
    const { name, email, password, phone, emailVerified, phoneVerified } = req.body

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      console.log('❌ User already exists:', email)
      return res.status(409).json({ success: false, message: 'User already exists with this email' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = new User({ 
      name, 
      email, 
      password: hashedPassword, 
      phone,
      emailVerified: emailVerified || false,
      phoneVerified: phoneVerified || false
    })
    
    await user.save()
    console.log('✅ User registered successfully:', email)
    
    const token = jwt.sign(
      { id: user._id, type: 'user', email: user.email },
      JWT_SECRET,
      { expiresIn: '1h' }
    )
    
    res.status(201).json({ 
      success: true,
      token,
      message: 'User registered successfully', 
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        emailVerified: user.emailVerified,
        phoneVerified: user.phoneVerified
      }
    })
  } catch (error) {
    console.error('❌ Registration error:', error.message)
    res.status(500).json({ success: false, message: error.message })
  }
})

// Sync Firebase user to database
router.post('/sync-firebase-user', async (req, res) => {
  try {
    const { firebaseUid, email, name, phone } = req.body

    // Check if user already exists by Firebase UID or email
    let user = await User.findOne({ $or: [{ firebaseUid }, { email }] })
    
    if (user) {
      // Update existing user with Firebase UID if not set
      if (!user.firebaseUid) {
        user.firebaseUid = firebaseUid
        await user.save()
      }
    } else {
      // Create new user
      user = new User({
        name,
        email,
        firebaseUid,
        phone: phone || '',
        password: 'firebase-auth' // Placeholder since Firebase handles auth
      })
      await user.save()
    }

    const token = jwt.sign(
      { id: user._id, type: 'user', email: user.email },
      JWT_SECRET,
      { expiresIn: '1h' }
    )

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        isMember: user.isMember,
        membershipTier: user.membershipTier,
        points: user.points
      }
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// Check if exclusive member exists
router.post('/check-exclusive-member', async (req, res) => {
  try {
    const { membershipId } = req.body
    
    if (!membershipId) {
      return res.status(400).json({ success: false, message: 'Membership ID is required' })
    }

    const member = await Member.findOne({ membershipId })
    
    if (member) {
      res.json({
        success: true,
        exists: true,
        member: {
          name: member.name,
          email: member.email,
          membershipId: member.membershipId,
          tier: member.tier
        }
      })
    } else {
      res.json({
        success: true,
        exists: false,
        message: 'Member not found'
      })
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

module.exports = router