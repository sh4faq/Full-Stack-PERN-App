# Merchant Management System

A full-stack CRUD application for managing merchant data, built with the PERN stack (PostgreSQL, Express, React, Node.js).

## Live Demo

**Frontend:** https://full-stack-pern-app.vercel.app/

**Backend API:** https://full-stack-pern-app-production.up.railway.app/merchants

## Project Overview

This is a merchant management system where you can add, view, edit, and delete merchant records. I built this to learn how to connect a React frontend to a PostgreSQL database through an Express API. The app includes features like search filtering, real-time statistics, and form validation.

### Features

- **Create** new merchants with name and country
- **Read** all merchants in a searchable table
- **Update** existing merchant information
- **Delete** merchants with confirmation
- **Search** merchants by name or country
- **Statistics dashboard** showing totals and filtered counts
- **Responsive design** that works on mobile devices

## Technologies Used

### Frontend
- React 19 (with Vite for fast development)
- CSS3 with Flexbox for layouts
- Fetch API for HTTP requests

### Backend
- Node.js
- Express.js
- PostgreSQL (pg library)
- CORS for cross-origin requests

### Deployment
- Frontend: Vercel
- Backend + Database: Railway

## Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL installed locally
- Git

### Database Setup

1. Open your PostgreSQL client (psql or pgAdmin)
2. Run the following SQL:

```sql
CREATE DATABASE api;

\c api

CREATE TABLE merchants (
  ID SERIAL PRIMARY KEY,
  merchant_name VARCHAR(30),
  country VARCHAR(30)
);

-- Optional: add some test data
INSERT INTO merchants (merchant_name, country)
VALUES ('Walmart', 'United States'),
       ('Carrefour', 'France'),
       ('Tesco', 'United Kingdom');
```

### Backend Setup

1. Clone the repo:
```bash
git clone https://github.com/sh4faq/Full-Stack-PERN-App.git
cd Full-Stack-PERN-App
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```
DB_USER=postgres
DB_HOST=localhost
DB_DATABASE=api
DB_PASSWORD=your_password_here
DB_PORT=5432
```

4. Start the server:
```bash
npm start
```

The API will run on http://localhost:3001

### Frontend Setup

1. Navigate to the client folder:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The app will open at http://localhost:5173

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/merchants` | Get all merchants |
| GET | `/merchants/:id` | Get a single merchant |
| POST | `/merchants` | Create a new merchant |
| PUT | `/merchants/:id` | Update a merchant |
| DELETE | `/merchants/:id` | Delete a merchant |

## Project Structure

```
Full-Stack-PERN-App/
├── client/                 # React frontend
│   ├── src/
│   │   ├── App.jsx        # Main component with all logic
│   │   ├── App.css        # Styles
│   │   └── main.jsx       # Entry point
│   ├── package.json
│   └── vite.config.js
├── index.js               # Express server
├── queries.js             # Database queries
├── setup.sql              # Database schema
├── package.json
└── README.md
```

## React Concepts Used

### Hooks
- **useState** - Managing state for merchants, form data, loading, errors, search terms, and success messages
- **useEffect** - Fetching merchants when the component first loads

### Components & Props
- **StatsCard** - Receives `title`, `value`, and `color` props to display statistics
- **LoadingSpinner** - Simple loading indicator component
- **MerchantRow** - Receives `merchant`, `onEdit`, and `onDelete` props for each table row

### Data Flow
The frontend communicates with the backend using the Fetch API. When a user performs any CRUD operation, the app sends an HTTP request to the Express API, which then updates the PostgreSQL database. The UI updates automatically after each operation.

## What I Learned

Working on this project taught me a lot about how full-stack applications work together:

1. **Connecting the pieces** - Understanding how data flows from the database, through the API, to the frontend was the biggest challenge. Once I got that working, everything else made more sense.

2. **Environment variables** - I learned why it's important to keep database credentials out of your code and use `.env` files instead. This was new to me but makes total sense for security.

3. **Deployment challenges** - Deploying to Vercel and Railway had a learning curve. I had to figure out how to set environment variables on the server and deal with CORS issues.

4. **State management in React** - Managing multiple pieces of state (loading, errors, form data, etc.) and keeping them in sync was tricky but helped me understand React better.

5. **Component reusability** - Breaking down the UI into smaller components like StatsCard and MerchantRow made the code cleaner and easier to maintain.

## Future Improvements

If I had more time, I would add:
- User authentication so different users can have their own merchants
- Sorting options for the table columns
- Pagination for when there are many merchants
- Export to CSV functionality

## Author

Built by sh4faq for the Full Stack Development course.
