// src/components/Navbar.jsx
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); // Added useLocation hook

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!currentUser) return null;

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/dashboard">Logistics System</Link>
      </div>

      <div className="navbar-menu">
        <Link to="/dashboard" className={`navbar-item ${location.pathname === '/dashboard' ? 'active' : ''}`}>
          Dashboard
        </Link>
        <Link to="/simulation" className={`navbar-item ${location.pathname === '/simulation' ? 'active' : ''}`}>
          Simulation
        </Link>
        <Link to="/drivers" className={`navbar-item ${location.pathname === '/drivers' ? 'active' : ''}`}>
          Drivers
        </Link>
        <Link to="/routes" className={`navbar-item ${location.pathname === '/routes' ? 'active' : ''}`}>
          Routes
        </Link>
        <Link to="/orders" className={`navbar-item ${location.pathname === '/orders' ? 'active' : ''}`}>
          Orders
        </Link>
      </div>

      <div className="navbar-end">
        <span className="user-name">{currentUser.name}</span>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}
