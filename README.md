# 🔧 LocalMaster — Local Services Booking Platform

> A full-stack MERN application connecting customers with verified local service professionals for plumbing, electrical work, cleaning, and more.

**Built for Cohort 26 Buildathon — Problem Statement 1**

---

## 🌐 Live Demo

- **Frontend:** [https://localmaster.vercel.app](https://localmaster.vercel.app)
- **Backend API:** [https://localmaster-backend.onrender.com](https://localmaster-backend.onrender.com)

---

## 📌 Table of Contents

- [About the Project](#about-the-project)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Folder Structure](#folder-structure)
- [Getting Started](#getting-started)
- [API Endpoints](#api-endpoints)
- [Screenshots](#screenshots)

---

## 📖 About the Project

LocalMaster solves a real-world problem — finding trusted local service professionals is difficult, time-consuming and unreliable. LocalMaster provides a platform where:

- **Customers** can browse verified providers, book services and track jobs in real time
- **Providers** can list their services, manage bookings and grow their business
- **Admins** can approve providers, manage categories and moderate reviews

---

## ✨ Features

### 👤 Customer
- Register and login securely
- Browse verified service providers
- Filter by city and service category
- Book a provider with date, time and address
- Track booking status in real time
- Cancel bookings
- Submit reviews and ratings after completion

### 🔧 Provider
- Register as a service professional
- Set up profile (bio, experience, price, city, category)
- Toggle availability on/off
- View and manage incoming bookings
- Accept or reject booking requests
- Update job status (confirmed → in-progress → completed)

### 🛡️ Admin
- Approve or reject provider registrations
- Manage service categories (add, edit, delete)
- Moderate customer reviews (show/hide)
- View all contact messages
- Platform overview dashboard

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React.js (Vite) | UI Framework |
| React Router DOM | Client-side routing |
| Axios | HTTP requests |
| Context API | Global auth state |
| Tailwind CSS | Styling |

### Backend
| Technology | Purpose |
|---|---|
| Node.js | Runtime |
| Express.js | Web framework |
| MongoDB Atlas | Database |
| Mongoose | ODM |
| JWT | Authentication |
| bcryptjs | Password hashing |

### Deployment
| Service | Purpose |
|---|---|
| Vercel | Frontend hosting |
| Render | Backend hosting |
| MongoDB Atlas | Cloud database |
| GitHub | Version control |

---

## 📁 Folder Structure

```
localmaster/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── bookingController.js
│   │   ├── categoryController.js
│   │   ├── contactController.js
│   │   ├── providerController.js
│   │   └── reviewController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── Booking.js
│   │   ├── Category.js
│   │   ├── Contact.js
│   │   ├── Provider.js
│   │   ├── Review.js
│   │   └── User.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── booking.js
│   │   ├── category.js
│   │   ├── contact.js
│   │   ├── provider.js
│   │   └── review.js
│   ├── .env
│   ├── package.json
│   └── server.js
│
└── frontend/
    ├── src/
    │   ├── api/
    │   │   └── axios.js
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── components/
    │   │   └── ProtectedRoute.jsx
    │   └── pages/
    │       ├── public/
    │       │   ├── Landing.jsx
    │       │   ├── Login.jsx
    │       │   ├── Register.jsx
    │       │   ├── Providers.jsx
    │       │   └── Contact.jsx
    │       ├── customer/
    │       │   ├── Dashboard.jsx
    │       │   ├── BookNow.jsx
    │       │   └── BookingDetail.jsx
    │       ├── provider/
    │       │   ├── Dashboard.jsx
    │       │   └── Profile.jsx
    │       └── admin/
    │           ├── Dashboard.jsx
    │           ├── Categories.jsx
    │           ├── Providers.jsx
    │           ├── Reviews.jsx
    │           └── Messages.jsx
    ├── package.json
    └── vite.config.js
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- Git

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/Subhadip77/localmaster.git
cd localmaster
```

**2. Setup Backend**
```bash
cd backend
npm install
```

Create `.env` file in `backend/`:
```env
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

```bash
npm run dev
```

**3. Setup Frontend**
```bash
cd frontend
npm install
npm run dev
```

**4. Open in browser**
```
Frontend: http://localhost:5173
Backend:  http://localhost:5000
```

### Test Credentials
```
Admin:    admin@localmaster.com  / admin123
Customer: rahul@gmail.com        / 123456
Provider: ramesh@gmail.com       / 123456
```

---

## 📡 API Endpoints

### Auth
| Method | Endpoint | Access |
|---|---|---|
| POST | /api/auth/register | Public |
| POST | /api/auth/login | Public |
| GET | /api/auth/profile | Private |
| PUT | /api/auth/profile | Private |

### Categories
| Method | Endpoint | Access |
|---|---|---|
| GET | /api/categories | Public |
| POST | /api/categories | Admin |
| PUT | /api/categories/:id | Admin |
| DELETE | /api/categories/:id | Admin |

### Providers
| Method | Endpoint | Access |
|---|---|---|
| GET | /api/providers | Public |
| GET | /api/providers/:id | Public |
| GET | /api/providers/my/profile | Provider |
| PUT | /api/providers/profile | Provider |
| PUT | /api/providers/toggle/availability | Provider |
| PUT | /api/providers/:id/approve | Admin |
| GET | /api/providers/admin/all | Admin |

### Bookings
| Method | Endpoint | Access |
|---|---|---|
| POST | /api/bookings | Customer |
| GET | /api/bookings/my | Customer |
| GET | /api/bookings/provider | Provider |
| GET | /api/bookings/:id | Auth |
| PUT | /api/bookings/:id/accept | Provider |
| PUT | /api/bookings/:id/reject | Provider |
| PUT | /api/bookings/:id/status | Provider |
| PUT | /api/bookings/:id/cancel | Customer |

### Reviews
| Method | Endpoint | Access |
|---|---|---|
| POST | /api/reviews/:bookingId | Customer |
| GET | /api/reviews/provider/:id | Public |
| GET | /api/reviews | Admin |
| PUT | /api/reviews/:id/toggle | Admin |

### Contact
| Method | Endpoint | Access |
|---|---|---|
| POST | /api/contact | Public |
| GET | /api/contact | Admin |
| PUT | /api/contact/:id/read | Admin |

---

## 🎯 Booking Status Flow

```
requested → confirmed → in-progress → completed
     └──────────────→ cancelled / rejected
```

---

## 👨‍💻 Developer -- Subhadip Mishra

