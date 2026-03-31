# TravelGuard — Complete Setup Guide (Beginner Friendly) 🚀

Hey! This guide will walk you through setting up the **TravelGuard** project on your local machine from scratch. No prior experience needed — just follow each step carefully.

---

## 📋 Table of Contents

1. [What You Need (Prerequisites)](#1--what-you-need-prerequisites)
2. [Clone the Repository](#2--clone-the-repository)
3. [Understand the Project Structure](#3--understand-the-project-structure)
4. [Install & Start Docker (Database)](#4--install--start-docker-database)
5. [Setup the Backend](#5--setup-the-backend)
6. [Setup the Frontend](#6--setup-the-frontend)
7. [Seed the Database (Sample Data)](#7--seed-the-database-sample-data)
8. [Run the Full Application](#8--run-the-full-application)
9. [Open the App & Login](#9--open-the-app--login)
10. [Stopping Everything](#10--stopping-everything)
11. [Common Errors & Fixes](#11--common-errors--fixes)
12. [Project File Explanation](#12--project-file-explanation)

---

## 1. 🛠 What You Need (Prerequisites)

Before starting, make sure you have these 3 things installed on your computer:

### a) Node.js (v18 or later)

Node.js runs the backend server and builds the frontend.

**Check if you have it:**
```bash
node --version
```
You should see something like `v18.x.x` or `v20.x.x` or higher.

**If NOT installed:**
- Go to [https://nodejs.org](https://nodejs.org)
- Download the **LTS** version (the big green button)
- Run the installer → keep clicking Next → Done
- Close and reopen your terminal, then check again with `node --version`

> When you install Node.js, **npm** (Node Package Manager) is included automatically. Verify with `npm --version`.

---

### b) Docker Desktop

Docker runs our PostgreSQL database inside a container (think of it as a lightweight virtual machine).

**Check if you have it:**
```bash
docker --version
```

**If NOT installed:**
- Go to [https://www.docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop)
- Download Docker Desktop for your OS (Mac / Windows / Linux)
- Install it and **open Docker Desktop** (let it fully start — you'll see the whale icon in your taskbar/menu bar)

> ⚠️ **IMPORTANT:** Docker Desktop must be **running** (open the app) before you proceed. The whale icon should be visible in your system tray / menu bar.

---

### c) Git

Git is used to clone (download) this project.

**Check if you have it:**
```bash
git --version
```

**If NOT installed:**
- **Mac:** Run `xcode-select --install` in terminal
- **Windows:** Download from [https://git-scm.com/downloads](https://git-scm.com/downloads)
- **Linux:** Run `sudo apt install git`

---

## 2. 📥 Clone the Repository

Open your **Terminal** (Mac/Linux) or **Command Prompt / PowerShell** (Windows).

Navigate to wherever you want to keep the project (e.g., your Desktop):

```bash
cd ~/Desktop
```

Clone the repository:

```bash
git clone <PASTE_THE_GITHUB_REPO_URL_HERE>
```

> Replace `<PASTE_THE_GITHUB_REPO_URL_HERE>` with the actual GitHub URL I shared with you.

Then enter the project folder:

```bash
cd travel
```

You should now be inside the project directory. Run `ls` (Mac/Linux) or `dir` (Windows) to see the files:

```
backend/
frontend/
docker-compose.yml
README.md
SETUP_GUIDE.md
```

---

## 3. 📂 Understand the Project Structure

Here's what each folder/file does (just so you know what you're working with):

```
travel/
├── docker-compose.yml      ← Tells Docker to run a PostgreSQL database
├── README.md               ← Project overview
├── SETUP_GUIDE.md          ← This file you're reading!
│
├── backend/                ← The server (Node.js + Express)
│   ├── .env                ← Secret config (database URL, JWT secret, port)
│   ├── package.json        ← Lists all backend dependencies
│   ├── server.js           ← Main entry point — starts the API server
│   ├── controllers/        ← Business logic (auth, trips, expenses, itinerary)
│   ├── middleware/         ← JWT authentication check
│   ├── routes/             ← URL routing (which URL calls which controller)
│   └── prisma/
│       ├── schema.prisma   ← Database table definitions
│       └── seed.js         ← Script to fill DB with sample data
│
└── frontend/               ← The website UI (React + Vite)
    ├── package.json        ← Lists all frontend dependencies
    ├── vite.config.js      ← Build tool config (also sets up API proxy)
    ├── index.html          ← HTML shell
    └── src/
        ├── App.jsx         ← Main React component (routing)
        ├── index.css       ← All styles (dark theme, animations, layout)
        ├── components/     ← Reusable UI pieces (sidebar, modals, etc.)
        ├── pages/          ← Full pages (Login, Register, Dashboard, TripDetails)
        └── services/
            └── api.js      ← HTTP client that talks to the backend
```

---

## 4. 🐳 Install & Start Docker (Database)

Our app uses **PostgreSQL** as its database. Instead of installing PostgreSQL directly, we use Docker to run it in a container. This is cleaner and easier.

### Step 4.1 — Make sure Docker Desktop is running

Open the **Docker Desktop** application. Wait until it says **"Docker Desktop is running"** (you'll see the whale icon in your system tray/menu bar become steady).

### Step 4.2 — Start the database container

In your terminal, make sure you're in the project root folder (`travel/`):

```bash
cd ~/Desktop/travel
```

Now run:

```bash
docker compose up -d
```

**What this does:**
- Downloads a PostgreSQL 15 image (first time only, takes ~30 seconds)
- Creates a container named `travelguard_db`
- Starts the database on **port 5433** on your machine
- Creates a database called `travelguard_db` with username `travelguard` and password `travelguard_secret`

**You should see output like:**
```
✔ Container travelguard_db Started
```

### Step 4.3 — Verify it's running

```bash
docker ps
```

You should see a row with `travelguard_db` and status `Up`:

```
CONTAINER ID   IMAGE                PORTS                    NAMES
abc123...      postgres:15-alpine   0.0.0.0:5433->5432/tcp   travelguard_db
```

> ✅ If you see this, your database is ready!

> ❌ If you see nothing or get an error, make sure Docker Desktop is open and running. Try `docker compose up -d` again.

---

## 5. ⚙️ Setup the Backend

### Step 5.1 — Go to the backend folder

```bash
cd backend
```

### Step 5.2 — Check the `.env` file

The `.env` file contains configuration. It's already pre-configured and included in the repo. Let's verify it exists:

```bash
cat .env
```

You should see:
```env
DATABASE_URL="postgresql://travelguard:travelguard_secret@localhost:5433/travelguard_db"
JWT_SECRET="travelguard_jwt_super_secret_key_2025_k8x9m2p5q7r1"
PORT=5000
CLIENT_URL="http://localhost:5173"
NODE_ENV=development
```

> 💡 **What do these mean?**
> - `DATABASE_URL` — Connection string to the PostgreSQL database running in Docker
> - `JWT_SECRET` — A secret key used to create login tokens (like a password for passwords)
> - `PORT` — The backend server will run on port 5000
> - `CLIENT_URL` — The frontend URL (for CORS security)

> ⚠️ **Port 5433 note:** We use port `5433` (not the default `5432`) because you might already have PostgreSQL installed locally on `5432`. If you DON'T have local PostgreSQL and want to use `5432`, change it in both `docker-compose.yml` and `.env`.

### Step 5.3 — Install backend dependencies

```bash
npm install
```

This downloads all the packages listed in `package.json` into a `node_modules/` folder. It may take 1-2 minutes the first time.

**You should see:**
```
added 120 packages in Xs
```

### Step 5.4 — Generate Prisma Client

Prisma is the tool that talks to the database. We need to generate its client code:

```bash
npx prisma generate
```

**You should see:**
```
✔ Generated Prisma Client to ./node_modules/@prisma/client
```

### Step 5.5 — Push the database schema

This creates the actual tables (User, Trip, Itinerary, Expense) in the PostgreSQL database:

```bash
npx prisma db push
```

**You should see:**
```
Your database is now in sync with your Prisma schema.
```

> ✅ At this point, your database has empty tables ready to be filled!

---

## 6. 🎨 Setup the Frontend

### Step 6.1 — Go to the frontend folder

```bash
cd ../frontend
```

(This goes up one level from `backend/` and into `frontend/`)

### Step 6.2 — Install frontend dependencies

```bash
npm install
```

This downloads React, Vite, and all other frontend packages. May take 1-2 minutes.

**You should see:**
```
added 150+ packages in Xs
```

> ✅ Frontend is ready!

---

## 7. 🌱 Seed the Database (Sample Data)

Let's fill the database with sample trips, itineraries, and expenses so you can see the app in action right away.

### Step 7.1 — Go back to the backend folder

```bash
cd ../backend
```

### Step 7.2 — Run the seed script

```bash
node prisma/seed.js
```

**You should see:**
```
🌱 Seeding TravelGuard database...

✅ Created user: demo@travelguard.com
✅ Created 3 trips
✅ Created itinerary items
✅ Created expense entries

🎉 Seeding completed! Use demo@travelguard.com / demo1234 to login
```

This creates:

| What | Details |
|------|---------|
| **Demo User** | Email: `demo@travelguard.com`, Password: `demo1234` |
| **Trip 1** | Goa Beach Vacation (₹25,000 budget, 5 expenses, 8 itinerary items) |
| **Trip 2** | Manali Adventure (₹30,000 budget, 5 itinerary items) |
| **Trip 3** | Jaipur Heritage Tour (₹15,000 budget, completed, 7 expenses) |

---

## 8. 🏃 Run the Full Application

You need **two terminal windows/tabs** — one for the backend and one for the frontend.

### Terminal 1 — Start the Backend

```bash
cd ~/Desktop/travel/backend
npm run dev
```

**You should see:**
```
🚀 TravelGuard server running on port 5000
```

> 🟢 Keep this terminal open! The backend is running.

### Terminal 2 — Start the Frontend

Open a **new terminal tab/window** (Cmd+T on Mac, or just open another terminal), then:

```bash
cd ~/Desktop/travel/frontend
npm run dev
```

**You should see:**
```
VITE ready in Xms

➜  Local:   http://localhost:5173/
```

> 🟢 Keep this terminal open too! The frontend is running.

---

## 9. 🎉 Open the App & Login

Open your web browser and go to:

### 👉 [http://localhost:5173](http://localhost:5173)

You'll see the **TravelGuard login page** — a sleek dark-themed interface.

### Login with the demo account:

| Field | Value |
|-------|-------|
| **Email** | `demo@travelguard.com` |
| **Password** | `demo1234` |

Click **"Sign In"** and you'll land on the **Dashboard** with 3 pre-loaded trips!

### What you can do now:

- 👀 **Browse the dashboard** — See stats, trip cards, and budget progress bars
- 📝 **Create a new trip** — Click "+ New Trip" in the top right
- 🗺 **View trip details** — Click any trip card
- 📅 **Add itinerary items** — Inside a trip → Itinerary tab → "+ Add Item"
- 💰 **Track expenses** — Inside a trip → Expenses tab → "+ Add Expense"
- ✏️ **Edit a trip** — Trip details page → "Edit" button
- 🗑 **Delete a trip** — Trip details page → "Delete" button
- 🚪 **Sign out** — Sidebar → "Sign Out" at the bottom
- 🆕 **Register a new account** — Login page → "Create one" link

---

## 10. 🛑 Stopping Everything

When you're done working, here's how to cleanly shut everything down:

### Stop the Frontend
Go to the frontend terminal and press `Ctrl + C`

### Stop the Backend
Go to the backend terminal and press `Ctrl + C`

### Stop the Database (Docker)
```bash
cd ~/Desktop/travel
docker compose down
```

This stops and removes the database container. Your data is saved in a Docker volume, so next time you run `docker compose up -d`, your data will still be there.

> 💡 **To completely wipe the database** (delete all data and start fresh):
> ```bash
> docker compose down -v
> ```
> The `-v` flag removes the data volume. You'll need to run `npx prisma db push` and `node prisma/seed.js` again.

---

## 11. 🔧 Common Errors & Fixes

### ❌ `docker: command not found`
**Fix:** Install Docker Desktop and make sure it's running. See [Step 4](#4--install--start-docker-database).

### ❌ `npm: command not found`
**Fix:** Install Node.js from [https://nodejs.org](https://nodejs.org). Close and reopen your terminal after installing.

### ❌ `Error: P1001: Can't reach database server at localhost:5433`
**Fix:** Your Docker container isn't running. Run:
```bash
cd ~/Desktop/travel
docker compose up -d
```
Then wait 5 seconds and try again.

### ❌ `Error: P1010: User travelguard was denied access`
**Fix:** This usually means port 5433 is taken or Docker hasn't fully started. Try:
```bash
docker compose down
docker compose up -d
```
Wait 5 seconds, then try `npx prisma db push` again.

### ❌ `sh: vite: command not found` (when running frontend)
**Fix:** You need to install frontend dependencies first:
```bash
cd frontend
npm install
```

### ❌ `EADDRINUSE: port 5000 already in use`
**Fix:** Something else is running on port 5000. Either stop it, or change the `PORT` in `backend/.env` to something like `5001`.

### ❌ Frontend shows a blank page or network errors
**Fix:** Make sure the backend is running in another terminal (`npm run dev` in the `backend/` folder). The frontend needs the backend API to work.

### ❌ `Module not found` or `Cannot find package`
**Fix:** Run `npm install` in both `backend/` and `frontend/` directories.

---

## 12. 📖 Project File Explanation

Here's what every important file does, in plain English:

### Backend Files

| File | What it does |
|------|-------------|
| `server.js` | The main file. Starts the Express server, loads middleware, and registers all routes. |
| `.env` | Stores secret configuration (DB connection, JWT secret, port). Never share this publicly. |
| `prisma/schema.prisma` | Defines the database tables — User, Trip, Itinerary, Expense — and their relationships. |
| `prisma/seed.js` | A script that fills the database with sample data (demo user + 3 trips). |
| `middleware/authMiddleware.js` | Checks if a user is logged in by verifying their JWT token. Blocks unauthorized access. |
| `controllers/authController.js` | Handles registration (hashes password, saves user) and login (checks password, returns JWT). |
| `controllers/tripController.js` | Handles creating, reading, updating, and deleting trips. Also provides dashboard stats. |
| `controllers/itineraryController.js` | Handles adding, listing, updating, and deleting itinerary items for a trip. |
| `controllers/expenseController.js` | Handles adding, listing, updating, and deleting expenses for a trip. |
| `routes/authRoutes.js` | Maps `/api/auth/register` and `/api/auth/login` URLs to auth controller functions. |
| `routes/tripRoutes.js` | Maps `/api/trips` URLs to trip, itinerary, and expense controller functions. |
| `routes/expenseRoutes.js` | Maps `/api/expenses/:id` URLs to expense update/delete functions. |
| `routes/itineraryRoutes.js` | Maps `/api/itinerary/:id` URLs to itinerary update/delete functions. |

### Frontend Files

| File | What it does |
|------|-------------|
| `index.html` | The HTML shell. Loads fonts and the React app. |
| `vite.config.js` | Configures Vite (the build tool). Sets up the proxy so `/api` requests go to the backend. |
| `src/main.jsx` | Entry point. Renders the React `<App />` into the HTML page. |
| `src/App.jsx` | The root component. Sets up routing (which URL shows which page) and toast notifications. |
| `src/index.css` | All the styling — dark theme colors, card designs, animations, layout, responsive breakpoints. |
| `src/services/api.js` | Axios HTTP client. Automatically attaches the JWT token to every API request. |
| `src/components/PrivateRoute.jsx` | A guard component. If you're not logged in, it redirects you to `/login`. |
| `src/components/AppLayout.jsx` | The main layout with the sidebar (logo, navigation, user info, sign out). |
| `src/components/CreateTripModal.jsx` | The popup form for creating a new trip. |
| `src/pages/LoginPage.jsx` | The login page with email/password form. |
| `src/pages/RegisterPage.jsx` | The registration page with name/email/password form. |
| `src/pages/Dashboard.jsx` | The main dashboard showing stats cards and trip cards. |
| `src/pages/TripDetails.jsx` | The detailed view of a single trip with itinerary, expenses, budget bar, edit/delete. |

### Docker File

| File | What it does |
|------|-------------|
| `docker-compose.yml` | Tells Docker to run a PostgreSQL 15 database with the username `travelguard`, password `travelguard_secret`, and database name `travelguard_db` on port 5433. |

---

## ⚡ Quick Start Cheat Sheet

Once everything is installed, this is all you need to do every time:

```bash
# 1. Start database
cd ~/Desktop/travel
docker compose up -d

# 2. Start backend (Terminal 1)
cd backend
npm run dev

# 3. Start frontend (Terminal 2)
cd frontend
npm run dev

# 4. Open browser
# Go to http://localhost:5173
# Login: demo@travelguard.com / demo1234
```

---

**That's it! You're all set. Happy traveling! 🌍✈️🛡️**
