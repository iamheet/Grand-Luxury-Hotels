const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const https = require('https');
const { URL } = require('url');
const Booking = require('../models/Booking');
const auth = require('../middleware/auth');

const router = express.Router();

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET_KEY
});

// Helper function for HTTP requests with timeout
function makeRequest(url, options) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const requestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port || 443,
      path: urlObj.pathname,
      method: options.method || 'GET',
      headers: options.headers || {},
      timeout: 30000 // 30 second timeout
    };

    const req = https.request(requestOptions, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          ok: res.statusCode >= 200 && res.statusCode < 300,
          status: res.statusCode,
          json: () => Promise.resolve(JSON.parse(data))
        });
      });
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
    
    if (options.body) req.write(options.body);
    req.end();
  });
}

// Helper function to get PayPal access token
async function getPayPalAccessToken() {
  const response = await makeRequest(`${process.env.PAYPAL_BASE_URL}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`).toString('base64')}`
    },
    body: 'grant_type=client_credentials'
  });
  
  const data = await response.json();
  return data.access_token;
}

// STRIPE ROUTES (COMMENTED FOR FUTURE USE)
// Create Stripe checkout session (with fallback to Razorpay for Indian accounts)
/*
router.post('/create-stripe-session', auth, async (req, res) => {
  try {
    const { amount, currency = 'usd', bookingData } = req.body;
    
    console.log('💳 Stripe checkout session request:', { amount, currency, bookingData });
    console.log('🔑 Stripe key exists:', !!process.env.STRIPE_SECRET_KEY);

    // Validate required data
    if (!bookingData || !bookingData.hotelName || !bookingData.customerEmail) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required booking data' 
      });
    }

    // For Indian regulations, fallback to Razorpay
    if (currency.toLowerCase() === 'inr') {
      console.log('🇮🇳 Indian currency detected, using Razorpay instead');
      const options = {
        amount: Math.round(amount * 100), // Convert to paise
        currency: 'INR',
        receipt: `booking_${Date.now()}`,
        payment_capture: 1
      };
      
      const order = await razorpay.orders.create(options);
      
      return res.json({
        success: true,
        useRazorpay: true,
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        key: process.env.RAZORPAY_KEY_ID
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: currency,
            product_data: {
              name: `${bookingData.hotelName} - ${bookingData.roomTitle || 'Room'}`,
              description: `${bookingData.nights || 1} night(s) for ${bookingData.guests || 1} guest(s)`,
            },
            unit_amount: Math.round(amount),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/booking-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/checkout`,
      customer_email: bookingData.customerEmail,
      metadata: {
        hotelName: bookingData.hotelName,
        customerName: bookingData.customerName || 'Guest',
        customerEmail: bookingData.customerEmail
      }
    });

    console.log('✅ Stripe session created:', session.id);

    res.json({
      success: true,
      sessionId: session.id
    });
  } catch (error) {
    console.error('❌ Stripe checkout session error:', error.message);
    console.error('❌ Full error:', error);
    
    // If Stripe fails due to Indian regulations, fallback to Razorpay
    if (error.message.includes('Indian regulations')) {
      console.log('🔄 Falling back to Razorpay due to Indian regulations');
      try {
        const options = {
          amount: Math.round(req.body.amount * 100), // Convert to paise
          currency: 'INR',
          receipt: `booking_${Date.now()}`,
          payment_capture: 1
        };
        
        const order = await razorpay.orders.create(options);
        
        return res.json({
          success: true,
          useRazorpay: true,
          orderId: order.id,
          amount: order.amount,
          currency: order.currency,
          key: process.env.RAZORPAY_KEY_ID
        });
      } catch (razorpayError) {
        return res.status(500).json({ success: false, message: razorpayError.message });
      }
    }
    
    res.status(500).json({ success: false, message: error.message });
  }
});
*/

// Create Stripe payment intent (with fallback to Razorpay)
/*
router.post('/create-stripe-intent', auth, async (req, res) => {
  try {
    const { amount, currency = 'usd', bookingData } = req.body;
    
    console.log('💳 Stripe payment intent request:', { amount, currency });

    // For Indian regulations, fallback to Razorpay
    if (currency.toLowerCase() === 'inr') {
      console.log('🇮🇳 Indian currency detected, using Razorpay instead');
      const options = {
        amount: Math.round(amount * 100), // Convert to paise
        currency: 'INR',
        receipt: `booking_${Date.now()}`,
        payment_capture: 1
      };
      
      const order = await razorpay.orders.create(options);
      
      return res.json({
        success: true,
        useRazorpay: true,
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        key: process.env.RAZORPAY_KEY_ID
      });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount), // Amount in cents
      currency,
      metadata: {
        hotelName: bookingData.hotelName,
        customerName: bookingData.customerName,
        customerEmail: bookingData.customerEmail
      }
    });

    res.json({
      success: true,
      client_secret: paymentIntent.client_secret,
      payment_intent_id: paymentIntent.id
    });
  } catch (error) {
    console.error('❌ Stripe payment intent error:', error);
    
    // If Stripe fails due to Indian regulations, fallback to Razorpay
    if (error.message.includes('Indian regulations')) {
      console.log('🔄 Falling back to Razorpay due to Indian regulations');
      try {
        const options = {
          amount: Math.round(req.body.amount * 100), // Convert to paise
          currency: 'INR',
          receipt: `booking_${Date.now()}`,
          payment_capture: 1
        };
        
        const order = await razorpay.orders.create(options);
        
        return res.json({
          success: true,
          useRazorpay: true,
          orderId: order.id,
          amount: order.amount,
          currency: order.currency,
          key: process.env.RAZORPAY_KEY_ID
        });
      } catch (razorpayError) {
        return res.status(500).json({ success: false, message: razorpayError.message });
      }
    }
    
    res.status(500).json({ success: false, message: error.message });
  }
});
*/

