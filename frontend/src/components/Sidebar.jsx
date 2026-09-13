import { Link, useNavigate, useLocation } from 'react-router-dom'

function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()

  function handleLogout() {
    localStorage.removeItem('token')
    navigate('/login')
  }

  function isActive(path) {
    return location.pathname === path
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-logo-icon">↗</div>
        <span>SpendWise</span>
      </div>

      <nav className="sidebar-nav">
        <Link to="/dashboard" className={isActive('/dashboard') ? 'sidebar-link active' : 'sidebar-link'}>
          Dashboard
        </Link>
        <Link to="/budgets" className={isActive('/budgets') ? 'sidebar-link active' : 'sidebar-link'}>
          Budgets
        </Link>
        <Link to="/analytics" className={isActive('/analytics') ? 'sidebar-link active' : 'sidebar-link'}>
          Analytics
        </Link>
      </nav>

      <button className="sidebar-logout" onClick={handleLogout}>
        Logout
      </button>
    </aside>
  )
}

export default Sidebar