import { useState, useEffect, useRef } from 'react'
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
  'chile': '🇨🇱',
  'colombia': '🇨🇴',
  'peru': '🇵🇪',
  'venezuela': '🇻🇪',
  'ukraine': '🇺🇦',
  'romania': '🇷🇴',
  'hungary': '🇭🇺',
  'morocco': '🇲🇦',
  'kenya': '🇰🇪',
  'ghana': '🇬🇭',
  'jordan': '🇯🇴',
  'lebanon': '🇱🇧',
  'iraq': '🇮🇶',
  'syria': '🇸🇾',
  'kuwait': '🇰🇼',
  'qatar': '🇶🇦',
  'bahrain': '🇧🇭',
  'oman': '🇴🇲',
  'yemen': '🇾🇪',
  'palestine': '🇵🇸',
  'libya': '🇱🇾',
  'tunisia': '🇹🇳',
  'algeria': '🇩🇿',
  'sudan': '🇸🇩',
  'ethiopia': '🇪🇹',
  'tanzania': '🇹🇿',
  'uganda': '🇺🇬',
  'cuba': '🇨🇺',
  'puerto rico': '🇵🇷',
  'jamaica': '🇯🇲',
  'iceland': '🇮🇸',
  'luxembourg': '🇱🇺',
  'croatia': '🇭🇷',
  'serbia': '🇷🇸',
  'bulgaria': '🇧🇬',
  'slovakia': '🇸🇰',
  'slovenia': '🇸🇮',
  'lithuania': '🇱🇹',
  'latvia': '🇱🇻',
  'estonia': '🇪🇪'
}

const getFlag = (country) => {
  const key = country.toLowerCase().trim()
  return countryFlags[key] || '🌍'
}

// Options
const CATEGORIES = ['Retail', 'Food & Beverage', 'Electronics', 'Fashion', 'Services', 'Healthcare', 'Other']
const STATUSES = ['Active', 'Inactive', 'Pending']

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

// Toast notification for undo
function Toast({ message, onUndo, onClose, show }) {
  if (!show) return null
  return (
    <div className="toast">
      <span>{message}</span>
      {onUndo && <button className="toast-undo" onClick={onUndo}>Undo</button>}
      <button className="toast-close" onClick={onClose}>×</button>
    </div>
  )
}

// Merchant row component
function MerchantRow({ merchant, onEdit, onDelete, onToggleFavorite, isFavorite, isSelected, onToggleSelect, category, status }) {
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
        <span className={`status-badge status-${status.toLowerCase()}`}>
          {status}
        </span>
      </td>
      <td>
        <button className="btn-edit" onClick={() => onEdit(merchant)}>Edit</button>
        <button className="btn-delete" onClick={() => onDelete(merchant.id)}>Delete</button>
      </td>
    </tr>
  )
}

// Confirmation modal
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

