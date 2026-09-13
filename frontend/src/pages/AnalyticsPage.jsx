import { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'

const COLORS = ['#20c978', '#4f46e5', '#f59e0b', '#dc2626', '#0ea5e9', '#8b5cf6', '#ec4899', '#14b8a6']

function AnalyticsPage() {
  const [transactions, setTransactions] = useState([])
  const [error, setError] = useState('')

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
          {error && <p className="auth-error">{error}</p>}

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
                      outerRadius={100}
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
                <ResponsiveContainer width="100%" height={380}>
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
        </div>
      </div>
    </div>
  )
}

export default AnalyticsPage