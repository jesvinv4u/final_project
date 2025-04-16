import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import './ComplaintsPage.css'; 

const ComplaintsPage = () => {
  const location = useLocation();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  // Function to fetch complaints from backend
  const fetchComplaints = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/complaints');
      // Filter only pending complaints
      setComplaints(response.data.filter(c => c.status === 'Pending' || c.status === 'pending'));
      setLoading(false);
    } catch (error) {
      console.error("❌ Error fetching complaints:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  // Function to mark a complaint as resolved
  const handleResolve = async (id) => {
    try {
      // Send PUT request to update status to "resolved"
      await axios.put(`http://localhost:5000/api/complaints/${id}`, { status: "resolved" });
      // Refresh the complaints list
      fetchComplaints();
    } catch (error) {
      console.error("❌ Error updating complaint:", error);
      alert("Failed to update complaint. Please try again.");
    }
  };

  return (
    <div className="complaints-page-container">
      <nav className="admin-navbar">
        <div className="nav-left">
          <div className="logo">
            <Link to="/admin" style={{ textDecoration: 'none', color: 'inherit' }}>
              <h2>Admin Panel</h2>
            </Link>
          </div>
          <div className="nav-links">
            <Link to="/room-allocation" className={`nav-link ${location.pathname === "/room-allocation" ? "active" : ""}`}>Room Allocation</Link>
            <Link to="/outpass-data" className={`nav-link ${location.pathname === "/outpass-data" ? "active" : ""}`}>Outpass Data</Link>
            <Link to="/complaints-page" className={`nav-link ${location.pathname === "/complaints-page" ? "active" : ""}`}>Complaints</Link>
            <Link to="/vacate-request" className={`nav-link ${location.pathname === "/vacate-request" ? "active" : ""}`}>Vacate Request</Link>
          </div>
        </div>
      </nav>

      <div className="complaints-list">
        <h2>Pending Complaints</h2>
        {loading ? (
          <p>Loading complaints...</p>
        ) : complaints.length === 0 ? (
          <p>No pending complaints.</p>
        ) : (
          complaints.map(complaint => (
            <div key={complaint._id || complaint.id} className="complaint-card">
              <h4>{complaint.name || complaint.user}</h4>
              <p><strong>Email:</strong> {complaint.email}</p>
              <p><strong>Room Number:</strong> {complaint.roomNumber}</p>
              <p><strong>Issue:</strong> {complaint.problem || complaint.issue}</p>
              <p>Status: <span className="pending">{complaint.status}</span></p>
              {complaint.status.toLowerCase() === 'pending' && (
                <button onClick={() => handleResolve(complaint._id || complaint.id)} className="resolve-btn">
                  Resolve
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ComplaintsPage;
