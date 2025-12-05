import { useState, useEffect } from 'react'
import './App.css'

const API_URL = 'https://full-stack-pern-app-production.up.railway.app'

// Stats card component - shows summary statistics
function StatsCard({ title, value, color }) {
  return (
    <div className="stat-card" style={{ borderLeftColor: color }}>
      <div className="stat-value">{value}</div>
      <div className="stat-title">{title}</div>
    </div>
  )
}

// Loading spinner component
function LoadingSpinner() {
  return (
    <div className="spinner-container">
      <div className="spinner"></div>
      <p>Loading merchants...</p>
    </div>
  )
}

// MerchantRow component - receives data via props
function MerchantRow({ merchant, onEdit, onDelete }) {
  return (
    <tr>
      <td>{merchant.id}</td>
      <td>{merchant.merchant_name}</td>
      <td>{merchant.country}</td>
      <td>
        <button className="btn-edit" onClick={() => onEdit(merchant)}>
          Edit
        </button>
        <button className="btn-delete" onClick={() => onDelete(merchant.id)}>
          Delete
        </button>
      </td>
    </tr>
  )
}

function App() {
  const [merchants, setMerchants] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [formData, setFormData] = useState({
    merchant_name: '',
    country: ''
  })
  const [editingId, setEditingId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  // Filter merchants based on search term
  const filteredMerchants = merchants.filter(merchant =>
    merchant.merchant_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    merchant.country.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Calculate statistics
  const uniqueCountries = [...new Set(merchants.map(m => m.country))].length

  // Fetch all merchants
  const fetchMerchants = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`${API_URL}/merchants`)
      if (!response.ok) throw new Error('Failed to fetch merchants')
      const data = await response.json()
      setMerchants(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Load merchants on component mount
  useEffect(() => {
    fetchMerchants()
  }, [])

  // Handle form input changes
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  // Show success message then clear it
  const showSuccess = (message) => {
    setSuccessMsg(message)
    setError(null)
    setTimeout(() => setSuccessMsg(''), 3000)
  }

  // Create new merchant
  const handleCreate = async (e) => {
    e.preventDefault()
    setError(null)

    // Validate inputs
    if (!formData.merchant_name.trim() || !formData.country.trim()) {
      setError('Please fill in all fields')
      return
    }

    if (formData.merchant_name.trim().length < 2) {
      setError('Merchant name must be at least 2 characters')
      return
    }

    try {
      const response = await fetch(`${API_URL}/merchants`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          merchant_name: formData.merchant_name.trim(),
          country: formData.country.trim()
        })
      })
      if (!response.ok) throw new Error('Failed to create merchant')

      setFormData({ merchant_name: '', country: '' })
      fetchMerchants()
      showSuccess('Merchant created successfully!')
    } catch (err) {
      setError(err.message)
    }
  }

  // Update existing merchant
  const handleUpdate = async (e) => {
    e.preventDefault()
    setError(null)

    if (!formData.merchant_name.trim() || !formData.country.trim()) {
      setError('Please fill in all fields')
      return
    }

    try {
      const response = await fetch(`${API_URL}/merchants/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          merchant_name: formData.merchant_name.trim(),
          country: formData.country.trim()
        })
      })
      if (!response.ok) throw new Error('Failed to update merchant')

      setFormData({ merchant_name: '', country: '' })
      setEditingId(null)
      fetchMerchants()
      showSuccess('Merchant updated successfully!')
    } catch (err) {
      setError(err.message)
    }
  }

  // Delete merchant
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this merchant?')) return

    try {
      const response = await fetch(`${API_URL}/merchants/${id}`, {
        method: 'DELETE'
      })
      if (!response.ok) throw new Error('Failed to delete merchant')
      fetchMerchants()
      showSuccess('Merchant deleted successfully!')
    } catch (err) {
      setError(err.message)
    }
  }

  // Set form for editing
  const handleEdit = (merchant) => {
    setEditingId(merchant.id)
    setFormData({
      merchant_name: merchant.merchant_name,
      country: merchant.country
    })
  }

  // Cancel editing
  const handleCancel = () => {
    setEditingId(null)
    setFormData({ merchant_name: '', country: '' })
  }

  return (
    <div className="App">
      <h1>Merchant Management System</h1>

      {/* Statistics Dashboard */}
      <div className="stats-container">
        <StatsCard title="Total Merchants" value={merchants.length} color="#4CAF50" />
        <StatsCard title="Countries" value={uniqueCountries} color="#2196F3" />
        <StatsCard title="Showing" value={filteredMerchants.length} color="#FF9800" />
      </div>

      {error && <div className="error">{error}</div>}
      {successMsg && <div className="success">{successMsg}</div>}

      {/* Create/Update Form */}
      <div className="form-container">
        <h2>{editingId ? 'Update Merchant' : 'Add New Merchant'}</h2>
        <form onSubmit={editingId ? handleUpdate : handleCreate}>
          <div className="form-group">
            <label htmlFor="merchant_name">Merchant Name:</label>
            <input
              type="text"
              id="merchant_name"
              name="merchant_name"
              value={formData.merchant_name}
              onChange={handleInputChange}
              placeholder="Enter merchant name"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="country">Country:</label>
            <input
              type="text"
              id="country"
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              placeholder="Enter country"
              required
            />
          </div>
          <div className="form-buttons">
            <button type="submit" className="btn-primary">
              {editingId ? 'Update' : 'Create'}
            </button>
            {editingId && (
              <button type="button" className="btn-secondary" onClick={handleCancel}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Merchants List */}
      <div className="merchants-container">
        <div className="merchants-header">
          <h2>All Merchants</h2>
          <div className="search-box">
            <input
              type="text"
              placeholder="Search by name or country..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            {searchTerm && (
              <button
                className="clear-search"
                onClick={() => setSearchTerm('')}
              >
                Clear
              </button>
            )}
          </div>
        </div>
        {loading ? (
          <LoadingSpinner />
        ) : (
          <table className="merchants-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Merchant Name</th>
                <th>Country</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMerchants.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center' }}>
                    {searchTerm ? 'No merchants match your search.' : 'No merchants found. Add one above!'}
                  </td>
                </tr>
              ) : (
                filteredMerchants.map((merchant) => (
                  <MerchantRow
                    key={merchant.id}
                    merchant={merchant}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default App
