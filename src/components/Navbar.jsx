// src/components/Navbar.jsx
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

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
        <Link to="/dashboard" className="navbar-item">
          Dashboard
        </Link>
        <Link to="/simulation" className="navbar-item">
          Simulation
        </Link>
        <Link to="/drivers" className="navbar-item">
          Drivers
        </Link>
        <Link to="/routes" className="navbar-item">
          Routes
        </Link>
        <Link to="/orders" className="navbar-item">
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
