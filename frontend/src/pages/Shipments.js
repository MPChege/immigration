import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import './Shipments.css';

const Shipments = () => {
  const { user } = useContext(AuthContext);
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackedShipment, setTrackedShipment] = useState(null);

  useEffect(() => {
    if (user) {
      fetchShipments();
    }
  }, [user]);

  const fetchShipments = async () => {
    try {
      const response = await axios.get('/api/shipments/');
      setShipments(response.data.results || response.data);
    } catch (error) {
      console.error('Error fetching shipments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTrack = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`/api/shipments/track/?tracking_number=${trackingNumber}`);
      setTrackedShipment(response.data);
    } catch (error) {
      alert('Shipment not found');
      setTrackedShipment(null);
    }
  };

  const handleStatusUpdate = async (shipmentId, status, location) => {
    try {
      await axios.post(`/api/shipments/${shipmentId}/update_status/`, {
        status,
        current_location: location,
      });
      fetchShipments();
    } catch (error) {
      alert('Error updating shipment status');
    }
  };

  if (loading) return <div className="container">Loading...</div>;

  return (
    <div className="container">
      <h1>Shipments</h1>

      <div className="card">
        <h2>Track Shipment</h2>
        <form onSubmit={handleTrack} style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            placeholder="Enter tracking number"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
            style={{ flex: 1, padding: '10px' }}
          />
          <button type="submit" className="btn btn-primary">Track</button>
        </form>
        {trackedShipment && (
          <div style={{ marginTop: '20px', padding: '15px', background: '#f8f9fa', borderRadius: '4px' }}>
            <h3>Tracking Information</h3>
            <p><strong>Status:</strong> {trackedShipment.status}</p>
            <p><strong>Current Location:</strong> {trackedShipment.current_location || 'N/A'}</p>
            <p><strong>Estimated Delivery:</strong> {trackedShipment.estimated_delivery ? new Date(trackedShipment.estimated_delivery).toLocaleString() : 'N/A'}</p>
          </div>
        )}
      </div>

      <div className="card">
        <h2>{user?.user_type === 'service_provider' ? 'My Shipments' : 'My Shipments'}</h2>
        {shipments.length > 0 ? (
          <table className="data-table">
            <thead>
              <tr>
                <th>Tracking Number</th>
                <th>Status</th>
                <th>Current Location</th>
                <th>Estimated Delivery</th>
                {user?.user_type === 'service_provider' && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {shipments.map((shipment) => (
                <tr key={shipment.id}>
                  <td>{shipment.tracking_number}</td>
                  <td><span className={`status-badge status-${shipment.status}`}>{shipment.status}</span></td>
                  <td>{shipment.current_location || 'N/A'}</td>
                  <td>{shipment.estimated_delivery ? new Date(shipment.estimated_delivery).toLocaleString() : 'N/A'}</td>
                  {user?.user_type === 'service_provider' && (
                    <td>
                      <select
                        onChange={(e) => handleStatusUpdate(shipment.id, e.target.value, '')}
                        value={shipment.status}
                        className="btn btn-sm"
                      >
                        <option value="preparing">Preparing</option>
                        <option value="in_transit">In Transit</option>
                        <option value="out_for_delivery">Out for Delivery</option>
                        <option value="delivered">Delivered</option>
                        <option value="delayed">Delayed</option>
                      </select>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No shipments found.</p>
        )}
      </div>
    </div>
  );
};

export default Shipments;
