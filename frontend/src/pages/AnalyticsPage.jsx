import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'

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

  const categoryData = getCategoryBreakdown()

  return (
    <>
      <Navbar />
      <div className="dashboard-container">
        <h1>Analytics</h1>
        {error && <p className="auth-error">{error}</p>}

        {categoryData.length === 0 ? (
          <p>No expense data yet. Add some transactions to see your breakdown.</p>
        ) : (
          <div className="chart-card">
            <h2>Spending by Category</h2>
            <ResponsiveContainer width="100%" height={350}>
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
      </div>
    </>
  )
}

export default AnalyticsPage