import { useState, useEffect } from 'react'
import './App.css'

const API_URL = 'https://full-stack-pern-app-production.up.railway.app'

// Country to flag emoji mapping
const countryFlags = {
  'united states': '🇺🇸',
  'usa': '🇺🇸',
  'france': '🇫🇷',
  'united kingdom': '🇬🇧',
  'uk': '🇬🇧',
  'germany': '🇩🇪',
  'canada': '🇨🇦',
  'japan': '🇯🇵',
  'china': '🇨🇳',
  'australia': '🇦🇺',
  'brazil': '🇧🇷',
  'india': '🇮🇳',
  'mexico': '🇲🇽',
  'spain': '🇪🇸',
  'italy': '🇮🇹',
  'south korea': '🇰🇷',
  'russia': '🇷🇺',
  'netherlands': '🇳🇱',
  'sweden': '🇸🇪',
  'switzerland': '🇨🇭',
  'singapore': '🇸🇬',
  'uae': '🇦🇪',
  'saudi arabia': '🇸🇦',
  'south africa': '🇿🇦',
  'argentina': '🇦🇷',
  'egypt': '🇪🇬',
  'turkey': '🇹🇷',
  'poland': '🇵🇱',
  'indonesia': '🇮🇩',
  'thailand': '🇹🇭',
  'vietnam': '🇻🇳',
  'malaysia': '🇲🇾',
  'philippines': '🇵🇭',
  'nigeria': '🇳🇬',
  'pakistan': '🇵🇰',
  'bangladesh': '🇧🇩',
  'ireland': '🇮🇪',
  'new zealand': '🇳🇿',
  'portugal': '🇵🇹',
  'greece': '🇬🇷',
  'czech republic': '🇨🇿',
  'belgium': '🇧🇪',
  'austria': '🇦🇹',
  'norway': '🇳🇴',
  'denmark': '🇩🇰',
  'finland': '🇫🇮',
  'israel': '🇮🇱',
  'chile': '🇨🇱',
  'colombia': '🇨🇴',
  'peru': '🇵🇪',
  'venezuela': '🇻🇪',
  'ukraine': '🇺🇦',
  'romania': '🇷🇴',
  'hungary': '🇭🇺',
  'morocco': '🇲🇦',
  'kenya': '🇰🇪',
  'ghana': '🇬🇭'
}

// Get flag for country
const getFlag = (country) => {
  const key = country.toLowerCase().trim()
  return countryFlags[key] || '🌍'
}

// Category options for merchants
const CATEGORIES = ['Retail', 'Food & Beverage', 'Electronics', 'Fashion', 'Services', 'Healthcare', 'Other']

// Stats card component
function StatsCard({ title, value, color }) {
  return (
    <div className="stat-card" style={{ borderLeftColor: color }}>
      <div className="stat-value">{value}</div>
      <div className="stat-title">{title}</div>
    </div>
  )
}

// Loading spinner
function LoadingSpinner() {
  return (
    <div className="spinner-container">
      <div className="spinner"></div>
      <p>Loading merchants...</p>
    </div>
  )
}

// Merchant row component with favorites and selection
function MerchantRow({ merchant, onEdit, onDelete, onToggleFavorite, isFavorite, isSelected, onToggleSelect, category }) {
  return (
    <tr className={isSelected ? 'selected-row' : ''}>
      <td>
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onToggleSelect(merchant.id)}
          className="row-checkbox"
        />
      </td>
      <td>
        <button
          className={`favorite-btn ${isFavorite ? 'favorited' : ''}`}
          onClick={() => onToggleFavorite(merchant.id)}
          title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          {isFavorite ? '★' : '☆'}
        </button>
      </td>
      <td>{merchant.id}</td>
      <td>{merchant.merchant_name}</td>
      <td>
        <span className="country-cell">
          <span className="flag">{getFlag(merchant.country)}</span>
          {merchant.country}
        </span>
      </td>
      <td>
        <span className={`category-badge category-${category.toLowerCase().replace(/[^a-z]/g, '')}`}>
          {category}
        </span>
      </td>
      <td>
        <button className="btn-edit" onClick={() => onEdit(merchant)}>Edit</button>
        <button className="btn-delete" onClick={() => onDelete(merchant.id)}>Delete</button>
      </td>
    </tr>
  )
}

