import React, { useState, useEffect } from "react";
import axios from "axios";

const VacateRoom = () => {
  const [when, setWhen] = useState("");
  const [reason, setReason] = useState("");
  const [ticket, setTicket] = useState(null);
  const token = localStorage.getItem("token");

  // Fetch active vacate request on mount
  useEffect(() => {
    const fetchVacateTicket = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/room/vacate",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setTicket(response.data.ticket);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          console.log("No active vacate request found.");
          setTicket(null);
        } else {
          console.error("Error fetching vacate request:", error);
        }
      }
    };

    fetchVacateTicket();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/room/vacate",
        { when, reason },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(response.data.message);
      setTicket(response.data.ticket);
    } catch (error) {
      console.error("Error submitting vacate request:", error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        alert(error.response.data.message);
      } else {
        alert("Error submitting vacate request. Please try again.");
      }
    }
  };

  const styles = {
    container: {
      maxWidth: "500px",
      margin: "50px auto",
      padding: "20px",
      background: "#ffffff",
      borderRadius: "12px",
      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
      textAlign: "center",
    },
    heading: {
      fontSize: "24px",
      color: "#333",
      marginBottom: "15px",
    },
    formGroup: {
      display: "flex",
      flexDirection: "column",
      marginBottom: "15px",
      textAlign: "left",
    },
    label: {
      fontSize: "16px",
      fontWeight: "600",
      marginBottom: "5px",
      color: "#555",
    },
    input: {
      padding: "10px",
      border: "2px solid #ddd",
      borderRadius: "8px",
      fontSize: "16px",
      transition: "0.3s ease-in-out",
    },
    button: {
      width: "100%",
      padding: "10px",
      backgroundColor: "#007bff",
      color: "white",
      fontSize: "18px",
      fontWeight: "bold",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      transition: "background-color 0.3s",
    },
    ticketReceipt: {
      marginTop: "20px",
      padding: "15px",
      background: "#f8f9fa",
      borderRadius: "8px",
      boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
      textAlign: "left",
    },
    ticketText: {
      fontSize: "14px",
      color: "#555",
    },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Vacate Room Request</h2>
      <form onSubmit={handleSubmit}>
        <div style={styles.formGroup}>
          <label style={styles.label}>When do you want to vacate?</label>
          <input
            type="date"
            value={when}
            onChange={(e) => setWhen(e.target.value)}
            required
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Reason for vacating:</label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
            style={styles.input}
          />
        </div>

        <button type="submit" style={styles.button}>
          Submit Request
        </button>
      </form>

      {ticket && (
        <div style={styles.ticketReceipt}>
          <h3 style={{ color: "#28a745" }}>Ticket Receipt</h3>
          <p style={styles.ticketText}>
            <strong>Ticket ID:</strong> {ticket._id}
          </p>
          <p style={styles.ticketText}>
            <strong>Vacate Date:</strong>{" "}
            {new Date(ticket.when).toLocaleDateString()}
          </p>
          <p style={styles.ticketText}>
            <strong>Reason:</strong> {ticket.reason}
          </p>
          <p style={styles.ticketText}>
            <strong>Status:</strong> {ticket.status}
          </p>
        </div>
      )}
    </div>
  );
};

export default VacateRoom;
