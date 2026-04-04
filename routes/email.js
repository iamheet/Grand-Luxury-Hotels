const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

// Create transporter with Gmail SMTP
const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASS || 'your-app-password'
  }
});

// Send booking confirmation email function
const sendBookingConfirmationEmail = async (to, guestName, hotelName, roomType, checkIn, checkOut, nights, guests, total, bookingId, paymentId) => {
  const mailOptions = {
    from: process.env.EMAIL_USER || 'your-email@gmail.com',
    to: to,
    subject: '✅ Booking Confirmed - The Grand Stay',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: linear-gradient(135deg, #1a1a2e, #16213e); color: white; border-radius: 10px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #fbbf24; font-size: 32px; margin: 0;">👑 The Grand Stay</h1>
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
          <p>© 2024 The Grand Stay. All rights reserved.</p>
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

// Send custom email function
const sendCustomEmail = async (to, subject, message) => {
  const mailOptions = {
    from: process.env.EMAIL_USER || 'your-email@gmail.com',
    to: to,
    subject: subject,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: linear-gradient(135deg, #1a1a2e, #16213e); color: white; border-radius: 10px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #fbbf24; font-size: 32px; margin: 0;">👑 The Grand Stay</h1>
        </div>
        <div style="background: rgba(255,255,255,0.1); padding: 30px; border-radius: 10px; border: 1px solid rgba(251, 191, 36, 0.3);">
          <div style="color: #e5e7eb; line-height: 1.6;">
            ${message}
          </div>
        </div>
        <div style="text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px;">
          <p>© 2024 The Grand Stay. All rights reserved.</p>
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

// Send WhatsApp booking confirmation function
const sendWhatsAppBookingConfirmation = async (phoneNumber, guestName, hotelName, roomType, checkIn, checkOut, nights, guests, total, bookingId) => {
  try {
    const message = `🏨 *The Grand Stay - Booking Confirmed!*\n\n✅ Dear ${guestName}, your booking is confirmed!\n\n📋 *Booking Details:*\n🏨 Hotel: ${hotelName}\n🛏️ Room: ${roomType}\n📅 Check-in: ${checkIn}\n📅 Check-out: ${checkOut}\n🌙 Nights: ${nights}\n👥 Guests: ${guests}\n💰 Total: ₹${total}\n\n🆔 Booking ID: ${bookingId}\n\n🙏 Thank you for choosing The Grand Stay!\n\n*Contact us:* +91-XXXXXXXXXX`;

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

// Send booking confirmation email
router.post('/booking-confirmation', async (req, res) => {
  try {
    const { to, guestName, hotelName, roomType, checkIn, checkOut, nights, guests, total, bookingId, paymentId } = req.body;
    
    const result = await sendBookingConfirmationEmail(
      to, guestName, hotelName, roomType, checkIn, checkOut, nights, guests, total, bookingId, paymentId
    );
    
    if (result.success) {
      res.json({ success: true, message: 'Booking confirmation email sent successfully' });
    } else {
      res.status(500).json({ success: false, message: result.error });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Send custom email
router.post('/send', async (req, res) => {
  try {
    const { to, subject, message } = req.body;
    
    const result = await sendCustomEmail(to, subject, message);
    
    if (result.success) {
      res.json({ success: true, message: 'Email sent successfully' });
    } else {
      res.status(500).json({ success: false, message: result.error });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Send WhatsApp booking confirmation
router.post('/whatsapp-booking', async (req, res) => {
  try {
    const { phoneNumber, guestName, hotelName, roomType, checkIn, checkOut, nights, guests, total, bookingId } = req.body;
    
    const result = await sendWhatsAppBookingConfirmation(
      phoneNumber, guestName, hotelName, roomType, checkIn, checkOut, nights, guests, total, bookingId
    );
    
    if (result.success) {
      res.json({ 
        success: true, 
        message: result.message, 
        whatsappUrl: result.whatsappUrl 
      });
    } else {
      res.status(500).json({ success: false, message: result.error });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;