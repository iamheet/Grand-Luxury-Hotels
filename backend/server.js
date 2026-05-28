const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');



// Debug CORS configuration
const allowedOrigins = [
  'https://www.royalstay.me', 
  'https://royalstay.me',
  'https://throyal.azurewebsites.net',
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  process.env.LOCALHOST_URL
].filter(Boolean);

console.log('🌐 CORS Allowed Origins:', allowedOrigins);
console.log('🔧 LOCALHOST_URL from env:', process.env.LOCALHOST_URL);

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Allow all origins for testing
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Make io accessible to routes
app.set('io', io);

// Middleware
app.use(cors({
  origin: '*', // Allow all origins for testing
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.static('public'));

// Production-ready MongoDB Connection with debugging
async function connectToMongoDB() {
  try {
    // Debug: Print environment info
    console.log('🔍 Environment Debug Info:');
    console.log('NODE_ENV:', process.env.NODE_ENV || 'undefined');
    console.log('MONGODB_URI exists:', !!process.env.MONGODB_URI);
    console.log('MONGODB_URI type:', typeof process.env.MONGODB_URI);
    
    // Get MongoDB URI with validation
    const mongoUri = process.env.MONGODB_URI;
    
    // Debug: Print URI info (without exposing credentials)
    if (mongoUri) {
      console.log('MONGODB_URI length:', mongoUri.length);
      console.log('MONGODB_URI starts with:', mongoUri.substring(0, 20) + '...');
      console.log('MONGODB_URI scheme valid:', mongoUri.startsWith('mongodb://') || mongoUri.startsWith('mongodb+srv://'));
    } else {
      console.log('❌ MONGODB_URI is undefined or empty');
    }
    
    // Validate URI format
    if (!mongoUri) {
      throw new Error('MONGODB_URI environment variable is not defined');
    }
    
    if (typeof mongoUri !== 'string') {
      throw new Error(`MONGODB_URI must be a string, got ${typeof mongoUri}`);
    }
    
    if (!mongoUri.startsWith('mongodb://') && !mongoUri.startsWith('mongodb+srv://')) {
      throw new Error(`Invalid MongoDB URI scheme. Expected 'mongodb://' or 'mongodb+srv://', got: ${mongoUri.substring(0, 20)}...`);
    }
    
    // Connect to MongoDB with modern options only
    console.log('🔄 Attempting MongoDB connection...');
    await mongoose.connect(mongoUri);
    
    console.log('✅ MongoDB Connected successfully');
    console.log('📊 Database:', mongoose.connection.db.databaseName);
    console.log('🌐 Host:', mongoose.connection.host);
    
  } catch (error) {
    console.error('❌ MongoDB Connection Failed:');
    console.error('   Error:', error.message);
    console.error('   Code:', error.code);
    
    // In production, we might want to retry or use a fallback
    if (process.env.NODE_ENV === 'production') {
      console.log('🔧 Retrying connection in 5 seconds...');
      setTimeout(() => {
        connectToMongoDB();
      }, 5000);
    } else {
      process.exit(1);
    }
  }
}

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
  try {
    await mongoose.connection.close();
    console.log('🔒 MongoDB connection closed through app termination');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during graceful shutdown:', error);
    process.exit(1);
  }
});

// Initialize MongoDB connection
connectToMongoDB();

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
app.use('/api/profile', require('./routes/profile'));

// Health check
app.get('/', (req, res) => {
  res.json({ 
    message: 'The Royal Stay API is running',
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
