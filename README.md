# NivaSeva (HomeEase) — Full-Stack Home Service Booking Platform

A clean, modular, and responsive full-stack home service booking application built with **React 19**, **Tailwind CSS**, **Node.js**, **Express.js**, and **MongoDB / Mongoose**.

---

## 🌟 Key Features

1. **Role-Based Access Control (Option 1 Implementation)**:
   - **Customer**: Registers publicly, browses service catalog, books appointments with fixed upfront pricing, tracks live booking status, and manages cancellations.
   - **Admin**: Cannot register through public forms! The first admin is seeded via a trusted backend seed script (`npm run seed`), and subsequent admins can be created/invited directly by existing admins from the **Master Admin Panel**.

2. **Service Catalog**:
   - Filter by categories: *Cleaning, Plumbing, Electrical, Appliances, Pest Control*.
   - Keyword search across service titles and descriptions.
   - Authoritative pricing in ₹ with duration, included highlights, and safety guarantees.

3. **Booking Workflow**:
   - Step-by-step scheduling: Pick Service → Select Date & Time Slot → Doorstep Address & Notes → Instant Confirmation.
   - Authoritative price snapshot stored at booking time (immune to client tampering).
   - Real-time status lifecycle: `PENDING` ➔ `CONFIRMED` ➔ `IN_PROGRESS` ➔ `COMPLETED` / `CANCELLED`.

4. **Role-Specific Dashboards**:
   - **Customer Dashboard**: Overview of scheduled appointments, status badges, price snapshots, and cancellation options.
   - **Admin Dashboard**: Real-time metrics (Total Bookings, Pending, Confirmed, Completed, Active Services, Revenue), booking status updater, service creator/manager, and Team Admin provisioning.

---

## 🚀 Quick Start Guide

### 1. Backend Setup
Open a terminal in the project root:
```bash
cd Backend
npm install
npm start
```
> The backend server starts on **http://localhost:5000**.
> Health check is accessible at `http://localhost:5000/api/health`.

### 2. Frontend Setup
In a second terminal:
```bash
cd Frontend
npm run dev
```
> The Vite development server starts on **http://localhost:5173**.

---

## 🔑 Demo Accounts (Pre-configured)

Use the quick demo buttons on the login page or enter these credentials:

| Role | Email | Password | Access / Destination |
| :--- | :--- | :--- | :--- |
| **Admin (Rahul)** | `admin@nivaseva.com` | `admin123` | Master Admin Dashboard (`/admin`) |
| **Customer** | `customer@nivaseva.com` | `customer123` | Customer Dashboard (`/dashboard`) |

> You can also register a new customer account anytime at `/register`.

---

## 🛠️ Database & Option 1 Seeding

- The application is connected to MongoDB via Mongoose.
- Update `Backend/.env` with your **MongoDB Atlas** or **local MongoDB** connection string:
  ```env
  MONGODB_URI=mongodb://127.0.0.1:27017/nivaseva
  ```
- To seed or reset initial services and the first Admin:
  ```bash
  cd Backend
  npm run seed
  ```
- *Note:* If MongoDB is not yet running locally, the backend includes an automatic in-memory development fallback so the frontend and API can be tested immediately out of the box without blocking!

---

## 📁 Project Architecture

```
NivaSeva/
├── Backend/
│   ├── src/
│   │   ├── config/          # MongoDB connection & dev fallback store
│   │   ├── controllers/     # Auth, Services, Bookings, Admin controllers
│   │   ├── middleware/      # JWT authentication, requireAdmin, errorHandler
│   │   ├── models/          # User, Service, Booking Mongoose schemas
│   │   ├── routes/          # Express route definitions
│   │   └── seed.js          # One-time Option 1 Admin & Services seed script
│   ├── .env.example
│   ├── package.json
│   └── server.js            # Express API server entry
│
├── Frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Common/      # Buttons, Input, Loader, StatusBadge, ProtectedRoute
│   │   │   └── layout/      # Responsive Navbar, Footer
│   │   ├── context/         # AuthContext (login, register, session persistence)
│   │   ├── pages/           # Home, Service, About, Login, Register, BookService, CustomerDashboard, AdminDashboard
│   │   ├── services/        # Fetch API client (auth, services, bookings, admin)
│   │   ├── App.jsx          # Routes configuration
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
└── README.md
```

---

## 🔌 API Endpoints Reference

### Authentication
- `POST /api/auth/register` — Register a customer (role is strictly `CUSTOMER`)
- `POST /api/auth/login` — Authenticate customer or admin, returns JWT
- `GET /api/auth/me` — Get current authenticated user profile

### Services
- `GET /api/services` — List active services (with category & search filters)
- `GET /api/services/:id` — Get service details
- `POST /api/services` — Create new service *(Admin only)*
- `PUT /api/services/:id` — Update existing service *(Admin only)*
- `DELETE /api/services/:id` — Remove service *(Admin only)*

### Bookings
- `POST /api/bookings` — Create a new appointment *(Customer)*
- `GET /api/bookings/my` — Get logged-in customer's bookings *(Customer)*
- `GET /api/bookings/:id` — View appointment details *(Owner or Admin)*
- `PATCH /api/bookings/:id/cancel` — Cancel appointment *(Customer)*

### Admin
- `GET /api/admin/stats` — Metrics overview (counts, revenue) *(Admin only)*
- `GET /api/admin/bookings` — List all customer bookings *(Admin only)*
- `PATCH /api/admin/bookings/:id/status` — Transition status *(Admin only)*
- `POST /api/admin/users` — Provision new Admin account (Option 1) *(Admin only)*
- `GET /api/admin/users` — List registered users *(Admin only)*
