# Full Stack Merchant Management Application

A complete full stack CRUD application with React frontend, Express backend, and PostgreSQL database. This project demonstrates a modern web application architecture following the PERN stack (PostgreSQL, Express, React, Node.js).

## Features

- **React Frontend**: Modern, responsive UI built with React and Vite
- **RESTful API**: Express backend with full CRUD operations
- **PostgreSQL Database**: Robust data persistence
- **Real-time Updates**: Instant UI updates after CRUD operations
- **Environment Variable Configuration**: Secure credential management
- **CORS Enabled**: Frontend-backend communication
- **Clean UI**: Professional styling with hover effects and form validation

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL installed and running
- npm or yarn package manager

## Installation

### 1. Install PostgreSQL

Follow the instructions at: https://neon.com/postgresql/postgresql-getting-started/install-postgresql

### 2. Clone and Setup Project

```bash
cd C:\Users\hamze\Desktop\vscode-projects\CRUD
npm install
```

### 3. Configure Database

1. Start PostgreSQL and access the PostgreSQL shell:
```bash
psql postgres
```

2. Create a new database:
```sql
CREATE DATABASE api;
```

3. Connect to the database:
```sql
\c api
```

4. Create the merchants table:
```sql
CREATE TABLE merchants (
  ID SERIAL PRIMARY KEY,
  merchant_name VARCHAR(30),
  country VARCHAR(30)
);
```

5. Insert sample data (optional):
```sql
INSERT INTO merchants (merchant_name, country)
VALUES ('Walmart', 'United States'),
       ('Carrefour', 'France'),
       ('Tesco', 'United Kingdom');
```

6. Exit PostgreSQL:
```sql
\q
```

### 4. Configure Environment Variables

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Edit the `.env` file with your PostgreSQL credentials:
```
DB_USER=your_postgres_username
DB_HOST=localhost
DB_DATABASE=api
DB_PASSWORD=your_postgres_password
DB_PORT=5432
```

**IMPORTANT**: The `.env` file contains sensitive credentials and is already listed in `.gitignore` to prevent it from being committed to GitHub.

## Running the Full Stack Application

You need to run both the backend and frontend servers simultaneously.

### Terminal 1: Start the Backend Server

```bash
npm start
```

The backend API will start on `http://localhost:3001`

### Terminal 2: Start the React Frontend

```bash
cd client
npm run dev
```

The React frontend will start on `http://localhost:5173`

### Access the Application

Open your browser and navigate to: **http://localhost:5173**

You should see the Merchant Management System with:
- A form to add new merchants
- A table displaying all merchants
- Edit and Delete buttons for each merchant

## API Endpoints

### Get all merchants
```
GET http://localhost:3001/merchants
```

### Get a single merchant by ID
```
GET http://localhost:3001/merchants/:id
```

### Create a new merchant
```
POST http://localhost:3001/merchants
Content-Type: application/json

{
  "merchant_name": "Amazon",
  "country": "United States"
}
```

### Update a merchant
```
PUT http://localhost:3001/merchants/:id
Content-Type: application/json

{
  "merchant_name": "Amazon Updated",
  "country": "USA"
}
```

### Delete a merchant
```
DELETE http://localhost:3001/merchants/:id
```

## Testing the API

You can test the API using:
- **cURL** commands from terminal
- **Postman** - popular API testing tool
- **Thunder Client** - VS Code extension
- **REST Client** - VS Code extension

### Example cURL Commands

```bash
# Get all merchants
curl http://localhost:3001/merchants

# Get merchant by ID
curl http://localhost:3001/merchants/1

# Create new merchant
curl -X POST http://localhost:3001/merchants \
  -H "Content-Type: application/json" \
  -d "{\"merchant_name\":\"Amazon\",\"country\":\"United States\"}"

# Update merchant
curl -X PUT http://localhost:3001/merchants/1 \
  -H "Content-Type: application/json" \
  -d "{\"merchant_name\":\"Amazon Updated\",\"country\":\"USA\"}"

# Delete merchant
curl -X DELETE http://localhost:3001/merchants/1
```

## Project Structure

```
CRUD/
├── client/                # React frontend application
│   ├── node_modules/      # Frontend dependencies (not committed)
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── App.jsx        # Main React component with CRUD logic
│   │   ├── App.css        # Styling for the application
│   │   └── main.jsx       # React entry point
│   ├── index.html         # HTML template
│   ├── package.json       # Frontend dependencies
│   └── vite.config.js     # Vite configuration
├── node_modules/          # Backend dependencies (not committed)
├── .env                   # Environment variables (not committed)
├── .env.example           # Example environment variables
├── .gitignore             # Git ignore file
├── index.js               # Express server and routes
├── queries.js             # Database queries and CRUD operations
├── package.json           # Backend dependencies
└── README.md              # This file
```

