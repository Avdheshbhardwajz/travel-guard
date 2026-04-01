# TravelGuard — User Guide

> Your complete guide to planning trips, tracking expenses, managing itineraries, and staying safe with TravelGuard.

---

## What is TravelGuard?

TravelGuard is an **intelligent travel planning platform** that helps you organize every aspect of your trips in one place. Whether you're planning a beach getaway to Goa, a mountain trek in Manali, or a heritage tour of Jaipur — TravelGuard keeps your plans, budgets, and daily activities organized and accessible.

### Who is this for?

- 🎒 **Solo travelers** who want to plan and budget trips independently
- 👨‍👩‍👧‍👦 **Families** planning vacations and tracking group expenses
- 🎓 **Students** organizing college trips on a tight budget
- 💼 **Business travelers** tracking work-related travel expenses
- 🌍 **International travelers** tracking expenses in multiple currencies

### What can you do with TravelGuard?

| Feature | Description |
|---------|-------------|
| **Trip Management** | Create, organize, and track multiple trips |
| **Itinerary Planning** | Build day-by-day activity plans with times and locations |
| **Expense Tracking** | Log every expense by category (food, transport, stay, etc.) |
| **Multi-Currency Support** | Track expenses in 10+ currencies with live exchange rates |
| **Budget Monitoring** | Set a budget and see real-time utilization with visual progress bars |
| **Trip Sharing** | Generate shareable links so others can view your trip |
| **Emergency & SOS** | One-tap SOS button with location sharing and emergency contacts |
| **Emergency Directory** | Searchable directory of emergency numbers for 40+ countries |
| **Dashboard Overview** | Get a bird's-eye view of all your trips, spending, and stats |

---

## Getting Started

### Step 1 — Create Your Account

Open the app at **http://localhost:5173** and you'll land on the login page.

If you're a first-time user, click **"Create one"** at the bottom to go to the registration page.

Fill in:
- **Full Name** — Your display name (e.g., "Avdhesh Bhardwaj")
- **Email Address** — A unique email to identify your account
- **Password** — At least 6 characters

Click **"Create Account"** and you'll be automatically logged in and redirected to the Dashboard.

> [!TIP]
> A demo account is pre-loaded with sample data for exploration:
> - **Email:** `demo@travelguard.com`
> - **Password:** `demo1234`

---

### Step 2 — Explore the Dashboard

Once logged in, the **Dashboard** is your home base. It gives you a complete overview of your travel life.

Here's what you'll see:

#### Stats Cards (Top Row)
Four summary cards at the top give you an instant snapshot:

| Card | What it shows |
|------|--------------|
| **Total Trips** | How many trips you've created |
| **Active Trips** | Trips currently in "planning" or "active" status |
| **Completed** | How many trips you've finished |
| **Total Spent** | Combined spending across all your trips (in ₹) |

#### Trip Cards (Below Stats)
Each trip appears as a card showing:
- **Trip name** and **destination**
- **Travel dates**
- **Amount spent** so far
- A **budget progress bar** showing how much of the budget is used
- A **status badge** (Planning, Active, or Completed)

#### Sidebar (Left)
- **TravelGuard logo** — click to return to dashboard
- **Dashboard** link — your home page
- **Emergency & SOS** — manage emergency contacts and access the SOS feature
- **Emergency Directory** — look up emergency numbers for any country
- **Your profile** — shows your name and email at the bottom
- **Sign Out** — logs you out of the app

---

### Step 3 — Create a New Trip

Click the **"+ New Trip"** button in the top-right corner of the dashboard.

A modal window opens with the following fields:

| Field | Required? | Example |
|-------|-----------|---------| 
| **Trip Title** | ✅ Yes | "Goa Beach Vacation" |
| **Destination** | Optional | "Goa, India" |
| **Description** | Optional | "A relaxing week at the beaches of Goa" |
| **Start Date** | Optional | 2026-04-15 |
| **End Date** | Optional | 2026-04-22 |
| **Budget (₹)** | Optional | 25000 |

Click **"Create Trip"** and your trip is saved. It will appear instantly on the dashboard.

> [!NOTE]
> Setting a budget is highly recommended — it enables the budget utilization progress bar, so you can easily track if you're overspending.

---

### Step 4 — Plan Your Itinerary

Click on any trip card on the Dashboard to open the **Trip Details** page.

The Trip Details page shows:

