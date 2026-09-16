import { Link } from 'react-router-dom'
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts'
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
  const [budgets, setBudgets] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('All')
  const [filterType, setFilterType] = useState('All')
  const [sortBy, setSortBy] = useState('newest')

  const token = localStorage.getItem('token')

  useEffect(() => {
    fetchTransactions()
    fetchBudgets()
  }, [])

  async function fetchTransactions() {
    try {
      const response = await fetch('http://localhost:5000/api/transactions', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      const data = await response.json()

      if (response.ok) {
        setTransactions(data)
      } else {
        setError(data.message || 'Failed to fetch transactions')
      }
    } catch (err) {
      setError('Server error')
    }
  }

  async function fetchBudgets() {
    try {
      const response = await fetch('http://localhost:5000/api/budgets', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await response.json()
      if (response.ok) setBudgets(data)
    } catch (err) {
      // silent fail, budgets are secondary info here
    }
  }

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  function handleEditClick(transaction) {
    setFormData({
      amount: transaction.amount,
      description: transaction.description,
      category: transaction.category,
      type: transaction.type
    })
    setEditingId(transaction._id)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!formData.amount || !formData.description) {
      setError('Please fill all fields')
      return
    }

    try {
      const url = editingId
        ? `http://localhost:5000/api/transactions/${editingId}`
        : 'http://localhost:5000/api/transactions'

      const method = editingId ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok) {
        setFormData({
          amount: '',
          description: '',
          category: 'Food',
          type: 'expense'
        })
        setEditingId(null)
        fetchTransactions()
      } else {
        setError(data.message || 'Something went wrong')
      }
    } catch (err) {
      setError('Server error')
    }
  }

  async function handleDelete(id) {
    try {
      const response = await fetch(`http://localhost:5000/api/transactions/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      const data = await response.json()

      if (response.ok) {
        fetchTransactions()
      } else {
        setError(data.message || 'Failed to delete transaction')
      }
    } catch (err) {
      setError('Server error')
    }
  }

  function getRecentPreview() {
    return [...transactions]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5)
  }

  function getTrendData() {
    const monthlyData = {}

    transactions.forEach((t) => {
      const month = new Date(t.date).toLocaleDateString('en-US', {
        month: 'short'
      })

      if (!monthlyData[month]) {
        monthlyData[month] = 0
      }

      monthlyData[month] +=
        t.type === 'income' ? Number(t.amount) : -Number(t.amount)
    })

    return Object.entries(monthlyData).map(([month, net]) => ({
      month,
      net
    }))
  }

  function exportToCSV() {
    const headers = ['Description', 'Amount', 'Category', 'Type', 'Date']

    const rows = getFilteredTransactions().map((t) => [
      t.description,
      t.amount,
      t.category,
      t.type,
      new Date(t.date).toLocaleDateString()
    ])

    const csvContent = [
      headers,
      ...rows
    ]
      .map((row) => row.join(','))
      .join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'transactions.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  function getFilteredTransactions() {
    let filtered = [...transactions]

    if (searchTerm) {
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

          <div className="dashboard-overview-grid">
            <div className="chart-card overview-trend">
              <h2>Balance Trend</h2>

              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={getTrendData()}>
                  <XAxis dataKey="month" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="net"
                    stroke="#20c978"
                    strokeWidth={2.5}
                    dot={{ r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-card overview-budgets">
              <div className="overview-card-header">
                <h2>Budget Status</h2>
                <Link to="/budgets" className="overview-link">
                  View all →
                </Link>
              </div>

              {budgets.length === 0 ? (
                <p className="overview-empty">No budgets set yet.</p>
              ) : (
                budgets.slice(0, 3).map((b) => {
                  const spent = transactions
                    .filter(
                      (t) =>
                        t.category === b.category &&
                        t.type === 'expense'
                    )
                    .reduce((sum, t) => sum + Number(t.amount), 0)

                  const pct = Math.min((spent / b.limit) * 100, 100)

                  return (
                    <div key={b._id} className="overview-budget-row">
                      <div className="overview-budget-label">
                        <span>{b.category}</span>
                        <span>
                          ₹{spent} / ₹{b.limit}
                        </span>
                      </div>

                      <div className="budget-progress-bar">
                        <div
                          className={`budget-progress-fill ${
                            spent > b.limit ? 'over-budget' : ''
                          }`}
                          style={{ width: `${pct}%` }}
                        ></div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>

          <div className="chart-card overview-recent">
            <div className="overview-card-header">
              <h2>Recent Transactions</h2>
            </div>

            <div className="recent-list">
              {getRecentPreview().map((t) => (
                <div key={t._id} className="recent-item">
                  <div className="recent-item-info">
                    <span className="recent-item-name">
                      {t.description}
                    </span>

                    <span className="recent-item-date">
                      {new Date(t.date).toLocaleDateString()} · {t.category}
                    </span>
                  </div>

                  <span className={`recent-item-amount ${t.type}`}>
                    {t.type === 'income' ? '+' : '-'}₹{t.amount}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <h2 className="section-divider">Manage Transactions</h2>

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

            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="Food">Food</option>
              <option value="Transport">Transport</option>
              <option value="Shopping">Shopping</option>
              <option value="Bills">Bills</option>
              <option value="Salary">Salary</option>
              <option value="Other">Other</option>
            </select>

            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>

            <button type="submit">
              {editingId ? 'Update Transaction' : 'Add Transaction'}
            </button>
          </form>

          <div className="filter-bar">
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="All">All Categories</option>
              <option value="Food">Food</option>
              <option value="Transport">Transport</option>
              <option value="Shopping">Shopping</option>
              <option value="Bills">Bills</option>
              <option value="Salary">Salary</option>
              <option value="Other">Other</option>
            </select>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="All">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="highest">Highest Amount</option>
              <option value="lowest">Lowest Amount</option>
            </select>

            <button onClick={exportToCSV}>Export CSV</button>
          </div>

          <h2>Transactions</h2>

          <ul className="transaction-list">
            {getFilteredTransactions().map((t) => (
              <li key={t._id} className="transaction-item">
                <span>
                  {t.description} — ₹{t.amount} ({t.category}, {t.type})
                </span>

                <div>
                  <button onClick={() => handleEditClick(t)}>
                    Edit
                  </button>

                  <button onClick={() => handleDelete(t._id)}>
                    Delete
                  </button>
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