const express = require('express');
const router = express.Router();
const { sendBookingConfirmationEmail, sendCustomEmail, sendWhatsAppBookingConfirmation } = require('../emailService');

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

// Send email inquiry
router.post('/inquiry', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    
    // Validate required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ 
        success: false, 
        message: 'Name, email, subject, and message are required' 
      });
    }
    
    // Send inquiry email to admin
    const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER;
    const inquirySubject = `🔔 New Inquiry: ${subject}`;
    const inquiryMessage = `
      <h2 style="color: #fbbf24;">New Customer Inquiry</h2>
      <div style="background: rgba(0,0,0,0.2); padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 5px; margin-top: 10px;">
          ${message.replace(/\n/g, '<br>')}
        </div>
      </div>
      <p style="color: #9ca3af; font-size: 14px;">Received: ${new Date().toLocaleString()}</p>
    `;
    
    const result = await sendCustomEmail(adminEmail, inquirySubject, inquiryMessage);
    
    if (result.success) {
      res.json({ 
        success: true, 
        message: 'Your inquiry has been sent successfully. We will get back to you soon!' 
      });
    } else {
      res.status(500).json({ success: false, message: result.error });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;