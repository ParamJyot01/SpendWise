import { useState, useEffect } from 'react'

function Dashboard() {
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    category: 'Food',
    type: 'expense'
  })

  const [transactions, setTransactions] = useState([])
  const [error, setError] = useState('')

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

      setFormData({
        amount: '',
        description: '',
        category: 'Food',
        type: 'expense'
      })
    } catch (err) {
      setError('Failed to add transaction')
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

  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount), 0)

  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0)

  const balance = totalIncome - totalExpense

  return (
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

        <button type="submit">Add Transaction</button>
      </form>

      <h2>Transactions</h2>
      <ul className="transaction-list">
        {transactions.map((t) => (
          <li key={t._id} className="transaction-item">
            <span>{t.description} — ₹{t.amount} ({t.category}, {t.type})</span>
            <button onClick={() => handleDelete(t._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Dashboard