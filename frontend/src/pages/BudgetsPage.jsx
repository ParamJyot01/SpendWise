import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'

function BudgetsPage() {
  const [budgets, setBudgets] = useState([])
  const [transactions, setTransactions] = useState([])
  const [formData, setFormData] = useState({
    category: 'Food',
    limit: ''
  })
  const [error, setError] = useState('')

  const token = localStorage.getItem('token')

  useEffect(() => {
    fetchBudgets()
    fetchTransactions()
  }, [])

  async function fetchBudgets() {
    try {
      const response = await fetch('http://localhost:5000/api/budgets', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await response.json()

      if (!response.ok) {
        setError(data.message || 'Failed to load budgets')
        return
      }

      setBudgets(data)
    } catch (err) {
      setError('Failed to load budgets')
    }
  }

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

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  async function handleSubmit(e) {
    e.preventDefault()

    if (!formData.limit || Number(formData.limit) <= 0) {
      alert('Please enter a valid limit greater than 0')
      return
    }

    try {
      const response = await fetch('http://localhost:5000/api/budgets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      const newBudget = await response.json()
      setBudgets([...budgets, newBudget])
      setFormData({ category: 'Food', limit: '' })
    } catch (err) {
      setError('Failed to add budget')
    }
  }

  async function handleDelete(id) {
    try {
      await fetch(`http://localhost:5000/api/budgets/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
      setBudgets(budgets.filter((b) => b._id !== id))
    } catch (err) {
      setError('Failed to delete budget')
    }
  }

  function getSpentForCategory(category) {
    return transactions
      .filter((t) => t.category === category && t.type === 'expense')
      .reduce((sum, t) => sum + Number(t.amount), 0)
  }

  return (
    <>
      <Navbar />
      <div className="dashboard-container">
        <h1>Budgets</h1>
        {error && <p className="auth-error">{error}</p>}

        <form className="transaction-form" onSubmit={handleSubmit}>
          <select name="category" value={formData.category} onChange={handleChange}>
            <option value="Food">Food</option>
            <option value="Transport">Transport</option>
            <option value="Shopping">Shopping</option>
            <option value="Bills">Bills</option>
            <option value="Other">Other</option>
          </select>

          <input
            type="number"
            name="limit"
            placeholder="Budget limit"
            value={formData.limit}
            onChange={handleChange}
          />

          <button type="submit">Set Budget</button>
        </form>

        <h2>Your Budgets</h2>
        <div className="budget-list">
          {budgets.map((b) => {
            const spent = getSpentForCategory(b.category)
            const percentage = Math.min((spent / b.limit) * 100, 100)
            const isOverBudget = spent > b.limit

            return (
              <div key={b._id} className="budget-card">
                <div className="budget-card-header">
                  <span className="budget-category">{b.category}</span>
                  <button onClick={() => handleDelete(b._id)}>Delete</button>
                </div>
                <div className="budget-progress-bar">
                  <div
                    className={`budget-progress-fill ${isOverBudget ? 'over-budget' : ''}`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <div className="budget-numbers">
                  <span>₹{spent} spent</span>
                  <span>₹{b.limit} limit</span>
                </div>
                {isOverBudget && <p className="budget-warning">You've exceeded this budget!</p>}
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}

export default BudgetsPage