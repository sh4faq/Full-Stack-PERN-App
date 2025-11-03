# Testing the CRUD API

This guide will help you test all the API endpoints after setting up the database and starting the server.

## Prerequisites

1. PostgreSQL database is set up with the merchants table (run `setup.sql`)
2. `.env` file is configured with your database credentials
3. Server is running (`npm start`)

## Option 1: Using cURL (Command Line)

### 1. Get all merchants
```bash
curl http://localhost:3000/merchants
```
**Expected Response:**
```json
[
  {
    "id": 1,
    "merchant_name": "Walmart",
    "country": "United States"
  },
  {
    "id": 2,
    "merchant_name": "Carrefour",
    "country": "France"
  },
  {
    "id": 3,
    "merchant_name": "Tesco",
    "country": "United Kingdom"
  }
]
```

### 2. Get single merchant by ID
```bash
curl http://localhost:3000/merchants/1
```

### 3. Create a new merchant
```bash
curl -X POST http://localhost:3000/merchants \
  -H "Content-Type: application/json" \
  -d "{\"merchant_name\":\"Amazon\",\"country\":\"United States\"}"
```
**Expected Response:**
```
Merchant added with ID: 4
```

### 4. Update a merchant
```bash
curl -X PUT http://localhost:3000/merchants/4 \
  -H "Content-Type: application/json" \
  -d "{\"merchant_name\":\"Amazon Prime\",\"country\":\"USA\"}"
```
**Expected Response:**
```
Merchant modified with ID: 4
```

### 5. Delete a merchant
```bash
curl -X DELETE http://localhost:3000/merchants/4
```
**Expected Response:**
```
Merchant deleted with ID: 4
```

## Option 2: Using Postman

1. **Install Postman**: Download from https://www.postman.com/downloads/
2. **Create a new request** for each endpoint:

### GET all merchants
- Method: `GET`
- URL: `http://localhost:3000/merchants`

### GET merchant by ID
- Method: `GET`
- URL: `http://localhost:3000/merchants/1`

### POST create merchant
- Method: `POST`
- URL: `http://localhost:3000/merchants`
- Headers: `Content-Type: application/json`
- Body (raw JSON):
```json
{
  "merchant_name": "Amazon",
  "country": "United States"
}
```

### PUT update merchant
- Method: `PUT`
- URL: `http://localhost:3000/merchants/1`
- Headers: `Content-Type: application/json`
- Body (raw JSON):
```json
{
  "merchant_name": "Amazon Updated",
  "country": "USA"
}
```

### DELETE merchant
- Method: `DELETE`
- URL: `http://localhost:3000/merchants/1`

## Option 3: Using Thunder Client (VS Code Extension)

1. Install Thunder Client extension in VS Code
2. Click on Thunder Client icon in sidebar
3. Create new request
4. Follow similar steps as Postman above

## Option 4: Using REST Client (VS Code Extension)

1. Install REST Client extension
2. Create a file called `test.http` in your project
3. Add the following content:

```http
### Get all merchants
GET http://localhost:3000/merchants

### Get merchant by ID
GET http://localhost:3000/merchants/1

### Create new merchant
POST http://localhost:3000/merchants
Content-Type: application/json

{
  "merchant_name": "Amazon",
  "country": "United States"
}

### Update merchant
PUT http://localhost:3000/merchants/1
Content-Type: application/json

{
  "merchant_name": "Amazon Updated",
  "country": "USA"
}

### Delete merchant
DELETE http://localhost:3000/merchants/1
```

4. Click "Send Request" above each request

## Troubleshooting

### Server won't start
- Check if PostgreSQL is running
- Verify `.env` credentials are correct
- Make sure port 3000 is not already in use

### Database connection errors
- Verify PostgreSQL service is running
- Check database name, username, and password in `.env`
- Make sure the `api` database exists
- Verify the `merchants` table was created

### No data returned
- Make sure you ran the INSERT statements from `setup.sql`
- Check the database using: `psql -d api -c "SELECT * FROM merchants;"`

## Verifying Data in PostgreSQL

You can always check your database directly:

```bash
# Connect to database
psql -d api

# View all merchants
SELECT * FROM merchants;

# Exit
\q
```

## Success Checklist

- [ ] GET all merchants returns array of merchants
- [ ] GET merchant by ID returns single merchant
- [ ] POST creates new merchant and returns success message
- [ ] PUT updates merchant and returns success message
- [ ] DELETE removes merchant and returns success message
- [ ] Database changes persist after server restart