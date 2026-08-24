import { useState, useEffect } from 'react'

function Dashboard() {
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    category: 'Food',
    type: 'expense'
  })

  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('transactions')
    return saved ? JSON.parse(saved) : []
  })

  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions))
  }, [transactions])

  function handleChange(e) {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

function handleSubmit(e) {
  e.preventDefault()

  if (!formData.amount || Number(formData.amount) <= 0) {
    alert('Please enter a valid amount greater than 0')
    return
  }

  if (!formData.description.trim()) {
    alert('Please enter a description')
    return
  }

  const newTransaction = {
    id: Date.now(),
    ...formData
  }

  setTransactions([...transactions, newTransaction])

  setFormData({
    amount: '',
    description: '',
    category: 'Food',
    type: 'expense'
  })
}

  function handleDelete(id) {
    setTransactions(transactions.filter((t) => t.id !== id))
  }

  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount), 0)

  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0)

  const balance = totalIncome - totalExpense

  return (
    <div>
      <h1>Dashboard</h1>
      <div>
        <p>Total Income: ₹{totalIncome}</p>
        <p>Total Expense: ₹{totalExpense}</p>
        <p>Balance: ₹{balance}</p>
      </div>

      <form onSubmit={handleSubmit}>
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
      <ul>
        {transactions.map((t) => (
          <li key={t.id}>
            {t.description} — ₹{t.amount} ({t.category}, {t.type})
            <button onClick={() => handleDelete(t.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Dashboard