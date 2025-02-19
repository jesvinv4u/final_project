import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./RoomAllocation.css";

const RoomAllocation = () => {
  const [bookings, setBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/room-requests/requests");
        setBookings(response.data);
      } catch (error) {
        console.error("Error fetching booking requests:", error);
      }
    };
    fetchBookings();
  }, []);

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });

    const sortedBookings = [...bookings].sort((a, b) => {
      if (key === "roomNumber") {
        return direction === "asc" ? a[key] - b[key] : b[key] - a[key];
      }
      return direction === "asc"
        ? a[key].localeCompare(b[key])
        : b[key].localeCompare(a[key]);
    });
    setBookings(sortedBookings);
  };

  const handleApprove = async (id) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/room-requests/update-request/${id}`,
        { status: "Approved" }
      );
      setBookings(
        bookings.map((booking) => (booking._id === id ? response.data.request : booking))
      );
      alert("Request approved successfully!");
    } catch (error) {
      console.error("Error approving request:", error);
      alert("Error approving request. Please try again.");
    }
  };

  const handleReject = async (id) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/room-requests/update-request/${id}`,
        { status: "Rejected" }
      );
      setBookings(
        bookings.map((booking) => (booking._id === id ? response.data.request : booking))
      );
      alert("Request rejected successfully!");
    } catch (error) {
      console.error("Error rejecting request:", error);
      alert("Error rejecting request. Please try again.");
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
            <Link to="/room-allocation" className="nav-link active">
              Room Allocation
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
      </nav>

      <div className="room-allocation-content">
        <h1>Room Allocation Management</h1>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search bookings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="bookings-table-container">
          <table className="bookings-table">
            <thead>
              <tr>
                <th onClick={() => handleSort("name")}>
                  Name {sortConfig.key === "name" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                </th>
                <th onClick={() => handleSort("email")}>
                  Email {sortConfig.key === "email" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                </th>
                <th onClick={() => handleSort("roomNumber")}>
                  Room {sortConfig.key === "roomNumber" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                </th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {bookings
                .filter((booking) =>
                  booking.name.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((booking) => (
                  <tr key={booking._id}>
                    <td>
                      <button
                        className="student-name-btn"
                        onClick={() => setSelectedStudent(booking)}
                      >
                        {booking.name}
                      </button>
                    </td>
                    <td>{booking.email}</td>
                    <td>{booking.roomNumber}</td>
                    <td>
                      {booking.status === "Pending" ? (
                        <>
                          <button
                            onClick={() => handleApprove(booking._id)}
                            className="approve-btn"
                            style={{ marginRight: "10px", backgroundColor: "green", color: "white" }}
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(booking._id)}
                            className="reject-btn"
                            style={{ backgroundColor: "red", color: "white" }}
                          >
                            Reject
                          </button>
                        </>
                      ) : (
                        <button
                          className={
                            booking.status === "Approved" ? "approved-btn" : "rejected-btn"
                          }
                          style={{
                            backgroundColor: booking.status === "Approved" ? "green" : "red",
                            color: "white",
                          }}
                          disabled
                        >
                          {booking.status}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {selectedStudent && (
          <div className="student-details-modal">
            <h2>Student Details</h2>
            <p>
              <strong>Name:</strong> {selectedStudent.name}
            </p>
            <p>
              <strong>Email:</strong> {selectedStudent.email}
            </p>
            <p>
              <strong>Room Number:</strong> {selectedStudent.roomNumber}
            </p>
            <p>
              <strong>Check-in Date:</strong> {selectedStudent.checkInDate}
            </p>
            <button onClick={() => setSelectedStudent(null)} className="close-modal">
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomAllocation;
