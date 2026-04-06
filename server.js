const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

// Only load dotenv in development (not in Azure production)
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
  console.log('🔧 Development mode: dotenv loaded');
} else {
  console.log('🚀 Production mode: using Azure environment variables');
}

// Log startup information
console.log('🚀 Starting The Grand Stay API...');
console.log('📍 Environment:', process.env.NODE_ENV || 'development');
console.log('🔌 Port:', process.env.PORT || 5000);
console.log('📂 Working Directory:', process.cwd());
console.log('📋 Node Version:', process.version);
console.log('🔄 Deployment timestamp:', new Date().toISOString());

// Debug environment variables (without exposing secrets)
console.log('🔍 Environment Variables Check:');
console.log('  - NODE_ENV:', process.env.NODE_ENV || 'undefined');
console.log('  - PORT:', process.env.PORT || 'undefined');
console.log('  - MONGODB_URI exists:', !!process.env.MONGODB_URI);
console.log('  - JWT_SECRET exists:', !!process.env.JWT_SECRET);
console.log('  - RAZORPAY_KEY_ID exists:', !!process.env.RAZORPAY_KEY_ID);
console.log('  - EMAIL_USER exists:', !!process.env.EMAIL_USER);

// Validate critical environment variables
if (!process.env.MONGODB_URI) {
  console.error('❌ CRITICAL ERROR: MONGODB_URI environment variable is not set!');
  console.error('   Please check your Azure App Service Configuration > Application Settings');
  console.error('   Required: MONGODB_URI = your_mongodb_connection_string');
  process.exit(1);
}

if (!process.env.JWT_SECRET) {
  console.error('❌ CRITICAL ERROR: JWT_SECRET environment variable is not set!');
  console.error('   Please add JWT_SECRET to your Azure App Service Configuration');
  process.exit(1);
}

console.log('✅ All critical environment variables are present');

const app = express();
const server = http.createServer(app);

// Determine frontend URLs based on environment
const allowedOrigins = process.env.NODE_ENV === 'production'
  ? [
      'https://throyal.azurewebsites.net',
      'https://your-frontend-domain.com',
      process.env.FRONTEND_URL
    ].filter(Boolean)
  : ['http://localhost:5173', 'http://localhost:3000'];

console.log('🌐 Allowed CORS origins:', allowedOrigins);

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Make io accessible to routes
app.set('io', io);

// Middleware
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.static('public'));

// MongoDB Connection with proper error handling
console.log('🔗 Attempting MongoDB connection...');

const connectToMongoDB = async () => {
  try {
    const mongooseOptions = {
      serverSelectionTimeoutMS: 10000, // 10 seconds
      socketTimeoutMS: 45000, // 45 seconds
      maxPoolSize: 10,
      minPoolSize: 5,
      maxIdleTimeMS: 30000,
      bufferCommands: false,
      bufferMaxEntries: 0
    };

    await mongoose.connect(process.env.MONGODB_URI, mongooseOptions);
    console.log('✅ MongoDB Connected Successfully');
    console.log('📊 Database:', mongoose.connection.name);
    console.log('🌐 Host:', mongoose.connection.host);
    
  } catch (error) {
    console.error('❌ MongoDB Connection Failed:');
    console.error('   Error:', error.message);
    console.error('   Code:', error.code);
    
    if (error.message.includes('authentication failed')) {
      console.error('   💡 Check your MongoDB username and password');
    } else if (error.message.includes('network')) {
      console.error('   💡 Check your network connection and MongoDB URI');
    } else if (error.message.includes('timeout')) {
      console.error('   💡 MongoDB server might be unreachable or slow');
    }
    
    console.error('   🔧 Retrying connection in 5 seconds...');
    setTimeout(connectToMongoDB, 5000);
  }
};

// Handle MongoDB connection events
mongoose.connection.on('connected', () => {
  console.log('🟢 Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('🔴 Mongoose connection error:', err.message);
});

mongoose.connection.on('disconnected', () => {
  console.log('🟡 Mongoose disconnected from MongoDB');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('🛑 Received SIGINT, closing MongoDB connection...');
  await mongoose.connection.close();
  process.exit(0);
});

// Initialize MongoDB connection
connectToMongoDB();

// Routes
const passwordResetRoutes = require('./routes/passwordReset');
const paymentRoutes = require('./routes/payment');
// const emailRoutes = require('./routes/emailService');
const newsletterRoutes = require('./routes/newsletter');
const otpRoutes = require('./routes/otp');
app.use('/api/password', passwordResetRoutes);
app.use('/api/payment', paymentRoutes);
// app.use('/api/email', emailRoutes);
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
