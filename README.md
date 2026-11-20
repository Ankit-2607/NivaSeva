# NivaSeva – Full-Stack Home Service Booking Platform

NivaSeva is a clean, modular, and responsive full-stack home service booking application built using **React 19, Tailwind CSS, Node.js, Express.js, and MongoDB with Mongoose**.

## 🌟 Key Features

### 1. Role-Based Access Control

- **Customer:** Can register publicly, browse services, book appointments with upfront pricing, track booking status, and manage cancellations.
- **Admin:** Cannot register through public forms. The first admin account is created using a trusted backend seed script (`npm run seed`). Existing admins can create additional admin accounts through the Master Admin Panel.

### 2. Service Catalog

- Browse services by categories:
  - Cleaning
  - Plumbing
  - Electrical
  - Appliances
  - Pest Control
- Search services by title and description.
- View service pricing in ₹, estimated duration, included features, and safety guarantees.

### 3. Booking Workflow

A step-by-step booking process:

1. Select a service.
2. Choose a date and time slot.
3. Enter the doorstep address and additional notes.
4. Confirm the booking.

Additional features:
- Price snapshot stored at booking time to prevent client-side price manipulation.
- Booking status lifecycle:

`PENDING → CONFIRMED → IN_PROGRESS → COMPLETED / CANCELLED`

### 4. Role-Specific Dashboards

**Customer Dashboard**
- View scheduled appointments.
- Track booking statuses.
- View booking price details.
- Cancel eligible bookings.

**Admin Dashboard**
- View total bookings, pending bookings, confirmed bookings, completed bookings, active services, and revenue.
- Update booking statuses.
- Create and manage services.
- Manage customers and provision additional admin accounts.

---

## 🚀 Quick Start Guide

### Prerequisites

Make sure you have installed:

- Node.js and npm
- MongoDB Atlas or local MongoDB
- Git

### 1. Backend Setup

Open a terminal in the project root:

```bash
cd Backend
npm install
```

Create a `.env` file using `.env.example` as a reference and configure your environment variables.

Start the backend:

```bash
npm start
```

The backend server runs at:

`http://localhost:5000`

Health check:

`http://localhost:5000/api/health`

### 2. Frontend Setup

Open a second terminal:

```bash
cd Frontend
npm install
npm run dev
```

The Vite development server runs at:

`http://localhost:5173`

---

## 🔑 Demo Accounts

Use the demo login buttons on the login page or enter these credentials:

| Role | Email | Password | Dashboard |
|---|---|---|---|
| Admin | admin@nivaseva.com | admin123 | `/admin` |
| Customer | customer@nivaseva.com | customer123 | `/dashboard` |

You can also register a new customer account through `/register`.

**Security note:** These are demo credentials. Change them before deploying the application publicly, and never use these passwords for real accounts.

---

## 🛠️ Database Configuration and Seeding

The application uses MongoDB with Mongoose.

Configure your MongoDB connection string in `Backend/.env`.

Example:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/nivaseva
```

To seed initial services and create the first admin account:

```bash
cd Backend
npm run seed
```

The backend also includes an in-memory development fallback when MongoDB is unavailable, according to the current implementation.

---

## 📁 Project Architecture

```text
NivaSeva/
│
├── Backend/
│   ├── src/
│   │   ├── config/          # MongoDB connection and development fallback
│   │   ├── controllers/     # Auth, Services, Bookings, Admin controllers
│   │   ├── middleware/      # JWT authentication and error handling
│   │   ├── models/          # User, Service, Booking schemas
│   │   ├── routes/          # Express API routes
│   │   └── seed.js          # Initial admin and service seeding
│   │
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
├── Frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Common/      # Buttons, Input, Loader, StatusBadge
│   │   │   └── layout/      # Navbar and Footer
│   │   ├── context/         # Authentication context
│   │   ├── pages/           # Application pages
│   │   ├── services/        # API client and service functions
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
├── README.md
└── .gitignore
```

---

## 🔌 API Endpoints Reference

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a customer |
| POST | `/api/auth/login` | Authenticate customer or admin |
| GET | `/api/auth/me` | Get authenticated user profile |

### Services

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/services` | List active services with filters |
| GET | `/api/services/:id` | Get service details |
| POST | `/api/services` | Create a service (Admin only) |
| PUT | `/api/services/:id` | Update a service (Admin only) |
| DELETE | `/api/services/:id` | Delete a service (Admin only) |

### Bookings

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/bookings` | Create a booking (Customer) |
| GET | `/api/bookings/my` | Get customer bookings |
| GET | `/api/bookings/:id` | View booking details (Owner or Admin) |
| PATCH | `/api/bookings/:id/cancel` | Cancel a booking (Customer) |

### Admin

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/admin/stats` | Get dashboard metrics |
| GET | `/api/admin/bookings` | List all customer bookings |
| PATCH | `/api/admin/bookings/:id/status` | Update booking status |
| POST | `/api/admin/users` | Create an admin account |
| GET | `/api/admin/users` | List registered users |

---

## 🧰 Tech Stack

**Frontend**
- React 19
- Vite
- Tailwind CSS
- JavaScript

**Backend**
- Node.js
- Express.js
- REST APIs
- JWT Authentication

**Database**
- MongoDB
- Mongoose

---

## 🎯 Project Goal

The goal of NivaSeva is to simplify the process of finding and booking reliable household services through a user-friendly platform while providing administrators with tools to manage services, customers, and bookings.