1. **Trip Header** — Title, status badge, destination, and description
2. **Edit / Delete / Share buttons** — Modify, remove, or share the trip
3. **Stats Cards** — Travel dates, total spent, budget, and remaining balance
4. **Budget Utilization Bar** — Visual progress of how much you've spent vs. your budget
5. **Itinerary Tab** (selected by default) — Day-by-day activity plan

#### Adding an Itinerary Item

Click **"+ Add Item"** next to the "Day-by-Day Itinerary" heading. Fill in:

| Field | Required? | Example |
|-------|-----------|---------| 
| **Day Number** | ✅ Yes | 1 |
| **Activity** | ✅ Yes | "Visit Amber Fort and take a guided tour" |
| **Location** | Optional | "Amber, Jaipur" |
| **Time** | Optional | "9:00 AM" |

Click **"Add Item"** and it appears in the timeline, grouped by day number.

> [!TIP]
> Itinerary items are automatically grouped and sorted by day. Add multiple activities for the same day and they'll appear together under a "Day X" header.

#### Deleting an Itinerary Item

Hover over any itinerary item and a **🗑 delete icon** appears on the right. Click it to remove the item.

---

### Step 5 — Track Your Expenses (with Multi-Currency Support)

Switch to the **Expenses** tab to view and manage your spending.

Each expense shows:
- A **category icon** (colored by type)
- **Expense title** (what you spent on)
- **Date**, **category badge**, and **currency tag** (if not INR)
- **Amount** in the selected currency

The **Spending Breakdown** panel on the right shows your expenses grouped by category with totals.

#### Adding an Expense

Click **"+ Add Expense"** to open the inline form.

Fill in:

| Field | Required? | Example |
|-------|-----------|---------| 
| **Title** | ✅ Yes | "Hotel booking — 3 nights" |
| **Amount** | ✅ Yes | 4500 |
| **Category** | Optional (defaults to "Other") | Food & Dining, Transport, Accommodation, Other |
| **Currency** | Optional (defaults to INR) | INR, USD, EUR, GBP, JPY, AUD, CAD, SGD, THB, AED |
| **Date** | Optional (defaults to today) | 2026-04-16 |

Click **"Add Expense"** and it's saved immediately. The budget bar, stats, and spending breakdown all update in real-time.

#### Multi-Currency Support 💱

When traveling internationally, you can track expenses in the local currency:

- Select the currency from the **Currency dropdown** when adding an expense
- If your trip has expenses in multiple currencies, a **multi-currency banner** appears at the top
- Click **"View Exchange Rates"** to see live exchange rates against INR (powered by the free Frankfurter API)
- Exchange rates are fetched in real-time and displayed as convenient chips

> [!TIP]
> Even if the API is temporarily unavailable, approximate fallback rates are provided so you're never blocked from viewing conversions.

#### Expense Categories

| Category | What to track | Icon Color |
|----------|--------------|------------|
| 🍽 **Food & Dining** | Restaurants, street food, snacks, drinks | Orange |
| 🚗 **Transport** | Flights, trains, taxis, fuel, rentals | Blue |
| 🏨 **Accommodation** | Hotels, hostels, Airbnb, resorts | Purple |
| 📦 **Other** | Tickets, shopping, souvenirs, miscellaneous | Green |

---

### Step 6 — Share Your Trip

You can share any trip with friends, family, or colleagues via a **public link** — no account required to view.

#### Generating a Share Link

1. Open the **Trip Details** page
2. Click the **"Share"** button (next to Edit)
3. In the Share modal, click **"Generate Share Link"**
4. A unique URL is generated — click **"Copy"** to copy it to your clipboard
5. Send the link to anyone you want to share the trip with

#### What the Shared View Shows

Anyone with the share link can see (in read-only mode):
- **Trip title**, destination, description, and dates
- **Owner's name** (who created the trip)
- **Full itinerary** grouped by day
- **All expenses** with category and currency
- **Spending breakdown** by category

#### Revoking a Share Link

If you want to stop sharing, open the Share modal and click **"Revoke Link"**. The previous link will immediately stop working.

> [!NOTE]
> Shared trip pages are read-only. Viewers cannot modify the trip, itinerary, or expenses.

---

### Step 7 — Emergency & SOS Features 🆘

TravelGuard includes safety features to help you in emergencies while traveling.

#### Accessing Emergency Features

Click **"Emergency & SOS"** in the sidebar to access:

1. **SOS Emergency Button** — A prominent red button at the top of the page
2. **Emergency Contact Management** — Add up to 5 trusted contacts
3. **Quick Info Card** — Safety tips and feature overview

