import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'

function LandingPage() {
  return (
    <div>
      <Navbar />
      <div className="landing-hero">
        <div className="landing-badge">💰 Take control of your money</div>
        <h1>Track. Budget. <span className="landing-highlight">Grow.</span></h1>
        <p>SpendWise helps you track spending, set smart budgets, and understand exactly where your money goes — all in one clean dashboard.</p>
        <div className="landing-cta-group">
          <Link to="/register"><button className="landing-primary-btn">Get Started Free</button></Link>
          <Link to="/login"><button className="landing-secondary-btn">Log In</button></Link>
        </div>
      </div>

      <div className="landing-features">
        <div className="feature-card">
          <div className="feature-icon">📊</div>
          <h3>Track Transactions</h3>
          <p>Log income and expenses in seconds, organized by category.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🎯</div>
          <h3>Set Budgets</h3>
          <p>Set spending limits per category and get warned before you overspend.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">📈</div>
          <h3>Visual Analytics</h3>
          <p>See exactly where your money goes with clear, real-time charts.</p>
        </div>
      </div>
    </div>
  )
}

export default LandingPage