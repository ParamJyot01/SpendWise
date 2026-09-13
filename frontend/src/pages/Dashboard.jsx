import { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
function Dashboard() {
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    category: 'Food',
    type: 'expense'
  })

  const [transactions, setTransactions] = useState([])
  const [error, setError] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('All')
  const [filterType, setFilterType] = useState('All')
  const [sortBy, setSortBy] = useState('newest')

  const token = localStorage.getItem('token')

  useEffect(() => {
    fetchTransactions()
  }, [])

  async function fetchTransactions() {
    try {
      const response = await fetch('http://localhost:5000/api/transactions', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      const data = await response.json()

      if (!response.ok) {
        setError(data.message || 'Failed to load transactions')
        return
      }

      setTransactions(data)
    } catch (err) {
      setError('Failed to load transactions')
    }
  }

  function handleChange(e) {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  function handleEditClick(transaction) {
    setEditingId(transaction._id)
    setFormData({
      amount: transaction.amount,
      description: transaction.description,
      category: transaction.category,
      type: transaction.type
    })
  }

  async function handleSubmit(e) {
    e.preventDefault()

    if (!formData.amount || Number(formData.amount) <= 0) {
      alert('Please enter a valid amount greater than 0')
      return
    }

    if (!formData.description.trim()) {
      alert('Please enter a description')
      return
    }

    try {
      if (editingId) {
        const response = await fetch(`http://localhost:5000/api/transactions/${editingId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(formData)
        })

        const updatedTransaction = await response.json()

        setTransactions(transactions.map((t) =>
          t._id === editingId ? updatedTransaction : t
        ))

        setEditingId(null)
      } else {
        const response = await fetch('http://localhost:5000/api/transactions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(formData)
        })

        const newTransaction = await response.json()
        setTransactions([...transactions, newTransaction])
      }

      setFormData({
        amount: '',
        description: '',
        category: 'Food',
        type: 'expense'
      })
    } catch (err) {
      setError('Failed to save transaction')
    }
  }

  async function handleDelete(id) {
    try {
      await fetch(`http://localhost:5000/api/transactions/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      setTransactions(transactions.filter((t) => t._id !== id))
    } catch (err) {
      setError('Failed to delete transaction')
    }
  }
  function getFilteredTransactions() {
    let filtered = [...transactions]

    if (searchTerm.trim()) {
      filtered = filtered.filter((t) =>
        t.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (filterCategory !== 'All') {
      filtered = filtered.filter((t) => t.category === filterCategory)
    }

    if (filterType !== 'All') {
      filtered = filtered.filter((t) => t.type === filterType)
    }

    if (sortBy === 'newest') {
      filtered.sort((a, b) => new Date(b.date) - new Date(a.date))
    } else if (sortBy === 'oldest') {
      filtered.sort((a, b) => new Date(a.date) - new Date(b.date))
    } else if (sortBy === 'highest') {
      filtered.sort((a, b) => Number(b.amount) - Number(a.amount))
    } else if (sortBy === 'lowest') {
      filtered.sort((a, b) => Number(a.amount) - Number(b.amount))
    }

    return filtered
  }

  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount), 0)

  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0)

  const balance = totalIncome - totalExpense

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
      <div className="dashboard-container">
        <h1>Dashboard</h1>
        {error && <p className="auth-error">{error}</p>}

        <div className="summary-cards">
          <div className="summary-card income-card">
            <h3>Total Income</h3>
            <p>₹{totalIncome}</p>
          </div>
          <div className="summary-card expense-card">
            <h3>Total Expense</h3>
            <p>₹{totalExpense}</p>
          </div>
          <div className="summary-card balance-card">
            <h3>Balance</h3>
            <p>₹{balance}</p>
          </div>
        </div>

        <form className="transaction-form" onSubmit={handleSubmit}>
          <input
            type="number"
            name="amount"
            placeholder="Amount"
            value={formData.amount}
            onChange={handleChange}
          />

          <input
            type="text"
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
          />

          <select name="category" value={formData.category} onChange={handleChange}>
            <option value="Food">Food</option>
            <option value="Transport">Transport</option>
            <option value="Shopping">Shopping</option>
            <option value="Bills">Bills</option>
            <option value="Other">Other</option>
          </select>

          <select name="type" value={formData.type} onChange={handleChange}>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>

          <button type="submit">{editingId ? 'Update Transaction' : 'Add Transaction'}</button>
        </form>

        <div className="filter-bar">
          <input
            type="text"
            placeholder="Search by description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
            <option value="All">All Categories</option>
            <option value="Food">Food</option>
            <option value="Transport">Transport</option>
            <option value="Shopping">Shopping</option>
            <option value="Bills">Bills</option>
            <option value="Other">Other</option>
          </select>

          <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            <option value="All">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>

          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highest">Highest Amount</option>
            <option value="lowest">Lowest Amount</option>
          </select>
        </div>

        <h2>Transactions</h2>
        <ul className="transaction-list">
          {getFilteredTransactions().map((t) => (
            <li key={t._id} className="transaction-item">
              <span>{t.description} — ₹{t.amount} ({t.category}, {t.type})</span>
              <div>
                <button onClick={() => handleEditClick(t)}>Edit</button>
                <button onClick={() => handleDelete(t._id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
      </div>
    </div>
  )
}

export default Dashboard