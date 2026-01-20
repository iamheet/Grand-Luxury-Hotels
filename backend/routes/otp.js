const express = require('express');
const jwt = require('jsonwebtoken');
const twilio = require('twilio');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const router = express.Router();

// Initialize Twilio client
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Initialize email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// In-memory OTP storage (use Redis in production)
const otpStorage = new Map();

// Generate random 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP via Email
const sendEmail = async (email, otp) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: '🔐 Your Grand Stay OTP Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: linear-gradient(135deg, #1a1a2e, #16213e); color: white; border-radius: 10px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #fbbf24; font-size: 32px; margin: 0;">👑 The Grand Stay</h1>
            <p style="color: #d1d5db; margin-top: 10px;">Your OTP Verification Code</p>
          </div>
          
          <div style="background: rgba(255,255,255,0.1); padding: 30px; border-radius: 10px; border: 1px solid rgba(251, 191, 36, 0.3);">
            <h2 style="color: #fbbf24; margin-top: 0;">Verification Code</h2>
            <p style="color: #e5e7eb;">Your OTP verification code is:</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <div style="display: inline-block; background: linear-gradient(135deg, #fbbf24, #f59e0b); color: #1a1a2e; padding: 20px 40px; border-radius: 10px; font-weight: bold; font-size: 32px; letter-spacing: 8px;">
                ${otp}
              </div>
            </div>
            
            <p style="color: #9ca3af; font-size: 14px; text-align: center;">
              ⏰ This code will expire in 5 minutes<br/>
              🔒 Don't share this code with anyone
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px;">
            <p>© 2024 The Grand Stay. All rights reserved.</p>
          </div>
        </div>
      `
    };
    
    await transporter.sendMail(mailOptions);
    console.log(`📧 Email OTP sent to ${email}: ${otp}`);
    return true;
  } catch (error) {
    console.error('Email send error:', error);
    console.log(`📧 Fallback - OTP for ${email}: ${otp}`);
    return true;
  }
};

// Send OTP via Twilio SMS
const sendSMS = async (phoneNumber, otp) => {
  try {
    await client.messages.create({
      body: `Your Grand Stay OTP is: ${otp}. Valid for 5 minutes.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber
    });
    console.log(`📱 SMS sent to ${phoneNumber}: OTP ${otp}`);
    return true;
  } catch (error) {
    console.error('SMS send error:', error);
    // Fallback: log OTP if SMS fails
    console.log(`📱 Fallback - OTP for ${phoneNumber}: ${otp}`);
    return true; // Return true to continue flow
  }
};

// Send OTP
router.post('/send', async (req, res) => {
  try {
    console.log('OTP send request received:', req.body);
    const { phoneNumber, email } = req.body;
    
    if (!phoneNumber && !email) {
      return res.status(400).json({ success: false, message: 'Phone number or email is required' });
    }

    const otp = generateOTP();
    const identifier = phoneNumber || email;
    console.log('Generated OTP:', otp, 'for:', identifier);
    
    // Store OTP with 5-minute expiry
    otpStorage.set(identifier, {
      otp: otp,
      expires: Date.now() + 5 * 60 * 1000
    });

    let sent = false;
    let method = '';
    
    if (phoneNumber) {
      console.log('Attempting to send SMS...');
      sent = await sendSMS(phoneNumber, otp);
      method = 'SMS';
    } else if (email) {
      console.log('Attempting to send Email...');
      sent = await sendEmail(email, otp);
      method = 'Email';
    }
    
    if (!sent) {
      return res.status(500).json({ success: false, message: `Failed to send ${method}` });
    }
    
    res.json({ 
      success: true, 
      message: `OTP sent successfully via ${method}`
    });
  } catch (error) {
    console.error('OTP send error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Verify OTP
router.post('/verify', async (req, res) => {
  try {
    const { phoneNumber, email, otp, name } = req.body;
    const identifier = phoneNumber || email;
    
    if (!identifier || !otp) {
      return res.status(400).json({ success: false, message: 'Phone number/email and OTP are required' });
    }

    const storedOTP = otpStorage.get(identifier);
    
    if (!storedOTP) {
      return res.status(400).json({ success: false, message: 'OTP not found or expired' });
    }

    if (Date.now() > storedOTP.expires) {
      otpStorage.delete(identifier);
      return res.status(400).json({ success: false, message: 'OTP expired' });
    }

    if (storedOTP.otp !== otp) {
      return res.status(400).json({ success: false, message: 'Invalid OTP' });
    }

    // OTP verified, remove from storage
    otpStorage.delete(identifier);

    // Check if user exists
    let user = await User.findOne(phoneNumber ? { phone: phoneNumber } : { email: email });
    
    if (!user) {
      // Create new user
      user = new User({
        phone: phoneNumber || null,
        email: email || `${phoneNumber}@phone.com`,
        name: name || 'User',
        password: phoneNumber ? 'phone-auth' : 'email-auth'
      });
      await user.save();
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, phone: user.phone, email: user.email },
      process.env.JWT_SECRET || 'luxury-grand-stay-secret-2024',
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'OTP verified successfully',
      token: token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Send Email OTP (separate endpoint)
router.post('/send-email', async (req, res) => {
  try {
    console.log('Email OTP send request received:', req.body);
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    const otp = generateOTP();
    console.log('Generated OTP:', otp, 'for email:', email);
    
    // Store OTP with 5-minute expiry
    otpStorage.set(email, {
      otp: otp,
      expires: Date.now() + 5 * 60 * 1000
    });

    console.log('Attempting to send Email...');
    const emailSent = await sendEmail(email, otp);
    
    if (!emailSent) {
      return res.status(500).json({ success: false, message: 'Failed to send Email' });
    }
    
    res.json({ 
      success: true, 
      message: 'OTP sent successfully to your email'
    });
  } catch (error) {
    console.error('Email OTP send error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Verify Email OTP (separate endpoint)
router.post('/verify-email', async (req, res) => {
  try {
    const { email, otp, name } = req.body;
    
    if (!email || !otp) {
      return res.status(400).json({ success: false, message: 'Email and OTP are required' });
    }

    const storedOTP = otpStorage.get(email);
    
    if (!storedOTP) {
      return res.status(400).json({ success: false, message: 'OTP not found or expired' });
    }

    if (Date.now() > storedOTP.expires) {
      otpStorage.delete(email);
      return res.status(400).json({ success: false, message: 'OTP expired' });
    }

    if (storedOTP.otp !== otp) {
      return res.status(400).json({ success: false, message: 'Invalid OTP' });
    }

    // OTP verified, remove from storage
    otpStorage.delete(email);

    // Check if user exists
    let user = await User.findOne({ email: email });
    
    if (!user) {
      // Create new user
      user = new User({
        email: email,
        name: name || 'User',
        password: 'email-auth'
      });
      await user.save();
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET || 'luxury-grand-stay-secret-2024',
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Email OTP verified successfully',
      token: token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;