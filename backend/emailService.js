const nodemailer = require('nodemailer');
const axios = require('axios');

// Create transporter with Gmail SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com', // Replace with your Gmail
    pass: process.env.EMAIL_PASS || 'your-app-password' // Replace with Gmail App Password
  }
});

// Send booking confirmation email
const sendBookingConfirmationEmail = async (to, guestName, hotelName, roomType, checkIn, checkOut, nights, guests, total, bookingId, paymentId) => {
  const mailOptions = {
    from: process.env.EMAIL_USER || 'your-email@gmail.com',
    to: to,
    subject: '✅ Booking Confirmed - The Royal Stay',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: linear-gradient(135deg, #1a1a2e, #16213e); color: white; border-radius: 10px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #fbbf24; font-size: 32px; margin: 0;">👑 The Royal Stay</h1>
          <p style="color: #d1d5db; margin-top: 10px;">Booking Confirmation</p>
        </div>
        
        <div style="background: rgba(255,255,255,0.1); padding: 30px; border-radius: 10px; border: 1px solid rgba(251, 191, 36, 0.3);">
          <h2 style="color: #fbbf24; margin-top: 0;">Booking Confirmed! 🎉</h2>
          <p style="color: #e5e7eb;">Dear ${guestName},</p>
          <p style="color: #e5e7eb;">Your booking has been confirmed. Here are your details:</p>
          
          <div style="background: rgba(0,0,0,0.2); padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #fbbf24; margin-top: 0;">🏨 ${hotelName}</h3>
            <p style="color: #e5e7eb; margin: 5px 0;">📅 Check-in: ${checkIn}</p>
            <p style="color: #e5e7eb; margin: 5px 0;">📅 Check-out: ${checkOut}</p>
            <p style="color: #e5e7eb; margin: 5px 0;">🛏️ Room: ${roomType}</p>
            <p style="color: #e5e7eb; margin: 5px 0;">🌙 Nights: ${nights}</p>
            <p style="color: #e5e7eb; margin: 5px 0;">👥 Guests: ${guests}</p>
            <p style="color: #fbbf24; margin: 5px 0; font-weight: bold;">💰 Total: ₹${total}</p>
          </div>
          
          <div style="background: rgba(0,0,0,0.2); padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="color: #9ca3af; margin: 5px 0; font-size: 14px;">📋 Booking ID: ${bookingId}</p>
            <p style="color: #9ca3af; margin: 5px 0; font-size: 14px;">💳 Payment ID: ${paymentId}</p>
          </div>
          
          <p style="color: #e5e7eb;">We look forward to hosting you!</p>
        </div>
        
        <div style="text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px;">
          <p>© 2024 The Royal Stay. All rights reserved.</p>
        </div>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, error: error.message };
  }
};

// Send custom email
const sendCustomEmail = async (to, subject, message) => {
  const mailOptions = {
    from: process.env.EMAIL_USER || 'your-email@gmail.com',
    to: to,
    subject: subject,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: linear-gradient(135deg, #1a1a2e, #16213e); color: white; border-radius: 10px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #fbbf24; font-size: 32px; margin: 0;">👑 The Royal Stay</h1>
        </div>
        
        <div style="background: rgba(255,255,255,0.1); padding: 30px; border-radius: 10px; border: 1px solid rgba(251, 191, 36, 0.3);">
          <div style="color: #e5e7eb; line-height: 1.6;">
            ${message}
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px;">
          <p>© 2024 The Royal Stay. All rights reserved.</p>
        </div>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, error: error.message };
  }
};

// Send WhatsApp booking confirmation (URL-based)
const sendWhatsAppBookingConfirmation = async (phoneNumber, guestName, hotelName, roomType, checkIn, checkOut, nights, guests, total, bookingId) => {
  try {
    const message = `🏨 *The Royal Stay - Booking Confirmed!*\n\n✅ Dear ${guestName}, your booking is confirmed!\n\n📋 *Booking Details:*\n🏨 Hotel: ${hotelName}\n🛏️ Room: ${roomType}\n📅 Check-in: ${checkIn}\n📅 Check-out: ${checkOut}\n🌙 Nights: ${nights}\n👥 Guests: ${guests}\n💰 Total: ₹${total}\n\n🆔 Booking ID: ${bookingId}\n\n🙏 Thank you for choosing The Royal Stay!\n\n*Contact us:* +91-XXXXXXXXXX`;

    // Create WhatsApp URL for direct messaging
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    
    return { 
      success: true, 
      whatsappUrl: whatsappUrl,
      message: 'WhatsApp URL generated successfully' 
    };
  } catch (error) {
    console.error('WhatsApp URL generation error:', error.message);
    return { success: false, error: error.message };
  }
};

