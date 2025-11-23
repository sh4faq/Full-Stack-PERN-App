const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()
const db = require('./queries')
const port = process.env.PORT || 3001

app.use(cors())
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

app.get('/', (request, response) => {
  response.json({ info: 'Node.js, Express, and Postgres API' })
})

app.get('/merchants', db.getMerchants)
app.get('/merchants/:id', db.getMerchantById)
app.post('/merchants', db.createMerchant)
app.put('/merchants/:id', db.updateMerchant)
app.delete('/merchants/:id', db.deleteMerchant)

app.listen(port, async () => {
  console.log(`App running on port ${port}.`)

  // Test database connection
  try {
    await db.testConnection()
    console.log('Database connection successful!')
  } catch (error) {
    console.error('Database connection failed:', error.message)
  }
})
