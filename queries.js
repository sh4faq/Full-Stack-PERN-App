require('dotenv').config()
const Pool = require('pg').Pool
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
})

const testConnection = () => {
  return pool.query('SELECT NOW()')
}

const getMerchants = (request, response) => {
  pool.query('SELECT * FROM merchants ORDER BY id ASC', (error, results) => {
    if (error) {
      console.error('Error in getMerchants:', error)
      response.status(500).json({ error: error.message })
      return
    }
    response.status(200).json(results.rows)
  })
}

const getMerchantById = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('SELECT * FROM merchants WHERE id = $1', [id], (error, results) => {
    if (error) {
      console.error('Error in getMerchantById:', error)
      response.status(500).json({ error: error.message })
      return
    }
    response.status(200).json(results.rows[0] || null)
  })
}

const createMerchant = (request, response) => {
  const { merchant_name, country } = request.body

  pool.query('INSERT INTO merchants (merchant_name, country) VALUES ($1, $2) RETURNING *', [merchant_name, country], (error, results) => {
    if (error) {
      console.error('Error in createMerchant:', error)
      response.status(500).json({ error: error.message })
      return
    }
    response.status(201).json(results.rows[0])
  })
}

const updateMerchant = (request, response) => {
  const id = parseInt(request.params.id)
  const { merchant_name, country } = request.body

  pool.query(
    'UPDATE merchants SET merchant_name = $1, country = $2 WHERE id = $3 RETURNING *',
    [merchant_name, country, id],
    (error, results) => {
      if (error) {
        console.error('Error in updateMerchant:', error)
        response.status(500).json({ error: error.message })
        return
      }
      response.status(200).json(results.rows[0])
    }
  )
}

const deleteMerchant = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('DELETE FROM merchants WHERE id = $1', [id], (error, results) => {
    if (error) {
      console.error('Error in deleteMerchant:', error)
      response.status(500).json({ error: error.message })
      return
    }
    response.status(200).json({ id, message: 'Merchant deleted' })
  })
}

module.exports = {
  getMerchants,
  getMerchantById,
  createMerchant,
  updateMerchant,
  deleteMerchant,
  testConnection,
}
