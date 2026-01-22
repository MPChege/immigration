import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import './ServiceProviderDashboard.css';

const ServiceProviderDashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    bookings: 0,
    shipments: 0,
  });
  const [recentBookings, setRecentBookings] = useState([]);

  useEffect(() => {
    fetchStats();
    fetchRecentBookings();
  }, []);

  const fetchStats = async () => {
    try {
      const [bookings, shipments] = await Promise.all([
        axios.get('/api/bookings/'),
        axios.get('/api/shipments/'),
      ]);
      setStats({
        bookings: bookings.data.count || bookings.data.length,
        shipments: shipments.data.count || shipments.data.length,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchRecentBookings = async () => {
    try {
      const response = await axios.get('/api/bookings/?limit=5');
      setRecentBookings(response.data.results || response.data.slice(0, 5));
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  return (
    <div className="container">
      <h1>Service Provider Dashboard</h1>
      <p>Welcome, {user?.service_provider?.company_name || user?.first_name || user?.username}!</p>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Bookings</h3>
          <p className="stat-number">{stats.bookings}</p>
        </div>
        <div className="stat-card">
          <h3>Shipments</h3>
          <p className="stat-number">{stats.shipments}</p>
        </div>
      </div>

      <div className="card">
        <h2>Recent Bookings</h2>
        {recentBookings.length > 0 ? (
          <table className="data-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Service Type</th>
                <th>Booking Date</th>
                <th>Status</th>
                <th>Amount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.map((booking) => (
                <tr key={booking.id}>
                  <td>{booking.user?.first_name} {booking.user?.last_name}</td>
                  <td>{booking.service_type}</td>
                  <td>{new Date(booking.booking_date).toLocaleDateString()}</td>
                  <td><span className={`status-badge status-${booking.status}`}>{booking.status}</span></td>
                  <td>${booking.total_amount}</td>
                  <td>
                    {booking.status === 'pending' && (
                      <button
                        onClick={async () => {
                          try {
                            await axios.post(`/api/bookings/${booking.id}/confirm/`);
                            fetchRecentBookings();
                            fetchStats();
                          } catch (error) {
                            alert('Error confirming booking');
                          }
                        }}
                        className="btn btn-primary btn-sm"
                      >
                        Confirm
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No bookings yet.</p>
        )}
      </div>
    </div>
  );
};

export default ServiceProviderDashboard;