#### Managing Emergency Contacts

Add contacts who should be notified in an emergency:

| Field | Required? | Example |
|-------|-----------|---------| 
| **Full Name** | ✅ Yes | "Mom" |
| **Phone Number** | ✅ Yes | "+91 98765 43210" |
| **Relationship** | Optional | Parent, Spouse, Sibling, Friend, Relative, Other |

You can add up to **5 emergency contacts**. Each contact can be:
- **Called directly** from the contact card (tap the Call button)
- **Edited** with updated information
- **Deleted** when no longer needed

#### Using the SOS Button

When you press the **SOS Emergency** button:

1. A modal opens with your **current GPS location** (latitude, longitude, accuracy)
2. You can **open your location in Google Maps** for precise directions
3. Your **emergency contacts** are listed with options to:
   - **Call** them directly (one tap)
   - **Send SMS** with your GPS coordinates embedded in the message
4. **Universal emergency numbers** are shown at the bottom:
   - 112 (International), 100 (Police - India), 102 (Ambulance - India), 101 (Fire - India)

> [!IMPORTANT]
> The SOS feature uses your browser's Geolocation API. You must allow location access when prompted for the GPS coordinates to work.

---

### Step 8 — Emergency Services Directory 🌍

Click **"Emergency Directory"** in the sidebar to access a curated database of emergency numbers for **40+ countries worldwide**.

#### Features

- **Search bar** — Type a country name to filter instantly (e.g., "Japan", "Thailand")
- **Clickable numbers** — Tap any number to initiate a direct call
- **Three categories per country**: Police, Ambulance, and Fire
- **Expandable cards** — Click a country card to see:
  - Universal emergency number
  - Additional notes (tourist police, poison control, etc.)

#### Countries Covered

The directory includes emergency numbers for: India, USA, UK, Canada, Australia, Germany, France, Japan, China, Brazil, Thailand, Singapore, UAE, Italy, Spain, South Korea, Mexico, Indonesia, Turkey, Russia, South Africa, Egypt, Malaysia, New Zealand, Netherlands, Switzerland, Portugal, Greece, Vietnam, Philippines, Nepal, Sri Lanka, Pakistan, Bangladesh, Maldives, Kenya, Argentina, Colombia, Peru, and Ireland.

> [!TIP]
> **112** is the universal emergency number that works in most countries. When in doubt, dial **112** — it even works without a SIM card in many regions.

---

### Step 9 — Edit or Delete a Trip

On the Trip Details page, use the buttons in the top-right corner:

- **✏️ Edit** — Opens a modal to update the trip title, destination, dates, budget, or status
- **📤 Share** — Generate or manage the share link for this trip
- **🗑 Delete** — Opens a confirmation dialog before permanently deleting the trip and all its data

> [!CAUTION]
> Deleting a trip is permanent and removes all associated itinerary items and expenses. This action cannot be undone.

#### Changing Trip Status

When editing a trip, you can change its status:

| Status | Meaning |
|--------|---------|
| **Planning** | You're still preparing for this trip |
| **Active** | The trip is currently happening |
| **Completed** | The trip is finished |

---

## Common Use Cases

### 🏖 Use Case 1 — Planning a Vacation

> *"I want to plan a 5-day trip to Goa with my friends and keep track of our ₹25,000 budget."*

1. **Create the trip** — Set title, destination "Goa, India", dates, and budget ₹25,000
2. **Build the itinerary** — Add day-by-day activities:
   - Day 1: Arrive, check into hotel, explore Baga Beach
   - Day 2: Dudhsagar Waterfalls excursion
   - Day 3: Water sports at Calangute
   - Day 4: South Goa exploration
   - Day 5: Shopping at flea market, departure
3. **Track expenses** as you spend — flights ₹8,500, hotel ₹7,000, food ₹3,000, etc.
4. **Monitor the budget bar** — At 83% utilization, you know you're close to the limit
5. **Share the trip** with friends so everyone can see the plan
6. **Mark as completed** when you return home

---

### 🌏 Use Case 2 — International Trip with Multi-Currency

> *"I'm going to Thailand for a week and need to track expenses in both THB and INR."*

1. **Create the trip** — "Bangkok & Phuket Adventure", budget ₹50,000
2. **Log expenses in local currency**:
   - Transport: Taxi ฿350 (THB), Flight ₹12,000 (INR)
   - Food: Street food ฿200 (THB), Restaurant ฿800 (THB)
   - Accommodation: Hotel ₹3,500/night (INR)
