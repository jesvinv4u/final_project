import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Adminhome.css'; // Create this CSS file


const AdminHome = () => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    // Perform logout actions
    localStorage.removeItem('authToken');
    window.location.href = '/login';
  };

  return (
    <div className="admin-container">
      {/* Navigation Bar */}
      <nav className="admin-navbar">
        <div className="nav-left">
          <div className="logo">
            <h2>Admin Panel</h2>
          </div>
          <div className="nav-links">
            <Link to="/room-allocation" className="nav-link">
              Room Allocation
            </Link>
            <Link to="" className="nav-link">
              Change Room
            </Link>
            <Link to="/outpass-data" className="nav-link">
              Outpass Data
            </Link>
            <Link to="/complaints-page" className="nav-link">
              Complaints
            </Link>
            <Link to="/vacate-request" className="nav-link">
              Vacate Request
            </Link>
          </div>
        </div>
        
        {/* Logout Section */}
        <div className="nav-right">
          <button 
            className="logout-btn"
            onClick={() => setShowLogoutModal(true)}
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="logout-modal">
          <div className="modal-content">
            <h3>Confirm Logout</h3>
            <p>Are you sure you want to log out?</p>
            <div className="modal-buttons">
              <button 
                className="cancel-btn"
                onClick={() => setShowLogoutModal(false)}
              >
                Cancel
              </button>
              <button 
                className="confirm-btn"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="admin-content">
        <h1>Welcome, Administrator</h1>
        <div className="stats-container">
          {/* Add your statistics cards here */}
          <div className="stat-card">
            <h3>Total Rooms</h3>
            <p>150</p>
          </div>
          <div className="stat-card">
            <h3>Active Students</h3>
            <p>450</p>
          </div>
          <div className="stat-card">
            <h3>Pending Requests</h3>
            <p>23</p>
          </div>
        </div>
        <div className="world-map-card">
          <div className="map-container">
            <div className="world-map"></div>
          </div>
          <div className="map-overlay">
            <h3>Hostel Network</h3>
            <p>Explore our hostels across the Campus</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminHome;