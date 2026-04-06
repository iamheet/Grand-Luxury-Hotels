const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? ['https://www.royalstay.me', 'https://royalstay.me']
      : 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

// Make io accessible to routes
app.set('io', io);

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? ['https://www.royalstay.me', 'https://royalstay.me']
    : 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.static('public'));

// MongoDB Connection with retry logic
let retryCount = 0;
const maxRetries = 5;

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('✅ MongoDB Connected');
    retryCount = 0;
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err.message);
    if (retryCount < maxRetries) {
      retryCount++;
      console.log(`🔄 Retrying connection (${retryCount}/${maxRetries})...`);
      setTimeout(connectDB, 5000);
    } else {
      console.error('❌ Max retries reached. Exiting...');
      process.exit(1);
    }
  }
};

connectDB();

// Routes
const passwordResetRoutes = require('./routes/passwordReset');
const paymentRoutes = require('./routes/payment');
const emailRoutes = require('./routes/email');
const newsletterRoutes = require('./routes/newsletter');
const otpRoutes = require('./routes/otp');
app.use('/api/password', passwordResetRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/email', emailRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/otp', otpRoutes);
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/hotels', require('./routes/hotels'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/members', require('./routes/members'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/subadmin', require('./routes/subadmin'));

// Health check
app.get('/', (req, res) => {
  res.json({ 
    message: 'The Grand Stay API is running',
    environment: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 5000,
    timestamp: new Date().toISOString()
  });
});

// Socket.io connection
io.on('connection', (socket) => {
  console.log('✅ Admin connected:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('❌ Admin disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🔌 Socket.io ready for real-time notifications`);
});
