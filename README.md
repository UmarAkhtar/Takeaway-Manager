# Takeaway-Manager
![CI](https://github.com/UmarAkhtar/Takeaway-Manager/actions/workflows/ci.yml/badge.svg)

A Takeaway menu and management app based on my experience managing a takeaway.

**Live demo:** https://takeaway-manager.onrender.com

*Hosted on Render's free tier, so the first load can take about a minute while the server wakes up.*

## Features
- Menu loaded from SQLite database.
- Items grouped into category tabs.
- Prices stored in pence, shown in pounds.

## Coming next
- Adding and editing menu items.
- Order entry.
- Kitchen board.
- End-of-day takings.

## Tech Stack
- React + Vite
- Node.js + Express
- SQLite
- Github Actions for CI
- Render for hosting

## Running it locally

You'll need [Node.js](https://nodejs.org/) 24 or newer and [PostgreSQL](https://www.postgresql.org/download/) 18.

1. Clone the repo and install the packages:

   ```bash
   git clone https://github.com/UmarAkhtar/Takeaway-Manager.git
   cd Takeaway-Manager
   npm install
   ```

2. Create two databases, `takeaway_dev` and `takeaway_test`. Then copy `.env.example` to `.env` and fill in your own values.

3. Set up the database, load the sample menu and create your staff login:

   ```bash
   npm run migrate
   npm run seed
   npm run create-staff
   ```

4. Start the server and the frontend together:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser.

To run it the way it runs in production, as one server with no Vite:

```bash
npm run build
npm start
```

Then open [http://localhost:3000](http://localhost:3000).