// Activity log component
function ActivityLog({ activities, onClear }) {
  if (activities.length === 0) return null
  return (
    <div className="activity-log">
      <div className="activity-header">
        <h3>Recent Activity</h3>
        <button className="btn-small" onClick={onClear}>Clear</button>
      </div>
      <ul>
        {activities.slice(0, 5).map((activity, idx) => (
          <li key={idx}>
            <span className={`activity-icon ${activity.type}`}>
              {activity.type === 'create' ? '+' : activity.type === 'update' ? '✎' : '−'}
            </span>
            <span className="activity-text">{activity.text}</span>
            <span className="activity-time">{activity.time}</span>
          </li>
        ))}
      </ul>
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
    category: 'Retail',
    status: 'Active'
  })
  const [editingId, setEditingId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'asc' })

  // Refs for keyboard shortcuts
  const nameInputRef = useRef(null)
  const fileInputRef = useRef(null)

  // Load dark mode from localStorage
  // Safe JSON parse helper
  const safeJsonParse = (str, fallback) => {
    if (!str) return fallback
    try {
      return JSON.parse(str)
    } catch {
      return fallback
    }
  }

  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode')
    return saved === 'true'
  })

  // Favorites stored in localStorage
  const [favorites, setFavorites] = useState(() => {
    return safeJsonParse(localStorage.getItem('merchantFavorites'), [])
  })

  // Categories stored in localStorage
  const [merchantCategories, setMerchantCategories] = useState(() => {
    return safeJsonParse(localStorage.getItem('merchantCategories'), {})
  })

  // Statuses stored in localStorage
  const [merchantStatuses, setMerchantStatuses] = useState(() => {
    return safeJsonParse(localStorage.getItem('merchantStatuses'), {})
  })

  // Activity log
  const [activities, setActivities] = useState(() => {
    return safeJsonParse(localStorage.getItem('merchantActivities'), [])
  })

  // Filter states
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)
  const [filterCategory, setFilterCategory] = useState('All')
  const [filterStatus, setFilterStatus] = useState('All')

  // Bulk selection
  const [selectedIds, setSelectedIds] = useState([])

  // Modal state
  const [showModal, setShowModal] = useState(false)

  // Duplicate warning
  const [duplicateWarning, setDuplicateWarning] = useState('')

  // Undo delete state
  const [deletedMerchant, setDeletedMerchant] = useState(null)
  const [showToast, setShowToast] = useState(false)

  // Save to localStorage effects
  useEffect(() => {
    localStorage.setItem('darkMode', darkMode)
    if (darkMode) {
      document.body.classList.add('dark-mode')
    } else {
      document.body.classList.remove('dark-mode')
    }
  }, [darkMode])

  useEffect(() => {
    localStorage.setItem('merchantFavorites', JSON.stringify(favorites))
  }, [favorites])

  useEffect(() => {
    localStorage.setItem('merchantCategories', JSON.stringify(merchantCategories))
  }, [merchantCategories])

  useEffect(() => {
    localStorage.setItem('merchantStatuses', JSON.stringify(merchantStatuses))
  }, [merchantStatuses])

  useEffect(() => {
    localStorage.setItem('merchantActivities', JSON.stringify(activities))
  }, [activities])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl+N or Cmd+N - focus on new merchant form
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault()
        handleCancel() // Clear form first
        nameInputRef.current?.focus()
      }
      // Escape - cancel editing
      if (e.key === 'Escape' && editingId) {
        handleCancel()
      }
      // Ctrl+E - export CSV
      if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
        e.preventDefault()
        exportToCSV()
      }
      // Ctrl+D - toggle dark mode
      if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault()
        setDarkMode(prev => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [editingId])

  // Add activity to log
  const addActivity = (type, text) => {
    const now = new Date()
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    setActivities(prev => [{ type, text, time }, ...prev.slice(0, 19)])
  }

  const clearActivities = () => {
    setActivities([])
  }

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev)
  }

  const toggleFavorite = (id) => {
    setFavorites(prev => {
      if (prev.includes(id)) {
        return prev.filter(fid => fid !== id)
      } else {
        return [...prev, id]
      }
    })
  }

  const toggleSelect = (id) => {
    setSelectedIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(sid => sid !== id)
      } else {
        return [...prev, id]
      }
    })
  }

  const selectAll = () => {
    if (selectedIds.length === sortedMerchants.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(sortedMerchants.map(m => m.id))
    }
  }

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) {
      setError('No merchants selected')
      return
    }
    setShowModal(true)
  }

  const executeBulkDelete = async () => {
    setShowModal(false)
    try {
      for (const id of selectedIds) {
        await fetch(`${API_URL}/merchants/${id}`, { method: 'DELETE' })
      }
      addActivity('delete', `Deleted ${selectedIds.length} merchants`)
      setSelectedIds([])
      fetchMerchants()
      showSuccess(`Deleted ${selectedIds.length} merchants!`)
    } catch (err) {
      setError('Failed to delete some merchants')
    }
  }

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
    const status = merchantStatuses[merchant.id] || 'Active'
    const matchesStatus = filterStatus === 'All' || status === filterStatus
    return matchesSearch && matchesFavorite && matchesCategory && matchesStatus
  })

  // Sort merchants
  const sortedMerchants = [...filteredMerchants].sort((a, b) => {
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

  // Export to CSV
  const exportToCSV = () => {
    if (merchants.length === 0) {
      setError('No data to export')
      return
    }

    const headers = ['ID', 'Merchant Name', 'Country', 'Category', 'Status', 'Favorite']
    const csvData = sortedMerchants.map(m => [
      m.id,
      `"${m.merchant_name}"`,
      `"${m.country}"`,
      merchantCategories[m.id] || 'Other',
      merchantStatuses[m.id] || 'Active',
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

    addActivity('export', 'Exported data to CSV')
    showSuccess('Data exported to CSV!')
  }

  // Import from CSV
  const handleImportCSV = (e) => {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = async (event) => {
      try {
        const text = event.target.result
        const lines = text.split('\n').filter(line => line.trim())

        if (lines.length < 2) {
          setError('CSV file is empty or has no data rows')
          return
        }

        // Skip header row
        const dataRows = lines.slice(1)
        let imported = 0

        for (const row of dataRows) {
          // Simple CSV parsing (handles quoted values)
          const cols = row.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g)
          if (!cols || cols.length < 2) continue

          const name = cols[1]?.replace(/"/g, '').trim()
          const country = cols[2]?.replace(/"/g, '').trim()
          const category = cols[3]?.replace(/"/g, '').trim() || 'Other'
          const status = cols[4]?.replace(/"/g, '').trim() || 'Active'

          if (name && country) {
            const response = await fetch(`${API_URL}/merchants`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ merchant_name: name, country: country })
            })

            if (response.ok) {
              const text = await response.text()
              const newMerchant = text ? JSON.parse(text) : {}
              if (newMerchant.id) {
                setMerchantCategories(prev => ({ ...prev, [newMerchant.id]: category }))
                setMerchantStatuses(prev => ({ ...prev, [newMerchant.id]: status }))
              }
              imported++
            }
          }
        }

        fetchMerchants()
        addActivity('create', `Imported ${imported} merchants from CSV`)
        showSuccess(`Imported ${imported} merchants from CSV!`)
      } catch (err) {
        setError('Failed to import CSV: ' + err.message)
      }
    }
    reader.readAsText(file)
    e.target.value = '' // Reset file input
  }

  // Stats
  const uniqueCountries = [...new Set(merchants.map(m => m.country))].length
  const favoritesCount = favorites.filter(id => merchants.some(m => m.id === id)).length
  const activeCount = merchants.filter(m => (merchantStatuses[m.id] || 'Active') === 'Active').length

  // Fetch merchants
  const fetchMerchants = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`${API_URL}/merchants`)
      if (!response.ok) throw new Error('Failed to fetch merchants')
      const text = await response.text()
      // Check if response is valid JSON
      if (!text) throw new Error('Empty response from server')
      const data = JSON.parse(text)
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

      const text = await response.text()
      const newMerchant = text ? JSON.parse(text) : {}

      setMerchantCategories(prev => ({ ...prev, [newMerchant.id]: formData.category }))
      setMerchantStatuses(prev => ({ ...prev, [newMerchant.id]: formData.status }))

      addActivity('create', `Added "${formData.merchant_name}"`)
      setFormData({ merchant_name: '', country: '', category: 'Retail', status: 'Active' })
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

      setMerchantCategories(prev => ({ ...prev, [editingId]: formData.category }))
      setMerchantStatuses(prev => ({ ...prev, [editingId]: formData.status }))

      addActivity('update', `Updated "${formData.merchant_name}"`)
      setFormData({ merchant_name: '', country: '', category: 'Retail', status: 'Active' })
      setEditingId(null)
      setDuplicateWarning('')
      fetchMerchants()
      showSuccess('Merchant updated successfully!')
    } catch (err) {
      setError(err.message)
    }
  }

  // Delete with undo capability
  const handleDelete = async (id) => {
    const merchant = merchants.find(m => m.id === id)
    if (!merchant) return

    try {
      const response = await fetch(`${API_URL}/merchants/${id}`, {
        method: 'DELETE'
      })
      if (!response.ok) throw new Error('Failed to delete merchant')

      // Store deleted merchant for undo
      setDeletedMerchant({
        ...merchant,
        category: merchantCategories[id] || 'Other',
        status: merchantStatuses[id] || 'Active',
        isFavorite: favorites.includes(id)
      })

      // Clean up
      setFavorites(prev => prev.filter(fid => fid !== id))
      setMerchantCategories(prev => {
        const updated = { ...prev }
        delete updated[id]
        return updated
      })
      setMerchantStatuses(prev => {
        const updated = { ...prev }
        delete updated[id]
        return updated
      })

      addActivity('delete', `Deleted "${merchant.merchant_name}"`)
      fetchMerchants()
      setShowToast(true)

      // Auto-hide toast after 5 seconds
      setTimeout(() => {
        setShowToast(false)
        setDeletedMerchant(null)
      }, 5000)
    } catch (err) {
      setError(err.message)
    }
  }

  // Undo delete
  const handleUndo = async () => {
    if (!deletedMerchant) return

    try {
      const response = await fetch(`${API_URL}/merchants`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          merchant_name: deletedMerchant.merchant_name,
          country: deletedMerchant.country
        })
      })

      if (response.ok) {
        const text = await response.text()
        const restored = text ? JSON.parse(text) : {}
        setMerchantCategories(prev => ({ ...prev, [restored.id]: deletedMerchant.category }))
        setMerchantStatuses(prev => ({ ...prev, [restored.id]: deletedMerchant.status }))
        if (deletedMerchant.isFavorite) {
          setFavorites(prev => [...prev, restored.id])
        }
        addActivity('create', `Restored "${deletedMerchant.merchant_name}"`)
        fetchMerchants()
        showSuccess('Merchant restored!')
      }
    } catch (err) {
      setError('Failed to restore merchant')
    }

    setShowToast(false)
    setDeletedMerchant(null)
  }

  const handleEdit = (merchant) => {
    setEditingId(merchant.id)
    setFormData({
      merchant_name: merchant.merchant_name,
      country: merchant.country,
      category: merchantCategories[merchant.id] || 'Other',
      status: merchantStatuses[merchant.id] || 'Active'
    })
    setDuplicateWarning('')
    nameInputRef.current?.focus()
  }

  const handleCancel = () => {
    setEditingId(null)
    setFormData({ merchant_name: '', country: '', category: 'Retail', status: 'Active' })
    setDuplicateWarning('')
  }

  return (
    <div className={`App ${darkMode ? 'dark-mode' : ''}`}>
      <header className="app-header">
        <h1>Merchant Management System</h1>
        <p className="subtitle">Track and manage your merchant partners</p>
        <div className="header-actions">
          <button className="theme-toggle" onClick={toggleDarkMode}>
            {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
          <span className="keyboard-hint">Ctrl+N: New | Ctrl+E: Export | Ctrl+D: Dark Mode</span>
        </div>
      </header>

      {/* Statistics Dashboard */}
      <div className="stats-container">
        <StatsCard title="Total Merchants" value={merchants.length} color="#4CAF50" />
        <StatsCard title="Active" value={activeCount} color="#2196F3" />
        <StatsCard title="Countries" value={uniqueCountries} color="#9C27B0" />
        <StatsCard title="Favorites" value={favoritesCount} color="#FF5722" />
        <StatsCard title="Showing" value={filteredMerchants.length} color="#FF9800" />
      </div>

      {error && <div className="error">{error}</div>}
      {successMsg && <div className="success">{successMsg}</div>}

      {/* Activity Log */}
      <ActivityLog activities={activities} onClear={clearActivities} />

      {/* Form */}
      <div className="form-container">
        <h2>{editingId ? 'Update Merchant' : 'Add New Merchant'}</h2>
        <form onSubmit={editingId ? handleUpdate : handleCreate}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="merchant_name">Merchant Name:</label>
              <input
                ref={nameInputRef}
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
          </div>
          <div className="form-row">
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
            <div className="form-group">
              <label htmlFor="status">Status:</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="status-select"
              >
                {STATUSES.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-buttons">
            <button type="submit" className="btn-primary">
              {editingId ? 'Update' : 'Create'}
            </button>
            {editingId && (
              <button type="button" className="btn-secondary" onClick={handleCancel}>
                Cancel (Esc)
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
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="status-filter"
              >
                <option value="All">All Statuses</option>
                {STATUSES.map(s => (
                  <option key={s} value={s}>{s}</option>
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
            <div className="action-buttons">
              <button className="btn-export" onClick={exportToCSV}>
                Export CSV
              </button>
              <label className="btn-import">
                Import CSV
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  onChange={handleImportCSV}
                  style={{ display: 'none' }}
                />
              </label>
            </div>
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
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedMerchants.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center' }}>
                    {searchTerm || showFavoritesOnly || filterCategory !== 'All' || filterStatus !== 'All'
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
                    status={merchantStatuses[merchant.id] || 'Active'}
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

      {/* Modals and Toasts */}
      <ConfirmModal
        show={showModal}
        title="Confirm Delete"
        message={`Are you sure you want to delete ${selectedIds.length} merchant(s)? This cannot be undone.`}
        onConfirm={executeBulkDelete}
        onCancel={() => setShowModal(false)}
      />

      <Toast
        show={showToast}
        message={deletedMerchant ? `Deleted "${deletedMerchant.merchant_name}"` : ''}
        onUndo={handleUndo}
        onClose={() => { setShowToast(false); setDeletedMerchant(null); }}
      />
    </div>
  )
}

export default App