// Confirmation modal component
function ConfirmModal({ show, title, message, onConfirm, onCancel }) {
  if (!show) return null

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>{title}</h3>
        <p>{message}</p>
        <div className="modal-buttons">
          <button className="btn-danger" onClick={onConfirm}>Yes, Delete</button>
          <button className="btn-secondary" onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  )
}

function App() {
  const [merchants, setMerchants] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [formData, setFormData] = useState({
    merchant_name: '',
    country: '',
    category: 'Retail'
  })
  const [editingId, setEditingId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'asc' })

  // Load dark mode from localStorage
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode')
    return saved === 'true'
  })

  // Favorites stored in localStorage
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('merchantFavorites')
    return saved ? JSON.parse(saved) : []
  })

  // Categories stored in localStorage (since we cant modify the database)
  const [merchantCategories, setMerchantCategories] = useState(() => {
    const saved = localStorage.getItem('merchantCategories')
    return saved ? JSON.parse(saved) : {}
  })

  // Filter states
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)
  const [filterCategory, setFilterCategory] = useState('All')

  // Bulk selection
  const [selectedIds, setSelectedIds] = useState([])

  // Modal state
  const [showModal, setShowModal] = useState(false)

  // Duplicate warning
  const [duplicateWarning, setDuplicateWarning] = useState('')

  // Save dark mode to localStorage
  useEffect(() => {
    localStorage.setItem('darkMode', darkMode)
    if (darkMode) {
      document.body.classList.add('dark-mode')
    } else {
      document.body.classList.remove('dark-mode')
    }
  }, [darkMode])

  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem('merchantFavorites', JSON.stringify(favorites))
  }, [favorites])

  // Save categories to localStorage
  useEffect(() => {
    localStorage.setItem('merchantCategories', JSON.stringify(merchantCategories))
  }, [merchantCategories])

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(prev => !prev)
  }

  // Toggle favorite
  const toggleFavorite = (id) => {
    setFavorites(prev => {
      if (prev.includes(id)) {
        return prev.filter(fid => fid !== id)
      } else {
        return [...prev, id]
      }
    })
  }

  // Toggle selection
  const toggleSelect = (id) => {
    setSelectedIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(sid => sid !== id)
      } else {
        return [...prev, id]
      }
    })
  }

  // Select all visible merchants
  const selectAll = () => {
    if (selectedIds.length === sortedMerchants.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(sortedMerchants.map(m => m.id))
    }
  }

  // Bulk delete selected
  const handleBulkDelete = () => {
    if (selectedIds.length === 0) {
      setError('No merchants selected')
      return
    }
    setShowModal(true)
  }

  // Execute bulk delete
  const executeBulkDelete = async () => {
    setShowModal(false)
    try {
      for (const id of selectedIds) {
        await fetch(`${API_URL}/merchants/${id}`, { method: 'DELETE' })
      }
      setSelectedIds([])
      fetchMerchants()
      showSuccess(`Deleted ${selectedIds.length} merchants!`)
    } catch (err) {
      setError('Failed to delete some merchants')
    }
  }

  // Check for duplicates as user types
  const checkDuplicate = (name) => {
    if (name.length < 2) {
      setDuplicateWarning('')
      return
    }
    const similar = merchants.find(m =>
      m.merchant_name.toLowerCase() === name.toLowerCase() && m.id !== editingId
    )
    if (similar) {
      setDuplicateWarning(`A merchant named "${similar.merchant_name}" already exists!`)
    } else {
      setDuplicateWarning('')
    }
  }

  // Filter merchants
  const filteredMerchants = merchants.filter(merchant => {
    const matchesSearch = merchant.merchant_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      merchant.country.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFavorite = !showFavoritesOnly || favorites.includes(merchant.id)
    const category = merchantCategories[merchant.id] || 'Other'
    const matchesCategory = filterCategory === 'All' || category === filterCategory
    return matchesSearch && matchesFavorite && matchesCategory
  })

  // Sort merchants
  const sortedMerchants = [...filteredMerchants].sort((a, b) => {
    // Favorites always first if showing all
    if (!showFavoritesOnly) {
      const aFav = favorites.includes(a.id)
      const bFav = favorites.includes(b.id)
      if (aFav && !bFav) return -1
      if (!aFav && bFav) return 1
    }

    let aVal = a[sortConfig.key]
    let bVal = b[sortConfig.key]

    if (typeof aVal === 'string') {
      aVal = aVal.toLowerCase()
      bVal = bVal.toLowerCase()
    }

    if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1
    if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1
    return 0
  })

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }))
  }

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return ''
    return sortConfig.direction === 'asc' ? ' ↑' : ' ↓'
  }

  // Export to CSV with categories
  const exportToCSV = () => {
    if (merchants.length === 0) {
      setError('No data to export')
      return
    }

    const headers = ['ID', 'Merchant Name', 'Country', 'Category', 'Favorite']
    const csvData = sortedMerchants.map(m => [
      m.id,
      m.merchant_name,
      m.country,
      merchantCategories[m.id] || 'Other',
      favorites.includes(m.id) ? 'Yes' : 'No'
    ])

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `merchants_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
    window.URL.revokeObjectURL(url)

    showSuccess('Data exported to CSV!')
  }

  // Stats
  const uniqueCountries = [...new Set(merchants.map(m => m.country))].length
  const favoritesCount = favorites.filter(id => merchants.some(m => m.id === id)).length

  // Fetch merchants
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

  useEffect(() => {
    fetchMerchants()
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })

    // Check for duplicates when name changes
    if (name === 'merchant_name') {
      checkDuplicate(value)
    }
  }

  const showSuccess = (message) => {
    setSuccessMsg(message)
    setError(null)
    setTimeout(() => setSuccessMsg(''), 3000)
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    setError(null)

    if (!formData.merchant_name.trim() || !formData.country.trim()) {
      setError('Please fill in all fields')
      return
    }

    if (formData.merchant_name.trim().length < 2) {
      setError('Merchant name must be at least 2 characters')
      return
    }

    // Warn but allow duplicates
    if (duplicateWarning) {
      if (!window.confirm('A merchant with this name exists. Add anyway?')) {
        return
      }
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

      const newMerchant = await response.json()

      // Save category for new merchant
      setMerchantCategories(prev => ({
        ...prev,
        [newMerchant.id]: formData.category
      }))

      setFormData({ merchant_name: '', country: '', category: 'Retail' })
      setDuplicateWarning('')
      fetchMerchants()
      showSuccess('Merchant created successfully!')
    } catch (err) {
      setError(err.message)
    }
  }

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

      // Update category
      setMerchantCategories(prev => ({
        ...prev,
        [editingId]: formData.category
      }))

      setFormData({ merchant_name: '', country: '', category: 'Retail' })
      setEditingId(null)
      setDuplicateWarning('')
      fetchMerchants()
      showSuccess('Merchant updated successfully!')
    } catch (err) {
      setError(err.message)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this merchant?')) return

    try {
      const response = await fetch(`${API_URL}/merchants/${id}`, {
        method: 'DELETE'
      })
      if (!response.ok) throw new Error('Failed to delete merchant')

      // Clean up favorites and categories
      setFavorites(prev => prev.filter(fid => fid !== id))
      setMerchantCategories(prev => {
        const updated = { ...prev }
        delete updated[id]
        return updated
      })

      fetchMerchants()
      showSuccess('Merchant deleted successfully!')
    } catch (err) {
      setError(err.message)
    }
  }

  const handleEdit = (merchant) => {
    setEditingId(merchant.id)
    setFormData({
      merchant_name: merchant.merchant_name,
      country: merchant.country,
      category: merchantCategories[merchant.id] || 'Other'
    })
    setDuplicateWarning('')
  }

  const handleCancel = () => {
    setEditingId(null)
    setFormData({ merchant_name: '', country: '', category: 'Retail' })
    setDuplicateWarning('')
  }

  return (
    <div className={`App ${darkMode ? 'dark-mode' : ''}`}>
      <header className="app-header">
        <h1>Merchant Management System</h1>
        <p className="subtitle">Track and manage your merchant partners</p>
        <button className="theme-toggle" onClick={toggleDarkMode}>
          {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>
      </header>

      {/* Statistics Dashboard */}
      <div className="stats-container">
        <StatsCard title="Total Merchants" value={merchants.length} color="#4CAF50" />
        <StatsCard title="Countries" value={uniqueCountries} color="#2196F3" />
        <StatsCard title="Favorites" value={favoritesCount} color="#FF5722" />
        <StatsCard title="Showing" value={filteredMerchants.length} color="#FF9800" />
      </div>

      {error && <div className="error">{error}</div>}
      {successMsg && <div className="success">{successMsg}</div>}

      {/* Form */}
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
            {duplicateWarning && <span className="duplicate-warning">{duplicateWarning}</span>}
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
          <div className="form-group">
            <label htmlFor="category">Category:</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="category-select"
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
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
          <div className="header-controls">
            <div className="filter-controls">
              <button
                className={`filter-btn ${showFavoritesOnly ? 'active' : ''}`}
                onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              >
                {showFavoritesOnly ? '★ Favorites' : '☆ All'}
              </button>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="category-filter"
              >
                <option value="All">All Categories</option>
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="search-box">
              <input
                type="text"
                placeholder="Search by name or country..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              {searchTerm && (
                <button className="clear-search" onClick={() => setSearchTerm('')}>
                  Clear
                </button>
              )}
            </div>
            <button className="btn-export" onClick={exportToCSV}>
              Export CSV
            </button>
          </div>
        </div>

        {/* Bulk actions */}
        {selectedIds.length > 0 && (
          <div className="bulk-actions">
            <span>{selectedIds.length} selected</span>
            <button className="btn-danger" onClick={handleBulkDelete}>
              Delete Selected
            </button>
            <button className="btn-secondary" onClick={() => setSelectedIds([])}>
              Clear Selection
            </button>
          </div>
        )}

        {loading ? (
          <LoadingSpinner />
        ) : (
          <table className="merchants-table">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    checked={selectedIds.length === sortedMerchants.length && sortedMerchants.length > 0}
                    onChange={selectAll}
                    title="Select all"
                  />
                </th>
                <th>Fav</th>
                <th onClick={() => handleSort('id')} className="sortable">
                  ID{getSortIcon('id')}
                </th>
                <th onClick={() => handleSort('merchant_name')} className="sortable">
                  Merchant Name{getSortIcon('merchant_name')}
                </th>
                <th onClick={() => handleSort('country')} className="sortable">
                  Country{getSortIcon('country')}
                </th>
                <th>Category</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedMerchants.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center' }}>
                    {searchTerm || showFavoritesOnly || filterCategory !== 'All'
                      ? 'No merchants match your filters.'
                      : 'No merchants found. Add one above!'}
                  </td>
                </tr>
              ) : (
                sortedMerchants.map((merchant) => (
                  <MerchantRow
                    key={merchant.id}
                    merchant={merchant}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onToggleFavorite={toggleFavorite}
                    isFavorite={favorites.includes(merchant.id)}
                    isSelected={selectedIds.includes(merchant.id)}
                    onToggleSelect={toggleSelect}
                    category={merchantCategories[merchant.id] || 'Other'}
                  />
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      <footer className="app-footer">
        <p>Built with React, Express, and PostgreSQL</p>
      </footer>

      {/* Confirmation Modal */}
      <ConfirmModal
        show={showModal}
        title="Confirm Delete"
        message={`Are you sure you want to delete ${selectedIds.length} merchant(s)? This cannot be undone.`}
        onConfirm={executeBulkDelete}
        onCancel={() => setShowModal(false)}
      />
    </div>
  )
}

export default App
