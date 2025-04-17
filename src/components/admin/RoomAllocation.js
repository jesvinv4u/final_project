import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./RoomAllocation.css";

const RoomAllocation = () => {
  const [changeRequests, setChangeRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Fetch room change requests from the new API endpoint
  useEffect(() => {
    const fetchChangeRequests = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/ticket");
        setChangeRequests(response.data);
      } catch (error) {
        console.error("Error fetching room change requests:", error);
      }
    };
    fetchChangeRequests();
  }, []);

  // Approve room change request.
  // Also auto-reject competing pending requests for the same desired room.
  const handleApproveChangeRequest = async (id, desiredRoom) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/ticket/update/${id}`,
        { status: "Approved" }
      );
      setChangeRequests((prev) =>
        prev.map((req) => (req._id === id ? response.data : req))
      );
      // Automatically reject competing requests
      const competingRequests = changeRequests.filter(
        (req) =>
          req._id !== id &&
          req.desiredRoom === desiredRoom &&
          req.status === "Pending"
      );
      for (const req of competingRequests) {
        const res = await axios.put(
          `http://localhost:5000/api/ticket/update/${req._id}`,
          { status: "Rejected" }
        );
        setChangeRequests((prev) =>
          prev.map((r) => (r._id === req._id ? res.data : r))
        );
      }
      alert("Room change request approved. Other conflicting requests were auto-rejected.");
    } catch (error) {
      console.error("Error approving room change request:", error);
      alert("Error approving room change request. Please try again.");
    }
  };

  const handleRejectChangeRequest = async (id) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/ticket/update/${id}`,
        { status: "Rejected" }
      );
      setChangeRequests((prev) =>
        prev.map((req) => (req._id === id ? response.data : req))
      );
      alert("Room change request rejected successfully!");
    } catch (error) {
      console.error("Error rejecting room change request:", error);
      alert("Error rejecting room change request. Please try again.");
    }
  };

  return (
    <div className="room-allocation-container">
      <nav className="admin-navbar">
        <div className="nav-left">
          <div className="logo">
            <Link to="/admin" style={{ textDecoration: "none", color: "inherit" }}>
              <h2>Admin Panel</h2>
            </Link>
          </div>
          <div className="nav-links">
            {/* You can add other admin links here */}
            <Link to="/changeroom" className="nav-link active">
              Room Change Requests
            </Link>
          </div>
        </div>
      </nav>

      <div className="room-allocation-content">
        <h1>Room Change Requests</h1>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search requests..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="change-requests-table-container">
          <table className="bookings-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Current Room</th>
                <th>Desired Room</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {changeRequests
                .filter((req) =>
                  req.name.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((req) => (
                  <tr key={req._id}>
                    <td>{req.name}</td>
                    <td>{req.email}</td>
                    <td>{req.currentRoom}</td>
                    <td>{req.desiredRoom}</td>
                    <td>
                      {req.status === "Pending" ? (
                        <>
                          <button
                            onClick={() =>
                              handleApproveChangeRequest(req._id, req.desiredRoom)
                            }
                            className="approve-btn"
                            style={{
                              marginRight: "10px",
                              backgroundColor: "green",
                              color: "white",
                            }}
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleRejectChangeRequest(req._id)}
                            className="reject-btn"
                            style={{
                              backgroundColor: "red",
                              color: "white",
                            }}
                          >
                            Reject
                          </button>
                        </>
                      ) : (
                        <button
                          className={
                            req.status === "Approved" ? "approved-btn" : "rejected-btn"
                          }
                          style={{
                            backgroundColor: req.status === "Approved" ? "green" : "red",
                            color: "white",
                          }}
                          disabled
                        >
                          {req.status}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RoomAllocation;
