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

module.exports = router;