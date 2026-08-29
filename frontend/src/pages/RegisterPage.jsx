import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const navigate = useNavigate()

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message)
        return
      }

      navigate('/login')
    } catch (err) {
      setError('Something went wrong. Try again.')
    }
  }

   return (
    <div className="auth-page">
      <div className="auth-illustration">
        <div className="auth-blob"></div>
        <div className="auth-blob-2"></div>
        <div className="auth-brand">
          <span className="auth-brand-dot"></span>
          SpendWise
        </div>

        <div className="auth-illustration-graphic">
          <svg width="190" height="190" viewBox="0 0 200 200" fill="none">
            <rect x="40" y="110" width="24" height="60" rx="7" fill="rgba(255,255,255,0.85)" />
            <rect x="88" y="80" width="24" height="90" rx="7" fill="white" />
            <rect x="136" y="50" width="24" height="120" rx="7" fill="#fbbf24" />
            <circle cx="148" cy="40" r="12" fill="white" />
          </svg>
        </div>

        <div className="auth-quote">
          <p>"Setup took two minutes. Now I actually stick to my budget."</p>
          <span>Join people building better money habits.</span>
        </div>
      </div>

      <div className="auth-form-side">
        <div className="auth-container">
          <h1>Create your account</h1>
          <p className="auth-subtitle">Start tracking your money in minutes</p>
          {error && <p className="auth-error">{error}</p>}
          <form onSubmit={handleSubmit}>
            <div className="auth-field">
              <label>Name</label>
              <input name="name" placeholder="Your name" value={formData.name} onChange={handleChange} />
            </div>
            <div className="auth-field">
              <label>Email</label>
              <input name="email" placeholder="you@example.com" value={formData.email} onChange={handleChange} />
            </div>
            <div className="auth-field">
              <label>Password</label>
              <input name="password" type="password" placeholder="••••••••" value={formData.password} onChange={handleChange} />
            </div>
            <button type="submit">Create Account</button>
          </form>
          <p className="auth-switch">
            Already have an account? <a href="/login">Log in</a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage