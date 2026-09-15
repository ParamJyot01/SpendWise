import { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line } from 'recharts'
const COLORS = ['#20c978', '#4f46e5', '#f59e0b', '#dc2626', '#0ea5e9', '#8b5cf6', '#ec4899', '#14b8a6']
const CATEGORY_ICONS = {
  Food: '🍔',
  Transport: '🚌',
  Shopping: '🛍️',
  Bills: '📄',
  Other: '📦'
}
function AnalyticsPage() {
  const [transactions, setTransactions] = useState([])
  const [error, setError] = useState('')
  const [insights, setInsights] = useState([])
  const [loadingInsights, setLoadingInsights] = useState(false)

  const token = localStorage.getItem('token')

  useEffect(() => {
    fetchTransactions()
  }, [])

  async function fetchTransactions() {
    try {
      const response = await fetch('http://localhost:5000/api/transactions', {
        headers: { Authorization: `Bearer ${token}` }
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
  async function fetchInsights() {
    setLoadingInsights(true)
    try {
      const response = await fetch('http://localhost:5000/api/insights', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await response.json()

      if (!response.ok) {
        setError(data.message || 'Failed to load insights')
        return
      }

      setInsights(data.suggestions)
    } catch (err) {
      setError('Failed to load insights')
    } finally {
      setLoadingInsights(false)
    }
  }

  function getCategoryBreakdown() {
    const expenseTransactions = transactions.filter((t) => t.type === 'expense')

    const grouped = {}
    expenseTransactions.forEach((t) => {
      grouped[t.category] = (grouped[t.category] || 0) + Number(t.amount)
    })

    return Object.keys(grouped).map((category) => ({
      name: category,
      value: grouped[category]
    }))
  }

  function getIncomeVsExpense() {
    const income = transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + Number(t.amount), 0)

    const expense = transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + Number(t.amount), 0)

    return [
      { name: 'Income', amount: income },
      { name: 'Expense', amount: expense }
    ]
  }
  function getMonthlyTrend() {
    const grouped = {}

    transactions.forEach((t) => {
      const date = new Date(t.date)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      const monthLabel = date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })

      if (!grouped[monthKey]) {
        grouped[monthKey] = { month: monthLabel, income: 0, expense: 0 }
      }

      if (t.type === 'income') {
        grouped[monthKey].income += Number(t.amount)
      } else {
        grouped[monthKey].expense += Number(t.amount)
      }
    })

    return Object.keys(grouped)
      .sort()
      .map((key) => grouped[key])
  }
  function getRecentTransactions() {
    return [...transactions]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5)
  }
  function getSummaryStats() {
    const income = transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + Number(t.amount), 0)

    const expense = transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + Number(t.amount), 0)

    return {
      income,
      expense,
      balance: income - expense,
      transactionCount: transactions.length
    }
  }

  const stats = getSummaryStats()

  const categoryData = getCategoryBreakdown()

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <div className="analytics-container">
          <div className="analytics-header">
            <h1>Analytics</h1>
            <p>A breakdown of your income, spending, and category habits.</p>
          </div>
                    <div className="insights-section">
            <div className="insights-header">
              <h2>💡 Smart Insights</h2>
              <button onClick={fetchInsights} disabled={loadingInsights} className="insights-btn">
                {loadingInsights ? 'Thinking...' : 'Get AI Suggestions'}
              </button>
            </div>

            {insights.length > 0 && (
              <div className="insights-list">
                {insights.map((tip, index) => (
                  <div key={index} className="insight-item">
                    <span className="insight-number">{index + 1}</span>
                    <p>{tip}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
          {error && <p className="auth-error">{error}</p>}

          <div className="analytics-stats-row">
            <div className="stat-card">
              <div className="stat-icon income-icon">₹</div>
              <div>
                <span className="stat-label">Total Income</span>
                <span className="stat-value">₹{stats.income}</span>
              </div>
            </div>
            <div className="stat-card highlighted">
              <div className="stat-icon expense-icon-white">↓</div>
              <div>
                <span className="stat-label light">Total Expense</span>
                <span className="stat-value light">₹{stats.expense}</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon balance-icon">=</div>
              <div>
                <span className="stat-label">Balance</span>
                <span className="stat-value">₹{stats.balance}</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon count-icon">#</div>
              <div>
                <span className="stat-label">Transactions</span>
                <span className="stat-value">{stats.transactionCount}</span>
              </div>
            </div>
          </div>

          <div className="charts-grid">
            {categoryData.length === 0 ? (
              <p>No expense data yet. Add some transactions to see your breakdown.</p>
            ) : (
              <div className="chart-card">
                <h2>Spending by Category</h2>
                <ResponsiveContainer width="100%" height={380}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={110}
                      paddingAngle={3}
                      label={false}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}

            {transactions.length > 0 && (
              <div className="chart-card">
                <h2>Income vs Expense</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={getIncomeVsExpense()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="amount" fill="#20c978" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {transactions.length > 0 && (
            <div className="chart-card trend-chart-card">
              <h2>Monthly Trend</h2>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={getMonthlyTrend()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="income" stroke="#16a34a" strokeWidth={2.5} />
                  <Line type="monotone" dataKey="expense" stroke="#dc2626" strokeWidth={2.5} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          <div className="chart-card recent-list-card">
            <h2>Recent Transactions</h2>
            <div className="recent-list">
              {getRecentTransactions().map((t) => (
                <div key={t._id} className="recent-item">
                  <div className="recent-item-icon">{CATEGORY_ICONS[t.category] || '💰'}</div>
                  <div className="recent-item-info">
                    <span className="recent-item-name">{t.description}</span>
                    <span className="recent-item-date">{new Date(t.date).toLocaleDateString()}</span>
                  </div>
                  <span className={`recent-item-amount ${t.type}`}>
                    {t.type === 'income' ? '+' : '-'}₹{t.amount}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AnalyticsPage