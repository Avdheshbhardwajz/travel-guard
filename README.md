# TravelGuard — Intelligent Travel Planning Platform

A full-stack web application for travel planning, expense management, and itinerary tracking. Built with React.js, Node.js, Express.js, PostgreSQL, and Prisma ORM.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js 18 + Vite |
| Backend | Node.js + Express.js |
| Database | PostgreSQL 15 (Docker) |
| ORM | Prisma 5 |
| Auth | JWT + bcrypt |
| Icons | Lucide React |

## Quick Start

### Prerequisites
- Node.js 18+
- Docker Desktop

### 1. Start the Database
```bash
docker compose up -d
```

### 2. Setup Backend
```bash
cd backend
npm install
npx prisma db push
npx prisma generate
node prisma/seed.js    # Seeds demo data
npm run dev
```

### 3. Setup Frontend
```bash
cd frontend
npm install
npm run dev
```

### 4. Open the App
Visit **http://localhost:5173**

Demo credentials: `demo@travelguard.com` / `demo1234`

## Features

- **User Authentication** — Secure register/login with JWT tokens and bcrypt password hashing
- **Trip Management** — Create, edit, delete trips with destination, dates, and budget
- **Itinerary Planning** — Day-by-day activity planner with location and time
- **Expense Tracking** — Track expenses by category (food, transport, accommodation, other)
- **Budget Monitoring** — Real-time budget utilization with progress bar and remaining balance
- **Dashboard** — Overview with stats cards, trip cards, and category spending breakdown

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login and get JWT |
| GET | /api/trips | Get all user trips |
| POST | /api/trips | Create a trip |
| GET | /api/trips/:id | Get trip with details |
| PUT | /api/trips/:id | Update a trip |
| DELETE | /api/trips/:id | Delete a trip |
| POST | /api/trips/:id/itinerary | Add itinerary item |
| GET | /api/trips/:id/itinerary | Get trip itinerary |
| POST | /api/trips/:id/expenses | Add expense |
| GET | /api/trips/:id/expenses | Get trip expenses |

## Project Structure

```
travelguard/
├── docker-compose.yml
├── backend/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── tripController.js
│   │   ├── itineraryController.js
│   │   └── expenseController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── tripRoutes.js
│   │   ├── expenseRoutes.js
│   │   └── itineraryRoutes.js
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.js
│   ├── server.js
│   └── .env
└── frontend/
    └── src/
        ├── components/
        │   ├── AppLayout.jsx
        │   ├── PrivateRoute.jsx
        │   └── CreateTripModal.jsx
        ├── pages/
        │   ├── LoginPage.jsx
        │   ├── RegisterPage.jsx
        │   ├── Dashboard.jsx
        │   └── TripDetails.jsx
        ├── services/
        │   └── api.js
        ├── App.jsx
        └── index.css
```