3. **View live exchange rates** — Click "View Exchange Rates" to see current THB↔INR conversion
4. **Review the multi-currency breakdown** — See spending in each currency

---

### 💼 Use Case 3 — Business Travel Expense Report

> *"I need to track all expenses from my Delhi business trip for reimbursement."*

1. **Create the trip** — "Delhi Client Meeting", set dates and a reference budget
2. **Log every expense** under the right category:
   - Transport: Flight ₹5,200, Uber ₹800
   - Accommodation: Hotel ₹4,000
   - Food: Client dinner ₹2,500, working lunch ₹600
3. **Review the Spending Breakdown** panel — See totals per category
4. **Share the trip** with your manager for approval — they can view everything via the share link
5. **Use the expense list as a report** — All amounts, dates, and categories are organized

---

### 🆘 Use Case 4 — Staying Safe While Traveling Solo

> *"I'm traveling solo to Southeast Asia and want a safety net."*

1. **Add emergency contacts** — Parent, best friend, and local embassy number
2. **Check the Emergency Directory** — Look up Thailand (191 police, 1669 ambulance, 1155 tourist police)
3. **In an emergency**, press the **SOS button**:
   - Your GPS location is captured automatically
   - One-tap call or SMS your emergency contacts with your coordinates
   - Universal emergency numbers (112) are right there

---

### 🎓 Use Case 5 — Student Group Trip on a Budget

> *"Our college group has ₹5,000 per person for a Manali trip. We need to stay on track."*

1. **Create the trip** with a total group budget
2. **Plan the itinerary** — Assign activities to each day so everyone's on the same page
3. **Share the trip** via a public link so every group member can see the plan
4. **Add expenses** as the group spends — split equally and log the total
5. **Watch the budget bar** — If it turns yellow (70%+) or red (90%+), time to cut back!
6. **After the trip**, review the full expense history to settle up

---

## Tips & Best Practices

> [!TIP]
> **Always set a budget** — Even a rough estimate helps you track spending and avoid surprises.

> [!TIP]
> **Log expenses immediately** — Add expenses as they happen so you don't forget small purchases.

> [!TIP]
> **Use the right currency** — When abroad, log expenses in the local currency for accuracy. Use the exchange rate viewer to track conversions.

> [!TIP]
> **Set up emergency contacts before traveling** — Don't wait until you need them. Add your contacts before your trip starts.

> [!TIP]
> **Share your trip with family** — Even if traveling solo, share your trip with a family member so they know your plans and itinerary.

> [!TIP]
> **Use categories wisely** — Categorizing expenses helps you see where your money goes (most travelers overspend on food!).

> [!TIP]
> **Plan itinerary by day** — Use day numbers to organize your activities chronologically. Include times for a structured plan.

---

## Quick Reference

| Action | How To |
|--------|--------|
| Create account | Visit `/register`, fill the form, click "Create Account" |
| Login | Visit `/login`, enter email & password, click "Sign In" |
| Create trip | Dashboard → "+ New Trip" button |
| View trip details | Dashboard → Click on a trip card |
| Add itinerary item | Trip Details → Itinerary tab → "+ Add Item" |
| Add expense | Trip Details → Expenses tab → "+ Add Expense" |
| Change expense currency | Trip Details → Expenses tab → "+ Add Expense" → Currency dropdown |
| View exchange rates | Trip Details → Multi-currency banner → "View Exchange Rates" |
| Share a trip | Trip Details → "Share" button → "Generate Share Link" → "Copy" |
| Revoke share link | Trip Details → "Share" button → "Revoke Link" |
| Manage emergency contacts | Sidebar → "Emergency & SOS" → "+ Add Contact" |
| Use SOS | Sidebar → "Emergency & SOS" → "SOS Emergency" button |
| Look up emergency numbers | Sidebar → "Emergency Directory" → Search for a country |
| Edit trip | Trip Details → "Edit" button |
| Delete trip | Trip Details → "Delete" button → Confirm |
| Sign out | Sidebar → "Sign Out" at the bottom |

---

## Keyboard & Navigation

- All pages are navigable via clicks — no keyboard shortcuts are required
- Use the **"← Back to Dashboard"** link on the Trip Details page to return
- The **sidebar** is always visible on desktop for quick navigation
- On **mobile**, tap the **☰ menu button** to open/close the sidebar
- **Shared trip pages** work independently — no login required

---

*TravelGuard — Plan Smart, Travel Safe* 🛡️
