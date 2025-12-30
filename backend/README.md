# The Grand Stay - Backend API

## Setup Instructions

1. Install MongoDB locally or use MongoDB Atlas
2. Install dependencies:
   ```bash
   cd backend
   npm install
   ```

3. Update `.env` file with your MongoDB URI

4. Start the server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user

### Bookings
- GET `/api/bookings` - Get user bookings (requires auth)
- POST `/api/bookings` - Create booking (requires auth)
- DELETE `/api/bookings/:id` - Cancel booking (requires auth)

### Users
- GET `/api/users` - Get users

### Hotels
- GET `/api/hotels` - Get hotels

### Members
- GET `/api/members` - Get members

## Environment Variables
- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
