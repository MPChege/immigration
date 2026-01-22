import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    providers: 0,
    bookings: 0,
    relocations: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [users, providers, bookings, relocations] = await Promise.all([
        axios.get('/api/auth/users/'),
        axios.get('/api/auth/service-providers/'),
        axios.get('/api/bookings/'),
        axios.get('/api/relocations/'),
      ]);
      setStats({
        users: users.data.count || users.data.length,
        providers: providers.data.count || providers.data.length,
        bookings: bookings.data.count || bookings.data.length,
        relocations: relocations.data.count || relocations.data.length,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  return (
    <div className="container">
      <h1>Admin Dashboard</h1>
      <p>System Overview and Management</p>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Users</h3>
          <p className="stat-number">{stats.users}</p>
        </div>
        <div className="stat-card">
          <h3>Service Providers</h3>
          <p className="stat-number">{stats.providers}</p>
        </div>
        <div className="stat-card">
          <h3>Total Bookings</h3>
          <p className="stat-number">{stats.bookings}</p>
        </div>
        <div className="stat-card">
          <h3>Total Relocations</h3>
          <p className="stat-number">{stats.relocations}</p>
        </div>
      </div>

      <div className="card">
        <h2>System Management</h2>
        <p>Admin features for managing users, service providers, and system configuration will be available here.</p>
        <p>Access the Django admin panel at <a href="http://localhost:8000/admin" target="_blank" rel="noopener noreferrer">http://localhost:8000/admin</a> for full administrative control.</p>
      </div>
    </div>
  );
};

export default AdminDashboard;
