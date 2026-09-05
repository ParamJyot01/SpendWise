import { Link, useNavigate } from 'react-router-dom'

function Navbar() {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  function handleLogout() {
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <h2 className="navbar-logo">SpendWise</h2>
      <div className="navbar-links">
        {token ? (
          <>
            <Link to="/dashboard"><button>Dashboard</button></Link>
            <Link to="/budgets"><button>Budgets</button></Link>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">
              <button>Login</button>
            </Link>
            <Link to="/register">
              <button>Sign Up</button>
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar