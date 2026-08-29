import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark'
  })
  const navigate = useNavigate()

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode-active')
      localStorage.setItem('theme', 'dark')
    } else {
      document.body.classList.remove('dark-mode-active')
      localStorage.setItem('theme', 'light')
    }
  }, [isDarkMode])

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
    <div className={`login-page-wrapper ${isDarkMode ? 'dark-mode' : ''}`}>
      <button className="theme-toggle" onClick={() => setIsDarkMode(!isDarkMode)}>
        {isDarkMode ? '☀️' : '🌙'}
      </button>
      <div className="login-container">

        <section className="login-left">
          <div className="circle-one"></div>
          <div className="circle-two"></div>

          <div className="login-brand">
            <div className="logo-icon">↗</div>
            <div className="brand-name">spend<span>Wise</span></div>
          </div>

          <p className="tagline">Track · Manage · Save</p>

          <h2 className="left-title">Start Your Journey</h2>
          <p className="left-description">Create an account to take control of your money.</p>

          <div className="illustration">
            <div className="monitor">
              <div className="monitor-header">
                <span className="mdot"></span>
                <span className="mdot"></span>
                <span className="mdot"></span>
              </div>
              <div className="dashboard-content">
                <div className="mini-chart">
                  <div className="mini-bar"></div>
                  <div className="mini-bar"></div>
                  <div className="mini-bar"></div>
                  <div className="mini-bar"></div>
                  <div className="mini-bar"></div>
                </div>
                <div className="pie"></div>
              </div>
            </div>

            <div className="person">
              <div className="head"></div>
              <div className="torso"></div>
              <div className="leg-one"></div>
              <div className="leg-two"></div>
            </div>

            <div className="coin">₹</div>
          </div>
        </section>

        <section className="login-right">
          <h1 className="login-title">Register</h1>
          <p className="login-subtitle">Create your account to get started.</p>

          {error && <p className="login-error-box">{error}</p>}

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Name</label>
              <div className="input-wrapper">
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="input-group">
              <label>Email</label>
              <div className="input-wrapper">
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                />
                <span className="input-icon">✉</span>
              </div>
            </div>

            <div className="input-group">
              <label>Password</label>
              <div className="input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <span
                  className="input-icon"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  ◉
                </span>
              </div>
            </div>

            <button type="submit" className="login-btn">Register</button>
          </form>

          <p className="signup-text">
            Already have an account? <a href="/login">Log in</a>
          </p>
        </section>

      </div>
    </div>
  )
}

export default RegisterPage