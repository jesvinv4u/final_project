import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './VacateRequest.css';

const VacateRequest = () => {
  const [requests, setRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const token = localStorage.getItem("token");

  // Fetch all vacate requests for admin
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/admin/vacate", {
          headers: { Authorization: `Bearer ${token}` },
        });
        // The admin endpoint returns { tickets: [...] }
        // Ensure we save an array even if res.data.tickets is undefined.
        setRequests(Array.isArray(res.data.tickets) ? res.data.tickets : []);
      } catch (error) {
        console.error("Error fetching vacate requests:", error);
        setRequests([]); // fallback to empty array
      }
    };

    fetchRequests();
  }, [token]);

  // Call admin endpoint to update (approve/reject) a vacate request
  const updateRequestStatus = async (ticketId, newStatus) => {
    try {
      await axios.put(
        `http://localhost:5000/api/admin/vacate/${ticketId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Update local state: if approved/rejected, refresh the list or update that ticket.
      setRequests(requests.map(request =>
        request._id === ticketId ? { ...request, status: newStatus } : request
      ));
    } catch (error) {
      console.error(`Error updating request ${ticketId}:`, error);
    }
  };

  const handleApprove = (ticketId) => {
    updateRequestStatus(ticketId, "approved");
  };

  const handleReject = (ticketId) => {
    updateRequestStatus(ticketId, "rejected");
  };

  const filteredRequests = requests.filter(request => {
    // Use request.name directly, converting to lowercase
    const studentname = request.name ? request.name.toLowerCase() : "";
    // Convert roomNumber to string and lowercase (if defined)
    const room = request.roomNumber !== undefined ? String(request.roomNumber).toLowerCase() : "";
    const search = searchTerm.toLowerCase();
    const matchesSearch = studentname.includes(search) || room.includes(search);
    const matchesStatus = selectedStatus === 'all' || request.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="vacate-request-container">
      <nav className="admin-navbar">
        <div className="nav-left">
          <div className="logo">
            <Link to="/admin" style={{ textDecoration: 'none', color: 'inherit' }}>
              <h2>Admin Panel</h2>
            </Link>
          </div>
          <div className="nav-links">
            <Link to="/room-allocation" className="nav-link">
              Room Allocation
            </Link>
            <Link to="/outpass-data" className="nav-link">
              Outpass Data
            </Link>
            <Link to="/complaints-page" className="nav-link">
              Complaints
            </Link>
            <Link to="/vacate-request" className="nav-link active">
              Vacate Request
            </Link>
          </div>
        </div>
      </nav>

      <div className="vacate-content">
        <div className="filters">
          <input
            type="text"
            placeholder="Search by name or room..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="status-filter"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <div className="requests-list">
          {filteredRequests.length === 0 ? (
            <div className="no-requests">No vacate requests found</div>
          ) : (
            filteredRequests.map(request => (
              <div key={request._id} className="request-card">
                <div className="request-info">
                  <h3>{request.name}</h3>
                  <p>Floor: {request.floor}</p>
                  <p>Room: {request.roomNumber}</p>
                  <p>Vacate Date: {new Date(request.when).toLocaleDateString()}</p>
                  <p>Reason: {request.reason}</p>
                  <p>Submitted: {new Date(request.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="request-actions">
                  <span className={`status-badge ${request.status}`}>
                    {request.status}
                  </span>
                  {request.status.toLowerCase() === 'pending' && (
                    <div className="action-buttons">
                      <button
                        onClick={() => handleApprove(request._id)}
                        className="approve-btn"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(request._id)}
                        className="reject-btn"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default VacateRequest;