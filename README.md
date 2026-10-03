# Takeaway-Manager
![CI](https://github.com/UmarAkhtar/Takeaway-Manager/actions/workflows/ci.yml/badge.svg)

A Takeaway menu and management app based on my experience managing a takeaway.

**Live demo:** https://takeaway-maanger.onrender.com

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
- Render for hostinghttp://localhost:5173

## Running it locally

You'll need [Node.js](https://nodejs.org/) 24 or newer.

1. Clone the repo and install the packages:

   ```bash
   git clone https://github.com/UmarAkhtar/Takeaway-Manager.git
   cd Takeaway-Manager
   npm install
   ```

2. Create the database and load the menu:

   ```bash
   npm run seed
   ```

3. Start the server and the frontend in two separate terminals:

   ```bash
   npm run dev:server
   ```

   ```bash
   npm run dev:client
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser.

To run it the way it runs in production, as one server with no Vite:

```bash
npm run build
npm start
```

Then open [http://localhost:3000](http://localhost:3000).
