import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import './Bookings.css';

const Bookings = () => {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await axios.get('/api/bookings/');
      setBookings(response.data.results || response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (bookingId, action) => {
    try {
      await axios.post(`/api/bookings/${bookingId}/${action}/`);
      fetchBookings();
    } catch (error) {
      alert('Error updating booking status');
    }
  };

  if (loading) return <div className="container">Loading...</div>;

  return (
    <div className="container">
      <h1>{user?.user_type === 'service_provider' ? 'My Bookings' : 'My Bookings'}</h1>

      <div className="card">
        {bookings.length > 0 ? (
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                {user?.user_type !== 'service_provider' && <th>Service Provider</th>}
                {user?.user_type === 'service_provider' && <th>Customer</th>}
                <th>Service Type</th>
                <th>Booking Date</th>
                <th>Status</th>
                <th>Amount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id}>
                  <td>{booking.id}</td>
                  {user?.user_type !== 'service_provider' && (
                    <td>{booking.service_provider?.company_name || 'N/A'}</td>
                  )}
                  {user?.user_type === 'service_provider' && (
                    <td>{booking.user?.first_name} {booking.user?.last_name}</td>
                  )}
                  <td>{booking.service_type}</td>
                  <td>{new Date(booking.booking_date).toLocaleString()}</td>
                  <td><span className={`status-badge status-${booking.status}`}>{booking.status}</span></td>
                  <td>${booking.total_amount}</td>
                  <td>
                    {user?.user_type === 'service_provider' && booking.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleStatusChange(booking.id, 'confirm')}
                          className="btn btn-primary btn-sm"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => handleStatusChange(booking.id, 'cancel')}
                          className="btn btn-secondary btn-sm"
                          style={{ marginLeft: '5px' }}
                        >
                          Cancel
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No bookings found.</p>
        )}
      </div>
    </div>
  );
};

export default Bookings;
