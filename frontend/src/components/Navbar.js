import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">Relocation System</Link>
        <div className="navbar-menu">
          {user ? (
            <>
              {user.user_type === 'user' && (
                <>
                  <Link to="/dashboard" className="navbar-link">Dashboard</Link>
                  <Link to="/relocations" className="navbar-link">Relocations</Link>
                  <Link to="/bookings" className="navbar-link">Bookings</Link>
                  <Link to="/shipments" className="navbar-link">Shipments</Link>
                  <Link to="/documents" className="navbar-link">Documents</Link>
                  <Link to="/service-providers" className="navbar-link">Service Providers</Link>
                </>
              )}
              {user.user_type === 'service_provider' && (
                <>
                  <Link to="/provider/dashboard" className="navbar-link">Dashboard</Link>
                  <Link to="/bookings" className="navbar-link">Bookings</Link>
                  <Link to="/shipments" className="navbar-link">Shipments</Link>
                </>
              )}
              {user.user_type === 'admin' && (
                <>
                  <Link to="/admin/dashboard" className="navbar-link">Admin Dashboard</Link>
                  <Link to="/dashboard" className="navbar-link">User View</Link>
                </>
              )}
              <span className="navbar-user">Welcome, {user.first_name || user.username}</span>
              <button onClick={handleLogout} className="btn btn-secondary">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-link">Login</Link>
              <Link to="/register" className="navbar-link">Register</Link>
              <Link to="/service-providers" className="navbar-link">Service Providers</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
