import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const VacateRoom = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [when, setWhen] = useState("");
  const [reason, setReason] = useState("");
  const [ticket, setTicket] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [profileFetched, setProfileFetched] = useState(false);
  const [currentRoom, setCurrentRoom] = useState(""); // current booked room

  // Fetch logged-in user's profile
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/user/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserProfile(response.data);
        setProfileFetched(true);
      } catch (error) {
        console.error("❌ Error fetching user profile:", error);
        setProfileFetched(true);
      }
    };
    fetchUserProfile();
  }, [token, navigate]);

  // Fetch booked room details and redirect if not found
  useEffect(() => {
    const fetchBookedRoom = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/room/book", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.room) {
          console.log("Booked room found:", response.data.room);
          setCurrentRoom(response.data.room.roomNumber);
        } else {
          alert("You do not have a booked room. Redirecting to homepage.");
          navigate("/home");
        }
      } catch (error) {
        alert("You do not have a booked room. Redirecting to homepage.");
        navigate("/home");
      }
    };

    fetchBookedRoom();
  }, [token, navigate]);

  // Fetch active vacate ticket on mount
  useEffect(() => {
    const fetchVacateTicket = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/room/vacate", {
          headers: { Authorization: `Bearer ${token}` },
        });
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

  // Disable submission if a ticket exists with status "Approved" for the currently booked room
  const isSubmissionDisabled =
    ticket &&
    ticket.status === "Approved" &&
    ticket.currentRoom === currentRoom;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmissionDisabled) {
      alert("Your vacate request has already been approved for your current room. No further requests can be made.");
      return;
    }
    if (!when || !reason) {
      alert("Please fill in all fields before submitting your request.");
      return;
    }

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
      const errMsg = error.response?.data?.message || "Error submitting vacate request. Please try again.";
      alert(errMsg);
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
      {isSubmissionDisabled ? (
        <div>
          <p>
            Your vacate request has been approved for your current room.
            {/* Hide the ticket if the user has booked a new room */}
          </p>
          {ticket && ticket.currentRoom === currentRoom && (
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
      ) : (
        <>
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
              ></textarea>
            </div>
            <button type="submit" style={styles.button}>
              Submit Request
            </button>
          </form>
          {/* Only show ticket if it belongs to the currently booked room */}
          {ticket && ticket.currentRoom === currentRoom && (
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
        </>
      )}
    </div>
  );
};

export default VacateRoom;
