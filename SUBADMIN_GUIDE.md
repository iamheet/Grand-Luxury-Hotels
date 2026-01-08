# Sub-Admin System Documentation

## Overview
The Grand Stay now has a complete Sub-Admin management system where the Main Admin can create and manage Sub-Admins with limited permissions.

## Admin Hierarchy

### 1. Main Admin (Super Admin)
- **Username**: `admin`
- **Password**: `luxury2024`
- **Access**: Full access to all features
- **Dashboard**: `/admin-dashboard`
- **Capabilities**:
  - View all users, bookings, hotels, transactions
  - Manage revenue and analytics
  - Create/Delete Sub-Admins
  - Manage hotel database
  - Full system control

### 2. Sub-Admin
- **Created by**: Main Admin only
- **Dashboard**: `/subadmin-dashboard`
- **Capabilities**: Based on assigned permissions
  - View Users (if permitted)
  - View Bookings (if permitted)
  - View Revenue (if permitted)
  - Manage Hotels (if permitted)

### 3. Hotel Admin
- **Login**: Hotel email and password from database
- **Dashboard**: `/admin-dashboard` (filtered view)
- **Capabilities**: Limited to their specific hotel data

## How to Create a Sub-Admin

1. **Login as Main Admin**
   - Go to `/admin-login`
   - Username: `admin`
   - Password: `luxury2024`

2. **Navigate to Sub Admins Section**
   - Click "Sub Admins" in the sidebar
   - Click "+ Add Sub Admin" button

3. **Enter Sub-Admin Details**
   - Name: Full name of the sub-admin
   - Username: Login username (must be unique)
   - Password: Login password
   - Email: Email address (must be unique)

4. **Default Permissions** (automatically assigned):
   - ✓ View Users
   - ✓ View Bookings
   - ✗ View Revenue
   - ✗ Manage Hotels

## Sub-Admin Login

1. Go to `/admin-login`
2. Enter the username and password created by Main Admin
3. System automatically routes to `/subadmin-dashboard`
4. Sub-Admin sees only the features they have permission for

## Features

### Main Admin Dashboard
- Full dashboard with all statistics
- User management
- Hotel management
- Transaction tracking
- Revenue analytics
- Sub-Admin management (NEW)
- Settings and customization

### Sub-Admin Dashboard
- Limited dashboard based on permissions
- Clean, modern UI matching main admin style
- Permission-based navigation
- View-only access (no delete/modify capabilities)
- Shows active permissions on dashboard

## Security Features

1. **JWT Authentication**: All admin types use JWT tokens
2. **Role-Based Access**: Backend validates admin type for each request
3. **Permission Checks**: Sub-admins can only access permitted endpoints
4. **Secure Password Storage**: Bcrypt hashing for all passwords
5. **Token Expiration**: 15-minute token expiry for security

## API Endpoints

### Sub-Admin Management (Main Admin Only)
- `GET /api/subadmin` - Get all sub-admins
- `POST /api/subadmin` - Create new sub-admin
- `PUT /api/subadmin/:id` - Update sub-admin
- `DELETE /api/subadmin/:id` - Delete sub-admin

### Authentication
- `POST /api/auth/login` - Login for all admin types
  - Main Admin: username + password
  - Sub-Admin: username + password
  - Hotel Admin: email + password

## Database Schema

### SubAdmin Model
```javascript
{
  name: String (required),
  username: String (required, unique),
  password: String (required, hashed),
  email: String (required, unique),
  phone: String (optional),
  permissions: {
    viewUsers: Boolean (default: true),
    viewBookings: Boolean (default: true),
    viewRevenue: Boolean (default: false),
    manageHotels: Boolean (default: false)
  },
  isActive: Boolean (default: true),
  createdBy: String (default: 'super-admin'),
  createdAt: Date (auto)
}
```

## File Structure

### Backend
- `backend/models/SubAdmin.js` - SubAdmin database model
- `backend/routes/subadmin.js` - SubAdmin management routes
- `backend/routes/auth.js` - Updated with sub-admin login logic
- `backend/server.js` - Registered subadmin routes

### Frontend
- `src/pages/SubAdminDashboard.tsx` - Sub-admin dashboard UI
- `src/pages/AdminDashboard.tsx` - Updated with SubAdmin management section
- `src/pages/AdminLogin.tsx` - Updated to route sub-admins correctly
- `src/App.tsx` - Added SubAdminDashboard route

## Usage Example

### Creating a Sub-Admin
```javascript
// Main Admin creates sub-admin via UI
Name: "John Doe"
Username: "johndoe"
Password: "secure123"
Email: "john@thegrandstay.com"

// System automatically assigns default permissions
Permissions: {
  viewUsers: true,
  viewBookings: true,
  viewRevenue: false,
  manageHotels: false
}
```

### Sub-Admin Login
```javascript
// Sub-admin logs in
Username: "johndoe"
Password: "secure123"

// System routes to /subadmin-dashboard
// Shows only Users and Bookings sections (based on permissions)
```

## Benefits

1. **Delegation**: Main admin can delegate tasks to sub-admins
2. **Security**: Limited access reduces security risks
3. **Scalability**: Easy to add more sub-admins as business grows
4. **Audit Trail**: Track who created each sub-admin
5. **Flexibility**: Customize permissions per sub-admin (future enhancement)

## Future Enhancements

1. **Custom Permissions**: Allow main admin to customize permissions per sub-admin
2. **Activity Logs**: Track sub-admin actions
3. **Email Notifications**: Notify sub-admins when account is created
4. **Password Reset**: Allow sub-admins to reset their passwords
5. **Session Management**: View active sub-admin sessions
6. **Bulk Operations**: Create multiple sub-admins at once

## Troubleshooting

### Sub-Admin Can't Login
- Verify username and password are correct
- Check if sub-admin account is active (isActive: true)
- Ensure backend server is running
- Check browser console for errors

### Sub-Admin Can't See Certain Features
- Check permissions in Main Admin dashboard
- Verify backend is returning correct permissions
- Clear browser cache and localStorage

### Main Admin Can't Create Sub-Admin
- Ensure you're logged in as Main Admin (not sub-admin)
- Check if username/email already exists
- Verify backend connection
- Check server logs for errors

## Support

For issues or questions, contact the development team or check the server logs for detailed error messages.
