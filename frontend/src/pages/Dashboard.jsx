import { useState } from 'react'

function Dashboard() {
  const [amount, setAmount] = useState('')

  return (
    <div>
      <h1>Dashboard</h1>
      <input
        type="number"
        placeholder="Enter amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <p>You typed: {amount}</p>
    </div>
  )
}

export default Dashboard