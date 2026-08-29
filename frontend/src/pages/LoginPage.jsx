import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
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
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message)
        return
      }

      localStorage.setItem('token', data.token)
      navigate('/dashboard')
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

          <h2 className="left-title">Welcome Back!</h2>
          <p className="left-description">Login to continue tracking your expenses.</p>

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
          <h1 className="login-title">Login</h1>
          <p className="login-subtitle">Welcome back! Please login to your account.</p>

          {error && <p className="login-error-box">{error}</p>}

          <form onSubmit={handleSubmit}>
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

            <div className="login-options-row">
              <label className="remember-me">
                <input type="checkbox" />
                Remember me
              </label>
              <a href="#" className="forgot-link">Forgot Password?</a>
            </div>

            <button type="submit" className="login-btn">Login</button>
          </form>

          <p className="signup-text">
            Don't have an account? <a href="/register">Sign up</a>
          </p>
        </section>

      </div>
    </div>
  )
}

export default LoginPage