// PAYPAL ROUTES
// Create PayPal order
router.post('/create-paypal-order', async (req, res) => {
  try {
    const { amount, currency = 'USD', bookingData, isMembership } = req.body;
    
    console.log('💰 PayPal order request:', { amount, currency, bookingData, isMembership });

    // Validate required data
    if (!bookingData || !bookingData.hotelName || !bookingData.customerEmail) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required booking data' 
      });
    }

    const order = {
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: currency,
          value: (amount / 100).toFixed(2) // Convert cents to dollars
        },
        description: `${bookingData.hotelName} - ${bookingData.roomTitle || 'Room'} (${bookingData.nights || 1} nights)`
      }],
      application_context: {
        return_url: isMembership 
          ? `${process.env.FRONTEND_URL || 'http://localhost:3000'}/membership-success`
          : `${process.env.FRONTEND_URL || 'http://localhost:3000'}/booking-success`,
        cancel_url: isMembership 
          ? `${process.env.FRONTEND_URL || 'http://localhost:3000'}/membership-payment`
          : `${process.env.FRONTEND_URL || 'http://localhost:3000'}/checkout`
      }
    };

    const response = await makeRequest(`${process.env.PAYPAL_BASE_URL}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${await getPayPalAccessToken()}`
      },
      body: JSON.stringify(order)
    });

    const orderData = await response.json();
    
    if (response.ok) {
      console.log('✅ PayPal order created:', orderData.id);
      res.json({
        success: true,
        orderId: orderData.id,
        approvalUrl: orderData.links.find(link => link.rel === 'approve')?.href
      });
    } else {
      console.error('❌ PayPal order creation failed:', orderData);
      throw new Error(orderData.message || 'PayPal order creation failed');
    }
  } catch (error) {
    console.error('❌ PayPal order error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Track processed orders to prevent duplicates
const processedOrders = new Map();

// Capture PayPal payment
router.post('/capture-paypal-payment', async (req, res) => {
  const { orderId, bookingData } = req.body;
  
  try {
    // Check if order is already completed
    if (processedOrders.get(orderId) === 'completed') {
      console.log('⚠️ Order already completed:', orderId);
      return res.status(409).json({ 
        success: false, 
        message: 'Order already completed' 
      });
    }
    
    // Mark order as processing
    processedOrders.set(orderId, 'processing');
    
    console.log('🔄 Capturing PayPal payment:', orderId);
    
    // Add timeout wrapper
    const capturePromise = makeRequest(`${process.env.PAYPAL_BASE_URL}/v2/checkout/orders/${orderId}/capture`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${await getPayPalAccessToken()}`
      }
    });
    
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('PayPal capture timeout')), 25000)
    );
    
    const response = await Promise.race([capturePromise, timeoutPromise]);
    const captureData = await response.json();
    
    console.log('📋 PayPal capture response:', {
      status: response.status,
      ok: response.ok,
      captureStatus: captureData.status
    });
    
    if (response.ok && captureData.status === 'COMPLETED') {
      // Mark as completed to prevent duplicate processing
      processedOrders.set(orderId, 'completed');
      
      // Check if booking already exists for this PayPal order
      const existingBooking = await Booking.findOne({ orderId: orderId, paymentMethod: 'paypal' });
      if (existingBooking) {
        console.log('⚠️ Booking already exists for PayPal order:', orderId);
        return res.json({
          success: true,
          message: 'Booking already exists',
          booking: existingBooking
        });
      }
      
      const booking = new Booking({
        ...bookingData,
        userId: req.userId || null,
        paymentId: captureData.id,
        orderId: orderId,
        paymentMethod: 'paypal',
        paymentStatus: 'completed',
        status: 'confirmed',
        bookingDate: new Date(),
        createdAt: new Date()
      });

      await booking.save();

      const io = req.app.get('io');
      if (io) {
        io.emit('newBooking', {
          message: 'New booking created',
          booking: {
            id: booking._id,
            hotelName: booking.hotelName,
            customerName: booking.guest?.name || 'Guest',
            amount: booking.total,
            createdAt: booking.createdAt
          }
        });
      }

      res.json({
        success: true,
        message: 'Payment captured and booking created',
        booking: booking
      });
    } else {
      console.error('❌ PayPal capture failed:', captureData);
      processedOrders.set(orderId, 'failed');
      res.status(400).json({ 
        success: false, 
        message: `Payment capture failed: ${captureData.message || 'Unknown error'}` 
      });
    }
  } catch (error) {
    console.error('❌ PayPal capture error:', error.message);
    processedOrders.delete(orderId); // Clear on error
    res.status(500).json({ success: false, message: error.message });
  }
});


// Optional auth middleware - allows both authenticated and unauthenticated requests
const optionalAuth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'luxury-grand-stay-secret-2024');
      req.userId = decoded.id;
    } catch (error) {
      // Token invalid but continue without auth
      console.log('Invalid token, continuing without auth');
    }
  }
  
  next();
};

router.post('/create-order', auth, async (req, res) => {
  try {
    const { amount, currency = 'INR', bookingData } = req.body;
    
    console.log('💰 Payment order request:', { amount, currency });

    const options = {
      amount: Math.round(amount), // Amount already in paise from frontend
      currency,
      receipt: `booking_${Date.now()}`,
      payment_capture: 1
    };

    console.log('📋 Razorpay options:', options);

    const order = await razorpay.orders.create(options);

    res.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    console.error('❌ Payment order error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Verify payment and create booking (supports Razorpay only - PayPal handled separately)
router.post('/verify-payment', auth, async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      bookingData
    } = req.body;

    // Only handle Razorpay verification here - PayPal is handled in capture-paypal-payment
    if (!razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Missing Razorpay payment details' });
    }

    // Handle Razorpay verification
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_SECRET_KEY)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Payment verification failed' });
    }

    // Payment verified, create booking
    const booking = new Booking({
      ...bookingData,
      userId: req.userId, // Now required since we use auth middleware
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      paymentMethod: 'razorpay',
      paymentStatus: 'completed',
      status: 'confirmed',
      bookingDate: new Date(),
      createdAt: new Date()
    });

    await booking.save();

    // Emit real-time notification
    const io = req.app.get('io');
    if (io) {
      io.emit('newBooking', {
        message: 'New booking created',
        booking: {
          id: booking._id,
          hotelName: booking.hotelName,
          customerName: booking.guest?.name || 'Guest',
          amount: booking.total,
          createdAt: booking.createdAt
        }
      });
    }

    res.json({
      success: true,
      message: 'Payment verified and booking created',
      booking: booking
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get payment details
router.get('/payment/:paymentId', auth, async (req, res) => {
  try {
    const payment = await razorpay.payments.fetch(req.params.paymentId);
    res.json({ success: true, payment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get transaction details for dispute resolution
router.get('/transaction/:bookingId', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return res.status(401).json({ success: false, message: 'Access denied. No token provided.' })
    }

    let decoded
    try {
      decoded = jwt.verify(token, 'luxury-grand-stay-secret-2024')
    } catch (error) {
      return res.status(401).json({ success: false, message: 'Invalid token.' })
    }

    const booking = await Booking.findById(req.params.bookingId)
    
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' })
    }

    // Allow access if user owns booking OR if admin
    const isOwner = booking.userId.toString() === decoded.id
    const isAdmin = decoded.username || decoded.type === 'admin' // Admin tokens have username field
    
    console.log('Token decoded:', { id: decoded.id, username: decoded.username, type: decoded.type })
    console.log('Booking userId:', booking.userId.toString())
    console.log('Access check:', { isOwner, isAdmin })
    
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Unauthorized access' })
    }

    if (!booking.paymentId) {
      return res.status(404).json({ success: false, message: 'No payment information found' })
    }

    // Fetch payment details from Razorpay or PayPal
    let payment;
    try {
      payment = await razorpay.payments.fetch(booking.paymentId);
    } catch (razorpayError) {
      // If Razorpay fails, try PayPal
      try {
        const response = await makeRequest(`${process.env.PAYPAL_BASE_URL}/v2/checkout/orders/${booking.paymentId}`, {
          headers: {
            'Authorization': `Bearer ${await getPayPalAccessToken()}`
          }
        });
        const paypalData = await response.json();
        payment = {
          currency: paypalData.purchase_units[0]?.amount?.currency_code || 'USD',
          method: 'paypal',
          email: paypalData.payer?.email_address,
          contact: null,
          created_at: new Date(paypalData.create_time).getTime() / 1000,
          status: paypalData.status.toLowerCase(),
          error_code: null,
          error_description: null
        };
      } catch (paypalError) {
        /* STRIPE FALLBACK (COMMENTED FOR FUTURE USE)
        try {
          const session = await stripe.checkout.sessions.retrieve(booking.paymentId);
          payment = {
            currency: session.currency,
            method: 'card',
            email: session.customer_email,
            contact: null,
            created_at: session.created,
            status: session.payment_status,
            error_code: null,
            error_description: null
          };
        } catch (stripeError) {
          throw new Error('Payment details not found in any payment provider');
        }
        */
        throw new Error('Payment details not found in Razorpay or PayPal');
      }
    }

    res.json({
      success: true,
      transaction: {
        bookingId: booking._id,
        razorpayPaymentId: booking.paymentId,
        razorpayOrderId: booking.orderId,
        paymentStatus: booking.paymentStatus,
        amount: booking.total,
        currency: payment.currency || 'INR',
        method: payment.method,
        email: payment.email,
        contact: payment.contact,
        createdAt: payment.created_at,
        paymentStatus: payment.status,
        errorCode: payment.error_code || null,
        errorDescription: payment.error_description || null,
        bookingDetails: {
          hotelName: booking.hotelName,
          checkIn: booking.checkIn,
          checkOut: booking.checkOut,
          guestName: booking.guest?.name,
          guestEmail: booking.guest?.email
        }
      }
    })
  } catch (error) {
    console.error('Transaction fetch error:', error)
    res.status(500).json({ success: false, message: error.message })
  }
})

// Handle payment failure (supports Razorpay and PayPal)
router.post('/payment-failed', auth, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, paypal_order_id, error, bookingData } = req.body

    // Create booking with failed status
    const booking = new Booking({
      ...bookingData,
      userId: req.userId,
      paymentId: razorpay_payment_id || paypal_order_id || null,
      orderId: razorpay_order_id || paypal_order_id || null,
      paymentMethod: paypal_order_id ? 'paypal' : 'razorpay',
      paymentStatus: 'failed',
      status: 'cancelled',
      failureReason: error || 'Payment failed',
      bookingDate: new Date(),
      createdAt: new Date()
    })

    await booking.save()

    res.json({
      success: true,
      message: 'Payment failure recorded',
      booking: booking
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

module.exports = router;