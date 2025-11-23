# Full Stack CRUD App - Project 5

A merchant management system built with React, Express, Node.js, and PostgreSQL for my web development class.

## What it does

Manage merchants - add, view, edit, and delete them. All the data is stored in a PostgreSQL database.

## Tech Stack

- **Frontend:** React with Vite
- **Backend:** Node.js + Express
- **Database:** PostgreSQL

## Setup

### Database Setup

1. Install PostgreSQL
2. Open psql and run:
```sql
CREATE DATABASE api;
\c api
CREATE TABLE merchants (
  ID SERIAL PRIMARY KEY,
  merchant_name VARCHAR(30),
  country VARCHAR(30)
);
```

### Install Dependencies

Backend:
```bash
npm install
```

Frontend:
```bash
cd client
npm install
```

### Environment Variables

Create a `.env` file:
```
DB_USER=postgres
DB_HOST=localhost
DB_DATABASE=api
DB_PASSWORD=your_password
DB_PORT=5432
```

## Running the App

Start backend (terminal 1):
```bash
npm start
```

Start frontend (terminal 2):
```bash
cd client
npm run dev
```

Open http://localhost:5173

## Features

- Create new merchants
- View all merchants in a table
- Edit existing merchants
- Delete merchants
- All changes update in real-time

## Project Structure

```
├── client/          # React frontend
│   └── src/
│       ├── App.jsx  # Main component
│       └── App.css  # Styles
├── index.js         # Express server
├── queries.js       # Database queries
└── .env            # Database credentials
```

## React Hooks Used

- useState - for managing form data and merchant list
- useEffect - for fetching merchants when page loads

## API Endpoints

- GET `/merchants` - Get all merchants
- GET `/merchants/:id` - Get one merchant
- POST `/merchants` - Create merchant
- PUT `/merchants/:id` - Update merchant
- DELETE `/merchants/:id` - Delete merchant
