# The Royal Stay 🏨
### Full-Stack Luxury Hotel Booking Platform

> A complete, production-inspired hotel booking system — built end-to-end with secure authentication, role-based access control, payment integration, and a scalable REST API architecture.

The Royal Stay is a full-stack MVP that covers the entire hotel booking lifecycle — from user registration and room browsing to secure payments and admin management. Built solo with Node.js, Express, MongoDB, and React, it demonstrates real-world backend architecture, clean API design, and third-party service integration.

---

## 🚀 Live Demo

Currently not deployed. Available locally — can provide a live demo on request.

---

## ✨ Features

### 👤 User Experience
- Secure registration & login with JWT-based authentication
- Browse hotel listings and check room availability
- Book rooms with real-time data handling
- View, manage, and track personal bookings
- Password reset via email flow

### 🛡️ Admin & Sub-Admin Controls
- Full admin dashboard for managing users, bookings, and hotels
- Sub-admin roles with granular, permission-based access (RBAC)
- Manage room listings, availability, and platform activity
- Monitor and control all user interactions from a single interface

### 💳 Payments
- Razorpay integration for secure, reliable payment processing
- End-to-end booking payment flow with proper error handling

### 📧 Email & Notifications
- Automated password reset email flow
- Mobile-friendly email templates
- User communication system built for scale

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Backend | Node.js, Express.js |
| Database | MongoDB |
| Authentication | JWT, bcrypt |
| Frontend | React.js, Tailwind CSS, HTML/CSS |
| Payment Gateway | Razorpay |
| Deployment | Railway |
| Dev Tools | Git, GitHub, Postman, VS Code |

---

## 🔐 Authentication Flow

```
User Register / Login
        │
        ▼
Password hashed with bcrypt
        │
        ▼
JWT Token generated on login
        │
        ▼
Token stored client-side
        │
        ▼
Protected routes validated via middleware
        │
        ▼
Access granted / denied based on role (User / Admin / Sub-Admin)
```

---

## 🔄 Booking Flow

```
User browses hotels & selects room
            │
            ▼
Booking request sent to API
            │
            ▼
Availability validated on backend
            │
            ▼
Razorpay payment initiated
            │
            ▼
Payment confirmed → Booking created in DB
            │
            ▼
Confirmation shown to user
```

---

## ⚡ API Overview

| Module | Endpoints |
|---|---|
| Auth | Register, Login, Logout, Password Reset |
| Hotels | List, Details, Availability |
| Bookings | Create, View, Cancel, Manage |
| Admin | User Management, Booking Control, Role Assignment |
| Payments | Initiate, Verify, Handle Webhooks |

---

## 🗄️ Database Design

- **Users** — profile, credentials, role, booking history
- **Hotels** — listings, room types, availability, pricing
- **Bookings** — user-hotel mapping, dates, status, payment info
- **Admins** — role-based access, permissions, activity logs

All schemas are optimised for query performance with proper indexing and validation layers.

---

## 📁 Project Structure

```
The Royal Stay/
├── backend/
│   ├── controllers/       # Route logic & business rules
│   ├── models/            # MongoDB schemas
│   ├── routes/            # API route definitions
│   ├── middleware/        # Auth, RBAC, error handling
│   └── utils/             # Email, payment helpers
├── src/
│   ├── components/        # Reusable React components
│   ├── pages/             # Page-level views
│   └── services/          # API call handlers
├── public/                # Static assets
├── .env.example           # Environment variable template
└── README.md
```

---

## 🏃 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- Razorpay account (for payment testing)

### Installation

```bash
# Clone the repository
git clone https://github.com/iamheet/the-royal-stay
cd the-royal-stay

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../src
npm install

# Set up environment variables
cp .env.example .env
# Fill in your MongoDB URI, JWT secret, Razorpay keys, email config
```

### Running the App

```bash
# Start backend
cd backend
npm run dev

# Start frontend (new terminal)
cd src
npm run dev
```

---

## 🔑 Environment Variables

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
```

---

## 💡 Key Highlights

- **Complete Full-Stack Ownership** — designed, built, and shipped solo from database to UI
- **Production-Grade Auth** — JWT + bcrypt + middleware-protected routes + RBAC
- **Real Payment Integration** — not mocked; actual Razorpay payment gateway wired up
- **Scalable Architecture** — clean MVC structure built to grow beyond MVP
- **Admin System** — full multi-role management panel, not just a basic CRUD app

---

## 🗺️ Roadmap

- [ ] Real-time room availability with WebSockets
- [ ] Advanced search & filtering (location, price, ratings)
- [ ] SMS notifications via Twilio
- [ ] Full UI/UX upgrade with animations and improved design system
- [ ] Reviews & ratings system
- [ ] Analytics dashboard for admins

---

## 🔮 Future Improvements

Beyond the roadmap, here are some bigger, more ambitious ideas planned for The Royal Stay's evolution:

- **Real-time Room Availability using WebSockets** — instant updates without page refresh
- **Dynamic Pricing Engine** — automatically adjusts room prices based on demand, seasonality, and occupancy patterns — like how airlines price tickets
- **Multi-Currency Support** — for international users and properties
- **AI-Powered Hotel Recommendations** — personalised suggestions based on user behaviour

 These ideas reflect my interest in building scalable, intelligent systems and exploring advanced product capabilities. While not implemented yet, they represent        potential directions for future development.

---

## 👨‍💻 Author


**Heet Chokshi** — Full Stack Developer

---

## ⭐ Support

If The Royal Stay helped you learn something or sparked an idea, drop a **star** on GitHub — it genuinely means a lot!

---

_Built with Node.js, strong coffee, and a deep respect for clean architecture_ ☕🏗️
