// OutpassData.js
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./OutpassData.css"; // Ensure this file exists

const OutpassData = () => {
  const [outpasses, setOutpasses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const token = localStorage.getItem("token");
  console.log("Token:", token);

  useEffect(() => {
    const fetchOutpasses = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/outpass", {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Assuming your backend route returns an array of outpass objects
        setOutpasses(response.data);
      } catch (error) {
        console.error("Error fetching outpass data:", error);
      }
    };
    fetchOutpasses();
  }, [token]);

  // Sorting functionality
  const sortedOutpasses = [...outpasses].sort((a, b) => {
    if (sortConfig.key) {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
    }
    return 0;
  });

  // Search functionality
  const filteredOutpasses = sortedOutpasses.filter((outpass) =>
    Object.values(outpass).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="outpass-data-container">
      {/* Navigation Bar */}
      <nav className="admin-navbar">
        <div className="nav-left">
          <div className="logo">
            <Link to="/admin" style={{ textDecoration: "none", color: "inherit" }}>
              <h2>Admin Panel</h2>
            </Link>
          </div>
          <div className="nav-links">
            <Link to="/room-allocation" className="nav-link">
              Room Allocation
            </Link>
            <Link to="/outpass-data" className="nav-link active">
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

      {/* Main Content */}
      <div className="outpass-data-content">
        <h1>Outpass Management</h1>

        <div className="search-container">
          <input
            type="text"
            placeholder="Search outpasses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="outpass-table-container">
          <table className="outpass-table">
            <thead>
              <tr>
                <th onClick={() => handleSort("name")}>
                  Name {sortConfig.key === "name" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                </th>
                <th onClick={() => handleSort("roomNumber")}>
                  Room {sortConfig.key === "roomNumber" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                </th>
                <th onClick={() => handleSort("checkIn")}>
                  From Date {sortConfig.key === "checkIn" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                </th>
                <th onClick={() => handleSort("checkOut")}>
                  To Date {sortConfig.key === "checkOut" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                </th>
                <th onClick={() => handleSort("reason")}>
                  Reason {sortConfig.key === "reason" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                </th>
                <th onClick={() => handleSort("createdAt")}>
                  Issued On {sortConfig.key === "createdAt" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredOutpasses.map((outpass) => (
                <tr key={outpass._id}>
                  <td>{outpass.name}</td>
                  <td>{outpass.roomNumber}</td>
                  <td>{new Date(outpass.checkIn).toLocaleDateString()}</td>
                  <td>{new Date(outpass.checkOut).toLocaleDateString()}</td>
                  <td>{outpass.reason}</td>
                  <td>{new Date(outpass.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OutpassData;