// Send welcome email for new registrations
const sendWelcomeEmail = async (to, name) => {
  const mailOptions = {
    from: process.env.EMAIL_USER || 'your-email@gmail.com',
    to: to,
    subject: '🎉 Welcome to The Royal Stay - Your Luxury Journey Begins!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: linear-gradient(135deg, #1a1a2e, #16213e); color: white; border-radius: 10px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #fbbf24; font-size: 32px; margin: 0;">👑 The Royal Stay</h1>
          <p style="color: #d1d5db; margin-top: 10px;">Welcome to Luxury</p>
        </div>
        
        <div style="background: rgba(255,255,255,0.1); padding: 30px; border-radius: 10px; border: 1px solid rgba(251, 191, 36, 0.3);">
          <h2 style="color: #fbbf24; margin-top: 0;">Welcome ${name}! 🎉</h2>
          <p style="color: #e5e7eb;">Thank you for joining The Royal Stay family!</p>
          
          <p style="color: #e5e7eb;">You now have access to:</p>
          <ul style="color: #e5e7eb; line-height: 1.8;">
            <li>🏨 Premium hotel bookings worldwide</li>
            <li>💎 Exclusive member benefits</li>
            <li>🎯 Personalized recommendations</li>
            <li>📞 24/7 customer support</li>
            <li>🎁 Special offers and discounts</li>
          </ul>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://www.royalstay.me" style="display: inline-block; background: linear-gradient(135deg, #fbbf24, #f59e0b); color: #1a1a2e; padding: 15px 40px; text-decoration: none; border-radius: 10px; font-weight: bold; font-size: 16px;">
              Start Exploring
            </a>
          </div>
          
          <p style="color: #e5e7eb;">Ready to book your next luxury getaway? Browse our exclusive collection of premium hotels and resorts.</p>
          
          <div style="background: rgba(0,0,0,0.2); padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #fbbf24; margin-top: 0;">🎯 Next Steps:</h3>
            <p style="color: #e5e7eb; margin: 5px 0;">✅ Complete your profile</p>
            <p style="color: #e5e7eb; margin: 5px 0;">🔍 Browse our hotel collection</p>
            <p style="color: #e5e7eb; margin: 5px 0;">📱 Download our mobile app (coming soon)</p>
          </div>
          
          <p style="color: #e5e7eb;">If you have any questions, our support team is here to help!</p>
        </div>
        
        <div style="text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px;">
          <p>© 2024 The Royal Stay. All rights reserved.</p>
          <p>Contact us: support@royalstay.me | +91-XXXXXXXXXX</p>
        </div>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Welcome email send error:', error);
    return { success: false, error: error.message };
  }
};
const sendPasswordResetEmail = async (email, resetToken) => {
  const resetLink = `http://localhost:5173/reset-password?token=${resetToken}`;
  
  const mailOptions = {
    from: process.env.EMAIL_USER || 'your-email@gmail.com',
    to: email,
    subject: '🔐 Password Reset - The Royal Stay',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: linear-gradient(135deg, #1a1a2e, #16213e); color: white; border-radius: 10px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #fbbf24; font-size: 32px; margin: 0;">👑 The Royal Stay</h1>
          <p style="color: #d1d5db; margin-top: 10px;">Luxury Hotel Management</p>
        </div>
        
        <div style="background: rgba(255,255,255,0.1); padding: 30px; border-radius: 10px; border: 1px solid rgba(251, 191, 36, 0.3);">
          <h2 style="color: #fbbf24; margin-top: 0;">Password Reset Request</h2>
          <p style="color: #e5e7eb; line-height: 1.6;">
            We received a request to reset your password. Click the button below to create a new password:
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" style="display: inline-block; background: linear-gradient(135deg, #fbbf24, #f59e0b); color: #1a1a2e; padding: 15px 40px; text-decoration: none; border-radius: 10px; font-weight: bold; font-size: 16px;">
              Reset Password
            </a>
          </div>
          
          <p style="color: #9ca3af; font-size: 14px; margin-top: 20px;">
            Or copy this link: <br/>
            <span style="color: #60a5fa; word-break: break-all;">${resetLink}</span>
          </p>
          
          <p style="color: #9ca3af; font-size: 14px; margin-top: 20px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 20px;">
            ⏰ This link will expire in 1 hour.<br/>
            🔒 If you didn't request this, please ignore this email.
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px;">
          <p>© 2024 The Royal Stay. All rights reserved.</p>
        </div>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, error: error.message };
  }
};

module.exports = { sendPasswordResetEmail, sendBookingConfirmationEmail, sendCustomEmail, sendWhatsAppBookingConfirmation };