## Security Features

- **Environment Variables**: Database credentials are stored in `.env` file (not committed to Git)
- **.gitignore**: Prevents sensitive files from being committed
- **.env.example**: Provides template without actual credentials

## How .env Works

The `queries.js` file uses the `dotenv` package to load environment variables:

```javascript
require('dotenv').config();
const Pool = require('pg').Pool;

const pool = new Pool({
  user: process.env.DB_USER,        // Loaded from .env
  host: process.env.DB_HOST,        // Loaded from .env
  database: process.env.DB_DATABASE, // Loaded from .env
  password: process.env.DB_PASSWORD, // Loaded from .env
  port: process.env.DB_PORT,        // Loaded from .env
});
```

This keeps your credentials secure and separate from your code!

## React Frontend Features

The React application (`client/src/App.jsx`) demonstrates:

### React Hooks Used

- **useState**: Managing component state for merchants list, form data, loading states, and errors
- **useEffect**: Fetching merchants data when component mounts

### Props and Component Structure

- Single component architecture with clear separation of concerns
- Props passed through event handlers and form inputs
- Controlled form inputs with two-way data binding

### CRUD Operations in React

1. **Create**: Form submission adds new merchants to the database
2. **Read**: `useEffect` hook fetches and displays all merchants on page load
3. **Update**: Click "Edit" button to populate form and modify existing merchants
4. **Delete**: Click "Delete" button with confirmation dialog

### API Integration

All operations use the native `fetch` API to communicate with the Express backend:

```javascript
const API_URL = 'http://localhost:3001'

// Example: Fetching merchants
const response = await fetch(`${API_URL}/merchants`)
const data = await response.json()
```

## Dependencies

### Backend Dependencies

- **express**: Web framework for Node.js
- **pg**: PostgreSQL client for Node.js
- **dotenv**: Loads environment variables from .env file
- **body-parser**: Parse incoming request bodies
- **cors**: Enable Cross-Origin Resource Sharing for frontend-backend communication

### Frontend Dependencies

- **react**: JavaScript library for building user interfaces
- **react-dom**: React package for working with the DOM
- **vite**: Fast build tool and development server

## Deployment

For Project 5 requirements, you need to deploy your application to a cloud hosting platform. Here are recommended options:

### Option 1: Vercel (Frontend) + Render (Backend + Database)

**Frontend (Vercel):**

1. Create account at vercel.com
2. Import your GitHub repository
3. Set root directory to `client`
4. Update `API_URL` in `client/src/App.jsx` to your backend URL
5. Deploy

**Backend (Render):**

1. Create account at render.com
2. Create a new PostgreSQL database
3. Create a new Web Service
4. Connect your GitHub repository
5. Add environment variables from your `.env` file
6. Deploy

### Option 2: Railway (All-in-One)

Railway can host both frontend, backend, and PostgreSQL database:

1. Create account at railway.app
2. Create new project from GitHub repo
3. Add PostgreSQL database
4. Configure environment variables
5. Deploy both services

### Option 3: Heroku

1. Create Heroku account
2. Install Heroku CLI
3. Add PostgreSQL add-on
4. Deploy backend and frontend

### Important: Update API URL for Production

Before deploying, update the `API_URL` in [client/src/App.jsx](client/src/App.jsx:4) to point to your deployed backend URL instead of `http://localhost:3001`.

## Git Commits

Make sure to create commits for each major feature:

```bash
git add .
git commit -m "Add backend CRUD API with PostgreSQL"

git add client/
git commit -m "Add React frontend with Vite"

git add .
git commit -m "Connect frontend to backend API"

git add .
git commit -m "Add CORS and environment configuration"
```

## Project Requirements Checklist

- [x] Functional React frontend with Vite
- [x] CRUD operations in React (Create, Read, Update, Delete)
- [x] React components with hooks (useState, useEffect)
- [x] Props used for passing data
- [x] Functional PostgreSQL database
- [x] Express API connected to database
- [x] Frontend-backend data transfer working
- [x] Environment variables configured (.env, .gitignore)
- [ ] Multiple commits on GitHub (create these as you develop)
- [ ] Deploy to cloud platform (Vercel, Render, Railway, Heroku, AWS, GCP, Azure)

## License

ISC

## References

- Backend Tutorial: [LogRocket CRUD REST API Guide](https://blog.logrocket.com/crud-rest-api-node-js-express-postgresql/)
- Full Stack Videos: [FavLinks Pt 1](http://www.youtube.com/watch?v=n0GF64Hdh4A) | [Pt 2](https://www.youtube.com/watch?v=O2N3F24cy1A)
