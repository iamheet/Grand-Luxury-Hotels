const mongoose = require('mongoose');

class DatabaseConnection {
  constructor() {
    this.isConnected = false;
    this.retryCount = 0;
    this.maxRetries = 5;
  }

  async connect() {
    try {
      // Debug environment information
      this.logEnvironmentInfo();
      
      // Validate MongoDB URI
      const mongoUri = this.validateMongoUri();
      
      // Connect with retry logic
      await this.connectWithRetry(mongoUri);
      
    } catch (error) {
      console.error('❌ Database connection failed:', error.message);
      
      if (process.env.NODE_ENV === 'production' && this.retryCount < this.maxRetries) {
        this.retryCount++;
        console.log(`🔄 Retrying connection (${this.retryCount}/${this.maxRetries}) in 5 seconds...`);
        setTimeout(() => this.connect(), 5000);
      } else {
        process.exit(1);
      }
    }
  }

  logEnvironmentInfo() {
    console.log('🔍 Database Environment Debug:');
    console.log('NODE_ENV:', process.env.NODE_ENV || 'undefined');
    console.log('MONGODB_URI exists:', !!process.env.MONGODB_URI);
    console.log('MONGODB_URI type:', typeof process.env.MONGODB_URI);
    
    if (process.env.MONGODB_URI) {
      const uri = process.env.MONGODB_URI;
      console.log('MONGODB_URI length:', uri.length);
      console.log('MONGODB_URI preview:', uri.substring(0, 30) + '...');
      console.log('Valid scheme:', uri.startsWith('mongodb://') || uri.startsWith('mongodb+srv://'));
    }
  }

  validateMongoUri() {
    const mongoUri = process.env.MONGODB_URI;
    
    if (!mongoUri) {
      throw new Error('MONGODB_URI environment variable is not defined');
    }
    
    if (typeof mongoUri !== 'string') {
      throw new Error(`MONGODB_URI must be a string, received ${typeof mongoUri}`);
    }
    
    if (mongoUri.trim() === '') {
      throw new Error('MONGODB_URI cannot be empty');
    }
    
    if (!mongoUri.startsWith('mongodb://') && !mongoUri.startsWith('mongodb+srv://')) {
      throw new Error(
        `Invalid MongoDB URI scheme. Expected 'mongodb://' or 'mongodb+srv://', ` +
        `but received: "${mongoUri.substring(0, 20)}..."`
      );
    }
    
    return mongoUri.trim();
  }

  async connectWithRetry(mongoUri) {
    console.log('🔄 Attempting MongoDB connection...');
    
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      minPoolSize: 5,
      maxIdleTimeMS: 30000,
      bufferMaxEntries: 0,
    };

    await mongoose.connect(mongoUri, options);
    
    this.isConnected = true;
    this.retryCount = 0;
    
    console.log('✅ MongoDB Connected Successfully');
    console.log('📊 Database:', mongoose.connection.db.databaseName);
    console.log('🌐 Host:', mongoose.connection.host);
    console.log('🔗 Connection State:', mongoose.connection.readyState);
  }

  setupEventHandlers() {
    mongoose.connection.on('connected', () => {
      console.log('🟢 Mongoose connected to MongoDB');
      this.isConnected = true;
    });

    mongoose.connection.on('error', (err) => {
      console.error('🔴 Mongoose connection error:', err.message);
      this.isConnected = false;
    });

    mongoose.connection.on('disconnected', () => {
      console.log('🟡 Mongoose disconnected from MongoDB');
      this.isConnected = false;
    });

    mongoose.connection.on('reconnected', () => {
      console.log('🟢 Mongoose reconnected to MongoDB');
      this.isConnected = true;
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await this.gracefulShutdown('SIGINT');
    });

    process.on('SIGTERM', async () => {
      await this.gracefulShutdown('SIGTERM');
    });
  }

  async gracefulShutdown(signal) {
    console.log(`\n🛑 Received ${signal}. Gracefully shutting down...`);
    
    try {
      await mongoose.connection.close();
      console.log('🔒 MongoDB connection closed successfully');
      process.exit(0);
    } catch (error) {
      console.error('❌ Error during graceful shutdown:', error);
      process.exit(1);
    }
  }

  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      readyState: mongoose.connection.readyState,
      host: mongoose.connection.host,
      database: mongoose.connection.db?.databaseName,
    };
  }
}

module.exports = new DatabaseConnection();