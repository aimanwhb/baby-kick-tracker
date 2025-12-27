# Baby Kick Tracker 🤰

A beautiful, mobile-first responsive web application to help pregnant mothers track daily baby kicks.

## Features
- **Clean, Calming UI**: Pastel-themed design optimized for mobile.
- **Daily Tracking**: Quick-record kicks with a single tap.
- **Progress Monitoring**: See today's count and last kick time at a glance.
- **Guidelines**: Built-in health guidance (10 kicks in 2 hours).
- **History & Trends**: View daily history with interactive charts.
- **Export**: Download your data as a CSV for your doctor.
- **Secure**: Simple authentication to keep your data private.

## Tech Stack
- **Frontend**: React (Vite), Framer Motion, Recharts, Lucide Icons.
- **Backend**: Node.js, Express, Sequelize.
- **Database**: SQLite (local and lightweight).

## Setup Instructions

### Prerequisites
- Node.js installed on your machine.

### 1. Backend Setup
1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. **Create a `.env` file** in the `backend` directory:
   ```env
   PORT=5000
   JWT_SECRET=your_super_secret_key_here
   DATABASE_PATH=./database.sqlite
   ```
4. Start the server:
   ```bash
   node server.js
   ```

### 2. Frontend Setup
1. Navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. **(Optional) Create a `.env` file** in the `frontend` directory for production:
   ```env
   VITE_API_URL=/api
   ```
   *Note: If you are using the Nginx proxy method described in our discussion, the frontend will default to `/api` even without this file.*
4. Start the development server:
   ```bash
   npm run dev
   ```
   The frontend will run on `http://localhost:5173`.

### 3. Usage
- Open `http://localhost:5173` in your browser (use mobile view in dev tools for the best experience).
- Register a new account.
- Start recording kicks!

## Disclaimer
This application is for informational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
