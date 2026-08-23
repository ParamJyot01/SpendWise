import Navbar from '../components/Navbar'

function LandingPage() {
  return (
    <div className="landing-page">
      <Navbar />
      <div className="landing-content">
        <h1>SpendWise</h1>
        <p>Take control of your money — track spending, set budgets, see where it goes.</p>
        <button>Get Started</button>
      </div>
    </div>
  )
}

export default LandingPage